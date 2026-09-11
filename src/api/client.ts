/**
 * Centralized HTTP client for talking to the Spring Boot REST API.
 * All feature API modules should go through this client instead of
 * calling `fetch` directly, so base URL, headers, and error handling
 * stay consistent in one place.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/api\/?$/, '')
export const AUTH_STORAGE_KEY = 'bakery-auth'

function getAuthHeaders(): Record<string, string> {
  try {
    const sessionStr = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!sessionStr) return {}
    const session = JSON.parse(sessionStr) as {
      accessToken?: string
      id?: number | string
      userId?: number | string
    }
    const headers: Record<string, string> = {}
    if (session.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`
    }
    const userId = session.id ?? session.userId ?? '1'
    if (userId !== undefined && userId !== null && userId !== '') {
      headers['X-User-Id'] = String(userId)
    }
    return headers
  } catch {
    return {}
  }
}

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options
  const authHeaders = getAuthHeaders()

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...authHeaders,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  const payload = isJson ? await response.json().catch(() => null) : null

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message?: unknown }).message)
        : undefined) ?? response.statusText
    throw new ApiError(message, response.status, payload)
  }

  return payload as T
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET', cache: 'no-store' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
