import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { CreateRoleInput, Role, UpdateRoleInput } from '@/features/roles/types'

interface RoleResponse extends Omit<Role, 'id'> {
  id: number
}

function toRole(response: RoleResponse): Role {
  return { ...response, id: String(response.id) }
}

export const roleApi = {
  getRoles: () =>
    apiClient
      .get<RoleResponse[]>(endpoints.roles.root)
      .then((roles) => roles.map(toRole)),
  getRole: (id: string) =>
    apiClient.get<RoleResponse>(endpoints.roles.byId(id)).then(toRole),
  createRole: (input: CreateRoleInput) =>
    apiClient.post<RoleResponse>(endpoints.roles.root, input).then(toRole),
  updateRole: (id: string, input: UpdateRoleInput) =>
    apiClient.put<RoleResponse>(endpoints.roles.byId(id), input).then(toRole),
  activateRole: (id: string) =>
    apiClient.patch<void>(endpoints.roles.activate(id)),
  deactivateRole: (id: string) =>
    apiClient.patch<void>(endpoints.roles.deactivate(id)),
  deleteRole: (id: string) => apiClient.delete<void>(endpoints.roles.byId(id)),
}