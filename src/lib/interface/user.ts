export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
}


export interface UserAddress {
  address_line: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  is_default: boolean;
}


export interface Users {
  id: number;
  full_name: string;
  phone_number: string;
  username?: string;
  email: string;
  role: string;
  role_id?: number;
  last_login?: string;
  last_update?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
  address?: UserAddress[];
  user_entry?: string;
  date_time_entry?: string;
  user_update?: string;
  date_time_update?: string;
}

export interface UsersResponse {
  success: boolean;
  code: number;
  message: string;
  data: Users[];
  meta: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

export interface RoleItem {
  id: number;
  role_name: string;
}

export interface OptionUserItem {
  id: string;
  label: string;
}

export interface CreateUserPayload {
  username?: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
}

export interface UserFormProps {
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: Users;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UpdateUserPayload {
  username?: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
}
