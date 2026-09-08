import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Product } from '@/features/products/types'
import type { Stock } from '@/features/stocks/types'

interface StockTableProps {
  stocks: Stock[]
  products: Product[]
  onEdit: (stock: Stock) => void
  onDelete: (stock: Stock) => void
}

export function StockTable({ stocks, products, onEdit, onDelete }: StockTableProps) {
  return (
    <Table>
      <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Unit</TableHead><TableHead className="text-right">Quantity</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
      <TableBody>{stocks.map((stock) => {
        const product = products.find((item) => item.id === stock.productId)
        const productName = stock.productName ?? product?.name ?? `Product #${stock.productId}`
        const categoryName = stock.categoryName ?? product?.categoryName ?? '-'
        return <TableRow key={stock.id}><TableCell className="font-medium">{productName}</TableCell><TableCell>{categoryName}</TableCell><TableCell>{product?.unitName ?? '-'}</TableCell><TableCell className="text-right">{stock.quantity}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" aria-label={`Edit ${productName} stock`} onClick={() => onEdit(stock)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label={`Delete ${productName} stock`} onClick={() => onDelete(stock)}><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>
      })}</TableBody>
    </Table>
  )
}