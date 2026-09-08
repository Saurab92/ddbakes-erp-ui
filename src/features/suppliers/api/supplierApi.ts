import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type {
  CreateSupplierInput,
  Supplier,
  UpdateSupplierInput,
} from '@/features/suppliers/types'

interface SupplierResponse extends Omit<Supplier, 'id'> {
  id: number
}

function toSupplier(response: SupplierResponse): Supplier {
  return { ...response, id: String(response.id) }
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
      .post<SupplierResponse>(endpoints.suppliers.root, input)
      .then(toSupplier),
  updateSupplier: (id: string, input: UpdateSupplierInput) =>
    apiClient
      .put<SupplierResponse>(endpoints.suppliers.byId(id), input)
      .then(toSupplier),
  activateSupplier: (id: string) =>
    apiClient.patch<void>(endpoints.suppliers.activate(id)),
  deactivateSupplier: (id: string) =>
    apiClient.patch<void>(endpoints.suppliers.deactivate(id)),
  deleteSupplier: (id: string) =>
    apiClient.delete<void>(endpoints.suppliers.byId(id)),
}