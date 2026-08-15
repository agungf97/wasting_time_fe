"use server";

import { buildQuery, fetchAPI } from "@/lib/api";
import {
  CreateVoucherPayload,
  UpdateVoucherPayload,
  ValidateVoucherPayload,
  ValidateVoucherResponse,
  VoucherDetailResponse,
  VoucherListParams,
  VouchersResponse,
} from "@/lib/interface/voucher";

export async function createVoucherAction(payload: CreateVoucherPayload) {
  const { data, error } = await fetchAPI<VoucherDetailResponse>(
    "/voucher/",
    {
      method: "POST",
      withAuth: true,
      body: JSON.stringify(payload),
    },
  );

  if (error) return { error };
  return { success: true, message: data?.message, data: data?.data };
}

export async function getVouchersAction(params: VoucherListParams = {}) {
  const query = buildQuery({
    search: params.search,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  });

  const { data, error } = await fetchAPI<VouchersResponse>(
    `/voucher/${query}`,
    { withAuth: true },
  );

  if (error) return { error };
  return { data: data?.data ?? [], meta: data?.meta };
}

export async function getVoucherDetailAction(code: string) {
  const { data, error } = await fetchAPI<VoucherDetailResponse>(
    `/voucher/detail?code=${encodeURIComponent(code)}`,
    { withAuth: true },
  );

  if (error) return { error };
  return { data: data?.data };
}

export async function updateVoucherAction(
  code: string,
  payload: UpdateVoucherPayload,
) {
  const { data, error } = await fetchAPI<VoucherDetailResponse>(
    `/voucher/update?code=${encodeURIComponent(code)}`,
    {
      method: "PUT",
      withAuth: true,
      body: JSON.stringify(payload),
    },
  );

  if (error) return { error };
  return { success: true, message: data?.message, data: data?.data };
}

export async function deleteVoucherAction(code: string) {
  const { data, error } = await fetchAPI<{
    success: boolean;
    message: string;
  }>(`/voucher/delete?code=${encodeURIComponent(code)}`, {
    method: "DELETE",
    withAuth: true,
  });

  if (error) return { error };
  return { success: true, message: data?.message };
}

/** Public endpoint — hanya perlu userAuth, tidak perlu role OWNER/ADMIN */
export async function validateVoucherAction(
  payload: ValidateVoucherPayload,
) {
  const { data, error } = await fetchAPI<ValidateVoucherResponse>(
    "/voucher/validate",
    {
      method: "POST",
      withAuth: true,
      body: JSON.stringify(payload),
    },
  );

  if (error) return { error };
  return { success: true, message: data?.message, data: data?.data };
}