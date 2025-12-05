export type Role = "ADMIN" | "STAFF" | "VIEWER";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  userName: string;
  email: string;
  role: Role;
  token?: string; // present if server also returns token; cookie is primary
}

export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
}
