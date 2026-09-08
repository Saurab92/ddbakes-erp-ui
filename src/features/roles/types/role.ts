export interface Role {
  id: string
  name: string
  description: string
  active: boolean
}

export interface CreateRoleInput {
  name: string
  description?: string
  active: boolean
}

export type UpdateRoleInput = Partial<CreateRoleInput>