import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import {
  FiUsers,
  FiStar,
  FiGitBranch,
  FiMapPin,
  FiLink,
  FiTwitter,
  FiBriefcase,
  FiCode,
} from 'react-icons/fi'

const COLORS = [
  '#388bfd', '#3fb950', '#f78166', '#d2a8ff', '#ffa657',
  '#79c0ff', '#56d364', '#ff7b72', '#bc8cff', '#ffb77b',
]

export default function ProfileHeader({ profile, languages }) {
  if (!profile) return null

  const langData = Object.entries(languages || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  const totalLangCount = langData.reduce((s, d) => s + d.value, 0)

  return (
    <div className="card mb-6 fade-in">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Avatar + Bio Column */}
        <div className="flex flex-col items-center sm:items-start gap-4 sm:w-72 shrink-0">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <img
              src={profile.avatar_url}
              alt={profile.login}
              className="relative w-28 h-28 rounded-full border-2 border-[var(--border-color)] object-cover shadow-md"
            />
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {profile.name || profile.login}
            </h1>
            <p className="text-sm font-medium text-[var(--text-muted)]">@{profile.login}</p>
          </div>

          {profile.bio && (
            <p className="text-sm text-[var(--text-secondary)] text-center sm:text-left leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-col gap-2 text-xs text-[var(--text-muted)] w-full pt-2 border-t border-[var(--border-subtle)]">
            {profile.company && (
              <span className="flex items-center gap-2">
                <FiBriefcase className="text-sm shrink-0 text-[var(--text-muted)]" />
                <span className="truncate">{profile.company}</span>
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-2">
                <FiMapPin className="text-sm shrink-0 text-[var(--text-muted)]" />
                <span className="truncate">{profile.location}</span>
              </span>
            )}
            {profile.blog && (
              <a
                href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[var(--accent-blue)] hover:underline truncate"
              >
                <FiLink className="text-sm shrink-0" />
                <span className="truncate">{profile.blog.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {profile.twitter_username && (
              <span className="flex items-center gap-2">
                <FiTwitter className="text-sm shrink-0 text-sky-400" />
                <span>@{profile.twitter_username}</span>
              </span>
            )}
          </div>
        </div>

        {/* Stats & Languages Section */}
        <div className="flex-1 w-full flex flex-col gap-5">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Followers', value: profile.followers?.toLocaleString() || '0', icon: <FiUsers className="text-blue-500" /> },
              { label: 'Following', value: profile.following?.toLocaleString() || '0', icon: <FiUsers className="text-purple-500" /> },
              { label: 'Public Repos', value: profile.public_repos?.toLocaleString() || '0', icon: <FiGitBranch className="text-emerald-500" /> },
              { label: 'Public Gists', value: profile.public_gists?.toLocaleString() || '0', icon: <FiStar className="text-amber-500" /> },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl p-3.5 text-center transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)] mb-1">
                  {stat.icon}
                  <span>{stat.label}</span>
                </div>
                <div className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Top Languages Pie Chart Card */}
          {langData.length > 0 && (
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <FiCode className="text-sm text-[var(--accent-blue)]" />
                  <span>Top Languages Distribution</span>
                </h3>
                <span className="text-[11px] font-medium text-[var(--text-muted)]">
                  Across Public Repositories
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                <div className="w-44 h-40 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={langData}
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={68}
                        dataKey="value"
                        paddingAngle={3}
                      >
                        {langData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v) => [`${Math.round((v / totalLangCount) * 100)}%`, 'Share']}
                        contentStyle={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: 'var(--border-color)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          boxShadow: 'var(--card-shadow)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend Chips */}
                <div className="flex-1 grid grid-cols-2 gap-2">
                  {langData.map((lang, i) => {
                    const pct = Math.round((lang.value / totalLangCount) * 100)
                    return (
                      <div
                        key={lang.name}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          />
                          <span className="font-medium text-[var(--text-secondary)] truncate">
                            {lang.name}
                          </span>
                        </div>
                        <span className="font-semibold text-[var(--text-muted)] ml-2 text-[11px]">
                          {pct}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
