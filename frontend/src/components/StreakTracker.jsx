import React from 'react'
import { FiZap, FiAward, FiCalendar, FiTrendingUp } from 'react-icons/fi'
import { FaFire } from 'react-icons/fa'

export default function StreakTracker({ streak, detailed = false }) {
  if (!streak) return null

  const { current = 0, longest = 0, total_contributions = 0 } = streak

  // Calculate milestone progress (e.g. towards 7, 30, or 100 days)
  const nextMilestone = current < 7 ? 7 : current < 30 ? 30 : current < 100 ? 100 : current + 50
  const progressPct = Math.min(Math.round((current / nextMilestone) * 100), 100)

  return (
    <div className="card fade-in mb-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-72 h-32 bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
        {/* Streak summary badge */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center text-3xl text-orange-500 shadow-inner shrink-0">
            <FaFire className={current > 0 ? 'animate-pulse' : 'opacity-60'} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-extrabold text-[var(--text-primary)] text-lg tracking-tight">
                Coding Streak
              </h3>
              {current > 0 ? (
                <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  🔥 Active
                </span>
              ) : (
                <span className="bg-zinc-500/15 text-[var(--text-muted)] border border-[var(--border-color)] text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              {current > 0
                ? `${current} consecutive day${current > 1 ? 's' : ''} of active commits!`
                : 'Push a commit today to kick off your next streak!'}
            </p>
          </div>
        </div>

        {/* Metric counts */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-color)] px-4 py-3 rounded-xl text-center min-w-[96px] shadow-sm">
            <div className="flex items-center justify-center gap-1 text-orange-500 text-xs font-semibold mb-1">
              <FiZap />
              <span>Current</span>
            </div>
            <div className="text-xl font-extrabold text-[var(--text-primary)]">
              {current} <span className="text-xs font-normal text-[var(--text-muted)]">days</span>
            </div>
          </div>

          <div className="bg-[var(--bg-elevated)] border border-[var(--border-color)] px-4 py-3 rounded-xl text-center min-w-[96px] shadow-sm">
            <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-semibold mb-1">
              <FiAward />
              <span>Longest</span>
            </div>
            <div className="text-xl font-extrabold text-[var(--text-primary)]">
              {longest} <span className="text-xs font-normal text-[var(--text-muted)]">days</span>
            </div>
          </div>

          <div className="bg-[var(--bg-elevated)] border border-[var(--border-color)] px-4 py-3 rounded-xl text-center min-w-[96px] shadow-sm">
            <div className="flex items-center justify-center gap-1 text-[var(--accent-blue)] text-xs font-semibold mb-1">
              <FiCalendar />
              <span>Total Year</span>
            </div>
            <div className="text-xl font-extrabold text-[var(--text-primary)]">
              {total_contributions.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Progress towards milestone */}
      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1 font-medium">
            <FiTrendingUp className="text-orange-500 text-xs" />
            <span>Next Milestone: {nextMilestone} Days</span>
          </span>
          <span className="font-semibold text-[var(--text-secondary)]">{progressPct}%</span>
        </div>
        <div className="w-full h-2 bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {detailed && (
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[var(--text-muted)]">
          <div className="bg-[var(--bg-elevated)] p-3.5 rounded-xl border border-[var(--border-color)]">
            <span className="font-bold text-[var(--text-primary)] block mb-1">🎯 Consistency Tip</span>
            Pushing regular commits showcases continuous learning, accountability, and problem-solving velocity to tech recruiters and engineering leads.
          </div>
          <div className="bg-[var(--bg-elevated)] p-3.5 rounded-xl border border-[var(--border-color)]">
            <span className="font-bold text-[var(--text-primary)] block mb-1">⚡ Streak Status</span>
            {current >= 14
              ? '🔥 Unstoppable momentum! Over two continuous weeks of shipping code.'
              : current >= 7
              ? '⚡ Solid habit forming! Full week milestone reached.'
              : current > 0
              ? '🚀 Building momentum! Consistency wins every time.'
              : '🌱 Make your first commit today to light up the streak gauge.'}
          </div>
        </div>
      )}
    </div>
  )
}
