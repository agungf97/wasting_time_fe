"use server";

import { fetchAPI } from "@/lib/api";
import {
  Address,
  AddressPayload,
  AddressResponse,
} from "@/lib/interface/address";

export async function getAddressesAction() {
  const { data, error } = await fetchAPI<AddressResponse>("/address/", {
    withAuth: true,
  });

  if (error) return { error };
  return { data: data?.data ?? [] };
}

export async function createAddressAction(payload: AddressPayload) {
  const { data, error } = await fetchAPI<{
    success: boolean;
    message: string;
    data: Address;
  }>("/address/", {
    method: "POST",
    withAuth: true,
    body: JSON.stringify(payload),
  });

  if (error) return { error };
  return { success: true, message: data?.message, data: data?.data };
}

export async function updateAddressAction(
  id: string | number,
  payload: AddressPayload,
) {
  const { data, error } = await fetchAPI<{
    success: boolean;
    message: string;
    data: Address;
  }>(`/address/update?id=${encodeURIComponent(String(id))}`, {
    method: "PUT",
    withAuth: true,
    body: JSON.stringify(payload),
  });

  if (error) return { error };
  return { success: true, message: data?.message, data: data?.data };
}

export async function deleteAddressAction(id: string | number) {
  const { data, error } = await fetchAPI<{
    success: boolean;
    message: string;
  }>(`/address/delete?id=${encodeURIComponent(String(id))}`, {
    method: "DELETE",
    withAuth: true,
  });

  if (error) return { error };
  return { success: true, message: data?.message };
}