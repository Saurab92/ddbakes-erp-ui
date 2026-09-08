import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { stockApi } from '@/features/stocks/api/stockApi'
import type { CreateStockInput, UpdateStockInput } from '@/features/stocks/types'

export const stockKeys = {
  all: ['stocks'] as const,
  lowStock: () => [...stockKeys.all, 'low-stock'] as const,
  byProduct: (productId: string) => [...stockKeys.all, 'product', productId] as const,
}

export function useLowStockQuery(enabled = true) {
  return useQuery({
    queryKey: stockKeys.lowStock(),
    queryFn: stockApi.getLowStock,
    enabled,
  })
}

export function useStockByProductQuery(productId: string) {
  return useQuery({
    queryKey: stockKeys.byProduct(productId),
    queryFn: () => stockApi.getStockByProductId(productId),
    enabled: Boolean(productId),
  })
}

export function useStocksByProductQueries(productIds: string[]) {
  return useQueries({
    queries: productIds.map((productId) => ({
      queryKey: stockKeys.byProduct(productId),
      queryFn: () => stockApi.getStockByProductId(productId),
    })),
  })
}

export function useCreateStock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateStockInput) => stockApi.createStock(input),
    onSuccess: (stock) => {
      queryClient.invalidateQueries({ queryKey: stockKeys.byProduct(stock.productId) })
      toast.success('Stock created successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create stock'),
  })
}

export function useUpdateStock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStockInput }) =>
      stockApi.updateStock(id, input),
    onSuccess: (stock) => {
      queryClient.invalidateQueries({ queryKey: stockKeys.byProduct(stock.productId) })
      toast.success('Stock updated successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update stock'),
  })
}

export function useDeleteStock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (stock: { id: string; productId: string }) => stockApi.deleteStock(stock.id),
    onSuccess: (_, stock) => {
      queryClient.removeQueries({ queryKey: stockKeys.byProduct(stock.productId) })
      toast.success('Stock deleted successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete stock'),
  })
}