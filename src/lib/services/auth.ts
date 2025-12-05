import api from '@/lib/api/axios'
import type { UserProfileResponse, LoginInput, LoginResponse } from '@/lib/types/auth'

export async function checkAuth(): Promise<UserProfileResponse | null> {
  try {
    const res = await api.get('/auth/check-auth')
    const data = res.data as any
    const user = data?.user ?? data
    return typeof user?.id === 'number' ? (user as UserProfileResponse) : null
  } catch (err: any) {
    if (err?.response?.status === 401) return null
    throw err
  }
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/login', input)
  return res.data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
