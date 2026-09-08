import { ApiError, apiClient, AUTH_STORAGE_KEY } from '@/api/client'
import { endpoints } from '@/api/endpoints'

export interface AuthSession {
  accessToken: string
  expiresIn?: number
  username: string
  firstName?: string
  role: string
}

const OP_MANAGER_ALLOWED_PATHS = ['/', '/purchases', '/issues', '/stocks']

export function canAccessPath(pathname: string, session: AuthSession | null) {
  if (!session) return false
  if (session.role.toUpperCase() !== 'OP_MANAGER') return true

  return OP_MANAGER_ALLOWED_PATHS.includes(pathname)
}

export function getAuthSession(): AuthSession | null {
  const storedSession = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!storedSession) return null

  try {
    return JSON.parse(storedSession) as AuthSession
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function login(username: string, password: string) {
  return fetch(endpoints.auth.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ username, password }),
  }).then(async (response) => {
    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const message =
        payload && typeof payload === 'object' && 'message' in payload
          ? String((payload as { message?: unknown }).message)
          : response.statusText
      throw new ApiError(message, response.status, payload)
    }

    return payload as AuthSession
  })
}

export function logout(accessToken: string) {
  return apiClient.post<void>(endpoints.auth.logout, undefined, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}