import type { Role } from './common'

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  id: number
  userName: string
  email: string
  role: Role
  token?: string
}

export interface UserProfileResponse {
  id: number
  name: string
  email: string
  role: Role
}
