import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type {
  DailyConsumption,
  DateRange,
  DepartmentConsumption,
  ProductConsumption,
} from '@/features/reports/types'

function toQuery(range: DateRange) {
  const params = new URLSearchParams({ from: range.from, to: range.to })
  return `?${params.toString()}`
}

function toDepartmentQuery(range: DateRange) {
  const params = new URLSearchParams({ startDate: range.from, endDate: range.to })
  return `?${params.toString()}`
}

export const reportApi = {
  getDepartmentConsumption: (range: DateRange) =>
    apiClient.get<DepartmentConsumption[]>(
      `${endpoints.reports.consumptionByDepartment}${toDepartmentQuery(range)}`,
    ),
  getProductConsumption: (range: DateRange) =>
    apiClient.get<ProductConsumption[]>(
      `${endpoints.reports.consumptionByProduct}${toQuery(range)}`,
    ),
  getDailyConsumption: (range: DateRange) =>
    apiClient.get<DailyConsumption[]>(
      `${endpoints.reports.consumptionDaily}${toQuery(range)}`,
    ),
}
