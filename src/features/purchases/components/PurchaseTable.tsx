import { Eye, Pencil } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { Purchase } from '@/features/purchases/types'

interface PurchaseTableProps {
  purchases: Purchase[]
  onEdit: (purchase: Purchase) => void
  onView: (purchase: Purchase) => void
}

function totalOf(purchase: Purchase) {
  if (purchase.totalAmount !== undefined) return purchase.totalAmount
  return purchase.purchaseItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  )
}

export function PurchaseTable({ purchases, onEdit, onView }: PurchaseTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Invoice #</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.map((purchase) => (
          <TableRow key={purchase.id}>
            <TableCell>{purchase.purchaseDate}</TableCell>
            <TableCell className="font-medium">{purchase.supplierName}</TableCell>
            <TableCell>{purchase.invoiceNumber}</TableCell>
            <TableCell>{purchase.purchaseItems.length}</TableCell>
            <TableCell>{totalOf(purchase).toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`View purchase details for ${purchase.invoiceNumber}`}
                  onClick={() => onView(purchase)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit purchase ${purchase.invoiceNumber}`}
                  onClick={() => onEdit(purchase)}
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
