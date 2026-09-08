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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Combobox } from '@/components/common/Combobox'
import { useDepartmentsQuery } from '@/features/departments/hooks/useDepartments'
import type { Person } from '@/features/persons/types'

const personFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  departmentId: z.string().min(1, 'Department is required'),
  active: z.boolean(),
})

export type PersonFormValues = z.infer<typeof personFormSchema>

interface PersonFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  person?: Person | null
  onSubmit: (values: PersonFormValues) => void
  isSubmitting?: boolean
}

export function PersonFormDialog({
  open,
  onOpenChange,
  person,
  onSubmit,
  isSubmitting,
}: PersonFormDialogProps) {
  const isEditing = Boolean(person)
  const { data: departments } = useDepartmentsQuery()
  const departmentOptions = (departments ?? [])
    .filter((department) => department.active || department.id === person?.departmentId)
    .map((department) => ({ value: department.id, label: department.name }))
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
    defaultValues: { name: '', departmentId: '', active: true },
  })

  useEffect(() => {
    if (open) {
      reset(person ?? { name: '', departmentId: '', active: true })
    }
  }, [open, person, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Person' : 'Add Person'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update this person and their department.' : 'Create a person for issue inventory.'}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="person-name">Name</Label>
            <Input id="person-name" placeholder="e.g. John Doe" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="person-department">Department</Label>
            <Controller
              control={control}
              name="departmentId"
              render={({ field }) => (
                <Combobox
                  id="person-department"
                  options={departmentOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a department"
                  searchPlaceholder="Search departments..."
                  emptyText="No departments found."
                />
              )}
            />
            {errors.departmentId && <p className="text-sm text-destructive">{errors.departmentId.message}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <Checkbox
                  id="person-active"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              )}
            />
            <Label htmlFor="person-active" className="font-normal">Active</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Add person'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}