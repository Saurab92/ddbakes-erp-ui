import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type {
  CreateSupplierInput,
  Supplier,
  SupplierProductSummary,
  UpdateSupplierInput,
} from '@/features/suppliers/types'

interface SupplierProductResponse extends Omit<SupplierProductSummary, 'id' | 'unitId' | 'categoryId'> {
  id: number
  unitId?: number
  categoryId?: number
}

interface SupplierResponse extends Omit<Supplier, 'id' | 'products' | 'productIds'> {
  id: number
  products?: SupplierProductResponse[]
  productIds?: number[]
}

function toSupplier(response: SupplierResponse): Supplier {
  return {
    ...response,
    id: String(response.id),
    products: response.products?.map((p) => ({
      ...p,
      id: String(p.id),
      unitId: p.unitId !== undefined ? String(p.unitId) : undefined,
      categoryId: p.categoryId !== undefined ? String(p.categoryId) : undefined,
    })),
    productIds:
      response.productIds?.map(String) ??
      response.products?.map((p) => String(p.id)),
  }
}

function toSupplierPayload(input: CreateSupplierInput | UpdateSupplierInput) {
  const payload: Record<string, unknown> = { ...input }
  if (input.productIds !== undefined) {
    payload.productIds = input.productIds.map(Number)
  }
  return payload
}

export const supplierApi = {
  getSuppliers: () =>
    apiClient
      .get<SupplierResponse[]>(endpoints.suppliers.root)
      .then((suppliers) => suppliers.map(toSupplier)),
  getSupplierById: (id: string) =>
    apiClient.get<SupplierResponse>(endpoints.suppliers.byId(id)).then(toSupplier),
  searchSuppliers: (name: string) =>
    apiClient
      .get<SupplierResponse[]>(`${endpoints.suppliers.search}?name=${encodeURIComponent(name)}`)
      .then((suppliers) => suppliers.map(toSupplier)),
  createSupplier: (input: CreateSupplierInput) =>
    apiClient
      .post<SupplierResponse>(endpoints.suppliers.root, toSupplierPayload(input))
      .then(toSupplier),
  updateSupplier: (id: string, input: UpdateSupplierInput) =>
    apiClient
      .put<SupplierResponse>(endpoints.suppliers.byId(id), toSupplierPayload(input))
      .then(toSupplier),
  activateSupplier: (id: string) =>
    apiClient.patch<void>(endpoints.suppliers.activate(id)),
  deactivateSupplier: (id: string) =>
    apiClient.patch<void>(endpoints.suppliers.deactivate(id)),
  deleteSupplier: (id: string) =>
    apiClient.delete<void>(endpoints.suppliers.byId(id)),
}