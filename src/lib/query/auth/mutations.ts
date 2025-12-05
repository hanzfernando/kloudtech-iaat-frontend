import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import { authKeys } from "./keys";
import type { LoginInput, LoginResponse } from "./types";

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const res = await api.post<LoginResponse>("/auth/login", input);
      // Cookie mode: server sets httpOnly cookie; no local storage writes
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: authKeys.root });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: authKeys.root });
    },
  });
}
