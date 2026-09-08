import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { departmentApi } from '@/features/departments/api/departmentApi'
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from '@/features/departments/types'

export const departmentKeys = {
  all: ['departments'] as const,
}

export function useDepartmentsQuery() {
  return useQuery({
    queryKey: departmentKeys.all,
    queryFn: departmentApi.getDepartments,
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateDepartmentInput) => departmentApi.createDepartment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
      toast.success('Department created successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create department'),
  })
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDepartmentInput }) =>
      departmentApi.updateDepartment(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
      toast.success('Department updated successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update department'),
  })
}

export function useSetDepartmentStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active
        ? departmentApi.activateDepartment(id)
        : departmentApi.deactivateDepartment(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
      toast.success(variables.active ? 'Department activated' : 'Department deactivated')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update department status'),
  })
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => departmentApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
      toast.success('Department deleted successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete department'),
  })
}