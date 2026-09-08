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
import { RoleFormDialog, type RoleFormValues } from '@/features/roles/components/RoleFormDialog'
import { RoleTable } from '@/features/roles/components/RoleTable'
import {
  useCreateRole,
  useDeleteRole,
  useRolesQuery,
  useSetRoleStatus,
  useUpdateRole,
} from '@/features/roles/hooks/useRoles'
import type { Role } from '@/features/roles/types'

export function RolesPage() {
  const { data: roles, isLoading, isError, refetch } = useRolesQuery()
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const setRoleStatus = useSetRoleStatus()
  const deleteRole = useDeleteRole()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [statusTarget, setStatusTarget] = useState<Role | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)

  const filteredRoles = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (roles ?? []).filter(
      (role) =>
        !term ||
        role.name.toLowerCase().includes(term) ||
        role.description.toLowerCase().includes(term),
    )
  }, [roles, search])

  function handleFormSubmit(values: RoleFormValues) {
    if (editingRole) {
      updateRole.mutate(
        { id: editingRole.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createRole.mutate(values, { onSuccess: () => setFormOpen(false) })
    }
  }

  function handleConfirmStatusChange() {
    if (!statusTarget) return
    setRoleStatus.mutate(
      { id: statusTarget.id, active: !statusTarget.active },
      { onSuccess: () => setStatusTarget(null) },
    )
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteRole.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="Manage the roles used to control access across your bakery operations."
        actions={
          <Button
            onClick={() => {
              setEditingRole(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Add Role
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search roles by name or description..."
            className="max-w-sm"
          />

          {isLoading ? (
            <TableSkeleton columns={4} />
          ) : isError ? (
            <ErrorState description="We could not load roles. Please try again." onRetry={() => refetch()} />
          ) : filteredRoles.length === 0 ? (
            <EmptyState
              title={roles && roles.length > 0 ? 'No roles match your search' : 'No roles yet'}
              description={
                roles && roles.length > 0
                  ? 'Try a different search term.'
                  : 'Add your first role to get started.'
              }
            />
          ) : (
            <RoleTable
              roles={filteredRoles}
              onEdit={(role) => {
                setEditingRole(role)
                setFormOpen(true)
              }}
              onToggleStatus={setStatusTarget}
              onDelete={setDeleteTarget}
            />
          )}
        </CardContent>
      </Card>

      <RoleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        role={editingRole}
        onSubmit={handleFormSubmit}
        isSubmitting={createRole.isPending || updateRole.isPending}
      />
      <ConfirmDialog
        open={Boolean(statusTarget)}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        title={statusTarget?.active ? 'Deactivate role?' : 'Activate role?'}
        description={
          statusTarget?.active
            ? `"${statusTarget?.name}" will no longer be available for use.`
            : `"${statusTarget?.name}" will become available for use again.`
        }
        confirmLabel={statusTarget?.active ? 'Deactivate' : 'Activate'}
        onConfirm={handleConfirmStatusChange}
        isLoading={setRoleStatus.isPending}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete role?"
        description={`This will permanently delete "${deleteTarget?.name}". This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={deleteRole.isPending}
      />
    </div>
  )
}