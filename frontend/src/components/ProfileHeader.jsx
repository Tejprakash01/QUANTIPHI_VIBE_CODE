import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { FiUsers, FiStar, FiGitBranch, FiMapPin, FiLink, FiTwitter, FiBriefcase } from 'react-icons/fi'

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
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar + Bio */}
        <div className="flex flex-col items-center md:items-start gap-3 md:w-64">
          <img
            src={profile.avatar_url}
            alt={profile.login}
            className="w-24 h-24 rounded-full border-2 border-[#30363d]"
          />
          <div>
            <h1 className="text-xl font-bold text-white">{profile.name || profile.login}</h1>
            <p className="text-[#8b949e] text-sm">@{profile.login}</p>
          </div>
          {profile.bio && (
            <p className="text-sm text-[#c9d1d9] text-center md:text-left">{profile.bio}</p>
          )}
          <div className="flex flex-col gap-1 text-sm text-[#8b949e] w-full">
            {profile.company && (
              <span className="flex items-center gap-1"><FiBriefcase className="text-xs" />{profile.company}</span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1"><FiMapPin className="text-xs" />{profile.location}</span>
            )}
            {profile.blog && (
              <a href={profile.blog} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-[#388bfd] hover:underline">
                <FiLink className="text-xs" />{profile.blog.replace(/^https?:\/\//, '')}
              </a>
            )}
            {profile.twitter_username && (
              <span className="flex items-center gap-1">
                <FiTwitter className="text-xs" />@{profile.twitter_username}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Followers', value: profile.followers?.toLocaleString(), icon: <FiUsers /> },
              { label: 'Following', value: profile.following?.toLocaleString(), icon: <FiUsers /> },
              { label: 'Public Repos', value: profile.public_repos?.toLocaleString(), icon: <FiGitBranch /> },
              { label: 'Gists', value: profile.public_gists?.toLocaleString(), icon: <FiStar /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0d1117] rounded-lg p-3 text-center border border-[#30363d]">
                <div className="text-2xl font-bold text-white">{stat.value ?? '—'}</div>
                <div className="text-xs text-[#8b949e] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Top Languages Pie Chart */}
          {langData.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[#8b949e] mb-2 uppercase tracking-wide">
                Top Languages
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ResponsiveContainer width={180} height={160}>
                  <PieChart>
                    <Pie
                      data={langData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {langData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [`${Math.round((v / totalLangCount) * 100)}%`, 'Usage']}
                      contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6 }}
                      itemStyle={{ color: '#c9d1d9' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2">
                  {langData.map((lang, i) => (
                    <div key={lang.name} className="flex items-center gap-1 text-xs">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-[#c9d1d9]">{lang.name}</span>
                      <span className="text-[#8b949e]">
                        ({Math.round((lang.value / totalLangCount) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

