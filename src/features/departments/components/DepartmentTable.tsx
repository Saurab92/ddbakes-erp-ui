import { Pencil, Power, PowerOff, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Department } from '@/features/departments/types'

interface DepartmentTableProps {
  departments: Department[]
  onEdit: (department: Department) => void
  onToggleStatus: (department: Department) => void
  onDelete: (department: Department) => void
}

export function DepartmentTable({
  departments,
  onEdit,
  onToggleStatus,
  onDelete,
}: DepartmentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((department) => (
          <TableRow key={department.id}>
            <TableCell className="font-medium">{department.name}</TableCell>
            <TableCell>
              <Badge variant={department.active ? 'success' : 'secondary'}>
                {department.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${department.name}`}
                  onClick={() => onEdit(department)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={
                    department.active
                      ? `Deactivate ${department.name}`
                      : `Activate ${department.name}`
                  }
                  onClick={() => onToggleStatus(department)}
                >
                  {department.active ? (
                    <PowerOff className="h-4 w-4" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${department.name}`}
                  onClick={() => onDelete(department)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}