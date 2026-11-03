import React from 'react'
import {
  FiActivity,
  FiStar,
  FiGitPullRequest,
  FiTrendingUp,
  FiAward,
  FiCode,
  FiClock,
} from 'react-icons/fi'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const COLORS = ['#388bfd', '#3fb950', '#f78166', '#d2a8ff', '#ffa657']

export default function ProductivityInsights({ data, username }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="card text-center py-12 text-[var(--text-muted)]">
        No developer productivity metrics available.
      </div>
    )
  }

  const {
    productivity_score = 0,
    score_label = 'Active Developer',
    score_breakdown = {},
    top_languages = [],
    total_stars = 0,
    total_forks = 0,
    avg_stars_per_repo = 0,
    recently_updated_repos = 0,
    total_repos = 0,
  } = data

  const getScoreTheme = (score) => {
    if (score >= 80) return { text: 'text-emerald-500', bar: '#10b981' }
    if (score >= 60) return { text: 'text-blue-500', bar: '#3b82f6' }
    if (score >= 40) return { text: 'text-amber-500', bar: '#f59e0b' }
    return { text: 'text-purple-500', bar: '#8b5cf6' }
  }

  const theme = getScoreTheme(productivity_score)

  const factorItems = [
    {
      title: 'Repository Volume',
      desc: 'Active codebases maintained',
      score: score_breakdown.repo_count ?? 0,
      max: 30,
    },
    {
      title: 'Community Traction',
      desc: 'Stars earned across public projects',
      score: score_breakdown.stars ?? 0,
      max: 25,
    },
    {
      title: 'Language Diversity',
      desc: 'Breadth of programming languages',
      score: score_breakdown.diversity ?? 0,
      max: 25,
    },
    {
      title: 'Recent Momentum',
      desc: 'Projects updated in the last 30 days',
      score: score_breakdown.recent_activity ?? 0,
      max: 20,
    },
  ]

  return (
    <div className="space-y-6 fade-in">
      {/* Overview Banner */}
      <div className="card relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-3xl text-[var(--accent-blue)] shadow-inner shrink-0">
              <FiAward />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  Developer Productivity Index
                </h2>
                <span className="bg-blue-500/15 text-[var(--accent-blue)] text-xs px-2.5 py-0.5 rounded-full font-bold border border-blue-500/30">
                  AI Analytics
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Evaluated from repository velocity, code traction, and engineering versatility
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[var(--bg-elevated)] border border-[var(--border-color)] px-5 py-3 rounded-2xl w-full md:w-auto justify-center shadow-sm">
            <div className="text-right">
              <div className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                Status
              </div>
              <div className="text-sm font-bold text-[var(--text-primary)]">{score_label}</div>
            </div>
            <div className="w-px h-8 bg-[var(--border-color)]" />
            <div>
              <span className={`text-3xl font-black ${theme.text}`}>
                {productivity_score}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-bold">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] mb-1">
            <FiStar className="text-amber-500" />
            <span>Total Stars</span>
          </div>
          <div className="text-2xl font-black text-[var(--text-primary)]">{total_stars}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">Avg {avg_stars_per_repo} per repo</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] mb-1">
            <FiGitPullRequest className="text-purple-500" />
            <span>Total Forks</span>
          </div>
          <div className="text-2xl font-black text-[var(--text-primary)]">{total_forks}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">Community derivations</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] mb-1">
            <FiClock className="text-emerald-500" />
            <span>Active Repos</span>
          </div>
          <div className="text-2xl font-black text-[var(--text-primary)]">{recently_updated_repos}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">Pushed in last 30 days</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] mb-1">
            <FiCode className="text-[var(--accent-blue)]" />
            <span>Languages</span>
          </div>
          <div className="text-2xl font-black text-[var(--text-primary)]">{top_languages.length}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">Public codebases</div>
        </div>
      </div>

      {/* Factor Breakdown & Top Languages Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Factors */}
        <div className="card space-y-4">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
            <FiTrendingUp className="text-[var(--accent-blue)]" />
            <span>Score Factors Breakdown</span>
          </h3>

          <div className="space-y-3.5">
            {factorItems.map((factor) => {
              const pct = Math.round((factor.score / factor.max) * 100)
              return (
                <div key={factor.title} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <div>
                      <span className="text-[var(--text-primary)] font-bold">{factor.title}</span>
                      <span className="text-[var(--text-muted)] ml-2 text-[11px]">({factor.desc})</span>
                    </div>
                    <span className="text-[var(--text-primary)] font-mono font-bold">
                      {factor.score}/{factor.max}
                    </span>
                  </div>
                  <div className="w-full bg-[var(--bg-elevated)] h-2 rounded-full overflow-hidden border border-[var(--border-color)]">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Languages Chart */}
        <div className="card flex flex-col justify-between">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2 mb-2">
            <FiActivity className="text-[var(--accent-blue)]" />
            <span>Language Frequency in Projects</span>
          </h3>

          {top_languages.length > 0 ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={top_languages}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <XAxis type="number" stroke="var(--text-muted)" tickLine={false} fontSize={11} />
                  <YAxis
                    dataKey="language"
                    type="category"
                    stroke="var(--text-muted)"
                    tickLine={false}
                    fontSize={11}
                    width={85}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                      borderRadius: 8,
                      color: 'var(--text-primary)',
                      fontSize: 12,
                      boxShadow: 'var(--card-shadow)',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {top_languages.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-xs text-[var(--text-muted)] py-12">
              No language statistics found for this profile.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
