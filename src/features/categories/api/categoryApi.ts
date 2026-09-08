import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/features/categories/types'

interface CategoryResponse extends Omit<Category, 'id'> {
  id: number
}

function toCategory(response: CategoryResponse): Category {
  return { ...response, id: String(response.id) }
}

export const categoryApi = {
  getCategories: () =>
    apiClient
      .get<CategoryResponse[]>(endpoints.categories.root)
      .then((categories) => categories.map(toCategory)),
  getCategory: (id: string) =>
    apiClient.get<CategoryResponse>(endpoints.categories.byId(id)).then(toCategory),
  createCategory: (input: CreateCategoryInput) =>
    apiClient
      .post<CategoryResponse>(endpoints.categories.root, input)
      .then(toCategory),
  updateCategory: (id: string, input: UpdateCategoryInput) =>
    apiClient
      .put<CategoryResponse>(endpoints.categories.byId(id), input)
      .then(toCategory),
  deactivateCategory: (id: string) =>
    apiClient.patch<void>(endpoints.categories.deactivate(id)),
  activateCategory: (id: string) =>
    apiClient
      .put<CategoryResponse>(endpoints.categories.byId(id), { active: true })
      .then(toCategory),
  deleteCategory: (id: string) =>
    apiClient.delete<void>(endpoints.categories.byId(id)),
}
