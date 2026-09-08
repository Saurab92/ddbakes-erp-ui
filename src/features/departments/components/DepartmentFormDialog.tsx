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
import type { Department } from '@/features/departments/types'

const departmentFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  active: z.boolean(),
})

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>

interface DepartmentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  department?: Department | null
  onSubmit: (values: DepartmentFormValues) => void
  isSubmitting?: boolean
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  onSubmit,
  isSubmitting,
}: DepartmentFormDialogProps) {
  const isEditing = Boolean(department)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: { name: '', active: true },
  })

  useEffect(() => {
    if (open) {
      reset(
        department
          ? { name: department.name, active: department.active }
          : { name: '', active: true },
      )
    }
  }, [open, department, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Department' : 'Add Department'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details for this department.'
              : 'Create a department for your bakery operations.'}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="department-name">Name</Label>
            <Input
              id="department-name"
              placeholder="e.g. Bakery Production"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="department-active"
              checked={watch('active')}
              onCheckedChange={(checked) => setValue('active', checked === true)}
            />
            <Label htmlFor="department-active" className="font-normal">
              Active
            </Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Add department'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}