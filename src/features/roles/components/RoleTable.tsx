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
import type { Role } from '@/features/roles/types'

interface RoleTableProps {
  roles: Role[]
  onEdit: (role: Role) => void
  onToggleStatus: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RoleTable({ roles, onEdit, onToggleStatus, onDelete }: RoleTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.id}>
            <TableCell className="font-medium">{role.name}</TableCell>
            <TableCell className="text-muted-foreground">{role.description}</TableCell>
            <TableCell>
              <Badge variant={role.active ? 'success' : 'secondary'}>
                {role.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" aria-label={`Edit ${role.name}`} onClick={() => onEdit(role)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={role.active ? `Deactivate ${role.name}` : `Activate ${role.name}`}
                  onClick={() => onToggleStatus(role)}
                >
                  {role.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" aria-label={`Delete ${role.name}`} onClick={() => onDelete(role)}>
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