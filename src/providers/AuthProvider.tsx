import * as React from "react";
import { useCheckAuth } from "@/lib/query/auth/queries";
import { useLogin, useLogout } from "@/lib/query/auth/mutations";
import type { LoginInput, LoginResponse, UserProfileResponse } from "@/lib/query/auth/types";

export interface AuthContext {
	isAuthenticated: boolean;
	authUser: UserProfileResponse | undefined;
	isAuthLoading: boolean;
	isUserDataLoading: boolean;
	login: (credentials: LoginInput) => Promise<LoginResponse>;
	logout: () => Promise<void>;
	isLoginLoading: boolean;
	isLogoutLoading: boolean;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data: authUser, isLoading: isAuthLoading } = useCheckAuth();
	const isAuthenticated = !!authUser?.id;

	// Do not block rendering; let routes handle pending states.
	const isUserDataLoading = isAuthenticated;

	const { mutateAsync: login, isPending: isLoginLoading } = useLogin();
	const { mutateAsync: logout, isPending: isLogoutLoading } = useLogout();

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				authUser: authUser ?? undefined,
				isAuthLoading,
				isUserDataLoading,
				login,
				logout,
				isLoginLoading,
				isLogoutLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

// Export type for router context usage
export type { AuthContext };
