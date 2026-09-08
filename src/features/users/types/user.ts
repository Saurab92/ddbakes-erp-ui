export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  active?: boolean
  status?: string
}

export interface CreateUserInput {
  username: string
  email: string
  password?: string
  firstName: string
  lastName: string
  role: string
}

export interface UpdateUserInput {
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface ChangePasswordInput {
  oldPassword?: string
  newPassword: string
}
