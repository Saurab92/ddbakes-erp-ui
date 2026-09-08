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
  DepartmentFormDialog,
  type DepartmentFormValues,
} from '@/features/departments/components/DepartmentFormDialog'
import { DepartmentTable } from '@/features/departments/components/DepartmentTable'
import {
  useCreateDepartment,
  useDeleteDepartment,
  useDepartmentsQuery,
  useSetDepartmentStatus,
  useUpdateDepartment,
} from '@/features/departments/hooks/useDepartments'
import type { Department } from '@/features/departments/types'

export function DepartmentsPage() {
  const { data: departments, isLoading, isError, refetch } = useDepartmentsQuery()
  const createDepartment = useCreateDepartment()
  const updateDepartment = useUpdateDepartment()
  const setDepartmentStatus = useSetDepartmentStatus()
  const deleteDepartment = useDeleteDepartment()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [statusTarget, setStatusTarget] = useState<Department | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null)

  const filteredDepartments = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (departments ?? []).filter(
      (department) => !term || department.name.toLowerCase().includes(term),
    )
  }, [departments, search])

  function handleFormSubmit(values: DepartmentFormValues) {
    if (editingDepartment) {
      updateDepartment.mutate(
        { id: editingDepartment.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createDepartment.mutate(values, { onSuccess: () => setFormOpen(false) })
    }
  }

  function handleConfirmStatusChange() {
    if (!statusTarget) return
    setDepartmentStatus.mutate(
      { id: statusTarget.id, active: !statusTarget.active },
      { onSuccess: () => setStatusTarget(null) },
    )
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteDepartment.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Manage the departments used across your bakery operations."
        actions={
          <Button
            onClick={() => {
              setEditingDepartment(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search departments by name..."
            className="max-w-sm"
          />

          {isLoading ? (
            <TableSkeleton columns={3} />
          ) : isError ? (
            <ErrorState
              description="We could not load departments. Please try again."
              onRetry={() => refetch()}
            />
          ) : filteredDepartments.length === 0 ? (
            <EmptyState
              title={
                departments && departments.length > 0
                  ? 'No departments match your search'
                  : 'No departments yet'
              }
              description={
                departments && departments.length > 0
                  ? 'Try a different search term.'
                  : 'Add your first department to get started.'
              }
            />
          ) : (
            <DepartmentTable
              departments={filteredDepartments}
              onEdit={(department) => {
                setEditingDepartment(department)
                setFormOpen(true)
              }}
              onToggleStatus={setStatusTarget}
              onDelete={setDeleteTarget}
            />
          )}
        </CardContent>
      </Card>

      <DepartmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        department={editingDepartment}
        onSubmit={handleFormSubmit}
        isSubmitting={createDepartment.isPending || updateDepartment.isPending}
      />
      <ConfirmDialog
        open={Boolean(statusTarget)}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        title={statusTarget?.active ? 'Deactivate department?' : 'Activate department?'}
        description={
          statusTarget?.active
            ? `"${statusTarget?.name}" will no longer be available for use.`
            : `"${statusTarget?.name}" will become available for use again.`
        }
        confirmLabel={statusTarget?.active ? 'Deactivate' : 'Activate'}
        onConfirm={handleConfirmStatusChange}
        isLoading={setDepartmentStatus.isPending}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete department?"
        description={`This will permanently delete "${deleteTarget?.name}". This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={deleteDepartment.isPending}
      />
    </div>
  )
}