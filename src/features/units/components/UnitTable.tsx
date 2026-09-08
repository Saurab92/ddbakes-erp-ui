import { Pencil, Power, PowerOff } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Unit } from '@/features/units/types'

interface UnitTableProps {
  units: Unit[]
  onEdit: (unit: Unit) => void
  onToggleStatus: (unit: Unit) => void
}

export function UnitTable({ units, onEdit, onToggleStatus }: UnitTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {units.map((unit) => (
          <TableRow key={unit.id}>
            <TableCell className="font-medium">{unit.name}</TableCell>
            <TableCell>{unit.code}</TableCell>
            <TableCell>
              <Badge variant={unit.active ? 'success' : 'secondary'}>
                {unit.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${unit.name}`}
                  onClick={() => onEdit(unit)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={unit.active ? `Deactivate ${unit.name}` : `Activate ${unit.name}`}
                  onClick={() => onToggleStatus(unit)}
                >
                  {unit.active ? (
                    <PowerOff className="h-4 w-4" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
