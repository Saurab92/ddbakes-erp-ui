import { CalendarClock, Construction, ShieldCheck, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MANAGEMENT_MODULES, type ManagementModuleId } from '@/config/modules'

interface ModulePlaceholderPageProps {
  title: string
  moduleId: ManagementModuleId
  description: string
  notice?: string
  highlights?: string[]
}

export function ModulePlaceholderPage({
  title,
  moduleId,
  description,
  notice,
  highlights = [],
}: ModulePlaceholderPageProps) {
  const moduleConfig = MANAGEMENT_MODULES[moduleId]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <Badge variant="secondary" className="text-xs uppercase">
              {moduleConfig?.shortLabel || moduleId}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {notice && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
          <ShieldCheck className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-semibold">Security & Access Policy:</span> {notice}
          </div>
        </div>
      )}

      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2.5 text-primary">
              <Construction className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>{title} Module</CardTitle>
              <CardDescription className="mt-0.5">
                This section is part of the {moduleConfig?.label} workspace.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The full workflow interface for <strong className="text-foreground">{title}</strong> is currently scheduled for rollout.
          </p>

          {highlights.length > 0 && (
            <div className="rounded-md border border-border bg-muted/40 p-4">
              <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Key Capabilities
              </h3>
              <ul className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
