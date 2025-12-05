export const userKeys = {
  root: ['users'] as const,
  list: () => [...userKeys.root, 'list'] as const,
  detail: (id: number) => [...userKeys.root, 'detail', id] as const,
}

export const getUsersKey = userKeys.list()
