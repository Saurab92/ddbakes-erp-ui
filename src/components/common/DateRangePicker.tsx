import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import type { DateRange as DayPickerDateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utils/cn'
import type { DateRange } from '@/types/common'

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const selected: DayPickerDateRange = {
    from: new Date(value.from),
    to: new Date(value.to),
  }

  function handleSelect(range: DayPickerDateRange | undefined) {
    if (!range?.from) return
    const from = range.from
    const to = range.to ?? range.from
    onChange({ from: format(from, 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') })
    if (range.from && range.to) {
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('justify-start text-left font-normal', className)}>
          <CalendarIcon className="h-4 w-4" />
          {format(new Date(value.from), 'MMM d, yyyy')} - {format(new Date(value.to), 'MMM d, yyyy')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          numberOfMonths={2}
          defaultMonth={selected.from}
        />
      </PopoverContent>
    </Popover>
  )
}
