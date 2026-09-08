import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '@/features/products/types'

/** Shape returned by the Spring Boot API: ids are numeric on the wire. */
interface ProductResponse extends Omit<Product, 'id' | 'unitId' | 'categoryId'> {
  id: number
  unitId: number
  categoryId: number
}

/** The list endpoint may return a bare array or wrap it as `{ products, count }`. */
type ProductListResponse = ProductResponse[] | { products: ProductResponse[]; count: number }

/** Normalize the wire payload to the frontend model (ids as strings). */
function toProduct(response: ProductResponse): Product {
  return {
    ...response,
    id: String(response.id),
    unitId: String(response.unitId),
    categoryId: String(response.categoryId),
  }
}

/** Convert the form model to the wire payload (`unitId`/`categoryId` as numbers). */
function toPayload(input: CreateProductInput) {
  return {
    ...input,
    unitId: Number(input.unitId),
    categoryId: Number(input.categoryId),
  }
}

export const productApi = {
  getProducts: () =>
    apiClient
      .get<ProductListResponse>(endpoints.products.root)
      .then((response) => (Array.isArray(response) ? response : response.products).map(toProduct)),
  createProduct: (input: CreateProductInput) =>
    apiClient
      .post<ProductResponse>(endpoints.products.root, toPayload(input))
      .then(toProduct),
  updateProduct: (id: string, input: UpdateProductInput) =>
    apiClient
      .put<ProductResponse>(endpoints.products.byId(id), toPayload(input))
      .then(toProduct),
  deleteProduct: (id: string) =>
    apiClient.delete<void>(endpoints.products.byId(id)),
  /**
   * The API only exposes a `PATCH /products/:id/deactivate` endpoint.
   * Reactivation is done via a partial `PUT /products/:id` update.
   */
  setProductStatus: (id: string, active: boolean) =>
    active
      ? apiClient
          .put<ProductResponse>(endpoints.products.byId(id), { active: true })
          .then(toProduct)
      : apiClient
          .patch<ProductResponse>(endpoints.products.deactivate(id))
          .then(toProduct),
}
