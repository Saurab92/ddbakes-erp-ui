import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { roleApi } from '@/features/roles/api/roleApi'
import type { CreateRoleInput, UpdateRoleInput } from '@/features/roles/types'

export const roleKeys = {
  all: ['roles'] as const,
}

export function useRolesQuery() {
  return useQuery({
    queryKey: roleKeys.all,
    queryFn: roleApi.getRoles,
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateRoleInput) => roleApi.createRole(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all })
      toast.success('Role created successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create role'),
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRoleInput }) =>
      roleApi.updateRole(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all })
      toast.success('Role updated successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update role'),
  })
}

export function useSetRoleStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? roleApi.activateRole(id) : roleApi.deactivateRole(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all })
      toast.success(variables.active ? 'Role activated' : 'Role deactivated')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update role status'),
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => roleApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all })
      toast.success('Role deleted successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete role'),
  })
}