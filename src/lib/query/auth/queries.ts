import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import { authKeys } from "./keys";
import type { UserProfileResponse } from "./types";

// Reusable query function for auth checks
export async function checkAuthQueryFn(): Promise<UserProfileResponse | null> {
  try {
    const res = await api.get<UserProfileResponse>("/auth/check-auth");
    const data = res.data as UserProfileResponse | null | undefined;
    // Validate shape to avoid truthy empty objects marking as authenticated
    if (data && typeof data === "object" && typeof data.id === "number") {
      return data;
    }
    return null;
  } catch (err: any) {
    if (err?.response?.status === 401) return null;
    throw err;
  }
}

export function useCheckAuth() {
  return useQuery<UserProfileResponse | null>({
    queryKey: authKeys.check(),
    queryFn: checkAuthQueryFn,
    staleTime: 1000 * 60, // 1 minute
  });
}
