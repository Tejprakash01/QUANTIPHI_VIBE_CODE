from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from routers import github, vibe


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="GitHub Developer Portfolio API",
    description="Backend for the GitHub Developer Portfolio Dashboard",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(github.router)
app.include_router(vibe.router)


@app.get("/")
async def root():
    return {
        "message": "GitHub Developer Portfolio API",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}

