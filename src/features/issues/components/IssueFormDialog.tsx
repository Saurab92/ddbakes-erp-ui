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
import { useDepartmentsQuery } from '@/features/departments/hooks/useDepartments'
import { usePersonsQuery } from '@/features/persons/hooks/usePersons'
import { useProductsQuery } from '@/features/products/hooks/useProducts'
import type { Issue } from '@/features/issues/types'

const issueItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce
    .number({ message: 'Quantity must be a number' })
    .positive('Quantity must be greater than 0'),
})

const issueFormSchema = z.object({
  issueDate: z.string().min(1, 'Issue date is required'),
  departmentId: z.string().min(1, 'Department is required'),
  personId: z.string().min(1, 'Person is required'),
  reason: z.string().trim().min(1, 'Reason is required').max(200, 'Reason must be at most 200 characters'),
  remarks: z.string().trim().max(500, 'Remarks must be at most 500 characters').optional(),
  issueItems: z.array(issueItemSchema).min(1, 'Add at least one item'),
})

export type IssueFormValues = z.output<typeof issueFormSchema>
type IssueFormInput = z.input<typeof issueFormSchema>

interface IssueFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  issue?: Issue | null
  onSubmit: (values: IssueFormValues) => void
  isSubmitting?: boolean
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

const emptyItem = { productId: '', quantity: 1 }

export function IssueFormDialog({
  open,
  onOpenChange,
  issue,
  onSubmit,
  isSubmitting,
}: IssueFormDialogProps) {
  const isEditing = Boolean(issue)
  const { data: departments } = useDepartmentsQuery()
  const { data: persons } = usePersonsQuery()
  const { data: products } = useProductsQuery()

  const departmentOptions = (departments ?? []).map((dept) => ({
    value: dept.id,
    label: dept.name,
  }))

  const personOptions = (persons ?? []).map((person) => ({
    value: person.id,
    label: person.name,
  }))

  const productOptions = (products ?? []).map((product) => ({
    value: product.id,
    label: product.name,
  }))

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<IssueFormInput, unknown, IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      issueDate: today(),
      departmentId: '',
      personId: '',
      reason: '',
      remarks: '',
      issueItems: [emptyItem],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'issueItems' })
  const items = watch('issueItems')

  useEffect(() => {
    if (open) {
      reset(
        issue
          ? {
              issueDate: issue.issueDate,
              departmentId: issue.departmentId,
              personId: issue.personId,
              reason: issue.reason,
              remarks: issue.remarks ?? '',
              issueItems: issue.issueItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            }
          : {
              issueDate: today(),
              departmentId: '',
              personId: '',
              reason: '',
              remarks: '',
              issueItems: [emptyItem],
            },
      )
    }
  }, [open, issue, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Issue' : 'Add Issue'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details for this issue inventory record.'
              : 'Record a new issue against a department and person.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="issue-date">Issue Date</Label>
              <Input id="issue-date" type="date" {...register('issueDate')} />
              {errors.issueDate && (
                <p className="text-sm text-destructive">{errors.issueDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue-reason">Reason</Label>
              <Input
                id="issue-reason"
                placeholder="e.g. Production requirement"
                {...register('reason')}
              />
              {errors.reason && (
                <p className="text-sm text-destructive">{errors.reason.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="issue-department">Department</Label>
              <Controller
                control={control}
                name="departmentId"
                render={({ field: departmentField }) => (
                  <Combobox
                    options={departmentOptions}
                    value={departmentField.value}
                    onChange={departmentField.onChange}
                    placeholder="Select a department"
                    searchPlaceholder="Search departments..."
                    emptyText="No departments found."
                  />
                )}
              />
              {errors.departmentId && (
                <p className="text-sm text-destructive">{errors.departmentId.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="issue-person">Person</Label>
              <Controller
                control={control}
                name="personId"
                render={({ field: personField }) => (
                  <Combobox
                    options={personOptions}
                    value={personField.value}
                    onChange={personField.onChange}
                    placeholder="Select a person"
                    searchPlaceholder="Search persons..."
                    emptyText="No persons found."
                  />
                )}
              />
              {errors.personId && (
                <p className="text-sm text-destructive">{errors.personId.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="issue-remarks">Remarks</Label>
              <Input
                id="issue-remarks"
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
              <Label>Issue Items</Label>
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
                  className="grid grid-cols-1 gap-2 rounded-md border p-3 sm:grid-cols-[1fr_100px_auto] sm:items-start"
                >
                  <div className="space-y-1">
                    <Controller
                      control={control}
                      name={`issueItems.${index}.productId`}
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
                    {errors.issueItems?.[index]?.productId && (
                      <p className="text-sm text-destructive">
                        {errors.issueItems[index]?.productId?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Input
                      type="number"
                      min={0}
                      step="1"
                      placeholder="Qty"
                      {...register(`issueItems.${index}.quantity`)}
                    />
                    {errors.issueItems?.[index]?.quantity && (
                      <p className="text-sm text-destructive">
                        {errors.issueItems[index]?.quantity?.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    aria-label={`Remove issue item ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {errors.issueItems && typeof errors.issueItems.message === 'string' && (
              <p className="text-sm text-destructive">{errors.issueItems.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Issue' : 'Create Issue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
