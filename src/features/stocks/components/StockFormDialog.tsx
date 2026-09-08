import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Combobox } from '@/components/common/Combobox'
import { useProductsQuery } from '@/features/products/hooks/useProducts'
import type { Stock } from '@/features/stocks/types'

const stockFormSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number({ message: 'Quantity must be a number' }).min(0, 'Quantity cannot be negative'),
})

export type StockFormValues = z.output<typeof stockFormSchema>
type StockFormInput = z.input<typeof stockFormSchema>

interface StockFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stock?: Stock | null
  onSubmit: (values: StockFormValues) => void
  isSubmitting?: boolean
}

export function StockFormDialog({
  open,
  onOpenChange,
  stock,
  onSubmit,
  isSubmitting,
}: StockFormDialogProps) {
  const { data: products } = useProductsQuery()
  const isEditing = Boolean(stock)
  const productOptions = (products ?? [])
    .filter((product) => product.active || product.id === stock?.productId)
    .map((product) => ({ value: product.id, label: product.name }))
  const { control, handleSubmit, register, reset, formState: { errors } } =
    useForm<StockFormInput, unknown, StockFormValues>({
      resolver: zodResolver(stockFormSchema),
      defaultValues: { productId: '', quantity: 0 },
    })

  useEffect(() => {
    if (open) reset(stock ? { productId: stock.productId, quantity: stock.quantity } : { productId: '', quantity: 0 })
  }, [open, reset, stock])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Stock' : 'Add Stock'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the available quantity.' : 'Set the initial quantity for a product.'}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="stock-product">Product</Label>
            <Controller control={control} name="productId" render={({ field }) => (
              <Combobox id="stock-product" options={productOptions} value={field.value} onChange={field.onChange} placeholder="Select a product" searchPlaceholder="Search products..." emptyText="No products found." disabled={isEditing} />
            )} />
            {errors.productId && <p className="text-sm text-destructive">{errors.productId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock-quantity">Quantity</Label>
            <Input id="stock-quantity" type="number" min={0} step="1" {...register('quantity')} />
            {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Add stock'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}