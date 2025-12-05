export type ApiSuccess<T> = { success: true; data: T; message?: string }
export type ApiList<T> = ApiSuccess<T[]>

export type Paginated<T> = {
  data: T[]
  page: number
  pageSize: number
  total: number
}
