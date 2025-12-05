import type { CreateUserInput, DeleteUserInput, UpdateUserInput } from '@/lib/types/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers } from './queries'
import * as userService from '@/lib/services/user'

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: CreateUserInput) => {
      return await userService.createUser(body)
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
      return await userService.updateUser(body)
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
      return await userService.deleteUser(body)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: getUsers.key })
    },
  })
}
