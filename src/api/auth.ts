import { apiClient, AUTH_STORAGE_KEY } from '@/api/client'
import { endpoints } from '@/api/endpoints'

export interface AuthSession {
  accessToken: string
  expiresIn?: number
  id?: number | string
  userId?: number | string
  username: string
  firstName?: string
  role: string
}

const OP_MANAGER_ALLOWED_PATHS = [
  '/',
  '/inventory/dashboard',
  '/purchases',
  '/issues',
  '/stocks',
  '/inventory/purchases',
  '/inventory/issues',
  '/inventory/stocks',
]

export function canAccessPath(pathname: string, session: AuthSession | null) {
  if (!session) return false
  if (session.role.toUpperCase() === 'OP_MANAGER') {
    return OP_MANAGER_ALLOWED_PATHS.includes(pathname)
  }

  return true
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
  return apiClient.post<AuthSession>(endpoints.auth.login, { username, password })
}

export function logout(accessToken: string) {
  return apiClient.post<void>(endpoints.auth.logout, undefined, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}