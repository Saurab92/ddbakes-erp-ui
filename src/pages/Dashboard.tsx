import { useState } from 'react'
import { AlertTriangle, DollarSign, Package, Ruler } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ErrorState } from '@/components/common/ErrorState'
import { TableSkeleton } from '@/components/common/TableSkeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLowStockQuery } from '@/features/stocks/hooks/useStocks'
import { useProductsQuery } from '@/features/products/hooks/useProducts'

// Mock summary data until the Spring Boot dashboard API is available.
const summaryCards = [
  {
    label: 'Total Products',
    value: '24',
    icon: Package,
  },
  {
    label: 'Purchased History',
    value: '6',
    icon: Ruler,
  },
  {
    label: 'Low Stock Items',
    value: '3',
    icon: AlertTriangle,
  },
  {
    label: 'Issued Items History',
    value: '$12,480',
    icon: DollarSign,
  },
]

export function Dashboard() {
  const [showLowStock, setShowLowStock] = useState(true)
  const [showProducts, setShowProducts] = useState(false)
  const lowStockQuery = useLowStockQuery()
  const productsQuery = useProductsQuery()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your bakery inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const isLowStock = card.label === 'Low Stock Items'
          const isTotalProducts = card.label === 'Total Products'
          const isClickable = isLowStock || isTotalProducts
          const toggle = isLowStock
            ? () => {
                setShowProducts(false)
                setShowLowStock((visible) => !visible)
              }
            : isTotalProducts
            ? () => {
                setShowLowStock(false)
                setShowProducts((visible) => !visible)
              }
            : undefined
          return (
          <Card
            key={card.label}
            className={isClickable ? 'cursor-pointer transition-colors hover:bg-muted/50' : undefined}
            onClick={toggle}
            onKeyDown={toggle ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') toggle()
            } : undefined}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{card.label}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {isLowStock
                  ? (lowStockQuery.data?.count ?? (lowStockQuery.isLoading ? '...' : '0'))
                  : isTotalProducts
                  ? (productsQuery.isLoading
                      ? '...'
                      : productsQuery.isError
                      ? '-'
                      : (productsQuery.data?.length ?? 0))
                  : card.value}
              </div>
            </CardContent>
            </Card>
            )
          })}
      </div>

        {showLowStock && (
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockQuery.isLoading ? (
                <TableSkeleton columns={4} rows={3} />
              ) : lowStockQuery.isError ? (
                <ErrorState message={lowStockQuery.error.message} />
              ) : lowStockQuery.data?.items.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No low-stock items found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockQuery.data?.items.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell className="font-medium">{stock.productName ?? `Product #${stock.productId}`}</TableCell>
                        <TableCell>{stock.categoryName ?? '-'}</TableCell>
                        <TableCell>{stock.unitName ?? '-'}</TableCell>
                        <TableCell className="text-right">{stock.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {showProducts && (
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              {productsQuery.isLoading ? (
                <TableSkeleton columns={5} rows={3} />
              ) : productsQuery.isError ? (
                <ErrorState message={productsQuery.error.message} />
              ) : productsQuery.data?.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No products found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Minimum Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productsQuery.data?.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.categoryName ?? '-'}</TableCell>
                        <TableCell>{product.unitName ?? '-'}</TableCell>
                        <TableCell className="text-right">{product.minimumStock}</TableCell>
                        <TableCell>{product.active ? 'Active' : 'Inactive'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

    </div>
  )
}
