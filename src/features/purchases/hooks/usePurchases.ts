import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { purchaseApi } from '@/features/purchases/api/purchaseApi'
import type { CreatePurchaseInput, UpdatePurchaseInput } from '@/features/purchases/types'

export const purchaseKeys = {
  all: ['purchases'] as const,
  detail: (id: string) => ['purchases', id] as const,
}

export function usePurchasesQuery() {
  return useQuery({
    queryKey: purchaseKeys.all,
    queryFn: purchaseApi.getPurchases,
  })
}

export function usePurchaseQuery(id: string | null) {
  return useQuery({
    queryKey: purchaseKeys.detail(id ?? ''),
    queryFn: () => purchaseApi.getPurchase(id as string),
    enabled: Boolean(id),
  })
}

export function useCreatePurchase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreatePurchaseInput) => purchaseApi.createPurchase(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
      toast.success('Purchase created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create purchase')
    },
  })
}

export function useUpdatePurchase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePurchaseInput }) =>
      purchaseApi.updatePurchase(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
      toast.success('Purchase updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update purchase')
    },
  })
}
