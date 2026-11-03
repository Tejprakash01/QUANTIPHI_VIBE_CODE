import React, { useState, useEffect } from 'react'
import {
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiCpu,
  FiFileText,
  FiRefreshCw,
  FiAward,
} from 'react-icons/fi'
import { vibeAPI } from '../services/api'

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: 'Full Stack Engineer (Python + React)',
    text: 'We are seeking a Full Stack Developer experienced in Python, FastAPI or Django, React, TypeScript, SQL databases (PostgreSQL/MySQL), Docker, and RESTful APIs.',
  },
  {
    title: 'Backend Specialist (Go / Python)',
    text: 'Looking for a Senior Backend Engineer proficient in Python, Go, Docker, Kubernetes, microservices architecture, and SQL/NoSQL databases.',
  },
  {
    title: 'Frontend Engineer (React / TypeScript)',
    text: 'Frontend developer needed with deep expertise in JavaScript, TypeScript, React, HTML5, CSS/Tailwind, state management, and modern build tools.',
  },
  {
    title: 'Data / Machine Learning Engineer',
    text: 'AI/ML Engineer role requiring Python, Jupyter Notebooks, Pandas, NumPy, Scikit-learn, Docker, and experience with data pipelines.',
  },
]

export default function VibeCheck({ username, token, userLanguages }) {
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // Load previous settings if exists
  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await vibeAPI.getSettings(username)
        if (data.last_job_description) {
          setJobDescription(data.last_job_description)
        }
      } catch (err) {
        // silent fail on settings fetch
      }
    }
    if (username) {
      loadSettings()
    }
  }, [username])

  const handleCheck = async (e) => {
    if (e) e.preventDefault()
    if (!jobDescription.trim()) return

    setLoading(true)
    setError('')
    try {
      const { data } = await vibeAPI.check(username, jobDescription, token)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to calculate Vibe Check.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreTheme = (score) => {
    if (score >= 80)
      return {
        text: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        fill: '#10b981',
      }
    if (score >= 60)
      return {
        text: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        fill: '#3b82f6',
      }
    if (score >= 40)
      return {
        text: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        fill: '#f59e0b',
      }
    return {
      text: 'text-rose-500',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      fill: '#ef4444',
    }
  }

  const scoreTheme = result ? getScoreTheme(result.match_score) : null

  return (
    <div className="space-y-6 fade-in">
      {/* Introduction Card */}
      <div className="card relative overflow-hidden">
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-2xl text-purple-500 shrink-0 shadow-inner">
            <FiCpu />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span>⚡ Tech Stack Compatibility (The Vibe Check)</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              Input any job description or target role requirements. Our server-side keyword engine compares required technologies against languages used across your public repositories and generates a match score.
            </p>
          </div>
        </div>
      </div>

      {/* Result Display Banner */}
      {result && scoreTheme && (
        <div className={`card p-6 border ${scoreTheme.bg} ${scoreTheme.border} transition-all duration-300 fade-in`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Radial gauge */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="var(--border-color)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={scoreTheme.fill}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - result.match_score / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-black ${scoreTheme.text}`}>
                    {result.match_score}%
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                    Match
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xl font-extrabold text-[var(--text-primary)] mb-1">
                  {result.label}
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Evaluated against cached repositories for <strong className="text-[var(--text-primary)]">@{username}</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto text-center">
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-color)] px-4 py-3 rounded-xl flex-1 sm:flex-initial min-w-[100px] shadow-sm">
                <div className="text-xs text-emerald-500 font-bold mb-0.5">Matched</div>
                <div className="text-2xl font-black text-[var(--text-primary)]">
                  {result.matched_technologies.length}
                </div>
              </div>
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-color)] px-4 py-3 rounded-xl flex-1 sm:flex-initial min-w-[100px] shadow-sm">
                <div className="text-xs text-rose-500 font-bold mb-0.5">Missing</div>
                <div className="text-2xl font-black text-[var(--text-primary)]">
                  {result.missing_technologies.length}
                </div>
              </div>
            </div>
          </div>

          {/* Matched & Missing Chips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-[var(--border-subtle)]">
            <div>
              <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <FiCheckCircle className="text-sm" />
                <span>Matched Technologies ({result.matched_technologies.length})</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matched_technologies.length > 0 ? (
                  result.matched_technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-mono font-medium px-2.5 py-1 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[var(--text-muted)] italic">No matching keywords found</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <FiXCircle className="text-sm" />
                <span>Missing Technologies ({result.missing_technologies.length})</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missing_technologies.length > 0 ? (
                  result.missing_technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-mono font-medium px-2.5 py-1 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-500 font-medium">All requested technologies matched!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <FiFileText className="text-[var(--accent-blue)]" />
            <span>Job Description or Tech Requirements</span>
          </label>
          <span className="text-xs text-[var(--text-muted)]">
            {jobDescription.length} characters
          </span>
        </div>

        {/* Preset quick templates */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[var(--text-muted)] shrink-0 font-medium">Try Preset:</span>
          {SAMPLE_JOB_DESCRIPTIONS.map((sample) => (
            <button
              key={sample.title}
              type="button"
              onClick={() => setJobDescription(sample.text)}
              className="bg-[var(--bg-elevated)] hover:border-[var(--accent-blue)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg text-[var(--text-secondary)] whitespace-nowrap transition-colors font-medium text-xs shadow-sm"
            >
              {sample.title}
            </button>
          ))}
        </div>

        <textarea
          rows={5}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description or requirements here (e.g. Python, React, TypeScript, FastAPI, Docker, PostgreSQL)..."
          className="w-full p-3.5 bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] text-sm resize-y leading-relaxed transition-colors"
        />

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center pt-1">
          <button
            type="button"
            onClick={() => setJobDescription('')}
            disabled={!jobDescription}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors underline disabled:opacity-30 disabled:no-underline"
          >
            Clear input
          </button>

          <button
            type="button"
            onClick={handleCheck}
            disabled={loading || !jobDescription.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin text-sm" />
                <span>Evaluating Tech Stack...</span>
              </>
            ) : (
              <>
                <FiTrendingUp className="text-sm" />
                <span>Calculate Compatibility</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
