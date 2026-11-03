import { useState, useCallback, useEffect } from 'react'
import {
  FiGithub,
  FiSearch,
  FiKey,
  FiAlertTriangle,
  FiCheckCircle,
  FiSun,
  FiMoon,
} from 'react-icons/fi'
import ProfileHeader from './components/ProfileHeader'
import ContributionGraph from './components/ContributionGraph'
import RepositoryCards from './components/RepositoryCards'
import VibeCheck from './components/VibeCheck'
import ProductivityInsights from './components/ProductivityInsights'
import StreakTracker from './components/StreakTracker'
import TokenModal from './components/TokenModal'
import { githubAPI } from './services/api'

export default function App() {
  const [username, setUsername] = useState('')
  const [token, setToken] = useState(() => localStorage.getItem('github_token') || '')
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio_theme') || 'dark')
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false)
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
    }
    localStorage.setItem('portfolio_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleSaveToken = (newToken) => {
    setToken(newToken)
    if (newToken) {
      localStorage.setItem('github_token', newToken)
    } else {
      localStorage.removeItem('github_token')
    }
  }

  const handleSearch = useCallback(
    async (e, overrideUsername = null) => {
      if (e) e.preventDefault()
      const targetUser = overrideUsername || username
      if (!targetUser.trim()) return

      setLoading(true)
      setError('')
      setIsRateLimited(false)
      setDashboard(null)

      try {
        const { data } = await githubAPI.getDashboard(targetUser.trim(), token || undefined)
        setDashboard(data)
        setActiveTab('overview')
      } catch (err) {
        const status = err.response?.status
        const detail = err.response?.data?.detail || ''
        const isRateLimit = status === 403 || detail.toLowerCase().includes('rate limit')

        setIsRateLimited(isRateLimit)
        setError(detail || 'Failed to fetch GitHub data. Check the username and try again.')
      } finally {
        setLoading(false)
      }
    },
    [username, token]
  )

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'repos', label: '📁 Repositories' },
    { id: 'contributions', label: '🌿 Contributions' },
    { id: 'vibe', label: '⚡ Vibe Check' },
    { id: 'insights', label: '🧠 Insights' },
  ]

  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-[#0d1117] text-[#c9d1d9]' : 'bg-[#f6f8fa] text-[#1f2328]'}`}>
      {/* Token Management Modal */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        currentToken={token}
        onSaveToken={handleSaveToken}
      />

      {/* Header */}
      <header className={`border-b sticky top-0 z-40 transition-colors ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div
            className={`flex items-center gap-2 font-bold text-lg cursor-pointer hover:opacity-80 transition-opacity ${isDark ? 'text-white' : 'text-[#1f2328]'}`}
            onClick={() => setDashboard(null)}
          >
            <FiGithub className="text-2xl" />
            <span>DevPortfolio</span>
          </div>

          <form onSubmit={(e) => handleSearch(e)} className="flex flex-1 gap-2 max-w-xl">
            <div className="flex-1 relative">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username..."
                className={`w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9] placeholder-[#8b949e] focus:border-[#388bfd]'
                    : 'bg-white border-[#d0d7de] text-[#1f2328] placeholder-[#57606a] focus:border-[#0969da]'
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-semibold transition-colors shadow-sm"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </form>

          {/* Quick Actions & Switches */}
          <div className="flex items-center gap-2">
            {/* Direct Token / GitHub Authentication Button */}
            <button
              type="button"
              onClick={() => setIsTokenModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                token
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
                  : isDark
                  ? 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d] hover:text-white'
                  : 'bg-[#f3f4f6] border-[#d0d7de] text-[#24292f] hover:bg-[#e5e7eb]'
              }`}
              title={token ? 'Authenticated: 5,000 req/hr' : 'Authenticate to bypass 60 req/hr rate limit'}
            >
              {token ? (
                <>
                  <FiCheckCircle className="text-emerald-400 text-xs" />
                  <span className="hidden sm:inline">Authenticated</span>
                  <span className="text-[10px] text-emerald-300 font-mono hidden md:inline">(5k/hr)</span>
                </>
              ) : (
                <>
                  <FiKey className="text-amber-400 text-xs" />
                  <span>Get Token</span>
                </>
              )}
            </button>

            {/* Dark / Light Mode Switch */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center justify-center p-2 rounded-md border transition-colors ${
                isDark
                  ? 'bg-[#21262d] border-[#30363d] text-[#e3b341] hover:bg-[#30363d]'
                  : 'bg-[#f3f4f6] border-[#d0d7de] text-[#0969da] hover:bg-[#e5e7eb]'
              }`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="text-sm" /> : <FiMoon className="text-sm" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Rate Limit Alert Card with Direct Token Action */}
        {isRateLimited && (
          <div className="mb-6 p-5 bg-[#251e18] border border-[#d29922]/50 rounded-xl text-[#e3b341] shadow-lg fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <FiAlertTriangle className="text-2xl text-[#d29922] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">GitHub API Rate Limit Reached (60 req/hr)</h3>
                  <p className="text-sm text-[#c9d1d9] mt-1 leading-relaxed">
                    Unauthenticated public requests are limited by GitHub. Connect a free Personal Access Token to get 5,000 requests/hr.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setIsTokenModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1f6feb] hover:bg-[#388bfd] text-xs font-semibold text-white rounded-lg transition-colors shadow-sm"
                >
                  <FiKey className="text-xs" />
                  <span>Create / Connect Token</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Standard Error */}
        {error && !isRateLimited && (
          <div className="mb-6 p-4 bg-[#3d1f1f] border border-[#f85149] rounded-lg text-[#f85149] text-sm">
            ❌ {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="spinner"></div>
            <p className={isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}>
              Fetching GitHub data for <strong className={isDark ? 'text-white' : 'text-[#1f2328]'}>{username}</strong>...
            </p>
          </div>
        )}

        {/* Landing / Welcome Screen */}
        {!loading && !dashboard && !error && (
          <div className="flex flex-col items-center justify-center py-16 gap-6 text-center fade-in">
            <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center text-4xl shadow-inner ${
              isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-[#d0d7de] text-[#1f2328]'
            }`}>
              <FiGithub />
            </div>
            <div className="max-w-xl">
              <h1 className={`text-3xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
                GitHub Developer Portfolio
              </h1>
              <p className={`text-base leading-relaxed ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>
                Enter any GitHub username to visualize daily coding activity, repository metrics, coding streaks, and calculate your <strong>Tech Stack Compatibility (Vibe Check)</strong> score.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsTokenModalOpen(true)}
                className={`flex items-center gap-2 px-5 py-2.5 border font-semibold text-sm rounded-lg transition-colors ${
                  isDark
                    ? 'bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-[#c9d1d9]'
                    : 'bg-white hover:bg-[#f3f4f6] border-[#d0d7de] text-[#1f2328]'
                }`}
              >
                <FiKey className="text-amber-400" />
                <span>{token ? 'Manage GitHub Token' : 'Connect GitHub Token'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 max-w-3xl w-full">
              {[
                { icon: '🌿', label: 'Contribution Heatmap', desc: '53-week visual calendar' },
                { icon: '📦', label: 'Repository Stats', desc: 'Stars, forks, language filters' },
                { icon: '⚡', label: 'The Vibe Check', desc: 'Job description match score' },
                { icon: '🔥', label: 'Streak & Insights', desc: 'Consistency & AI analytics' },
              ].map((f) => (
                <div key={f.label} className="card text-center py-5">
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>{f.label}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {dashboard && !loading && (
          <div className="fade-in space-y-4">
            {/* Profile Header */}
            <ProfileHeader profile={dashboard.profile} languages={dashboard.languages} />

            {/* Streak Tracker */}
            <StreakTracker streak={dashboard.streak} />

            {/* Navigation Tabs */}
            <div className={`flex gap-1 border-b mb-6 mt-6 overflow-x-auto ${isDark ? 'border-[#30363d]' : 'border-[#d0d7de]'}`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#f78166] text-[#f78166]'
                      : isDark
                      ? 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
                      : 'border-transparent text-[#57606a] hover:text-[#1f2328]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Views */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <ContributionGraph data={dashboard.contributions} />
                <RepositoryCards repos={dashboard.repos.slice(0, 6)} username={dashboard.profile.login} />
              </div>
            )}

            {activeTab === 'repos' && (
              <RepositoryCards repos={dashboard.repos} username={dashboard.profile.login} fullView />
            )}

            {activeTab === 'contributions' && (
              <div className="space-y-4">
                <ContributionGraph data={dashboard.contributions} />
                <StreakTracker streak={dashboard.streak} detailed />
              </div>
            )}

            {activeTab === 'vibe' && (
              <VibeCheck
                username={dashboard.profile.login}
                token={token}
                userLanguages={dashboard.languages}
              />
            )}

            {activeTab === 'insights' && (
              <ProductivityInsights
                data={dashboard.productivity}
                username={dashboard.profile.login}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
