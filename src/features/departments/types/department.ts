export interface Department {
  id: string
  name: string
  active: boolean
}

export interface CreateDepartmentInput {
  name: string
  active: boolean
}

export type UpdateDepartmentInput = Partial<CreateDepartmentInput>