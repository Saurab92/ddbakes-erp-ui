import { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useProductsQuery } from '@/features/products/hooks/useProducts'
import type { Purchase } from '@/features/purchases/types'

interface PurchaseDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchase: Purchase | null
}

export function PurchaseDetailsDialog({
  open,
  onOpenChange,
  purchase,
}: PurchaseDetailsDialogProps) {
  const { data: products } = useProductsQuery()

  const productMap = useMemo(() => {
    const map = new Map<string, string>()
    if (products) {
      for (const prod of products) {
        map.set(prod.id, prod.name)
      }
    }
    return map
  }, [products])

  if (!purchase) return null

  const grandTotal =
    purchase.totalAmount ??
    purchase.purchaseItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Purchase Details</DialogTitle>
          <DialogDescription>
            Invoice #{purchase.invoiceNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Summary Details */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Date</p>
              <p className="text-sm font-semibold">{purchase.purchaseDate}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Invoice #</p>
              <p className="text-sm font-semibold">{purchase.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Supplier</p>
              <p className="text-sm font-semibold">{purchase.supplierName}</p>
            </div>
            {purchase.remarks && (
              <div className="col-span-2 sm:col-span-3">
                <p className="text-xs font-medium text-muted-foreground">Remarks</p>
                <p className="text-sm text-foreground">{purchase.remarks}</p>
              </div>
            )}
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Purchase Items</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase.purchaseItems.map((item, index) => {
                    const productName =
                      item.productName ||
                      productMap.get(item.productId) ||
                      `Product #${item.productId}`
                    const lineTotal =
                      item.totalPrice ?? item.quantity * item.unitPrice

                    return (
                      <TableRow key={index}>
                        <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="font-medium">{productName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          ${item.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${lineTotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end border-t pt-3">
            <div className="text-right">
              <span className="text-sm font-medium text-muted-foreground mr-2">
                Grand Total:
              </span>
              <span className="text-lg font-bold text-foreground">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
