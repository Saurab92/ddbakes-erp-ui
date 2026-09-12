import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { productKeys } from '@/features/products/hooks/useProducts'
import { supplierApi } from '@/features/suppliers/api/supplierApi'
import type {
  CreateSupplierInput,
  UpdateSupplierInput,
} from '@/features/suppliers/types'

export const supplierKeys = {
  all: ['suppliers'] as const,
}

export function useSuppliersQuery() {
  return useQuery({
    queryKey: supplierKeys.all,
    queryFn: supplierApi.getSuppliers,
  })
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateSupplierInput) => supplierApi.createSupplier(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success('Supplier created successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create supplier'),
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSupplierInput }) =>
      supplierApi.updateSupplier(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success('Supplier updated successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update supplier'),
  })
}

export function useSetSupplierStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? supplierApi.activateSupplier(id) : supplierApi.deactivateSupplier(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success(variables.active ? 'Supplier activated' : 'Supplier deactivated')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update supplier status'),
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => supplierApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success('Supplier deleted successfully')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete supplier'),
  })
}