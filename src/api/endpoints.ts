/**
 * Central registry of REST API endpoint paths.
 * Feature API modules should reference these instead of hardcoding URLs,
 * so the Spring Boot API contract only needs updating in one place.
 */
const API_PREFIX = '/api'

export const endpoints = {
  auth: {
    login: `${API_PREFIX}/auth/login`,
    logout: `${API_PREFIX}/auth/logout`,
  },
  categories: {
    root: `${API_PREFIX}/categories`,
    byId: (id: string) => `${API_PREFIX}/categories/${id}`,
    deactivate: (id: string) => `${API_PREFIX}/categories/${id}/deactivate`,
  },
  departments: {
    root: `${API_PREFIX}/departments`,
    byId: (id: string) => `${API_PREFIX}/departments/${id}`,
    deactivate: (id: string) => `${API_PREFIX}/departments/${id}/deactivate`,
  },
  suppliers: {
    root: `${API_PREFIX}/suppliers`,
    byId: (id: string) => `${API_PREFIX}/suppliers/${id}`,
    search: `${API_PREFIX}/suppliers/search`,
    activate: (id: string) => `${API_PREFIX}/suppliers/${id}/activate`,
    deactivate: (id: string) => `${API_PREFIX}/suppliers/${id}/deactivate`,
  },
  units: {
    root: `${API_PREFIX}/units`,
    byId: (id: string) => `${API_PREFIX}/units/${id}`,
    status: (id: string) => `${API_PREFIX}/units/${id}/status`,
  },
  products: {
    root: `${API_PREFIX}/products`,
    byId: (id: string) => `${API_PREFIX}/products/${id}`,
    suppliers: (id: string) => `${API_PREFIX}/products/${id}/suppliers`,
    deactivate: (id: string) => `${API_PREFIX}/products/${id}/deactivate`,
  },
  persons: {
    root: `${API_PREFIX}/persons`,
    byId: (id: string) => `${API_PREFIX}/persons/${id}`,
    deactivate: (id: string) => `${API_PREFIX}/persons/${id}/deactivate`,
  },
  users: {
    root: `${API_PREFIX}/users`,
    byId: (id: string) => `${API_PREFIX}/users/${id}`,
    reactivate: (id: string) => `${API_PREFIX}/users/${id}/reactivate`,
    deactivate: (id: string) => `${API_PREFIX}/users/${id}/deactivate`,
    changePassword: (id: string) => `${API_PREFIX}/users/${id}/change-password`,
  },
  roles: {
    root: `${API_PREFIX}/roles`,
    byId: (id: string) => `${API_PREFIX}/roles/${id}`,
    activate: (id: string) => `${API_PREFIX}/roles/${id}/activate`,
    deactivate: (id: string) => `${API_PREFIX}/roles/${id}/deactivate`,
  },
  purchases: {
    root: `${API_PREFIX}/purchases`,
    byId: (id: string) => `${API_PREFIX}/purchases/${id}`,
  },
  issues: {
    root: `${API_PREFIX}/issues`,
    byId: (id: string) => `${API_PREFIX}/issues/${id}`,
  },
  stocks: {
    root: `${API_PREFIX}/stocks`,
    byId: (id: string) => `${API_PREFIX}/stocks/${id}`,
    byProductId: (productId: string) => `${API_PREFIX}/stocks/product/${productId}`,
    lowStock: `${API_PREFIX}/stocks/low-stock`,
  },
  reports: {
    consumptionByDepartment: `${API_PREFIX}/reports/consumption/department-wise`,
    consumptionByProduct: `${API_PREFIX}/reports/consumption/product`,
    consumptionDaily: `${API_PREFIX}/reports/consumption/daily`,
  },
} as const
