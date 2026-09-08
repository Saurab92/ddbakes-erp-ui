export interface Supplier {
  id: string
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  address?: string
  active: boolean
}

export interface CreateSupplierInput {
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  address?: string
  active: boolean
}

export type UpdateSupplierInput = Partial<CreateSupplierInput>