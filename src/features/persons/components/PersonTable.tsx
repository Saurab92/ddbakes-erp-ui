import { Pencil, PowerOff, Trash2 } from 'lucide-react'
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
import type { Person } from '@/features/persons/types'

interface PersonTableProps {
  persons: Person[]
  departmentNames: Map<string, string>
  onEdit: (person: Person) => void
  onDeactivate: (person: Person) => void
  onDelete: (person: Person) => void
}

export function PersonTable({ persons, departmentNames, onEdit, onDeactivate, onDelete }: PersonTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {persons.map((person) => (
          <TableRow key={person.id}>
            <TableCell className="font-medium">{person.name}</TableCell>
            <TableCell>{departmentNames.get(person.departmentId) ?? `Department #${person.departmentId}`}</TableCell>
            <TableCell>
              <Badge variant={person.active ? 'success' : 'secondary'}>
                {person.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" aria-label={`Edit ${person.name}`} onClick={() => onEdit(person)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                {person.active && (
                  <Button variant="ghost" size="icon" aria-label={`Deactivate ${person.name}`} onClick={() => onDeactivate(person)}>
                    <PowerOff className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" aria-label={`Delete ${person.name}`} onClick={() => onDelete(person)}>
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