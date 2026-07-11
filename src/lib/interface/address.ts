export interface Address {
  id: number | string;
  address_line: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  is_default: boolean;
  [key: string]: unknown;
}

export interface AddressPayload {
  address_line: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  is_default: boolean;
}

export interface AddressResponse {
  success: boolean;
  code: number;
  message: string;
  data: Address[];
}

export interface AddressActionResult {
  success?: boolean;
  error?: string;
  message?: string;
  data?: Address;
}