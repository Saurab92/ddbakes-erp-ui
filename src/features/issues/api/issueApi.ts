import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { CreateIssueInput, Issue, IssueItem, UpdateIssueInput } from '@/features/issues/types'

interface IssueItemResponse extends Omit<IssueItem, 'productId'> {
  productId: number
}

interface IssueResponse extends Omit<Issue, 'id' | 'departmentId' | 'personId' | 'issueItems'> {
  id: number
  departmentId: number
  personId: number
  issueItems: IssueItemResponse[]
}

interface IssuePageResponse {
  content: IssueResponse[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface IssuePage {
  content: Issue[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

function toIssue(response: IssueResponse): Issue {
  return {
    ...response,
    id: String(response.id),
    departmentId: String(response.departmentId),
    personId: String(response.personId),
    issueItems: response.issueItems.map((item) => ({
      ...item,
      productId: String(item.productId),
    })),
  }
}

function toPayload(input: CreateIssueInput) {
  return {
    ...input,
    departmentId: Number(input.departmentId),
    personId: Number(input.personId),
    issueItems: input.issueItems.map((item) => ({
      ...item,
      productId: Number(item.productId),
    })),
  }
}

export const issueApi = {
  getIssues: (page: number, size: number): Promise<IssuePage> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) })
    return apiClient
      .get<IssuePageResponse>(`${endpoints.issues.root}?${params}`)
      .then((response) => ({
        ...response,
        content: response.content.map(toIssue),
      }))
  },
  getIssue: (id: string) =>
    apiClient.get<IssueResponse>(endpoints.issues.byId(id)).then(toIssue),
  createIssue: (input: CreateIssueInput) =>
    apiClient
      .post<IssueResponse>(endpoints.issues.root, toPayload(input))
      .then(toIssue),
  updateIssue: (id: string, input: UpdateIssueInput) =>
    apiClient
      .put<IssueResponse>(endpoints.issues.byId(id), toPayload(input))
      .then(toIssue),
}
