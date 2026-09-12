export interface SupplierProductSummary {
  id: string
  name: string
  unitId?: string
  unitName?: string
  categoryId?: string
  categoryName?: string
  minimumStock?: number
  active?: boolean
}

export interface Supplier {
  id: string
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  address?: string
  active: boolean
  products?: SupplierProductSummary[]
  productIds?: string[]
}

export interface CreateSupplierInput {
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  address?: string
  active: boolean
  productIds?: string[]
}

export type UpdateSupplierInput = Partial<CreateSupplierInput>