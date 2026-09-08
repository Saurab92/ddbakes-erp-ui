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
import type { Supplier } from '@/features/suppliers/types'

interface SupplierTableProps {
  suppliers: Supplier[]
  onEdit: (supplier: Supplier) => void
  onToggleStatus: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}

export function SupplierTable({ suppliers, onEdit, onToggleStatus, onDelete }: SupplierTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact person</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell className="font-medium">{supplier.name}</TableCell>
            <TableCell>{supplier.contactPerson || '-'}</TableCell>
            <TableCell>{supplier.phone || '-'}</TableCell>
            <TableCell>{supplier.email || '-'}</TableCell>
            <TableCell>
              <Badge variant={supplier.active ? 'success' : 'secondary'}>
                {supplier.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" aria-label={`Edit ${supplier.name}`} onClick={() => onEdit(supplier)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={supplier.active ? `Deactivate ${supplier.name}` : `Activate ${supplier.name}`}
                  onClick={() => onToggleStatus(supplier)}
                >
                  {supplier.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" aria-label={`Delete ${supplier.name}`} onClick={() => onDelete(supplier)}>
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