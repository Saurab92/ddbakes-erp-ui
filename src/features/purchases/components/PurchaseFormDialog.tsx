import { useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'
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
import { useSuppliersQuery } from '@/features/suppliers/hooks/useSuppliers'
import type { Purchase } from '@/features/purchases/types'

const purchaseItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce
    .number({ message: 'Quantity must be a number' })
    .positive('Quantity must be greater than 0'),
  unitPrice: z.coerce
    .number({ message: 'Unit price must be a number' })
    .min(0, 'Unit price cannot be negative'),
})

const purchaseFormSchema = z.object({
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  supplierId: z.string().min(1, 'Supplier is required'),
  invoiceNumber: z
    .string()
    .trim()
    .min(1, 'Invoice number is required')
    .max(100, 'Invoice number must be at most 100 characters'),
  remarks: z.string().trim().max(500, 'Remarks must be at most 500 characters').optional(),
  purchaseItems: z.array(purchaseItemSchema).min(1, 'Add at least one item'),
})

export type PurchaseFormValues = z.output<typeof purchaseFormSchema>
type PurchaseFormInput = z.input<typeof purchaseFormSchema>

interface PurchaseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchase?: Purchase | null
  onSubmit: (values: PurchaseFormValues) => void
  isSubmitting?: boolean
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

const emptyItem = { productId: '', quantity: 1, unitPrice: 0 }

export function PurchaseFormDialog({
  open,
  onOpenChange,
  purchase,
  onSubmit,
  isSubmitting,
}: PurchaseFormDialogProps) {
  const isEditing = Boolean(purchase)
  const { data: products } = useProductsQuery()
  const productOptions = (products ?? []).map((product) => ({
    value: product.id,
    label: product.name,
  }))
  const { data: suppliers } = useSuppliersQuery()
  const supplierOptions = (suppliers ?? []).map((supplier) => ({
    value: supplier.id,
    label: supplier.name,
  }))

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<PurchaseFormInput, unknown, PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      purchaseDate: today(),
      supplierId: '',
      invoiceNumber: '',
      remarks: '',
      purchaseItems: [emptyItem],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'purchaseItems' })
  const items = watch('purchaseItems')
  const grandTotal = (items ?? []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  )

  useEffect(() => {
    if (open) {
      reset(
        purchase
          ? {
              purchaseDate: purchase.purchaseDate,
              supplierId: purchase.supplierId,
              invoiceNumber: purchase.invoiceNumber,
              remarks: purchase.remarks ?? '',
              purchaseItems: purchase.purchaseItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
            }
          : {
              purchaseDate: today(),
              supplierId: '',
              invoiceNumber: '',
              remarks: '',
              purchaseItems: [emptyItem],
            },
      )
    }
  }, [open, purchase, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Purchase' : 'Add Purchase'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details for this purchase.'
              : 'Record a new purchase and its line items.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="purchase-date">Purchase Date</Label>
              <Input id="purchase-date" type="date" {...register('purchaseDate')} />
              {errors.purchaseDate && (
                <p className="text-sm text-destructive">{errors.purchaseDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase-invoice-number">Invoice Number</Label>
              <Input
                id="purchase-invoice-number"
                placeholder="e.g. INV-1001"
                {...register('invoiceNumber')}
              />
              {errors.invoiceNumber && (
                <p className="text-sm text-destructive">{errors.invoiceNumber.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="purchase-supplier">Supplier</Label>
              <Controller
                control={control}
                name="supplierId"
                render={({ field: supplierField }) => (
                  <Combobox
                    options={supplierOptions}
                    value={supplierField.value}
                    onChange={supplierField.onChange}
                    placeholder="Select a supplier"
                    searchPlaceholder="Search suppliers..."
                    emptyText="No suppliers found."
                  />
                )}
              />
              {errors.supplierId && (
                <p className="text-sm text-destructive">{errors.supplierId.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="purchase-remarks">Remarks</Label>
              <Input
                id="purchase-remarks"
                placeholder="Optional notes"
                {...register('remarks')}
              />
              {errors.remarks && (
                <p className="text-sm text-destructive">{errors.remarks.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Purchase Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append(emptyItem)}
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-2 rounded-md border p-3 sm:grid-cols-[1fr_100px_110px_auto] sm:items-start"
                >
                  <div className="space-y-1">
                    <Controller
                      control={control}
                      name={`purchaseItems.${index}.productId`}
                      render={({ field: productField }) => (
                        <Combobox
                          options={productOptions}
                          value={productField.value}
                          onChange={productField.onChange}
                          placeholder="Select a product"
                          searchPlaceholder="Search products..."
                          emptyText="No products found."
                        />
                      )}
                    />
                    {errors.purchaseItems?.[index]?.productId && (
                      <p className="text-sm text-destructive">
                        {errors.purchaseItems[index]?.productId?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Input
                      type="number"
                      min={0}
                      step="1"
                      placeholder="Qty"
                      {...register(`purchaseItems.${index}.quantity`)}
                    />
                    {errors.purchaseItems?.[index]?.quantity && (
                      <p className="text-sm text-destructive">
                        {errors.purchaseItems[index]?.quantity?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="Unit price"
                      {...register(`purchaseItems.${index}.unitPrice`)}
                    />
                    {errors.purchaseItems?.[index]?.unitPrice && (
                      <p className="text-sm text-destructive">
                        {errors.purchaseItems[index]?.unitPrice?.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove item"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {errors.purchaseItems?.root && (
              <p className="text-sm text-destructive">{errors.purchaseItems.root.message}</p>
            )}

            <p className="text-right text-sm font-medium">
              Total: {grandTotal.toFixed(2)}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add purchase'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
