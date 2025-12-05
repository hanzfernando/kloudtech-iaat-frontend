import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import { authKeys } from "./keys";
import type { UserProfileResponse } from "./types";

// Reusable query function for auth checks
export async function checkAuthQueryFn(): Promise<UserProfileResponse | null> {
  try {
    const res = await api.get("/auth/check-auth");
    const data = res.data as any;
    const user = data?.user ?? data;
    return typeof user?.id === "number" ? (user as UserProfileResponse) : null;
  } catch (err: any) {
    if (err?.response?.status === 401) return null;
    throw err;
  }
}

export function useCheckAuth() {
  return useQuery<UserProfileResponse | null>({
    queryKey: authKeys.check(),
    queryFn: checkAuthQueryFn,
    // Reduce frequency and avoid disruptive refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
  });
}
