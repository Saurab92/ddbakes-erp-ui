import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  ChangePasswordInput,
} from '@/features/users/types'

interface UserResponse extends Omit<User, 'id'> {
  id: number | string
}

function toUser(response: UserResponse): User {
  return { ...response, id: String(response.id) }
}

export const userApi = {
  getUsers: () =>
    apiClient
      .get<UserResponse[]>(endpoints.users.root)
      .then((users) => (Array.isArray(users) ? users.map(toUser) : [])),

  getUser: (id: string) =>
    apiClient.get<UserResponse>(endpoints.users.byId(id)).then(toUser),

  createUser: (input: CreateUserInput) =>
    apiClient.post<UserResponse>(endpoints.users.root, input).then(toUser),

  updateUser: (id: string, input: UpdateUserInput) =>
    apiClient.put<UserResponse>(endpoints.users.byId(id), input).then(toUser),

  reactivateUser: (id: string) =>
    apiClient.put<UserResponse | void>(endpoints.users.reactivate(id)),

  deactivateUser: (id: string) =>
    apiClient.put<UserResponse | void>(endpoints.users.deactivate(id)),

  deleteUser: (id: string) =>
    apiClient.delete<void>(endpoints.users.byId(id)),

  changePassword: (id: string, input: ChangePasswordInput) =>
    apiClient.put<void>(endpoints.users.changePassword(id), input),
}
