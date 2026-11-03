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
      <div className="card text-center py-8 text-[#8b949e]">
        No productivity insights available.
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

  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-emerald-400', bar: '#34d399' }
    if (score >= 60) return { text: 'text-blue-400', bar: '#60a5fa' }
    if (score >= 40) return { text: 'text-amber-400', bar: '#fbbf24' }
    return { text: 'text-purple-400', bar: '#c084fc' }
  }

  const theme = getScoreColor(productivity_score)

  const factorItems = [
    {
      title: 'Repository Volume',
      desc: 'Portfolio size and codebases maintained',
      score: score_breakdown.repo_count ?? 0,
      max: 30,
    },
    {
      title: 'Community Recognition',
      desc: 'Stars earned across public projects',
      score: score_breakdown.stars ?? 0,
      max: 25,
    },
    {
      title: 'Language Diversity',
      desc: 'Breadth of languages and tools utilized',
      score: score_breakdown.diversity ?? 0,
      max: 25,
    },
    {
      title: 'Recent Momentum',
      desc: 'Active repositories updated within 30 days',
      score: score_breakdown.recent_activity ?? 0,
      max: 20,
    },
  ]

  return (
    <div className="space-y-6 fade-in">
      {/* Overview Banner */}
      <div className="card bg-gradient-to-r from-[#161b22] to-[#1e2638] border-[#30363d]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-3xl text-blue-400">
              <FiAward />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Developer Productivity Index</h2>
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-blue-500/30">
                  AI Analytics
                </span>
              </div>
              <p className="text-sm text-[#8b949e] mt-0.5">
                Calculated from repo activity, community traction, and technical versatility
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0d1117] border border-[#30363d] px-5 py-3 rounded-xl w-full md:w-auto justify-center">
            <div className="text-right">
              <div className="text-xs text-[#8b949e]">Status</div>
              <div className="text-sm font-bold text-white">{score_label}</div>
            </div>
            <div className="w-px h-8 bg-[#30363d]" />
            <div>
              <span className={`text-3xl font-black ${theme.text}`}>
                {productivity_score}
              </span>
              <span className="text-xs text-[#8b949e]">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 text-xs text-[#8b949e] mb-1">
            <FiStar className="text-[#e3b341]" />
            <span>Total Stars</span>
          </div>
          <div className="text-2xl font-bold text-white">{total_stars}</div>
          <div className="text-[11px] text-[#8b949e] mt-1">Avg {avg_stars_per_repo} per repo</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 text-xs text-[#8b949e] mb-1">
            <FiGitPullRequest className="text-purple-400" />
            <span>Total Forks</span>
          </div>
          <div className="text-2xl font-bold text-white">{total_forks}</div>
          <div className="text-[11px] text-[#8b949e] mt-1">Community derivations</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 text-xs text-[#8b949e] mb-1">
            <FiClock className="text-emerald-400" />
            <span>Active Repos</span>
          </div>
          <div className="text-2xl font-bold text-white">{recently_updated_repos}</div>
          <div className="text-[11px] text-[#8b949e] mt-1">Touched in last 30 days</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 text-xs text-[#8b949e] mb-1">
            <FiCode className="text-blue-400" />
            <span>Languages</span>
          </div>
          <div className="text-2xl font-bold text-white">{top_languages.length}</div>
          <div className="text-[11px] text-[#8b949e] mt-1">In public repositories</div>
        </div>
      </div>

      {/* Factor Breakdown & Top Languages Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Factors */}
        <div className="card space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <FiTrendingUp />
            <span>Score Factors Breakdown</span>
          </h3>

          <div className="space-y-3">
            {factorItems.map((factor) => {
              const pct = Math.round((factor.score / factor.max) * 100)
              return (
                <div key={factor.title} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <div>
                      <span className="text-white font-medium">{factor.title}</span>
                      <span className="text-[#8b949e] ml-2 text-[11px]">({factor.desc})</span>
                    </div>
                    <span className="text-[#c9d1d9] font-mono font-semibold">
                      {factor.score}/{factor.max}
                    </span>
                  </div>
                  <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#30363d]/50">
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
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
            <FiActivity />
            <span>Repository Language Frequency</span>
          </h3>

          {top_languages.length > 0 ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={top_languages}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" stroke="#8b949e" tickLine={false} fontSize={11} />
                  <YAxis
                    dataKey="language"
                    type="category"
                    stroke="#8b949e"
                    tickLine={false}
                    fontSize={11}
                    width={85}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#161b22',
                      border: '1px solid #30363d',
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                    itemStyle={{ color: '#c9d1d9' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {top_languages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-xs text-[#8b949e] py-12">
              No language statistics found for this profile.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

