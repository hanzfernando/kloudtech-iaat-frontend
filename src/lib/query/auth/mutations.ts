import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "./keys";
import type { LoginInput } from "@/lib/types/auth";
import * as authService from '@/lib/services/auth'

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      return await authService.login(input)
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
      await authService.logout()
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: authKeys.root });
    },
  });
}
