import { useState } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface MultiSelectOption {
  value: string
  label: string
  subLabel?: string
}

interface MultiSelectComboboxProps {
  options: MultiSelectOption[]
  value?: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function MultiSelectCombobox({
  options,
  value = [],
  onChange,
  placeholder = 'Select items...',
  searchPlaceholder = 'Search...',
  emptyText = 'No items found.',
  disabled,
  className,
  id,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false)
  const selectedValues = new Set(value)

  const selectedOptions = options.filter((opt) => selectedValues.has(opt.value))

  const handleToggle = (optionValue: string) => {
    if (selectedValues.has(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (optionValue: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  const handleSelectAll = () => {
    onChange(options.map((opt) => opt.value))
  }

  const handleClearAll = () => {
    onChange([])
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal min-h-10 h-auto py-2',
              value.length === 0 && 'text-muted-foreground',
              className,
            )}
          >
            <div className="flex flex-wrap items-center gap-1 text-left">
              {value.length === 0 ? (
                <span>{placeholder}</span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-foreground text-sm font-medium">
                    {value.length} selected
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({selectedOptions.slice(0, 2).map((o) => o.label).join(', ')}
                    {selectedOptions.length > 2 ? `, +${selectedOptions.length - 2} more` : ''})
                  </span>
                </div>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <div className="flex items-center justify-between border-b px-3 py-1.5 text-xs text-muted-foreground bg-muted/30">
              <span>{options.length} available</span>
              <div className="flex items-center gap-2">
                {value.length < options.length && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="hover:text-foreground underline"
                  >
                    Select all
                  </button>
                )}
                {value.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="hover:text-destructive text-muted-foreground underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <CommandList className="max-h-60 overflow-y-auto overflow-x-hidden scrollbar-thin">
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      value={`${option.label} ${option.subLabel ?? ''}`}
                      onSelect={() => handleToggle(option.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate text-sm">{option.label}</span>
                        {option.subLabel && (
                          <span className="truncate text-xs text-muted-foreground">
                            {option.subLabel}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected badges chips list */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-0.5 text-xs font-normal"
            >
              <span className="truncate max-w-[200px]">{option.label}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => handleRemove(option.value, e)}
                  className="rounded-full p-0.5 hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${option.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
