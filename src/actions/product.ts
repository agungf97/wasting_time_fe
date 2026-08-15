"use server";

import { buildQuery, fetchAPI } from "@/lib/api";
import {
  CreateProductPayload,
  ProductDetailResponse,
  ProductListParams,
  ProductsResponse,
  UpdateProductPayload,
} from "@/lib/interface/product";

function buildProductFormData(
  payload: CreateProductPayload | UpdateProductPayload,
): FormData {
  const formData = new FormData();
  const { images, ...fields } = payload;

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  images?.forEach((file) => {
    formData.append("images", file);
  });

  return formData;
}

export async function createProductAction(payload: CreateProductPayload) {
  const formData = buildProductFormData(payload);

  const { data, error } = await fetchAPI<ProductDetailResponse>(
    "/product/",
    {
      method: "POST",
      withAuth: true,
      body: formData,
    },
  );

  if (error) return { error };
  return { success: true, message: data?.message, data: data?.data };
}

export async function getProductsAction(params: ProductListParams = {}) {
  const query = buildQuery({
    product: params.product,
    product_brand: params.product_brand,
    gender: params.gender,
    stock_status: params.stock_status,
    condition: params.condition,
    search: params.search,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  });

  const { data, error } = await fetchAPI<ProductsResponse>(
    `/product/${query}`,
    { withAuth: true },
  );

  if (error) return { error };
  return { data: data?.data ?? [], meta: data?.meta };
}

export async function getProductDetailAction(productCode: string) {
  const { data, error } = await fetchAPI<ProductDetailResponse>(
    `/product/detail?product_code=${encodeURIComponent(productCode)}`,
    { withAuth: true },
  );

  if (error) return { error };
  return { data: data?.data };
}

export async function updateProductAction(
  productCode: string,
  payload: UpdateProductPayload,
) {
  const formData = buildProductFormData(payload);

  const { data, error } = await fetchAPI<ProductDetailResponse>(
    `/product/update?product_code=${encodeURIComponent(productCode)}`,
    {
      method: "PUT",
      withAuth: true,
      body: formData,
    },
  );

  if (error) return { error };
  return { success: true, message: data?.message, data: data?.data };
}

export async function deleteProductAction(productCode: string) {
  const { data, error } = await fetchAPI<{
    success: boolean;
    message: string;
  }>(`/product/delete?product_code=${encodeURIComponent(productCode)}`, {
    method: "DELETE",
    withAuth: true,
  });

  if (error) return { error };
  return { success: true, message: data?.message };
}