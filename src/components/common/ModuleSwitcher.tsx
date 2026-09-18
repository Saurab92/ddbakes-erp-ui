import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useModule } from '@/context/ModuleContext'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

export function ModuleSwitcher() {
  const [open, setOpen] = useState(false)
  const { currentModule, setModule, modules } = useModule()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Select management module"
          className="h-9 px-2 text-left font-semibold tracking-tight text-foreground hover:bg-accent/80 hover:text-accent-foreground flex items-center gap-1.5 focus-visible:ring-1"
        >
          <span className="truncate text-sm font-semibold tracking-tight sm:text-base uppercase">
            {currentModule.label}
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
              open && 'rotate-180',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-72 p-1.5 shadow-lg border border-border bg-popover"
      >
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Management Modules
        </div>
        <div className="space-y-0.5">
          {modules.map((module) => {
            const isSelected = module.id === currentModule.id
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => {
                  setModule(module.id)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm font-medium transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-foreground/90 hover:bg-accent/50 hover:text-accent-foreground',
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 flex justify-center">
                    {isSelected ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="h-4 w-4" />
                    )}
                  </span>
                  <span className="text-xs uppercase tracking-wide sm:text-sm font-semibold">
                    {module.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
