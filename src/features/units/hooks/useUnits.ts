import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { unitApi } from '@/features/units/api/unitApi'
import type { CreateUnitInput, UpdateUnitInput } from '@/features/units/types'

export const unitKeys = {
  all: ['units'] as const,
}

export function useUnitsQuery() {
  return useQuery({
    queryKey: unitKeys.all,
    queryFn: unitApi.getUnits,
  })
}

export function useCreateUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateUnitInput) => unitApi.createUnit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all })
      toast.success('Unit created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create unit')
    },
  })
}

export function useUpdateUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUnitInput }) =>
      unitApi.updateUnit(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all })
      toast.success('Unit updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update unit')
    },
  })
}

export function useSetUnitStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      unitApi.setUnitStatus(id, active),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all })
      toast.success(
        variables.active ? 'Unit activated' : 'Unit deactivated',
      )
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update unit status')
    },
  })
}
