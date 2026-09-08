export interface Product {
  id: string
  name: string
  unitId: string
  unitName: string
  categoryId: string
  categoryName: string
  minimumStock: number
  active: boolean
}

export interface CreateProductInput {
  name: string
  unitId: string
  categoryId: string
  minimumStock: number
  active: boolean
}

export type UpdateProductInput = CreateProductInput
