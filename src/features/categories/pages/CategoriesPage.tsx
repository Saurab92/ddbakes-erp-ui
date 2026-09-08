import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { SearchInput } from '@/components/common/SearchInput'
import { TableSkeleton } from '@/components/common/TableSkeleton'
import {
  CategoryFormDialog,
  type CategoryFormValues,
} from '@/features/categories/components/CategoryFormDialog'
import { CategoryTable } from '@/features/categories/components/CategoryTable'
import {
  useCategoriesQuery,
  useCreateCategory,
  useDeleteCategory,
  useSetCategoryStatus,
  useUpdateCategory,
} from '@/features/categories/hooks/useCategories'
import type { Category } from '@/features/categories/types'

export function CategoriesPage() {
  const { data: categories, isLoading, isError, refetch } = useCategoriesQuery()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const setCategoryStatus = useSetCategoryStatus()
  const deleteCategory = useDeleteCategory()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [statusTarget, setStatusTarget] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (categories ?? []).filter(
      (category) => !term || category.name.toLowerCase().includes(term),
    )
  }, [categories, search])

  function handleFormSubmit(values: CategoryFormValues) {
    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createCategory.mutate(values, { onSuccess: () => setFormOpen(false) })
    }
  }

  function handleConfirmStatusChange() {
    if (!statusTarget) return
    setCategoryStatus.mutate(
      { id: statusTarget.id, active: !statusTarget.active },
      { onSuccess: () => setStatusTarget(null) },
    )
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteCategory.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage the product categories used across your bakery operations."
        actions={
          <Button
            onClick={() => {
              setEditingCategory(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search categories by name..."
            className="max-w-sm"
          />

          {isLoading ? (
            <TableSkeleton columns={4} />
          ) : isError ? (
            <ErrorState
              description="We could not load categories. Please try again."
              onRetry={() => refetch()}
            />
          ) : filteredCategories.length === 0 ? (
            <EmptyState
              title={
                categories && categories.length > 0
                  ? 'No categories match your search'
                  : 'No categories yet'
              }
              description={
                categories && categories.length > 0
                  ? 'Try a different search term.'
                  : 'Add your first category to get started.'
              }
            />
          ) : (
            <CategoryTable
              categories={filteredCategories}
              onEdit={(category) => {
                setEditingCategory(category)
                setFormOpen(true)
              }}
              onToggleStatus={setStatusTarget}
              onDelete={setDeleteTarget}
            />
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSubmit={handleFormSubmit}
        isSubmitting={createCategory.isPending || updateCategory.isPending}
      />
      <ConfirmDialog
        open={Boolean(statusTarget)}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        title={statusTarget?.active ? 'Deactivate category?' : 'Activate category?'}
        description={
          statusTarget?.active
            ? `"${statusTarget?.name}" will no longer be available for use.`
            : `"${statusTarget?.name}" will become available for use again.`
        }
        confirmLabel={statusTarget?.active ? 'Deactivate' : 'Activate'}
        onConfirm={handleConfirmStatusChange}
        isLoading={setCategoryStatus.isPending}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete category?"
        description={`This will permanently delete "${deleteTarget?.name}". This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={deleteCategory.isPending}
      />
    </div>
  )
}
