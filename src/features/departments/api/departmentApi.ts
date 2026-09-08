import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type {
  CreateDepartmentInput,
  Department,
  UpdateDepartmentInput,
} from '@/features/departments/types'

interface DepartmentResponse extends Omit<Department, 'id'> {
  id: number
}

function toDepartment(response: DepartmentResponse): Department {
  return { ...response, id: String(response.id) }
}

export const departmentApi = {
  getDepartments: () =>
    apiClient
      .get<DepartmentResponse[]>(endpoints.departments.root)
      .then((departments) => departments.map(toDepartment)),
  createDepartment: (input: CreateDepartmentInput) =>
    apiClient
      .post<DepartmentResponse>(endpoints.departments.root, input)
      .then(toDepartment),
  updateDepartment: (id: string, input: UpdateDepartmentInput) =>
    apiClient
      .put<DepartmentResponse>(endpoints.departments.byId(id), input)
      .then(toDepartment),
  deactivateDepartment: (id: string) =>
    apiClient.patch<void>(endpoints.departments.deactivate(id)),
  activateDepartment: (id: string) =>
    apiClient
      .put<DepartmentResponse>(endpoints.departments.byId(id), { active: true })
      .then(toDepartment),
  deleteDepartment: (id: string) =>
    apiClient.delete<void>(endpoints.departments.byId(id)),
}