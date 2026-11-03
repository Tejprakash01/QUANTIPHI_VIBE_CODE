# 🚀 GitHub Developer Portfolio & Vibe Check Dashboard

A full-stack developer portfolio and technical analytics application built for the **Quantiphi Vibe Coding Challenge**. It connects to GitHub's REST and GraphQL APIs to visualize developer activity, repository statistics, coding streaks, and features an intelligent **Tech Stack Compatibility (Vibe Check)** engine.

---
LIVE - https://devportfolio-frontend-ql7q.onrender.com/

---
## 🌟 Highlights & Architecture

- **Backend**: FastAPI (Python 3.10+ / 3.14) with asynchronous architecture, SQLite caching (SQLAlchemy + aiosqlite), and server-side analytical algorithms.
- **Frontend**: React 18 with Vite, Tailwind CSS, Recharts for visual analytics, and Lucide/React Icons.
- **All Business Logic Server-Side**: Streak calculations, keyword matching, language aggregation, and productivity scoring are executed exclusively on the FastAPI backend.

```
quantiphivibe/
├── backend/
│   ├── config.py              # Application settings & environment loader
│   ├── database.py            # SQLite schema (Async SQLAlchemy & aiosqlite)
│   ├── main.py                # FastAPI entry point & CORS configuration
│   ├── requirements.txt       # Python dependencies
│   ├── routers/
│   │   ├── github.py          # GitHub API integration & aggregation routes
│   │   └── vibe.py            # Vibe check (Tech Stack Compatibility) routes
│   └── services/
│       ├── analytics_service.py # Streaks, Tech Stack keyword match, Productivity Index
│       └── github_service.py    # GitHub REST & GraphQL client with SQLite cache
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ContributionGraph.jsx   # Heatmap grid colored by intensity
│   │   │   ├── ProfileHeader.jsx       # Followers, stats & Top Languages Pie Chart
│   │   │   ├── RepositoryCards.jsx     # Repo cards with stars, forks, languages
│   │   │   ├── StreakTracker.jsx       # Current & longest streaks (Feature #1)
│   │   │   ├── ProductivityInsights.jsx# Developer Productivity Index (Feature #2)
│   │   │   └── VibeCheck.jsx           # Tech Stack Compatibility evaluator
│   │   ├── services/
│   │   │   └── api.js                  # Axios client connecting to FastAPI backend
│   │   ├── App.jsx                     # Dashboard orchestrator & tab navigation
│   │   ├── index.css                   # Custom styles, theme & animations
│   │   └── main.jsx                    # Application bootstrap
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## 📋 Features Implemented

### 1. 🌿 Contribution Graph Heatmap
- Visual heatmap grid showing daily coding activity colored by intensity (Level 0 to 4).
- Shows total contributions in the last year with interactive hover tooltips for every individual day.
- GraphQL integration for real-time GitHub contribution calendars.

### 2. 📦 Repository Cards
- Display key metrics for each repository:
  - ⭐️ Star count
  - 🍴 Fork count
  - 🏷 Language tag with distinct language color dots
  - 📝 Repository description & visibility badge
  - 🕒 Relative "Updated time"
  - Direct link to GitHub repository
- Live search by repository name/description, language filter dropdown, and sorting (Stars, Forks, Recently Updated, Alphabetical).

### 3. 👤 Profile Header
- Follower count, following count, public repos, and public gists.
- User bio, location, company, website, and Twitter handle.
- **Top Languages Pie Chart**: Interactive donut/pie chart powered by Recharts showing language distribution across public repositories with percentage breakdown.

### 4. ⚡ The Vibe Check (Tech Stack Compatibility)
- User inputs or pastes a target job description or requirements specification.
- Server-side keyword extractor scans against the developer's cached repositories and languages.
- Computes an automated **Match Percentage Badge** with status rating (e.g. *Excellent Match*, *Good Match*, *Partial Match*).
- Displays color-coded **Matched Technologies** (green) and **Missing Technologies** (red/orange) along with repository frequency counts.

---

## 🎁 Two Extra Features (Chatbot / AI Capabilities)

### Feature 1: 🔥 Coding Streak & Consistency Tracker
- Computes both **Current Streak** and **Longest Streak** from contribution calendars on the server side.
- Active streak badge indicator with daily habit recommendations for recruiters and peer developers.

### Feature 2: 🧠 Developer Productivity Index
- Comprehensive server-side developer analytics engine that evaluates:
  - **Repository Volume**: Portfolio size and codebase velocity
  - **Community Recognition**: Stargazer momentum across public projects
  - **Language Diversity**: Breadth of programming languages mastered
  - **Recent Momentum**: Projects actively maintained within the last 30 days
- Includes interactive horizontal bar charts for repository language frequencies and developer status badges (*Rockstar Developer*, *Active Contributor*, etc.).

---

## 🗄️ Backend Caching Engine (SQLite)

To prevent GitHub API rate-limiting (`403 API rate limit exceeded`) and ensure sub-millisecond page loads:
- **`CachedUser`**: Caches user profile data for 30 minutes.
- **`CachedRepo`**: Caches repositories metadata for 30 minutes.
- **`CachedContributions`**: Caches GraphQL contribution calendars.
- **`UserSettings`**: Persists last job description, match score, and user preferences locally.

---

## 🛠️ Getting Started

### Prerequisites
- Python 3.10+ (or 3.14)
- Node.js 18+ and npm

### 1. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Add GitHub token for higher rate limits and full GraphQL contribution access
# Create .env file:
# GITHUB_TOKEN=your_personal_access_token_here

# Run FastAPI server
uvicorn main:app --reload --port 8000
```
API Documentation will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The application will open at: `http://localhost:3000`

---

## 🚀 1-Click Deployment to Render (`render.yaml`)

This project includes a composed **Render Blueprint** (`render.yaml`) to deploy both the FastAPI backend and React frontend automatically.

### Deploy Steps:
1. Push your repository to GitHub.
2. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Blueprint**.
3. Select your repository. Render will automatically parse `render.yaml` and configure:
   - **`devportfolio-backend`**: FastAPI Python Web Service.
   - **`devportfolio-frontend`**: React Vite Static Site with SPA rewrites.
4. Render will prompt you for any secret environment variables (`GITHUB_TOKEN`), keeping your credentials private.
5. Click **Apply Blueprint** to launch both services.

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/github/profile/{username}` | Fetch user profile info |
| `GET` | `/api/github/repos/{username}` | Fetch cached user repositories |
| `GET` | `/api/github/contributions/{username}` | Fetch contribution calendar and streak |
| `GET` | `/api/github/languages/{username}` | Aggregated language breakdown |
| `GET` | `/api/github/productivity/{username}` | Developer Productivity Index metrics |
| `GET` | `/api/github/dashboard/{username}` | Unified payload for single-call loading |
| `POST` | `/api/vibe/check` | Calculate Tech Stack Compatibility against job description |
| `GET` | `/api/vibe/settings/{username}` | Fetch saved user settings & last match score |
| `PUT` | `/api/vibe/settings` | Update user settings |

---

## ⚖️ License
MIT License. Built for the Quantiphi Vibe Coding Round.

