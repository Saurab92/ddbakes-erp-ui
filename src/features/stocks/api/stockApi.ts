import { ApiError, apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { CreateStockInput, Stock, UpdateStockInput } from '@/features/stocks/types'

interface StockResponse extends Omit<Stock, 'id' | 'productId' | 'unitId' | 'createdBy' | 'updatedBy'> {
  id: number
  productId: number
  unitId?: number
  createdBy?: number
  updatedBy?: number
}

interface LowStockResponse {
  count: number
  items: StockResponse[]
}

function toStock(response: StockResponse): Stock {
  return {
    ...response,
    id: String(response.id),
    productId: String(response.productId),
    unitId: response.unitId === undefined ? undefined : String(response.unitId),
    createdBy: response.createdBy === undefined ? undefined : String(response.createdBy),
    updatedBy: response.updatedBy === undefined ? undefined : String(response.updatedBy),
  }
}

export const stockApi = {
  getLowStock: () =>
    apiClient
      .get<LowStockResponse>(endpoints.stocks.lowStock)
      .then((response) => ({
        count: response.count,
        items: response.items.map(toStock),
      })),
  getStock: (id: string) =>
    apiClient.get<StockResponse>(endpoints.stocks.byId(id)).then(toStock),
  getStockByProductId: (productId: string) =>
    apiClient
      .get<StockResponse>(endpoints.stocks.byProductId(productId))
      .then(toStock)
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 404) return null
        throw error
      }),
  createStock: (input: CreateStockInput) =>
    apiClient
      .post<StockResponse>(endpoints.stocks.root, {
        productId: Number(input.productId),
        quantity: input.quantity,
        createdBy: 1,
      })
      .then(toStock),
  updateStock: (id: string, input: UpdateStockInput) =>
    apiClient
      .put<StockResponse>(endpoints.stocks.byId(id), {
        quantity: input.quantity,
        updatedBy: 1,
      })
      .then(toStock),
  deleteStock: (id: string) => apiClient.delete<void>(endpoints.stocks.byId(id)),
}