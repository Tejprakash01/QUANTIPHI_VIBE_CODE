import axios from 'axios'

const BASE_URL = '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
})

export const githubAPI = {
  getProfile: (username, token) =>
    api.get(`/github/profile/${username}`, { params: { token } }),

  getRepos: (username, token) =>
    api.get(`/github/repos/${username}`, { params: { token } }),

  getContributions: (username, token) =>
    api.get(`/github/contributions/${username}`, { params: { token } }),

  getLanguages: (username, token) =>
    api.get(`/github/languages/${username}`, { params: { token } }),

  getProductivity: (username, token) =>
    api.get(`/github/productivity/${username}`, { params: { token } }),

  getDashboard: (username, token) =>
    api.get(`/github/dashboard/${username}`, { params: { token } }),
}

export const vibeAPI = {
  check: (username, jobDescription, token) =>
    api.post('/vibe/check', { username, job_description: jobDescription, token }),

  getSettings: (username) =>
    api.get(`/vibe/settings/${username}`),

  updateSettings: (username, settings) =>
    api.put('/vibe/settings', { username, ...settings }),
}

export default api
