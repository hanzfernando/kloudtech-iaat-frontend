import api from "@/lib/api/axios";
import { queryOptions, useQuery } from '@tanstack/react-query'
import { getUsersKey } from './keys'
import type { Paginated, User } from './types'

export const getUsers = {
  key: getUsersKey,
  options: () => queryOptions<User[]>({
    queryKey: getUsersKey,
    queryFn: async () => {
      const res = await api.get<Paginated<User>>('/users')
      return res.data.data
    },
  }),
}

export const useGetUsers = () => {
  return useQuery(getUsers.options())
}

export const getUsersPaginated = {
  key: getUsersKey,
  options: ({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}) =>
    queryOptions<Paginated<User>>({
      queryKey: [...getUsersKey, { page, pageSize }],
      queryFn: async () => {
        const res = await api.get<Paginated<User>>('/users', { params: { page, pageSize } })
        return res.data
      },
      placeholderData: (prev) => prev, // keep previous page while fetching
    }),
}

export const useGetUsersPaginated = (page?: number, pageSize?: number) => {
  return useQuery(getUsersPaginated.options({ page, pageSize }))
}