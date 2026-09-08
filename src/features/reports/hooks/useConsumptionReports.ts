import { useQuery } from '@tanstack/react-query'
import { reportApi } from '@/features/reports/api/reportApi'
import type { DateRange } from '@/features/reports/types'

export const reportKeys = {
  departmentConsumption: (range: DateRange) =>
    ['reports', 'consumption', 'department', range] as const,
  productConsumption: (range: DateRange) =>
    ['reports', 'consumption', 'product', range] as const,
  dailyConsumption: (range: DateRange) =>
    ['reports', 'consumption', 'daily', range] as const,
}

export function useDepartmentConsumptionQuery(range: DateRange) {
  return useQuery({
    queryKey: reportKeys.departmentConsumption(range),
    queryFn: () => reportApi.getDepartmentConsumption(range),
  })
}

export function useProductConsumptionQuery(range: DateRange) {
  return useQuery({
    queryKey: reportKeys.productConsumption(range),
    queryFn: () => reportApi.getProductConsumption(range),
  })
}

export function useDailyConsumptionQuery(range: DateRange) {
  return useQuery({
    queryKey: reportKeys.dailyConsumption(range),
    queryFn: () => reportApi.getDailyConsumption(range),
  })
}
