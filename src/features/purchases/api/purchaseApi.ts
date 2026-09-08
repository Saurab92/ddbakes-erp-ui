import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type {
  CreatePurchaseInput,
  Purchase,
  PurchaseItem,
  UpdatePurchaseInput,
} from '@/features/purchases/types'

/** Shape returned by the Spring Boot API: ids are numeric on the wire. */
interface PurchaseItemResponse extends Omit<PurchaseItem, 'productId'> {
  id?: number
  productId: number
}

interface PurchaseResponse extends Omit<Purchase, 'id' | 'supplierId' | 'purchaseItems'> {
  id: number
  supplierId: number
  purchaseItems: PurchaseItemResponse[]
}

/** Normalize the wire payload to the frontend model (ids as strings). */
function toPurchase(response: PurchaseResponse): Purchase {
  return {
    ...response,
    id: String(response.id),
    supplierId: String(response.supplierId),
    purchaseItems: response.purchaseItems.map((item) => ({
      ...item,
      productId: String(item.productId),
    })),
  }
}

/** Convert the form model to the wire payload (`supplierId`/`productId` as numbers). */
function toPayload(input: CreatePurchaseInput) {
  return {
    ...input,
    supplierId: Number(input.supplierId),
    purchaseItems: input.purchaseItems.map((item) => ({
      ...item,
      productId: Number(item.productId),
    })),
  }
}

export const purchaseApi = {
  getPurchases: () =>
    apiClient
      .get<PurchaseResponse[]>(endpoints.purchases.root)
      .then((purchases) => purchases.map(toPurchase)),
  getPurchase: (id: string) =>
    apiClient.get<PurchaseResponse>(endpoints.purchases.byId(id)).then(toPurchase),
  createPurchase: (input: CreatePurchaseInput) =>
    apiClient
      .post<PurchaseResponse>(endpoints.purchases.root, toPayload(input))
      .then(toPurchase),
  updatePurchase: (id: string, input: UpdatePurchaseInput) =>
    apiClient
      .put<PurchaseResponse>(endpoints.purchases.byId(id), toPayload(input))
      .then(toPurchase),
}
