export interface Unit {
  id: string
  name: string
  code: string
  active: boolean
}

export interface CreateUnitInput {
  name: string
  code: string
  active: boolean
}

export type UpdateUnitInput = CreateUnitInput
