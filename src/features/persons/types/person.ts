export interface Person {
  id: string
  name: string
  departmentId: string
  active: boolean
}

export interface CreatePersonInput {
  name: string
  departmentId: string
  active: boolean
}

export type UpdatePersonInput = CreatePersonInput