export interface ProductSupplierSummary {
  id: string
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  address?: string
  active?: boolean
}

export interface Product {
  id: string
  name: string
  unitId: string
  unitName: string
  categoryId: string
  categoryName: string
  minimumStock: number
  active: boolean
  suppliers?: ProductSupplierSummary[]
  supplierIds?: string[]
}

export interface CreateProductInput {
  name: string
  unitId: string
  categoryId: string
  minimumStock: number
  active: boolean
  supplierIds?: string[]
}

export type UpdateProductInput = Partial<CreateProductInput>
