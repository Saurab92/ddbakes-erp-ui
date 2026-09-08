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
  SupplierFormDialog,
  type SupplierFormValues,
} from '@/features/suppliers/components/SupplierFormDialog'
import { SupplierTable } from '@/features/suppliers/components/SupplierTable'
import {
  useCreateSupplier,
  useDeleteSupplier,
  useSetSupplierStatus,
  useSuppliersQuery,
  useUpdateSupplier,
} from '@/features/suppliers/hooks/useSuppliers'
import type { Supplier } from '@/features/suppliers/types'

function toSupplierInput(values: SupplierFormValues) {
  return Object.fromEntries(
    Object.entries(values).filter(([key, value]) => key === 'active' || value !== ''),
  ) as SupplierFormValues
}

export function SuppliersPage() {
  const { data: suppliers, isLoading, isError, refetch } = useSuppliersQuery()
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const setSupplierStatus = useSetSupplierStatus()
  const deleteSupplier = useDeleteSupplier()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [statusTarget, setStatusTarget] = useState<Supplier | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)

  const filteredSuppliers = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (suppliers ?? []).filter((supplier) => {
      if (!term) return true
      return [supplier.name, supplier.contactPerson, supplier.phone, supplier.email]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    })
  }, [suppliers, search])

  function handleFormSubmit(values: SupplierFormValues) {
    const input = toSupplierInput(values)
    if (editingSupplier) {
      updateSupplier.mutate(
        { id: editingSupplier.id, input },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createSupplier.mutate(input, { onSuccess: () => setFormOpen(false) })
    }
  }

  function handleConfirmStatusChange() {
    if (!statusTarget) return
    setSupplierStatus.mutate(
      { id: statusTarget.id, active: !statusTarget.active },
      { onSuccess: () => setStatusTarget(null) },
    )
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteSupplier.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage the suppliers used across your bakery operations."
        actions={
          <Button
            onClick={() => {
              setEditingSupplier(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Add Supplier
          </Button>
        }
      />
      <Card>
        <CardContent className="space-y-4 p-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search suppliers..."
            className="max-w-sm"
          />
          {isLoading ? (
            <TableSkeleton columns={6} />
          ) : isError ? (
            <ErrorState description="We could not load suppliers. Please try again." onRetry={() => refetch()} />
          ) : filteredSuppliers.length === 0 ? (
            <EmptyState
              title={suppliers && suppliers.length > 0 ? 'No suppliers match your search' : 'No suppliers yet'}
              description={suppliers && suppliers.length > 0 ? 'Try a different search term.' : 'Add your first supplier to get started.'}
            />
          ) : (
            <SupplierTable
              suppliers={filteredSuppliers}
              onEdit={(supplier) => {
                setEditingSupplier(supplier)
                setFormOpen(true)
              }}
              onToggleStatus={setStatusTarget}
              onDelete={setDeleteTarget}
            />
          )}
        </CardContent>
      </Card>
      <SupplierFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        supplier={editingSupplier}
        onSubmit={handleFormSubmit}
        isSubmitting={createSupplier.isPending || updateSupplier.isPending}
      />
      <ConfirmDialog
        open={Boolean(statusTarget)}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        title={statusTarget?.active ? 'Deactivate supplier?' : 'Activate supplier?'}
        description={
          statusTarget?.active
            ? `"${statusTarget?.name}" will no longer be available for use.`
            : `"${statusTarget?.name}" will become available for use again.`
        }
        confirmLabel={statusTarget?.active ? 'Deactivate' : 'Activate'}
        onConfirm={handleConfirmStatusChange}
        isLoading={setSupplierStatus.isPending}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete supplier?"
        description={`This will permanently delete "${deleteTarget?.name}". This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={deleteSupplier.isPending}
      />
    </div>
  )
}