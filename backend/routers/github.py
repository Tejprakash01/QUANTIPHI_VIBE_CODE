from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
import httpx
from database import get_db
from services.github_service import (
    fetch_user_profile,
    fetch_user_repos,
    fetch_contributions,
    get_aggregated_languages,
)
from services.analytics_service import calculate_streak, calculate_productivity_insights
from typing import Optional

router = APIRouter(prefix="/api/github", tags=["GitHub"])


def handle_github_exception(e: Exception):
    if isinstance(e, httpx.HTTPStatusError):
        status = e.response.status_code
        if status == 403 or status == 429:
            return HTTPException(
                status_code=403,
                detail=(
                    "GitHub API rate limit exceeded (60 requests/hr for unauthenticated IPs). "
                    "Please provide a GitHub Personal Access Token using the 'Get Token' button to access 5,000 requests/hr."
                ),
            )
        elif status == 404:
            return HTTPException(
                status_code=404,
                detail="GitHub user not found. Please verify the username.",
            )
        return HTTPException(status_code=status, detail=f"GitHub API Error: {e.response.text}")
    return HTTPException(status_code=500, detail=str(e))


@router.get("/profile/{username}")
async def get_profile(
    username: str,
    token: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    try:
        profile = await fetch_user_profile(username, db, token)
        return profile
    except Exception as e:
        raise handle_github_exception(e)


@router.get("/repos/{username}")
async def get_repos(
    username: str,
    token: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    try:
        repos = await fetch_user_repos(username, db, token)
        return {"repos": repos, "count": len(repos)}
    except Exception as e:
        raise handle_github_exception(e)


@router.get("/contributions/{username}")
async def get_contributions(
    username: str,
    token: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    try:
        data = await fetch_contributions(username, db, token)
        streak = calculate_streak(data.get("weeks", []))
        return {**data, "streak": streak}
    except Exception as e:
        raise handle_github_exception(e)


@router.get("/languages/{username}")
async def get_languages(
    username: str,
    token: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    try:
        langs = await get_aggregated_languages(username, db, token)
        return {"languages": langs}
    except Exception as e:
        raise handle_github_exception(e)


@router.get("/productivity/{username}")
async def get_productivity(
    username: str,
    token: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    try:
        repos = await fetch_user_repos(username, db, token)
        insights = calculate_productivity_insights(repos)
        return insights
    except Exception as e:
        raise handle_github_exception(e)


@router.get("/dashboard/{username}")
async def get_full_dashboard(
    username: str,
    token: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Single endpoint to fetch all dashboard data at once."""
    try:
        profile = await fetch_user_profile(username, db, token)
        repos = await fetch_user_repos(username, db, token)
        languages = await get_aggregated_languages(username, db, token)
        insights = calculate_productivity_insights(repos)
        contributions = await fetch_contributions(username, db, token)
        streak = calculate_streak(contributions.get("weeks", []))

        return {
            "profile": profile,
            "repos": repos[:12],
            "all_repos_count": len(repos),
            "languages": languages,
            "productivity": insights,
            "contributions": contributions,
            "streak": streak,
        }
    except Exception as e:
        raise handle_github_exception(e)
