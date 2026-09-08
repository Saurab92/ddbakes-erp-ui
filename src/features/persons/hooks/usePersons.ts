import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { personApi } from '@/features/persons/api/personApi'
import type { CreatePersonInput, UpdatePersonInput } from '@/features/persons/types'

export const personKeys = {
  all: ['persons'] as const,
}

export function usePersonsQuery() {
  return useQuery({ queryKey: personKeys.all, queryFn: personApi.getPersons })
}

export function useCreatePerson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreatePersonInput) => personApi.createPerson(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personKeys.all })
      toast.success('Person created successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create person'),
  })
}

export function useUpdatePerson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePersonInput }) =>
      personApi.updatePerson(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personKeys.all })
      toast.success('Person updated successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update person'),
  })
}

export function useDeactivatePerson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: personApi.deactivatePerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personKeys.all })
      toast.success('Person deactivated')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to deactivate person'),
  })
}

export function useDeletePerson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: personApi.deletePerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personKeys.all })
      toast.success('Person deleted successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete person'),
  })
}