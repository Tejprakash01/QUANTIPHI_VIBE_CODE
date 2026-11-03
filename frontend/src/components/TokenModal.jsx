import React, { useState } from 'react'
import { FiKey, FiExternalLink, FiCheck, FiX, FiShield, FiZap } from 'react-icons/fi'
import { FaGithub } from 'react-icons/fa'

export default function TokenModal({ isOpen, onClose, currentToken, onSaveToken }) {
  const [inputToken, setInputToken] = useState(currentToken || '')

  if (!isOpen) return null

  const GITHUB_NEW_TOKEN_URL =
    'https://github.com/settings/tokens/new?description=DevPortfolio+Dashboard&scopes=read:user,repo'

  const handleSave = (e) => {
    e.preventDefault()
    onSaveToken(inputToken.trim())
    onClose()
  }

  const handleClear = () => {
    setInputToken('')
    onSaveToken('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
        >
          <FiX className="text-xl" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl text-emerald-500 shadow-inner">
            <FaGithub />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">GitHub Authentication & Rate Limits</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Unlock 5,000 requests/hour and enable GraphQL contribution heatmaps
            </p>
          </div>
        </div>

        {/* Step 1: Direct Link */}
        <div className="space-y-4">
          <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <FiZap className="text-amber-500" />
                <span>Step 1: Generate Token with 1 Click</span>
              </span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Official GitHub
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Click below to open GitHub with the recommended scopes pre-configured. Scroll to the bottom and click <strong className="text-[var(--text-primary)]">"Generate token"</strong>, then copy it.
            </p>

            <a
              href={GITHUB_NEW_TOKEN_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              <FaGithub className="text-sm" />
              <span>Open GitHub & Generate Token</span>
              <FiExternalLink className="text-xs ml-1" />
            </a>
          </div>

          {/* Step 2: Paste and Save */}
          <form onSubmit={handleSave} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] block mb-1.5">
                Step 2: Paste Your Token Here
              </label>
              <div className="relative">
                <FiKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm" />
                <input
                  type="password"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_..."
                  className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <FiShield className="text-emerald-500 text-xs shrink-0" />
              <span>Token is stored securely in your browser's local storage and sent only to GitHub.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              {currentToken ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-rose-500 hover:underline font-semibold"
                >
                  Disconnect Token
                </button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[var(--border-color)] hover:bg-[var(--bg-elevated)] text-xs font-semibold text-[var(--text-secondary)] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!inputToken.trim()}
                  className="flex items-center gap-1.5 px-5 py-2 bg-[#1f6feb] hover:bg-[#388bfd] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  <FiCheck className="text-sm" />
                  <span>Save & Authenticate</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
