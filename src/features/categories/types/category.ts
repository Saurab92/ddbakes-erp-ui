export interface Category {
  id: string
  name: string
  description: string
  active: boolean
}

export interface CreateCategoryInput {
  name: string
  description: string
  active: boolean
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>
