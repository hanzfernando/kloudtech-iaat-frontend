import { queryOptions, useQuery } from "@tanstack/react-query";
import { authKeys } from "./keys";
import type { UserProfileResponse } from "@/lib/types/auth";
import * as authService from '@/lib/services/auth'

// Pattern-aligned query builder (key + options)
export const getCheckAuth = {
  key: authKeys.check(),
  options: () =>
    queryOptions<UserProfileResponse | null>({
      queryKey: authKeys.check(),
      queryFn: () => authService.checkAuth(),
      // Keep sensible defaults used previously
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    }),
};

export function useCheckAuth() {
  return useQuery(getCheckAuth.options());
}
