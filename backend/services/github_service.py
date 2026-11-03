import httpx
import json
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import CachedUser, CachedRepo, CachedContributions
from config import settings

CACHE_TTL_MINUTES = 30
GITHUB_API = "https://api.github.com"
GITHUB_GRAPHQL = "https://api.github.com/graphql"


def get_headers(token: str = None):
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "QuantiphiVibeDevPortfolio/1.0",
    }
    t = token or settings.GITHUB_TOKEN
    if t:
        clean_token = t.strip()
        if clean_token.startswith("Bearer ") or clean_token.startswith("token "):
            headers["Authorization"] = clean_token
        else:
            headers["Authorization"] = f"Bearer {clean_token}"
    return headers


def is_cache_fresh(cached_at: datetime) -> bool:
    return datetime.utcnow() - cached_at < timedelta(minutes=CACHE_TTL_MINUTES)


async def fetch_user_profile(username: str, db: AsyncSession, token: str = None):
    result = await db.execute(select(CachedUser).where(CachedUser.username == username))
    cached = result.scalar_one_or_none()
    if cached and is_cache_fresh(cached.cached_at):
        return json.loads(cached.data)

    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{GITHUB_API}/users/{username}", headers=get_headers(token))
        resp.raise_for_status()
        data = resp.json()

    if cached:
        cached.data = json.dumps(data)
        cached.cached_at = datetime.utcnow()
    else:
        db.add(CachedUser(username=username, data=json.dumps(data), cached_at=datetime.utcnow()))
    await db.commit()
    return data


async def fetch_user_repos(username: str, db: AsyncSession, token: str = None):
    result = await db.execute(select(CachedRepo).where(CachedRepo.username == username))
    cached_rows = result.scalars().all()

    if cached_rows and all(is_cache_fresh(r.cached_at) for r in cached_rows):
        return [json.loads(r.data) for r in cached_rows]

    async with httpx.AsyncClient() as client:
        repos = []
        page = 1
        while True:
            resp = await client.get(
                f"{GITHUB_API}/users/{username}/repos",
                headers=get_headers(token),
                params={"per_page": 100, "page": page, "sort": "updated", "type": "owner"},
            )
            resp.raise_for_status()
            batch = resp.json()
            if not batch:
                break
            repos.extend(batch)
            if len(batch) < 100:
                break
            page += 1

    # Delete old cache
    for r in cached_rows:
        await db.delete(r)

    for repo in repos:
        db.add(CachedRepo(
            username=username,
            repo_name=repo["name"],
            data=json.dumps(repo),
            cached_at=datetime.utcnow(),
        ))
    await db.commit()
    return repos


async def fetch_contributions(username: str, db: AsyncSession, token: str = None):
    result = await db.execute(
        select(CachedContributions).where(CachedContributions.username == username)
    )
    cached = result.scalar_one_or_none()
    if cached and is_cache_fresh(cached.cached_at):
        return json.loads(cached.data)

    t = token or settings.GITHUB_TOKEN
    if not t:
        return {"error": "GitHub token required for GraphQL contribution calendar (provide token in search bar)", "weeks": [], "totalContributions": 0}

    query = """
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
    """

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            GITHUB_GRAPHQL,
            json={"query": query, "variables": {"username": username}},
            headers=get_headers(token),
        )
        resp.raise_for_status()
        gql_data = resp.json()

    calendar = (
        gql_data.get("data", {})
        .get("user", {})
        .get("contributionsCollection", {})
        .get("contributionCalendar", {})
    )

    if not calendar:
        return {"error": "No calendar returned by GitHub GraphQL", "weeks": [], "totalContributions": 0}

    if cached:
        cached.data = json.dumps(calendar)
        cached.cached_at = datetime.utcnow()
    else:
        db.add(CachedContributions(
            username=username, data=json.dumps(calendar), cached_at=datetime.utcnow()
        ))
    await db.commit()
    return calendar


async def fetch_repo_languages(username: str, repo_name: str, token: str = None):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API}/repos/{username}/{repo_name}/languages",
            headers=get_headers(token),
        )
        if resp.status_code == 200:
            return resp.json()
    return {}


async def get_aggregated_languages(username: str, db: AsyncSession, token: str = None):
    repos = await fetch_user_repos(username, db, token)
    lang_totals = {}
    for repo in repos[:20]:
        if repo.get("language"):
            lang = repo["language"]
            lang_totals[lang] = lang_totals.get(lang, 0) + 1
    return lang_totals
