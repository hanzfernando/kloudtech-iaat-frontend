import type { Role } from './common'
export type { Paginated } from './api'

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
