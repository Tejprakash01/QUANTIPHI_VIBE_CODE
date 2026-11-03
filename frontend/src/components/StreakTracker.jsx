import React from 'react'
import { FiZap, FiAward, FiCalendar, FiActivity } from 'react-icons/fi'
import { FaFire } from 'react-icons/fa'

export default function StreakTracker({ streak, detailed = false }) {
  if (!streak) return null

  const { current = 0, longest = 0, total_contributions = 0 } = streak

  return (
    <div className="card fade-in bg-gradient-to-r from-[#161b22] to-[#1a2332] border-[#30363d] mb-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Streak summary badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-2xl text-orange-400">
            <FaFire className={current > 0 ? 'animate-bounce' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">Coding Streak</h3>
              {current > 0 ? (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Active
                </span>
              ) : (
                <span className="bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-xs text-[#8b949e]">
              {current > 0
                ? `${current} day streak! Keep pushing code!`
                : 'Commit today to reignite your streak!'}
            </p>
          </div>
        </div>

        {/* Metric counts */}
        <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
          <div className="bg-[#0d1117] border border-[#30363d] px-4 py-2.5 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 text-orange-400 text-xs mb-1">
              <FiZap />
              <span>Current</span>
            </div>
            <div className="text-xl font-bold text-white">{current} <span className="text-xs font-normal text-[#8b949e]">days</span></div>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] px-4 py-2.5 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs mb-1">
              <FiAward />
              <span>Longest</span>
            </div>
            <div className="text-xl font-bold text-white">{longest} <span className="text-xs font-normal text-[#8b949e]">days</span></div>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] px-4 py-2.5 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 text-xs mb-1">
              <FiCalendar />
              <span>Total Active</span>
            </div>
            <div className="text-xl font-bold text-white">{total_contributions.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {detailed && (
        <div className="mt-4 pt-4 border-t border-[#30363d]/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#8b949e]">
          <div className="bg-[#0d1117]/60 p-3 rounded border border-[#30363d]/50">
            <span className="font-semibold text-white block mb-1">🎯 Consistency Tip</span>
            Committing code at least once per day builds muscle memory and provides proof of daily problem-solving to recruiters.
          </div>
          <div className="bg-[#0d1117]/60 p-3 rounded border border-[#30363d]/50">
            <span className="font-semibold text-white block mb-1">⚡ Streak Status</span>
            {current >= 7
              ? '🔥 In the zone! Over a week of consistent commits.'
              : current > 0
              ? '🚀 Momentum is building! Push another commit to level up.'
              : '🌱 A single commit today will start your next streak.'}
          </div>
        </div>
      )}
    </div>
  )
}

