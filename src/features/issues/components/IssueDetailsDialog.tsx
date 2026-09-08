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
import type { Issue } from '@/features/issues/types'

interface IssueDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  issue: Issue | null
}

export function IssueDetailsDialog({ open, onOpenChange, issue }: IssueDetailsDialogProps) {
  const { data: products } = useProductsQuery()

  const productMap = useMemo(() => {
    const map = new Map<string, string>()
    if (products) {
      for (const product of products) {
        map.set(product.id, product.name)
      }
    }
    return map
  }, [products])

  if (!issue) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Issue Details</DialogTitle>
          <DialogDescription>Issue record for {issue.reason}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Date</p>
              <p className="text-sm font-semibold">{issue.issueDate}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Department</p>
              <p className="text-sm font-semibold">{issue.departmentName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Person</p>
              <p className="text-sm font-semibold">{issue.personName}</p>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <p className="text-xs font-medium text-muted-foreground">Reason</p>
              <p className="text-sm font-semibold">{issue.reason}</p>
            </div>
            {issue.remarks && (
              <div className="col-span-2 sm:col-span-3">
                <p className="text-xs font-medium text-muted-foreground">Remarks</p>
                <p className="text-sm text-foreground">{issue.remarks}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Issue Items</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issue.issueItems.map((item, index) => (
                    <TableRow key={`${item.productId}-${index}`}>
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {item.productName || productMap.get(item.productId) || `Product #${item.productId}`}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
