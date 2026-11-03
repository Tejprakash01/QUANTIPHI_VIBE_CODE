import React, { useState } from 'react'
import { FiStar, FiGitBranch, FiExternalLink, FiSearch, FiCode, FiClock } from 'react-icons/fi'
import { formatDistanceToNow, parseISO } from 'date-fns'

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
}

export default function RepositoryCards({ repos = [], username, fullView = false }) {
  const [search, setSearch] = useState('')
  const [filterLang, setFilterLang] = useState('all')
  const [sortBy, setSortBy] = useState('stars')

  if (!repos || repos.length === 0) {
    return (
      <div className="card w-full col-span-full py-12 text-center text-[var(--text-muted)]">
        No public repositories found.
      </div>
    )
  }

  const allLanguages = Array.from(
    new Set(repos.map((r) => r.language).filter(Boolean))
  )

  const filteredRepos = repos
    .filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(search.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(search.toLowerCase()))
      const matchesLang = filterLang === 'all' || repo.language === filterLang
      return matchesSearch && matchesLang
    })
    .sort((a, b) => {
      if (sortBy === 'stars') return (b.stargazers_count || 0) - (a.stargazers_count || 0)
      if (sortBy === 'forks') return (b.forks_count || 0) - (a.forks_count || 0)
      if (sortBy === 'updated') return new Date(b.updated_at) - new Date(a.updated_at)
      return a.name.localeCompare(b.name)
    })

  return (
    <div className={`space-y-4 ${fullView ? 'w-full' : 'col-span-full'}`}>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[var(--bg-elevated)] border border-[var(--border-color)] p-3 rounded-xl">
        <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <span>📦 Repositories</span>
          <span className="text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] px-2.5 py-0.5 rounded-full font-semibold">
            {filteredRepos.length}
          </span>
        </h2>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-44">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs" />
            <input
              type="text"
              placeholder="Filter repos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)]"
            />
          </div>

          {/* Language filter */}
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs px-2.5 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] cursor-pointer"
          >
            <option value="all">All Languages</option>
            {allLanguages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs px-2.5 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] cursor-pointer"
          >
            <option value="stars">Most Stars</option>
            <option value="forks">Most Forks</option>
            <option value="updated">Recently Updated</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRepos.map((repo) => {
          const langColor = LANG_COLORS[repo.language] || '#8b949e'
          return (
            <div
              key={repo.id}
              className="card flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 group relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--accent-blue)] hover:underline font-bold text-base flex items-center gap-1.5 break-all"
                  >
                    <span>{repo.name}</span>
                    <FiExternalLink className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <span className="text-[10px] font-semibold border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-muted)] px-2 py-0.5 rounded-full capitalize shrink-0">
                    {repo.visibility || 'public'}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-4 leading-relaxed min-h-[34px]">
                  {repo.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)] gap-2">
                <div className="flex items-center gap-3">
                  {repo.language && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                        style={{ backgroundColor: langColor }}
                      />
                      <span className="text-[var(--text-secondary)]">{repo.language}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1 hover:text-[var(--text-primary)]">
                    <FiStar className="text-xs text-amber-500" />
                    <span>{repo.stargazers_count ?? 0}</span>
                  </span>
                  <span className="flex items-center gap-1 hover:text-[var(--text-primary)]">
                    <FiGitBranch className="text-xs" />
                    <span>{repo.forks_count ?? 0}</span>
                  </span>
                </div>

                {repo.updated_at && (
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                    <FiClock className="text-[10px]" />
                    {formatDistanceToNow(parseISO(repo.updated_at), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
