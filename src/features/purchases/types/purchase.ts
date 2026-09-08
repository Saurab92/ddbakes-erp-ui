export interface PurchaseItem {
  productId: string
  productName?: string
  quantity: number
  unitPrice: number
  totalPrice?: number
}

export interface Purchase {
  id: string
  purchaseDate: string
  supplierId: string
  supplierName: string
  invoiceNumber: string
  remarks?: string
  purchaseItems: PurchaseItem[]
  totalAmount?: number
}

export interface PurchaseItemInput {
  productId: string
  quantity: number
  unitPrice: number
}

export interface CreatePurchaseInput {
  purchaseDate: string
  supplierId: string
  invoiceNumber: string
  remarks?: string
  purchaseItems: PurchaseItemInput[]
}

export type UpdatePurchaseInput = CreatePurchaseInput
