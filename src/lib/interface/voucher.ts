export type VoucherDiscountType = "PERCENTAGE" | "FIXED";

export interface Voucher {
  id: number;
  voucher_code: string;
  discount_type: VoucherDiscountType;
  discount_value: number;
  max_discount_idr: number | null;
  min_purchase_idr: number;
  quota: number;
  used_count?: number;
  valid_until: string;
  is_active?: boolean;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface VouchersResponse {
  success: boolean;
  code: number;
  message: string;
  data: Voucher[];
  meta?: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

export interface VoucherDetailResponse {
  success: boolean;
  code: number;
  message: string;
  data: Voucher;
}

export interface VoucherListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateVoucherPayload {
  voucher_code: string;
  discount_type: VoucherDiscountType;
  discount_value: number;
  max_discount_idr?: number | null;
  min_purchase_idr: number;
  quota: number;
  valid_until: string;
}

export type UpdateVoucherPayload = Partial<
  Omit<CreateVoucherPayload, "voucher_code">
>;

export interface ValidateVoucherPayload {
  voucher_code: string;
  subtotal_idr: number;
}

export interface ValidateVoucherResult {
  voucher_code: string;
  discount_type: VoucherDiscountType;
  discount_value: number;
  discount_amount_idr: number;
  final_total_idr: number;
}

export interface ValidateVoucherResponse {
  success: boolean;
  code: number;
  message: string;
  data: ValidateVoucherResult;
}