import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { issueApi } from '@/features/issues/api/issueApi'
import type { CreateIssueInput, UpdateIssueInput } from '@/features/issues/types'

export const issueKeys = {
  all: ['issues'] as const,
  page: (page: number, size: number) => ['issues', page, size] as const,
  detail: (id: string) => ['issues', id] as const,
}

export function useIssuesQuery(page: number, size = 10) {
  return useQuery({
    queryKey: issueKeys.page(page, size),
    queryFn: () => issueApi.getIssues(page, size),
  })
}

export function useIssueQuery(id: string | null) {
  return useQuery({
    queryKey: issueKeys.detail(id ?? ''),
    queryFn: () => issueApi.getIssue(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateIssue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateIssueInput) => issueApi.createIssue(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.all })
      toast.success('Issue created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create issue')
    },
  })
}

export function useUpdateIssue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateIssueInput }) =>
      issueApi.updateIssue(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.all })
      toast.success('Issue updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update issue')
    },
  })
}
