export interface IssueItem {
  productId: string
  productName?: string
  quantity: number
}

export interface Issue {
  id: string
  issueDate: string
  departmentId: string
  departmentName: string
  personId: string
  personName: string
  reason: string
  remarks?: string
  issueItems: IssueItem[]
}

export interface IssueItemInput {
  productId: string
  quantity: number
}

export interface CreateIssueInput {
  issueDate: string
  departmentId: string
  personId: string
  reason: string
  remarks?: string
  issueItems: IssueItemInput[]
}

export type UpdateIssueInput = CreateIssueInput
