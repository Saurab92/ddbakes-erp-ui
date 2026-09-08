import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/PageHeader'
import { SearchInput } from '@/components/common/SearchInput'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { TableSkeleton } from '@/components/common/TableSkeleton'
import { PurchaseTable } from '@/features/purchases/components/PurchaseTable'
import { PurchaseDetailsDialog } from '@/features/purchases/components/PurchaseDetailsDialog'
import {
  PurchaseFormDialog,
  type PurchaseFormValues,
} from '@/features/purchases/components/PurchaseFormDialog'
import {
  useCreatePurchase,
  usePurchasesQuery,
  useUpdatePurchase,
} from '@/features/purchases/hooks/usePurchases'
import type { Purchase } from '@/features/purchases/types'

export function PurchasesPage() {
  const { data: purchases, isLoading, isError, refetch } = usePurchasesQuery()
  const createPurchase = useCreatePurchase()
  const updatePurchase = useUpdatePurchase()

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null)
  const [viewingPurchase, setViewingPurchase] = useState<Purchase | null>(null)

  const filteredPurchases = useMemo(() => {
    if (!purchases) return []
    const term = search.trim().toLowerCase()
    if (!term) return purchases
    return purchases.filter(
      (purchase) =>
        purchase.supplierName.toLowerCase().includes(term) ||
        purchase.invoiceNumber.toLowerCase().includes(term),
    )
  }, [purchases, search])

  function handleAdd() {
    setEditingPurchase(null)
    setFormOpen(true)
  }

  function handleEdit(purchase: Purchase) {
    setEditingPurchase(purchase)
    setFormOpen(true)
  }

  function handleView(purchase: Purchase) {
    setViewingPurchase(purchase)
  }

  function handleFormSubmit(values: PurchaseFormValues) {
    if (editingPurchase) {
      updatePurchase.mutate(
        { id: editingPurchase.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createPurchase.mutate(values, { onSuccess: () => setFormOpen(false) })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases"
        description="Record and manage supplier purchases and their line items."
        actions={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Add Purchase
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by supplier or invoice number..."
            className="max-w-sm"
          />

          {isLoading ? (
            <TableSkeleton columns={6} />
          ) : isError ? (
            <ErrorState
              description="We could not load purchases. Please try again."
              onRetry={() => refetch()}
            />
          ) : filteredPurchases.length === 0 ? (
            <EmptyState
              title={purchases && purchases.length > 0 ? 'No purchases match your search' : 'No purchases yet'}
              description={
                purchases && purchases.length > 0
                  ? 'Try adjusting your search.'
                  : 'Add your first purchase to get started.'
              }
            />
          ) : (
            <PurchaseTable
              purchases={filteredPurchases}
              onEdit={handleEdit}
              onView={handleView}
            />
          )}
        </CardContent>
      </Card>

      <PurchaseFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        purchase={editingPurchase}
        onSubmit={handleFormSubmit}
        isSubmitting={createPurchase.isPending || updatePurchase.isPending}
      />

      <PurchaseDetailsDialog
        open={Boolean(viewingPurchase)}
        onOpenChange={(open) => !open && setViewingPurchase(null)}
        purchase={viewingPurchase}
      />
    </div>
  )
}
