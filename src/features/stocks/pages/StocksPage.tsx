import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { SearchInput } from '@/components/common/SearchInput'
import { TableSkeleton } from '@/components/common/TableSkeleton'
import { StockFormDialog, type StockFormValues } from '@/features/stocks/components/StockFormDialog'
import { StockTable } from '@/features/stocks/components/StockTable'
import { useCreateStock, useDeleteStock, useStocksByProductQueries, useUpdateStock } from '@/features/stocks/hooks/useStocks'
import { useProductsQuery } from '@/features/products/hooks/useProducts'
import { useCategoriesQuery } from '@/features/categories/hooks/useCategories'
import type { Stock } from '@/features/stocks/types'

export function StocksPage() {
  const { data: products } = useProductsQuery()
  const { data: categories } = useCategoriesQuery()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingStock, setEditingStock] = useState<Stock | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Stock | null>(null)
  const stockQueries = useStocksByProductQueries((products ?? []).map((product) => product.id))
  const createStock = useCreateStock()
  const updateStock = useUpdateStock()
  const deleteStock = useDeleteStock()
  const stocks = useMemo(
    () => stockQueries.flatMap((query) => (query.data ? [query.data] : [])),
    [stockQueries],
  )
  const filteredStocks = useMemo(() => {
    const term = search.trim().toLowerCase()
    return stocks.filter((stock) => {
      const product = products?.find((item) => item.id === stock.productId)
      const matchesSearch = !term || (stock.productName ?? product?.name ?? '').toLowerCase().includes(term)
      const matchesCategory = categoryFilter === 'all' || (product?.categoryId ?? stock.categoryId) === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [categoryFilter, products, search, stocks])
  const isLoading = Boolean(products) && stockQueries.some((query) => query.isLoading)
  const hasError = stockQueries.some((query) => query.isError)

  function handleSubmit(values: StockFormValues) {
    if (editingStock) {
      updateStock.mutate({ id: editingStock.id, input: { quantity: values.quantity } }, { onSuccess: () => setFormOpen(false) })
    } else {
      createStock.mutate(values, { onSuccess: () => setFormOpen(false) })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Stock" description="View and maintain product stock quantities." actions={<Button onClick={() => { setEditingStock(null); setFormOpen(true) }}><Plus className="h-4 w-4" />Add Stock</Button>} />
      <Card><CardContent className="space-y-4 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><SearchInput value={searchInput} onChange={setSearchInput} placeholder="Search stocks by product..." className="max-w-sm" /><Button variant="secondary" onClick={() => setSearch(searchInput)}><Search className="h-4 w-4" />Search</Button><Select value={categoryFilter} onValueChange={setCategoryFilter}><SelectTrigger className="sm:w-48"><SelectValue placeholder="Filter by category" /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{(categories ?? []).map((category) => (<SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>))}</SelectContent></Select></div>
        {!products?.length ? <EmptyState title="No products available" description="Create a product before recording stock." /> : isLoading ? <TableSkeleton columns={5} /> : hasError ? <ErrorState description="We could not load all stock records. Please try again." onRetry={() => stockQueries.forEach((query) => query.refetch())} /> : filteredStocks.length > 0 ? <StockTable stocks={filteredStocks} products={products} onEdit={(stock) => { setEditingStock(stock); setFormOpen(true) }} onDelete={setDeleteTarget} /> : <EmptyState title={stocks.length ? 'No stocks match your filters' : 'No stock records yet'} description={stocks.length ? 'Try a different product name or category filter.' : 'Add stock to start tracking product quantities.'} />}
      </CardContent></Card>
      <StockFormDialog open={formOpen} onOpenChange={setFormOpen} stock={editingStock} onSubmit={handleSubmit} isSubmitting={createStock.isPending || updateStock.isPending} />
      <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete stock record?" description="This will permanently remove the selected stock record." confirmLabel="Delete" onConfirm={() => deleteTarget && deleteStock.mutate(deleteTarget, { onSuccess: () => setDeleteTarget(null) })} isLoading={deleteStock.isPending} />
    </div>
  )
}