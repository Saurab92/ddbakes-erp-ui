import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userApi } from '@/features/users/api/userApi'
import type {
  CreateUserInput,
  UpdateUserInput,
  ChangePasswordInput,
} from '@/features/users/types'

export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => ['users', id] as const,
}

export function useUsersQuery() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: userApi.getUsers,
  })
}

export function useUserQuery(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUser(id),
    enabled: Boolean(id),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateUserInput) => userApi.createUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('User created successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create user'),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      userApi.updateUser(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('User updated successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update user'),
  })
}

export function useActivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => userApi.reactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('User activated successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to activate user'),
  })
}

export function useDeactivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => userApi.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('User deactivated successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to deactivate user'),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('User deleted successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete user'),
  })
}

export function useChangePassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ChangePasswordInput }) =>
      userApi.changePassword(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('Password changed successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to change password'),
  })
}
