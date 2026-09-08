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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { Unit } from '@/features/units/types'

const unitFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(50, 'Name must be at most 50 characters'),
  code: z
    .string()
    .trim()
    .min(1, 'Code is required')
    .max(10, 'Code must be at most 10 characters')
    .regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers only'),
  active: z.boolean(),
})

export type UnitFormValues = z.infer<typeof unitFormSchema>

interface UnitFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit?: Unit | null
  onSubmit: (values: UnitFormValues) => void
  isSubmitting?: boolean
}

export function UnitFormDialog({
  open,
  onOpenChange,
  unit,
  onSubmit,
  isSubmitting,
}: UnitFormDialogProps) {
  const isEditing = Boolean(unit)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: { name: '', code: '', active: true },
  })

  useEffect(() => {
    if (open) {
      reset(
        unit
          ? { name: unit.name, code: unit.code, active: unit.active }
          : { name: '', code: '', active: true },
      )
    }
  }, [open, unit, reset])

  const active = watch('active')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Unit' : 'Add Unit'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details for this unit of measurement.'
              : 'Create a new unit of measurement for products.'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="unit-name">Name</Label>
            <Input
              id="unit-name"
              placeholder="e.g. Kilogram"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit-code">Code</Label>
            <Input
              id="unit-code"
              placeholder="e.g. KG"
              {...register('code', {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase()
                },
              })}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="unit-active"
              checked={active}
              onCheckedChange={(checked) => setValue('active', checked === true)}
            />
            <Label htmlFor="unit-active" className="font-normal">
              Active
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add unit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
