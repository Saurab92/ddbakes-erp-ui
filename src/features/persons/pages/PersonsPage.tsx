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
import { PersonFormDialog, type PersonFormValues } from '@/features/persons/components/PersonFormDialog'
import { PersonTable } from '@/features/persons/components/PersonTable'
import { useDepartmentsQuery } from '@/features/departments/hooks/useDepartments'
import {
  useCreatePerson,
  useDeactivatePerson,
  useDeletePerson,
  usePersonsQuery,
  useUpdatePerson,
} from '@/features/persons/hooks/usePersons'
import type { Person } from '@/features/persons/types'

export function PersonsPage() {
  const { data: persons, isLoading, isError, refetch } = usePersonsQuery()
  const { data: departments } = useDepartmentsQuery()
  const createPerson = useCreatePerson()
  const updatePerson = useUpdatePerson()
  const deactivatePerson = useDeactivatePerson()
  const deletePerson = useDeletePerson()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<Person | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null)

  const filteredPersons = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (persons ?? []).filter((person) => !term || person.name.toLowerCase().includes(term))
  }, [persons, search])
  const departmentNames = useMemo(
    () => new Map((departments ?? []).map((department) => [department.id, department.name])),
    [departments],
  )

  function handleFormSubmit(values: PersonFormValues) {
    if (editingPerson) {
      updatePerson.mutate({ id: editingPerson.id, input: values }, { onSuccess: () => setFormOpen(false) })
    } else {
      createPerson.mutate(values, { onSuccess: () => setFormOpen(false) })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Persons"
        description="Manage people who receive inventory items."
        actions={
          <Button onClick={() => { setEditingPerson(null); setFormOpen(true) }}>
            <Plus className="h-4 w-4" />
            Add Person
          </Button>
        }
      />
      <Card>
        <CardContent className="space-y-4 p-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search persons by name..." className="max-w-sm" />
          {isLoading ? <TableSkeleton columns={4} /> : isError ? (
            <ErrorState description="We could not load persons. Please try again." onRetry={() => refetch()} />
          ) : filteredPersons.length === 0 ? (
            <EmptyState
              title={persons && persons.length > 0 ? 'No persons match your search' : 'No persons yet'}
              description={persons && persons.length > 0 ? 'Try a different search term.' : 'Add your first person to get started.'}
            />
          ) : (
            <PersonTable
              persons={filteredPersons}
              departmentNames={departmentNames}
              onEdit={(person) => { setEditingPerson(person); setFormOpen(true) }}
              onDeactivate={setDeactivateTarget}
              onDelete={setDeleteTarget}
            />
          )}
        </CardContent>
      </Card>
      <PersonFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        person={editingPerson}
        onSubmit={handleFormSubmit}
        isSubmitting={createPerson.isPending || updatePerson.isPending}
      />
      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title="Deactivate person?"
        description={`"${deactivateTarget?.name}" will no longer be available for issue inventory.`}
        confirmLabel="Deactivate"
        onConfirm={() => deactivateTarget && deactivatePerson.mutate(deactivateTarget.id, { onSuccess: () => setDeactivateTarget(null) })}
        isLoading={deactivatePerson.isPending}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete person?"
        description={`This will permanently delete "${deleteTarget?.name}". This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deletePerson.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
        isLoading={deletePerson.isPending}
      />
    </div>
  )
}