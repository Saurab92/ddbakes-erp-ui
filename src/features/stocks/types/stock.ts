export interface Stock {
  id: string
  productId: string
  quantity: number
  productName?: string
  categoryId?: string
  categoryName?: string
  unitId?: string
  unitName?: string
  createdBy?: string
  updatedBy?: string
}

export interface CreateStockInput {
  productId: string
  quantity: number
}

export interface UpdateStockInput {
  quantity: number
}