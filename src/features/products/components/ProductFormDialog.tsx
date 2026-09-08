import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Combobox } from '@/components/common/Combobox'
import { useUnitsQuery } from '@/features/units/hooks/useUnits'
import { useCategoriesQuery } from '@/features/categories/hooks/useCategories'
import type { Product } from '@/features/products/types'

const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be at most 100 characters'),
  unitId: z.string().min(1, 'Unit is required'),
  categoryId: z.string().min(1, 'Category is required'),
  minimumStock: z.coerce
    .number({ message: 'Minimum stock must be a number' })
    .min(0, 'Minimum stock cannot be negative'),
  active: z.boolean(),
})

export type ProductFormValues = z.output<typeof productFormSchema>
type ProductFormInput = z.input<typeof productFormSchema>

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSubmit: (values: ProductFormValues) => void
  isSubmitting?: boolean
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isSubmitting,
}: ProductFormDialogProps) {
  const isEditing = Boolean(product)
  const { data: units } = useUnitsQuery()
  const { data: categories } = useCategoriesQuery()
  const activeUnitOptions = (units ?? [])
    .filter((unit) => unit.active || unit.id === product?.unitId)
    .map((unit) => ({ value: unit.id, label: `${unit.name} (${unit.code})` }))
  const activeCategoryOptions = (categories ?? [])
    .filter((category) => category.active || category.id === product?.categoryId)
    .map((category) => ({ value: category.id, label: category.name }))

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { name: '', unitId: '', categoryId: '', minimumStock: 0, active: true },
  })

  useEffect(() => {
    if (open) {
      reset(
        product
          ? {
              name: product.name,
              unitId: product.unitId,
              categoryId: product.categoryId,
              minimumStock: product.minimumStock,
              active: product.active,
            }
          : { name: '', unitId: '', categoryId: '', minimumStock: 0, active: true },
      )
    }
  }, [open, product, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details for this product.'
              : 'Create a new product tracked in inventory.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              placeholder="e.g. Sugar"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-unit">Unit</Label>
            <Controller
              control={control}
              name="unitId"
              render={({ field }) => (
                <Combobox
                  id="product-unit"
                  options={activeUnitOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a unit"
                  searchPlaceholder="Search units..."
                  emptyText="No units found."
                />
              )}
            />
            {errors.unitId && (
              <p className="text-sm text-destructive">{errors.unitId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-category">Category</Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Combobox
                  id="product-category"
                  options={activeCategoryOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a category"
                  searchPlaceholder="Search categories..."
                  emptyText="No categories found."
                />
              )}
            />
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-minimum-stock">Minimum Stock</Label>
            <Input
              id="product-minimum-stock"
              type="number"
              min={0}
              step="1"
              {...register('minimumStock')}
            />
            {errors.minimumStock && (
              <p className="text-sm text-destructive">
                {errors.minimumStock.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <Checkbox
                  id="product-active"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              )}
            />
            <Label htmlFor="product-active" className="font-normal">
              Active
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
