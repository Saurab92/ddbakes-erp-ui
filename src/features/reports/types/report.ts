export type { DateRange } from '@/types/common'

export interface DepartmentConsumption {
  departmentId: string
  departmentName: string
  totalQuantity: number
  totalValue?: number
}

export interface ProductConsumption {
  productId: string
  productName: string
  unitName?: string
  totalQuantity: number
  totalValue?: number
}

export interface DailyConsumption {
  date: string
  totalQuantity: number
  totalValue?: number
}
