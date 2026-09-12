import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type {
  CreateProductInput,
  Product,
  ProductSupplierSummary,
  UpdateProductInput,
} from '@/features/products/types'

interface ProductSupplierResponse extends Omit<ProductSupplierSummary, 'id'> {
  id: number
}

/** Shape returned by the Spring Boot API: ids are numeric on the wire. */
interface ProductResponse extends Omit<Product, 'id' | 'unitId' | 'categoryId' | 'suppliers' | 'supplierIds'> {
  id: number
  unitId: number
  categoryId: number
  suppliers?: ProductSupplierResponse[]
  supplierIds?: number[]
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
    suppliers: response.suppliers?.map((supplier) => ({
      ...supplier,
      id: String(supplier.id),
    })),
    supplierIds:
      response.supplierIds?.map(String) ??
      response.suppliers?.map((s) => String(s.id)),
  }
}

/** Convert the form model to the wire payload (`unitId`/`categoryId`/`supplierIds` as numbers). */
function toPayload(input: CreateProductInput | UpdateProductInput) {
  const payload: Record<string, unknown> = { ...input }
  if (input.unitId !== undefined) {
    payload.unitId = Number(input.unitId)
  }
  if (input.categoryId !== undefined) {
    payload.categoryId = Number(input.categoryId)
  }
  if (input.supplierIds !== undefined) {
    payload.supplierIds = input.supplierIds.map(Number)
  }
  return payload
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
  updateProductSuppliers: (id: string, supplierIds: string[]) =>
    apiClient
      .put<ProductResponse>(endpoints.products.suppliers(id), {
        supplierIds: supplierIds.map(Number),
      })
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
