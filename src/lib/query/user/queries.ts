import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import { userKeys } from "./keys";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF" | "VIEWER";
}

export function useGetCurrentUser(enabled: boolean = true) {
  return useQuery<UserResponse | null>({
    queryKey: userKeys.current(),
    queryFn: async () => {
      const res = await api.get<UserResponse>("/users/me");
      return res.data ?? null;
    },
    enabled,
    staleTime: 1000 * 60,
  });
}
