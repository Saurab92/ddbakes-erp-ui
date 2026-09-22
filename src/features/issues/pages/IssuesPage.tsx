import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { SearchInput } from '@/components/common/SearchInput'
import { TableSkeleton } from '@/components/common/TableSkeleton'
import { IssueDetailsDialog } from '@/features/issues/components/IssueDetailsDialog'
import { IssueFormDialog, type IssueFormValues } from '@/features/issues/components/IssueFormDialog'
import { IssueTable } from '@/features/issues/components/IssueTable'
import { useCreateIssue, useIssuesQuery, useUpdateIssue } from '@/features/issues/hooks/useIssues'
import type { Issue } from '@/features/issues/types'

export function IssuesPage() {
  const pageSize = 10
  const [page, setPage] = useState(0)
  const { data, isLoading, isError, refetch } = useIssuesQuery(page, pageSize)
  const createIssue = useCreateIssue()
  const updateIssue = useUpdateIssue()

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [viewingIssue, setViewingIssue] = useState<Issue | null>(null)

  const issues = data?.issues

  const filteredIssues = useMemo(() => {
    if (!issues) return []
    const term = search.trim().toLowerCase()
    if (!term) return issues

    return issues.filter((issue) => {
      const departmentMatch = issue.departmentName.toLowerCase().includes(term)
      const personMatch = issue.personName.toLowerCase().includes(term)
      const reasonMatch = issue.reason.toLowerCase().includes(term)
      return departmentMatch || personMatch || reasonMatch
    })
  }, [issues, search])

  function handleAdd() {
    setEditingIssue(null)
    setFormOpen(true)
  }

  function handleEdit(issue: Issue) {
    setEditingIssue(issue)
    setFormOpen(true)
  }

  function handleView(issue: Issue) {
    setViewingIssue(issue)
  }

  function handleFormSubmit(values: IssueFormValues) {
    if (editingIssue) {
      updateIssue.mutate(
        { id: editingIssue.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createIssue.mutate(values, { onSuccess: () => setFormOpen(false) })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Issue Inventory"
        description="Track items issued to departments and people."
        actions={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Add Issue
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(0)
            }}
            placeholder="Search by department, person, or reason..."
            className="max-w-sm"
          />

          {isLoading ? (
            <TableSkeleton columns={6} />
          ) : isError ? (
            <ErrorState
              description="We could not load issue inventory records. Please try again."
              onRetry={() => refetch()}
            />
          ) : filteredIssues.length === 0 ? (
            <EmptyState
              title={data && data.totalElements > 0 ? 'No issues match your search' : 'No issues yet'}
              description={
                data && data.totalElements > 0
                  ? 'Try adjusting your search.'
                  : 'Add your first issue to get started.'
              }
            />
          ) : (
            <IssueTable
              issues={filteredIssues}
              onEdit={handleEdit}
              onView={handleView}
            />
          )}

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Page {page + 1} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                  disabled={page === 0 || isLoading}
                >
                  <ChevronLeft />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  disabled={page + 1 >= data.totalPages || isLoading}
                >
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <IssueFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        issue={editingIssue}
        onSubmit={handleFormSubmit}
        isSubmitting={createIssue.isPending || updateIssue.isPending}
      />

      <IssueDetailsDialog
        open={Boolean(viewingIssue)}
        onOpenChange={(open) => !open && setViewingIssue(null)}
        issue={viewingIssue}
      />
    </div>
  )
}
