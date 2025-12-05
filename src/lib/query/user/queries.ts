import { queryOptions, useQuery } from '@tanstack/react-query'
import { getUsersKey } from './keys'
import type { Paginated, User } from '@/lib/types/user'
import * as userService from '@/lib/services/user'

export const getUsers = {
  key: getUsersKey,
  options: () => queryOptions<User[]>({
    queryKey: getUsersKey,
    queryFn: () => userService.fetchUsers(),
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
      queryFn: () => userService.fetchUsersPaginated({ page, pageSize }),
      placeholderData: (prev) => prev, // keep previous page while fetching
    }),
}

export const useGetUsersPaginated = (page?: number, pageSize?: number) => {
  return useQuery(getUsersPaginated.options({ page, pageSize }))
}