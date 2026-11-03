from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from database import get_db, UserSettings
from services.github_service import get_aggregated_languages, fetch_user_repos
from services.analytics_service import compute_match_score
from typing import Optional

router = APIRouter(prefix="/api/vibe", tags=["Vibe Check"])


class VibeCheckRequest(BaseModel):
    username: str
    job_description: str
    token: Optional[str] = None


class SettingsUpdateRequest(BaseModel):
    username: str
    theme: Optional[str] = None
    pinned_repos: Optional[list] = None


@router.post("/check")
async def vibe_check(req: VibeCheckRequest, db: AsyncSession = Depends(get_db)):
    """
    Compare job description keywords against user's GitHub language stack.
    Returns a 'Tech Stack Compatibility' match percentage.
    """
    try:
        languages = await get_aggregated_languages(req.username, db, req.token)
        result = compute_match_score(req.job_description, languages)

        # Save to user settings
        settings_result = await db.execute(
            select(UserSettings).where(UserSettings.username == req.username)
        )
        user_settings = settings_result.scalar_one_or_none()
        if user_settings:
            user_settings.last_job_description = req.job_description
            user_settings.last_match_score = result["score"]
        else:
            db.add(UserSettings(
                username=req.username,
                last_job_description=req.job_description,
                last_match_score=result["score"],
            ))
        await db.commit()

        return {
            "username": req.username,
            "match_score": result["score"],
            "label": result["label"],
            "matched_technologies": result["matched"],
            "missing_technologies": result["missing"],
            "breakdown": result["breakdown"],
            "user_languages": languages,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/settings/{username}")
async def get_settings(username: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserSettings).where(UserSettings.username == username))
    settings = result.scalar_one_or_none()
    if not settings:
        return {"username": username, "theme": "dark", "last_match_score": 0, "pinned_repos": []}
    import json
    return {
        "username": settings.username,
        "theme": settings.theme,
        "last_job_description": settings.last_job_description,
        "last_match_score": settings.last_match_score,
        "pinned_repos": json.loads(settings.pinned_repos or "[]"),
    }


@router.put("/settings")
async def update_settings(req: SettingsUpdateRequest, db: AsyncSession = Depends(get_db)):
    import json
    result = await db.execute(select(UserSettings).where(UserSettings.username == req.username))
    user_settings = result.scalar_one_or_none()
    if not user_settings:
        user_settings = UserSettings(username=req.username)
        db.add(user_settings)

    if req.theme is not None:
        user_settings.theme = req.theme
    if req.pinned_repos is not None:
        user_settings.pinned_repos = json.dumps(req.pinned_repos)

    await db.commit()
    return {"status": "updated"}

