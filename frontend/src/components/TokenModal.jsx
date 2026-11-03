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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm fade-in">
      <div className="relative w-full max-w-lg bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8b949e] hover:text-white transition-colors p-1"
        >
          <FiX className="text-xl" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl text-emerald-400">
            <FaGithub />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">GitHub Authentication & Rate Limits</h3>
            <p className="text-xs text-[#8b949e]">
              Increase your API rate limit from 60 to 5,000 requests/hour
            </p>
          </div>
        </div>

        {/* Step 1: Direct Link */}
        <div className="space-y-4">
          <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FiZap className="text-amber-400" />
                <span>Step 1: Generate Token with 1 Click</span>
              </span>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                Official GitHub
              </span>
            </div>

            <p className="text-xs text-[#8b949e] leading-relaxed">
              Click below to open GitHub with the recommended scopes pre-configured. Just scroll down and click <strong className="text-white">"Generate token"</strong>, then copy it.
            </p>

            <a
              href={GITHUB_NEW_TOKEN_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
            >
              <FaGithub className="text-sm" />
              <span>Open GitHub & Generate Token</span>
              <FiExternalLink className="text-xs ml-1" />
            </a>
          </div>

          {/* Step 2: Paste and Save */}
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-white block mb-1.5">
                Step 2: Paste Your Token Here
              </label>
              <div className="relative">
                <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e] text-sm" />
                <input
                  type="password"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_..."
                  className="w-full pl-9 pr-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#388bfd] font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#8b949e]">
              <FiShield className="text-emerald-400 text-xs shrink-0" />
              <span>Token is saved in your browser's local storage and sent directly to GitHub.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              {currentToken ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-rose-400 hover:underline"
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
                  className="px-4 py-2 border border-[#30363d] hover:bg-[#21262d] text-xs text-[#c9d1d9] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!inputToken.trim()}
                  className="flex items-center gap-1.5 px-5 py-2 bg-[#1f6feb] hover:bg-[#388bfd] disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
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

