import api from '@/lib/api/axios'
import type { CreateUserInput, DeleteUserInput, UpdateUserInput, User, Paginated } from '@/lib/types/user'

export async function fetchUsers(): Promise<User[]> {
  const res = await api.get<Paginated<User>>('/users')
  return res.data.data
}

export async function fetchUsersPaginated(params: { page?: number; pageSize?: number } = {}): Promise<Paginated<User>> {
  const { page = 1, pageSize = 10 } = params
  const res = await api.get<Paginated<User>>('/users', { params: { page, pageSize } })
  return res.data
}

export async function createUser(body: CreateUserInput): Promise<User> {
  const res = await api.post<User>('/users', body)
  return res.data
}

export async function updateUser(body: UpdateUserInput): Promise<User> {
  const { id, ...rest } = body
  const res = await api.put<User>(`/users/${id}`, rest)
  return res.data
}

export async function deleteUser(body: DeleteUserInput): Promise<User> {
  const res = await api.delete<User>(`/users/${body.id}`)
  return res.data
}
