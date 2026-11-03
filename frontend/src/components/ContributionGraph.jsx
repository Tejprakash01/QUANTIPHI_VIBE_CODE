import React from 'react'
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
        <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">Contribution Activity</h2>
        <p className="text-[var(--text-muted)] text-sm">
          {data?.error
            ? '⚠️ ' + data.error
            : 'No contribution calendar available. Connect a GitHub token to enable live activity.'}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">Contribution Activity</h2>
          <p className="text-xs text-[var(--text-muted)]">Verified activity over the past 52 weeks</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
          <strong className="text-[var(--text-primary)] font-bold">{total.toLocaleString()}</strong> contributions
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-max">
          {/* Month labels */}
          <div className="flex mb-1.5 ml-8">
            {weeks.map((week, wIdx) => {
              const label = monthLabels.find((m) => m.wIdx === wIdx)
              return (
                <div key={wIdx} className="w-[12px] mr-[2px]">
                  {label ? (
                    <span className="text-[10px] font-medium text-[var(--text-muted)] whitespace-nowrap">
                      {MONTHS[label.month]}
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="flex gap-1.5">
            {/* Day labels */}
            <div className="flex flex-col gap-[2px] mr-1 mt-[1px]">
              {DAYS.map((day, i) => (
                <div key={i} className="h-[11px] text-[9px] font-medium text-[var(--text-muted)] leading-none">
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap Grid */}
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
                      className={`w-[11px] h-[11px] rounded-[2px] cursor-pointer transition-transform hover:scale-125 ${LEVEL_CLASS[level]}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 text-[10px] text-[var(--text-muted)] font-medium">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <div key={l} className={`w-[11px] h-[11px] rounded-[2px] ${LEVEL_CLASS[l]}`} />
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
            style={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              fontSize: 12,
              padding: '6px 10px',
              boxShadow: 'var(--card-hover-shadow)',
              zIndex: 9999,
            }}
          />
        ))
      )}
    </div>
  )
}
