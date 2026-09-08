import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { categoryApi } from '@/features/categories/api/categoryApi'
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/features/categories/types'

export const categoryKeys = {
  all: ['categories'] as const,
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: categoryApi.getCategories,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryApi.createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success('Category created successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create category'),
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      categoryApi.updateCategory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success('Category updated successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update category'),
  })
}

export function useSetCategoryStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? categoryApi.activateCategory(id) : categoryApi.deactivateCategory(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success(variables.active ? 'Category activated' : 'Category deactivated')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update category status'),
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success('Category deleted successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete category'),
  })
}
