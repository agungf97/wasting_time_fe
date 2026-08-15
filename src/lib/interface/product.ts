export type ProductGender = "Pria" | "Wanita" | "Unisex";
export type ProductCondition = "Baru" | "Bekas" | "Seperti Baru";
export type ProductStockStatus = "Tersedia" | "Terjual" | "Dipesan";

export interface ProductImage {
  id?: number;
  image_url: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  product_code: string;
  product_name: string;
  product_brand: string;
  reference_number?: string;
  serial_number?: string;
  movement?: string;
  gender: ProductGender;
  condition: ProductCondition;
  material?: string;
  release_year?: string;
  price_idr: number;
  stock_status: ProductStockStatus;
  description?: string;
  inclusions?: string;
  images?: ProductImage[];
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface ProductsResponse {
  success: boolean;
  code: number;
  message: string;
  data: Product[];
  meta?: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

export interface ProductDetailResponse {
  success: boolean;
  code: number;
  message: string;
  data: Product;
}

export interface ProductListParams {
  product?: string;
  product_brand?: string;
  gender?: string;
  stock_status?: string;
  condition?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateProductPayload {
  product_code: string;
  product_name: string;
  product_brand: string;
  reference_number?: string;
  serial_number?: string;
  movement?: string;
  gender: ProductGender;
  condition: ProductCondition;
  material?: string;
  release_year?: string;
  price_idr: number;
  stock_status: ProductStockStatus;
  description?: string;
  inclusions?: string;
  primary_image_index?: number;
  images: File[];
}

export type UpdateProductPayload = Partial<
  Omit<CreateProductPayload, "product_code" | "images">
> & {
  images?: File[];
};