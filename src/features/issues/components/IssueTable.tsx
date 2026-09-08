import { Eye, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Issue } from '@/features/issues/types'

interface IssueTableProps {
  issues: Issue[]
  onEdit: (issue: Issue) => void
  onView: (issue: Issue) => void
}

export function IssueTable({ issues, onEdit, onView }: IssueTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Person</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Items</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell>{issue.issueDate}</TableCell>
            <TableCell className="font-medium">{issue.departmentName}</TableCell>
            <TableCell>{issue.personName}</TableCell>
            <TableCell>{issue.reason}</TableCell>
            <TableCell>{issue.issueItems.length}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`View issue details for ${issue.reason}`}
                  onClick={() => onView(issue)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit issue ${issue.reason}`}
                  onClick={() => onEdit(issue)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
