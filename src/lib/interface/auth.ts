export interface LoginResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    token: string;
    expires_at: number;
    user: {
      id: number;
      full_name: string;
      phone_number: string;
      username: string;
      email: string;
      role: string;
      [key: string]: unknown;
    };
  };
}

export interface ChangePasswordPayload {
  password_sekarang: string;
  password_baru: string;
  password_baru_repeat: string;
}

export interface ChangePasswordResult {
  success: boolean;
  message: string;
}

export interface SessionItem {
  session_id: string;
  device?: string;
  ip_address?: string;
  created_at?: string;
  last_active?: string;
  is_current?: boolean;
  [key: string]: unknown;
}

export interface SessionsResponse {
  success: boolean;
  code: number;
  message: string;
  data: SessionItem[];
}