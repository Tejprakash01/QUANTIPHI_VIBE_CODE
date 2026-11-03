import React, { useState, useEffect } from 'react'
import { FiCheckCircle, FiXCircle, FiTrendingUp, FiCpu, FiFileText, FiRefreshCw } from 'react-icons/fi'
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
    title: 'Modern Frontend Engineer',
    text: 'Frontend developer needed with deep expertise in JavaScript, TypeScript, React, HTML5, CSS/Tailwind, state management, and modern build tools.',
  },
  {
    title: 'Machine Learning / Data Scientist',
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

  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', fill: '#34d399' }
    if (score >= 60) return { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', fill: '#60a5fa' }
    if (score >= 40) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', fill: '#fbbf24' }
    return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', fill: '#f87171' }
  }

  const scoreTheme = result ? getScoreColor(result.match_score) : null

  return (
    <div className="space-y-6 fade-in">
      {/* Introduction Card */}
      <div className="card bg-gradient-to-r from-[#161b22] to-[#1f2937] border-[#30363d]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl text-purple-400 shrink-0">
            <FiCpu />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⚡ Tech Stack Compatibility (Vibe Check)</span>
            </h2>
            <p className="text-sm text-[#8b949e] mt-1 leading-relaxed">
              Paste any job description to evaluate how well your GitHub projects align with the role. The backend analyzes your cached repositories and identifies matched vs missing skills.
            </p>
          </div>
        </div>
      </div>

      {/* Result Display Banner */}
      {result && scoreTheme && (
        <div className={`p-6 rounded-xl border ${scoreTheme.bg} ${scoreTheme.border} transition-all duration-300`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#30363d"
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
                  <span className="text-[10px] text-[#8b949e] uppercase tracking-wider">Match</span>
                </div>
              </div>

              <div>
                <div className="text-xl font-bold text-white mb-1">
                  {result.label}
                </div>
                <p className="text-xs text-[#8b949e]">
                  Evaluated against repositories for <strong className="text-white">@{username}</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-4 w-full sm:w-auto text-center">
              <div className="bg-[#0d1117] border border-[#30363d] px-4 py-2.5 rounded-lg flex-1 sm:flex-initial min-w-[100px]">
                <div className="text-xs text-emerald-400 font-semibold mb-1">Matched</div>
                <div className="text-xl font-bold text-white">{result.matched_technologies.length}</div>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] px-4 py-2.5 rounded-lg flex-1 sm:flex-initial min-w-[100px]">
                <div className="text-xs text-rose-400 font-semibold mb-1">Missing</div>
                <div className="text-xl font-bold text-white">{result.missing_technologies.length}</div>
              </div>
            </div>
          </div>

          {/* Matched & Missing Chips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-[#30363d]/50">
            <div>
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <FiCheckCircle /> Matched Technologies ({result.matched_technologies.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matched_technologies.length > 0 ? (
                  result.matched_technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-mono"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#8b949e] italic">No matching keywords found</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <FiXCircle /> Missing Technologies ({result.missing_technologies.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missing_technologies.length > 0 ? (
                  result.missing_technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs px-2.5 py-1 rounded-md font-mono"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 italic">No missing requirements!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <FiFileText />
            <span>Job Description or Requirements</span>
          </label>
          <span className="text-xs text-[#8b949e]">
            {jobDescription.length} characters
          </span>
        </div>

        {/* Preset quick templates */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#8b949e] shrink-0">Try preset:</span>
          {SAMPLE_JOB_DESCRIPTIONS.map((sample) => (
            <button
              key={sample.title}
              type="button"
              onClick={() => setJobDescription(sample.text)}
              className="bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] px-2.5 py-1 rounded text-[#c9d1d9] whitespace-nowrap transition-colors"
            >
              {sample.title}
            </button>
          ))}
        </div>

        <textarea
          rows={5}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description, required qualifications, or required technologies here (e.g., Python, React, TypeScript, FastAPI, Docker, SQL)..."
          className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#388bfd] text-sm resize-y"
        />

        {error && (
          <div className="p-3 bg-[#3d1f1f] border border-[#f85149] rounded-md text-[#f85149] text-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setJobDescription('')}
            disabled={!jobDescription}
            className="px-4 py-2 border border-[#30363d] hover:bg-[#21262d] disabled:opacity-50 text-[#c9d1d9] rounded-md text-sm font-medium transition-colors"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleCheck}
            disabled={loading || !jobDescription.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin text-sm" />
                <span>Analyzing Stack...</span>
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

