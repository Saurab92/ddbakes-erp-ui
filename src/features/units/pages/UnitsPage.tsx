import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/PageHeader'
import { SearchInput } from '@/components/common/SearchInput'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { TableSkeleton } from '@/components/common/TableSkeleton'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { UnitTable } from '@/features/units/components/UnitTable'
import {
  UnitFormDialog,
  type UnitFormValues,
} from '@/features/units/components/UnitFormDialog'
import {
  useCreateUnit,
  useSetUnitStatus,
  useUnitsQuery,
  useUpdateUnit,
} from '@/features/units/hooks/useUnits'
import type { Unit } from '@/features/units/types'

export function UnitsPage() {
  const { data: units, isLoading, isError, refetch } = useUnitsQuery()
  const createUnit = useCreateUnit()
  const updateUnit = useUpdateUnit()
  const setUnitStatus = useSetUnitStatus()

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [statusTarget, setStatusTarget] = useState<Unit | null>(null)

  const filteredUnits = useMemo(() => {
    if (!units) return []
    const term = search.trim().toLowerCase()
    if (!term) return units
    return units.filter(
      (unit) =>
        unit.name.toLowerCase().includes(term) ||
        unit.code.toLowerCase().includes(term),
    )
  }, [units, search])

  function handleAdd() {
    setEditingUnit(null)
    setFormOpen(true)
  }

  function handleEdit(unit: Unit) {
    setEditingUnit(unit)
    setFormOpen(true)
  }

  function handleFormSubmit(values: UnitFormValues) {
    if (editingUnit) {
      updateUnit.mutate(
        { id: editingUnit.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createUnit.mutate(values, { onSuccess: () => setFormOpen(false) })
    }
  }

  function handleConfirmStatusChange() {
    if (!statusTarget) return
    setUnitStatus.mutate(
      { id: statusTarget.id, active: !statusTarget.active },
      { onSuccess: () => setStatusTarget(null) },
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Units"
        description="Manage units of measurement used across products."
        actions={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Add Unit
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search units by name or code..."
            className="max-w-sm"
          />

          {isLoading ? (
            <TableSkeleton columns={4} />
          ) : isError ? (
            <ErrorState
              description="We could not load units. Please try again."
              onRetry={() => refetch()}
            />
          ) : filteredUnits.length === 0 ? (
            <EmptyState
              title={units && units.length > 0 ? 'No units match your search' : 'No units yet'}
              description={
                units && units.length > 0
                  ? 'Try a different search term.'
                  : 'Add your first unit to get started.'
              }
            />
          ) : (
            <UnitTable
              units={filteredUnits}
              onEdit={handleEdit}
              onToggleStatus={setStatusTarget}
            />
          )}
        </CardContent>
      </Card>

      <UnitFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        unit={editingUnit}
        onSubmit={handleFormSubmit}
        isSubmitting={createUnit.isPending || updateUnit.isPending}
      />

      <ConfirmDialog
        open={Boolean(statusTarget)}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        title={statusTarget?.active ? 'Deactivate unit?' : 'Activate unit?'}
        description={
          statusTarget?.active
            ? `"${statusTarget?.name}" will no longer be available for new products.`
            : `"${statusTarget?.name}" will become available for use again.`
        }
        confirmLabel={statusTarget?.active ? 'Deactivate' : 'Activate'}
        onConfirm={handleConfirmStatusChange}
        isLoading={setUnitStatus.isPending}
      />
    </div>
  )
}
