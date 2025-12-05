import * as React from "react";
import { Loader2 } from "lucide-react";
import { useCheckAuth } from "@/lib/query/auth/queries";
import { useLogin, useLogout } from "@/lib/query/auth/mutations";
import type { LoginInput, LoginResponse, UserProfileResponse } from "@/lib/query/auth/types";
import type { UserResponse } from "@/lib/query/user/queries";
import { useGetCurrentUser } from "@/lib/query/user/queries";

export interface AuthContext {
	isAuthenticated: boolean;
	user: UserResponse | undefined;
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
	const { data: user, isLoading: isUserLoading } = useGetCurrentUser(isAuthenticated);

	const isLoading = isAuthLoading;
	const isUserDataLoading = isAuthenticated && isUserLoading;

	const { mutateAsync: login, isPending: isLoginLoading } = useLogin();
	const { mutateAsync: logout, isPending: isLogoutLoading } = useLogout();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="animate-spin" />
			</div>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user: user ?? undefined,
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
