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
  totalPages: number
  totalElements: number
  number: number
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
  getIssues: (page = 0, size = 10) =>
    apiClient
      .get<IssuePageResponse | IssueResponse[]>(
        `${endpoints.issues.root}?page=${page}&size=${size}`,
      )
      .then((response) => {
        if (Array.isArray(response)) {
          return {
            issues: response.map(toIssue),
            page,
            totalPages: response.length < size ? page + 1 : page + 2,
            totalElements: response.length,
          }
        }

        return {
          issues: response.content.map(toIssue),
          page: response.number,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
        }
      }),
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
