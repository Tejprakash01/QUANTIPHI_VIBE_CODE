import { Tooltip } from 'react-tooltip'
import { format, parseISO } from 'date-fns'

const LEVEL_CLASS = ['contrib-0', 'contrib-1', 'contrib-2', 'contrib-3', 'contrib-4']

function getLevel(count) {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', '', 'Tue', '', 'Thu', '', 'Sat']

export default function ContributionGraph({ data }) {
  if (!data || !data.weeks) {
    return (
      <div className="card">
        <h2 className="text-base font-semibold mb-3">Contribution Activity</h2>
        <p className="text-[#8b949e] text-sm">
          {data?.error
            ? '⚠️ ' + data.error
            : 'No contribution data available. A GitHub token is required for this feature.'}
        </p>
      </div>
    )
  }

  const weeks = data.weeks || []
  const total = data.totalContributions || 0

  // Build month labels
  const monthLabels = []
  let lastMonth = -1
  weeks.forEach((week, wIdx) => {
    const firstDay = week.contributionDays?.[0]
    if (firstDay) {
      const month = new Date(firstDay.date).getMonth()
      if (month !== lastMonth) {
        monthLabels.push({ month, wIdx })
        lastMonth = month
      }
    }
  })

  return (
    <div className="card fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-white">Contribution Activity</h2>
        <span className="text-sm text-[#8b949e]">
          <strong className="text-white">{total.toLocaleString()}</strong> contributions in the last year
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-max">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {weeks.map((week, wIdx) => {
              const label = monthLabels.find((m) => m.wIdx === wIdx)
              return (
                <div key={wIdx} className="w-[13px] mr-[2px]">
                  {label ? (
                    <span className="text-[10px] text-[#8b949e] whitespace-nowrap">
                      {MONTHS[label.month]}
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-[2px] mr-1 mt-[1px]">
              {DAYS.map((day, i) => (
                <div key={i} className="h-[11px] text-[9px] text-[#8b949e] leading-none">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[2px]">
                {week.contributionDays?.map((day) => {
                  const level = getLevel(day.contributionCount)
                  const tooltipId = `contrib-${day.date}`
                  return (
                    <div
                      key={day.date}
                      data-tooltip-id={tooltipId}
                      data-tooltip-content={`${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''} on ${format(parseISO(day.date), 'MMM d, yyyy')}`}
                      className={`w-[11px] h-[11px] rounded-sm cursor-pointer ${LEVEL_CLASS[level]}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1 mt-2 ml-8 text-[10px] text-[#8b949e]">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <div key={l} className={`w-[11px] h-[11px] rounded-sm ${LEVEL_CLASS[l]}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Tooltips */}
      {weeks.flatMap((week) =>
        (week.contributionDays || []).map((day) => (
          <Tooltip
            key={day.date}
            id={`contrib-${day.date}`}
            style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, fontSize: 12 }}
          />
        ))
      )}
    </div>
  )
}

