export type Role = 'ADMIN' | 'STAFF' | 'VIEWER'

export type User = {
  id: number
  name: string
  email: string
  role: Role
  created_at?: string
  updated_at?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateUserInput = {
  name: string
  email: string
  password: string
  role: Role
}

export type UpdateUserInput = {
  id: number
  name?: string
  email?: string
  role?: Role
}

export type DeleteUserInput = { id: number }

export type ApiSuccess<T> = { success: true; data: T; message?: string }
export type ApiList<T> = ApiSuccess<T[]>

export type Paginated<T> = {
  data: T[]
  page: number
  pageSize: number
  total: number
}
