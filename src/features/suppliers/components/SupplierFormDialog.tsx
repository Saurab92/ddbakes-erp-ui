import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Supplier } from '@/features/suppliers/types'

const optionalText = (label: string, max: number) =>
  z.string().trim().max(max, `${label} must be at most ${max} characters`)

const supplierFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(150, 'Name must be at most 150 characters'),
  contactPerson: optionalText('Contact person', 100),
  phone: optionalText('Phone', 30),
  email: optionalText('Email', 150).email('Enter a valid email address').or(z.literal('')),
  address: optionalText('Address', 250),
  active: z.boolean(),
})

export type SupplierFormValues = z.infer<typeof supplierFormSchema>

interface SupplierFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier | null
  onSubmit: (values: SupplierFormValues) => void
  isSubmitting?: boolean
}

export function SupplierFormDialog({
  open,
  onOpenChange,
  supplier,
  onSubmit,
  isSubmitting,
}: SupplierFormDialogProps) {
  const isEditing = Boolean(supplier)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      active: true,
    },
  })

  useEffect(() => {
    if (open) {
      reset(
        supplier
          ? {
              name: supplier.name,
              contactPerson: supplier.contactPerson ?? '',
              phone: supplier.phone ?? '',
              email: supplier.email ?? '',
              address: supplier.address ?? '',
              active: supplier.active,
            }
          : {
              name: '',
              contactPerson: '',
              phone: '',
              email: '',
              address: '',
              active: true,
            },
      )
    }
  }, [open, supplier, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details for this supplier.'
              : 'Add a supplier for your bakery ingredients and operations.'}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="supplier-name">Name</Label>
            <Input id="supplier-name" placeholder="e.g. ABC Ingredients Pvt Ltd" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplier-contact-person">Contact person</Label>
              <Input id="supplier-contact-person" placeholder="e.g. Rahul Sharma" {...register('contactPerson')} />
              {errors.contactPerson && (
                <p className="text-sm text-destructive">{errors.contactPerson.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier-phone">Phone</Label>
              <Input id="supplier-phone" placeholder="e.g. 9876543210" {...register('phone')} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="supplier-email">Email</Label>
            <Input id="supplier-email" type="email" placeholder="e.g. rahul@abcingredients.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="supplier-address">Address</Label>
            <Input id="supplier-address" placeholder="e.g. 123 Industrial Area, Pune" {...register('address')} />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="supplier-active"
              checked={watch('active')}
              onCheckedChange={(checked) => setValue('active', checked === true)}
            />
            <Label htmlFor="supplier-active" className="font-normal">Active</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Add supplier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}