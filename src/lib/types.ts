export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
}

export interface AuthResponse {
  token: string;
  user: UserDetail;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export type UserDetail = User;

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  role: string;
}

export interface UpdateUserPayload {
  email?: string;
  full_name?: string;
  phone_number?: string;
  role?: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  id?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}
