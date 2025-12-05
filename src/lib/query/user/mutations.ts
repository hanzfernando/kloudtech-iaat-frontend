import api from '@/lib/api/axios'
import type { CreateUserInput, DeleteUserInput, UpdateUserInput, User } from './types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers } from './queries'

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: CreateUserInput) => {
      const res = await api.post<User>('/users', body)
      return res.data
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: getUsers.key })
    },
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: UpdateUserInput) => {
      const { id, ...rest } = body
      const res = await api.put<User>(`/users/${id}`, rest)
      return res.data
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: getUsers.key })
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: DeleteUserInput) => {
      const res = await api.delete<User>(`/users/${body.id}`)
      return res.data
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: getUsers.key })
    },
  })
}
