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
      <div className="card w-full col-span-full py-8 text-center text-[#8b949e]">
        No repositories found.
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>📦 Repositories</span>
          <span className="text-xs bg-[#30363d] text-[#8b949e] px-2 py-0.5 rounded-full">
            {filteredRepos.length}
          </span>
        </h2>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8b949e] text-xs" />
            <input
              type="text"
              placeholder="Find a repo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] focus:outline-none focus:border-[#388bfd]"
            />
          </div>

          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="bg-[#0d1117] border border-[#30363d] rounded-md text-xs px-2 py-1.5 text-[#c9d1d9] focus:outline-none focus:border-[#388bfd]"
          >
            <option value="all">All Languages</option>
            {allLanguages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0d1117] border border-[#30363d] rounded-md text-xs px-2 py-1.5 text-[#c9d1d9] focus:outline-none focus:border-[#388bfd]"
          >
            <option value="stars">Stars (High to Low)</option>
            <option value="forks">Forks (High to Low)</option>
            <option value="updated">Recently Updated</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRepos.map((repo) => {
          const langColor = LANG_COLORS[repo.language] || '#8b949e'
          return (
            <div
              key={repo.id}
              className="card flex flex-col justify-between hover:border-[#58a6ff] transition-all duration-200 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#58a6ff] hover:underline font-semibold text-base flex items-center gap-1.5 break-all group-hover:text-[#79c0ff]"
                  >
                    <span>{repo.name}</span>
                    <FiExternalLink className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <span className="text-[11px] border border-[#30363d] text-[#8b949e] px-2 py-0.5 rounded-full capitalize shrink-0">
                    {repo.visibility || 'public'}
                  </span>
                </div>

                <p className="text-sm text-[#8b949e] line-clamp-2 mb-4 leading-relaxed min-h-[40px]">
                  {repo.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-[#8b949e] pt-3 border-t border-[#21262d] gap-2">
                <div className="flex items-center gap-4">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: langColor }}
                      />
                      <span className="text-[#c9d1d9] font-medium">{repo.language}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1 hover:text-[#c9d1d9]">
                    <FiStar className="text-xs text-[#e3b341]" />
                    <span>{repo.stargazers_count ?? 0}</span>
                  </span>
                  <span className="flex items-center gap-1 hover:text-[#c9d1d9]">
                    <FiGitBranch className="text-xs" />
                    <span>{repo.forks_count ?? 0}</span>
                  </span>
                </div>

                {repo.updated_at && (
                  <span className="flex items-center gap-1 text-[11px]">
                    <FiClock className="text-[10px]" />
                    Updated {formatDistanceToNow(parseISO(repo.updated_at), { addSuffix: true })}
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

