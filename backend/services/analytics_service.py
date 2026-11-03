import re
from collections import Counter


# Common tech keywords mapped to languages/frameworks
TECH_KEYWORD_MAP = {
    "python": ["python", "py", "django", "flask", "fastapi", "pandas", "numpy", "scikit"],
    "javascript": ["javascript", "js", "node", "nodejs", "react", "vue", "angular", "express", "next"],
    "typescript": ["typescript", "ts", "angular", "next.js", "nestjs"],
    "java": ["java", "spring", "springboot", "maven", "gradle", "hibernate"],
    "go": ["go", "golang", "gin", "fiber"],
    "rust": ["rust", "cargo"],
    "c++": ["c++", "cpp", "cmake"],
    "c": ["c", "embedded"],
    "ruby": ["ruby", "rails", "sinatra"],
    "php": ["php", "laravel", "symfony", "wordpress"],
    "swift": ["swift", "ios", "xcode"],
    "kotlin": ["kotlin", "android"],
    "r": ["r", "rstudio", "shiny", "ggplot"],
    "scala": ["scala", "spark", "akka"],
    "dart": ["dart", "flutter"],
    "shell": ["bash", "shell", "sh", "powershell"],
    "html": ["html", "frontend", "web"],
    "css": ["css", "sass", "scss", "tailwind", "bootstrap"],
    "sql": ["sql", "mysql", "postgresql", "postgres", "sqlite", "database", "db"],
    "dockerfile": ["docker", "kubernetes", "k8s", "container", "devops"],
    "jupyter notebook": ["jupyter", "notebook", "data science", "machine learning", "ml", "ai"],
}


def extract_keywords(text: str) -> set:
    text = text.lower()
    # Extract words including symbols like c++, .js, c#
    words = set(re.findall(r"[a-z0-9+#.]+", text))
    return words


def compute_match_score(job_description: str, user_languages: dict) -> dict:
    """
    Compare job description keywords against user's repo languages.
    Uses whole-word token matching to prevent false positives.
    Returns match score and breakdown.
    """
    if not job_description.strip() or not user_languages:
        return {"score": 0, "matched": [], "missing": [], "breakdown": {}}

    jd_tokens = extract_keywords(job_description)
    user_langs_lower = {k.lower(): v for k, v in user_languages.items()}

    matched = []
    missing = []
    breakdown = {}

    for lang, keywords in TECH_KEYWORD_MAP.items():
        # Check if job description mentions this tech as a distinct token
        jd_mentions = any(kw in jd_tokens for kw in keywords)
        if not jd_mentions:
            continue

        # Check if user has this in their repos
        user_has = lang in user_langs_lower or any(
            kw in user_langs_lower for kw in keywords
        )

        breakdown[lang] = {
            "required": True,
            "user_has": user_has,
            "repo_count": user_langs_lower.get(lang, 0),
        }

        if user_has:
            matched.append(lang)
        else:
            missing.append(lang)

    total_required = len(matched) + len(missing)
    score = round((len(matched) / total_required * 100) if total_required > 0 else 0, 1)

    return {
        "score": score,
        "matched": matched,
        "missing": missing,
        "breakdown": breakdown,
        "label": _score_label(score),
    }


def _score_label(score: float) -> str:
    if score >= 80:
        return "Excellent Match 🚀"
    elif score >= 60:
        return "Good Match ✅"
    elif score >= 40:
        return "Partial Match 🟡"
    elif score >= 20:
        return "Low Match 🔴"
    else:
        return "No Match ❌"


def calculate_streak(weeks: list) -> dict:
    """Calculate current and longest coding streak from contribution calendar."""
    all_days = []
    for week in weeks:
        for day in week.get("contributionDays", []):
            all_days.append(day)

    all_days.sort(key=lambda d: d["date"])

    current_streak = 0
    longest_streak = 0
    temp_streak = 0

    from datetime import date, timedelta
    today_str = date.today().isoformat()
    yesterday_str = (date.today() - timedelta(days=1)).isoformat()

    # Calculate streaks
    for day in all_days:
        if day["contributionCount"] > 0:
            temp_streak += 1
            longest_streak = max(longest_streak, temp_streak)
        else:
            temp_streak = 0

    # Current streak (from today or yesterday backwards)
    reversed_days = list(reversed(all_days))
    started = False
    for day in reversed_days:
        if not started:
            if day["date"] in (today_str, yesterday_str):
                if day["contributionCount"] > 0:
                    current_streak += 1
                    started = True
            else:
                continue
        else:
            if day["contributionCount"] > 0:
                current_streak += 1
            else:
                break

    return {
        "current": current_streak,
        "longest": longest_streak,
        "total_contributions": sum(d.get("contributionCount", 0) for d in all_days),
    }


def calculate_productivity_insights(repos: list) -> dict:
    """Analyze repo patterns to generate productivity insights."""
    if not repos:
        return {}

    languages = Counter()
    total_stars = 0
    total_forks = 0
    recently_updated = 0
    from datetime import datetime, timezone, timedelta

    now = datetime.now(timezone.utc)
    thirty_days_ago = now - timedelta(days=30)

    for repo in repos:
        if repo.get("language"):
            languages[repo["language"]] += 1
        total_stars += repo.get("stargazers_count", 0)
        total_forks += repo.get("forks_count", 0)

        updated_at = repo.get("updated_at", "")
        if updated_at:
            try:
                updated = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
                if updated >= thirty_days_ago:
                    recently_updated += 1
            except Exception:
                pass

    top_languages = languages.most_common(5)
    total_repos = len(repos)
    avg_stars = round(total_stars / total_repos, 1) if total_repos else 0

    # Productivity score (0-100)
    score_factors = {
        "repo_count": min(total_repos * 2, 30),  # max 30 pts
        "stars": min(total_stars, 25),            # max 25 pts
        "diversity": min(len(languages) * 3, 25), # max 25 pts
        "recent_activity": min(recently_updated * 5, 20),  # max 20 pts
    }
    productivity_score = min(sum(score_factors.values()), 100)

    return {
        "productivity_score": productivity_score,
        "score_breakdown": score_factors,
        "top_languages": [{"language": l, "count": c} for l, c in top_languages],
        "total_stars": total_stars,
        "total_forks": total_forks,
        "avg_stars_per_repo": avg_stars,
        "recently_updated_repos": recently_updated,
        "total_repos": total_repos,
        "score_label": _productivity_label(productivity_score),
    }


def _productivity_label(score: float) -> str:
    if score >= 80:
        return "Rockstar Developer 🌟"
    elif score >= 60:
        return "Active Contributor 💪"
    elif score >= 40:
        return "Growing Developer 🌱"
    else:
        return "Getting Started 🚀"
