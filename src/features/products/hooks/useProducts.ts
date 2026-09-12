import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { productApi } from '@/features/products/api/productApi'
import { supplierKeys } from '@/features/suppliers/hooks/useSuppliers'
import type { CreateProductInput, UpdateProductInput } from '@/features/products/types'

export const productKeys = {
  all: ['products'] as const,
}

export function useProductsQuery() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: productApi.getProducts,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProductInput) => productApi.createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
      toast.success('Product created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create product')
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) =>
      productApi.updateProduct(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
      toast.success('Product updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product')
    },
  })
}

export function useUpdateProductSuppliers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, supplierIds }: { id: string; supplierIds: string[] }) =>
      productApi.updateProductSuppliers(id, supplierIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
      toast.success('Product suppliers updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product suppliers')
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
      toast.success('Product deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete product')
    },
  })
}

export function useSetProductStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      productApi.setProductStatus(id, active),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success(variables.active ? 'Product activated' : 'Product deactivated')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product status')
    },
  })
}
