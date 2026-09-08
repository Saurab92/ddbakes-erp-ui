import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/common/PageHeader'
import { SearchInput } from '@/components/common/SearchInput'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { TableSkeleton } from '@/components/common/TableSkeleton'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ProductTable } from '@/features/products/components/ProductTable'
import {
  ProductFormDialog,
  type ProductFormValues,
} from '@/features/products/components/ProductFormDialog'
import {
  useCreateProduct,
  useDeleteProduct,
  useProductsQuery,
  useSetProductStatus,
  useUpdateProduct,
} from '@/features/products/hooks/useProducts'
import { useCategoriesQuery } from '@/features/categories/hooks/useCategories'
import type { Product } from '@/features/products/types'

type StatusFilter = 'all' | 'active' | 'inactive'

export function ProductsPage() {
  const { data: products, isLoading, isError, refetch } = useProductsQuery()
  const { data: categories } = useCategoriesQuery()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const setProductStatus = useSetProductStatus()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [statusTarget, setStatusTarget] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const filteredProducts = useMemo(() => {
    if (!products) return []
    const term = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesSearch = term ? product.name.toLowerCase().includes(term) : true
      const matchesCategory =
        categoryFilter === 'all' ? true : product.categoryId === categoryFilter
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
            ? product.active
            : !product.active
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, search, categoryFilter, statusFilter])

  function handleAdd() {
    setEditingProduct(null)
    setFormOpen(true)
  }

  function handleEdit(product: Product) {
    setEditingProduct(product)
    setFormOpen(true)
  }

  function handleFormSubmit(values: ProductFormValues) {
    if (editingProduct) {
      updateProduct.mutate(
        { id: editingProduct.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createProduct.mutate(values, { onSuccess: () => setFormOpen(false) })
    }
  }

  function handleConfirmStatusChange() {
    if (!statusTarget) return
    setProductStatus.mutate(
      { id: statusTarget.id, active: !statusTarget.active },
      { onSuccess: () => setStatusTarget(null) },
    )
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteProduct.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage the products tracked in your bakery inventory."
        actions={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search products by name..."
              className="max-w-sm"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {(categories ?? []).map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className="sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <TableSkeleton columns={6} />
          ) : isError ? (
            <ErrorState
              description="We could not load products. Please try again."
              onRetry={() => refetch()}
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title={products && products.length > 0 ? 'No products match your filters' : 'No products yet'}
              description={
                products && products.length > 0
                  ? 'Try adjusting your search or filters.'
                  : 'Add your first product to get started.'
              }
            />
          ) : (
            <ProductTable
              products={filteredProducts}
              onEdit={handleEdit}
              onToggleStatus={setStatusTarget}
              onDelete={setDeleteTarget}
            />
          )}
        </CardContent>
      </Card>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        onSubmit={handleFormSubmit}
        isSubmitting={createProduct.isPending || updateProduct.isPending}
      />

      <ConfirmDialog
        open={Boolean(statusTarget)}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        title={statusTarget?.active ? 'Deactivate product?' : 'Activate product?'}
        description={
          statusTarget?.active
            ? `"${statusTarget?.name}" will no longer be available for new purchases or issues.`
            : `"${statusTarget?.name}" will become available for use again.`
        }
        confirmLabel={statusTarget?.active ? 'Deactivate' : 'Activate'}
        onConfirm={handleConfirmStatusChange}
        isLoading={setProductStatus.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete product?"
        description={`This will permanently delete "${deleteTarget?.name}". This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={deleteProduct.isPending}
      />
    </div>
  )
}
