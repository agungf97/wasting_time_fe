"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormCombobox } from "@/components/form-combo-box";
import { FilePlus, Star, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { cn, toAlphaNumericUpper, toCodeFormat, toDigitsOnly, toSentenceCase, toTitleCase, toUpperCaseOnly } from "@/lib/utils";
import { createProductAction, updateProductAction } from "@/actions/product";
import { Product } from "@/lib/interface/product";

const GENDER_OPTIONS = [
  { value: "Pria", label: "Pria" },
  { value: "Wanita", label: "Wanita" },
  { value: "Unisex", label: "Unisex" },
];

const CONDITION_OPTIONS = [
  { value: "Baru", label: "Baru" },
  { value: "Bekas", label: "Bekas" },
  { value: "Seperti Baru", label: "Seperti Baru" },
];

const STOCK_STATUS_OPTIONS = [
  { value: "Tersedia", label: "Tersedia" },
  { value: "Terjual", label: "Terjual" },
  { value: "Dipesan", label: "Dipesan" },
];

const productSchema = z.object({
  product_code: z
    .string()
    .min(1, "Kode produk wajib diisi")
    .regex(
      /^[A-Z0-9-]+$/,
      "Kode produk hanya boleh huruf besar, angka, dan tanda -",
    ),
  product_name: z.string().min(3, "Nama produk minimal 3 karakter"),
  product_brand: z.string().min(1, "Brand wajib diisi"),
  reference_number: z
    .string()
    .regex(/^[A-Z0-9]*$/, "Hanya boleh angka dan huruf besar")
    .optional(),
  serial_number: z
    .string()
    .regex(/^[A-Z0-9]*$/, "Hanya boleh angka dan huruf besar")
    .optional(),
  movement: z.string().optional(),
  gender: z.enum(["Pria", "Wanita", "Unisex"], {
    message: "Gender wajib dipilih",
  }),
  condition: z.enum(["Baru", "Bekas", "Seperti Baru"], {
    message: "Kondisi wajib dipilih",
  }),
  material: z.string().optional(),
  release_year: z
    .string()
    .regex(/^[0-9]*$/, "Tahun rilis hanya boleh angka")
    .optional(),
  price_idr: z
    .string()
    .min(1, "Harga wajib diisi")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: "Harga harus lebih dari 0",
    }),
  stock_status: z.enum(["Tersedia", "Terjual", "Dipesan"], {
    message: "Status stok wajib dipilih",
  }),
  description: z.string().optional(),
  inclusions: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ImageItem {
  file?: File;
  preview: string;
  isExisting: boolean;
}

interface ProductFormProps {
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: Product;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProductForm({
  onSuccess,
  mode = "create",
  initialData,
  open: openProp,
  onOpenChange,
}: ProductFormProps) {
  const [openInternal, setOpenInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isEdit = mode === "edit";
  const open = isEdit ? (openProp ?? false) : openInternal;
  const setOpen = isEdit ? (val: boolean) => onOpenChange?.(val) : setOpenInternal;

  const [images, setImages] = useState<ImageItem[]>(() =>
    isEdit && initialData?.images?.length
      ? initialData.images.map((img) => ({
          preview: img.image_url,
          isExisting: true,
        }))
      : [],
  );
  const [primaryIndex, setPrimaryIndex] = useState(() => {
    if (!isEdit || !initialData?.images?.length) return 0;
    const idx = initialData.images.findIndex((img) => img.is_primary);
    return idx >= 0 ? idx : 0;
  });
  const [imageError, setImageError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_code: initialData?.product_code ?? "",
      product_name: initialData?.product_name ?? "",
      product_brand: initialData?.product_brand ?? "",
      reference_number: initialData?.reference_number ?? "",
      serial_number: initialData?.serial_number ?? "",
      movement: initialData?.movement ?? "",
      gender: (initialData?.gender ?? "") as ProductFormValues["gender"],
      condition: (initialData?.condition ?? "") as ProductFormValues["condition"],
      material: initialData?.material ?? "",
      release_year: initialData?.release_year ?? "",
      price_idr: initialData?.price_idr ? String(initialData.price_idr) : "",
      stock_status:
        (initialData?.stock_status ?? "") as ProductFormValues["stock_status"],
      description: initialData?.description ?? "",
      inclusions: initialData?.inclusions ?? "",
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const handleFiles = (files: File[]) => {
    if (!files.length) return;

    const newItems: ImageItem[] = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isExisting: false,
      }));

    if (!newItems.length) return;

    setImages((prev) => [...prev, ...newItems]);
    setImageError("");
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const removed = prev[index];
      if (removed && !removed.isExisting) {
        URL.revokeObjectURL(removed.preview);
      }
      const next = prev.filter((_, i) => i !== index);
      return next;
    });

    setPrimaryIndex((prevIndex) => {
      if (index === prevIndex) return 0;
      if (index < prevIndex) return prevIndex - 1;
      return prevIndex;
    });
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (isSubmitting) return;

    if (!isEdit && images.length === 0) {
      setImageError("Minimal satu gambar produk wajib diunggah");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const newFiles = images
        .filter((img) => !img.isExisting && img.file)
        .map((img) => img.file!) as File[];

      const payload = {
        ...data,
        price_idr: Number(data.price_idr),
      };

      const action = isEdit
        ? updateProductAction(initialData!.product_code, {
            ...payload,
            primary_image_index: primaryIndex,
            images: newFiles.length ? newFiles : undefined,
          })
        : createProductAction({
            ...payload,
            primary_image_index: primaryIndex,
            images: newFiles,
          });

      const { data: result, message, error } = await action;

      if (error) {
        setError(error);
        return;
      }

      toast.success(
        message ||
          (isEdit ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan"),
        { description: result?.product_name },
      );

      setOpen(false);
      if (!isEdit) {
        reset();
        setImages([]);
        setPrimaryIndex(0);
      }
      onSuccess?.();
    } catch (err) {
      console.error(isEdit ? "Update product error:" : "Create product error:", err);
      setError("Tidak dapat terhubung ke server. Coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isEdit && (
        <Button variant="outline" onClick={handleClick} className="cursor-pointer">
          <FilePlus className="w-4 h-4 text-muted-foreground" />
          <span>Product</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="flex flex-col max-h-[90vh] p-0 gap-0 overflow-hidden sm:max-w-2xl"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>{isEdit ? "Edit Product" : "Tambah Product"}</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah untuk {isEdit ? "memperbarui" : "menambahkan"} produk.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 px-6 py-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md" role="alert">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_code">
                    Kode Produk <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="product_code"
                    type="text"
                    placeholder="PRD-001"
                    disabled={isEdit}
                    {...register("product_code")}
                    onChange={(e) => {
                      e.target.value = toCodeFormat(e.target.value);
                      register("product_code").onChange(e);
                    }}
                    className={errors.product_code ? "border-red-500" : ""}
                  />
                  {errors.product_code && (
                    <span className="text-sm text-red-500">
                      {errors.product_code.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_brand">
                    Brand <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="product_brand"
                    type="text"
                    placeholder="ROLEX"
                    {...register("product_brand")}
                    onChange={(e) => {
                      e.target.value = toUpperCaseOnly(e.target.value);
                      register("product_brand").onChange(e);
                    }}
                    className={errors.product_brand ? "border-red-500" : ""}
                  />
                  {errors.product_brand && (
                    <span className="text-sm text-red-500">
                      {errors.product_brand.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_name">
                  Nama Produk <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="product_name"
                  type="text"
                  placeholder="Rolex Submariner"
                  {...register("product_name")}
                  onChange={(e) => {
                    e.target.value = toTitleCase(e.target.value);
                    register("product_name").onChange(e);
                  }}
                  className={errors.product_name ? "border-red-500" : ""}
                />
                {errors.product_name && (
                  <span className="text-sm text-red-500">
                    {errors.product_name.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference_number">No. Referensi</Label>
                  <Input
                    id="reference_number"
                    type="text"
                    placeholder="126610LN"
                    {...register("reference_number")}
                    onChange={(e) => {
                      e.target.value = toAlphaNumericUpper(e.target.value);
                      register("reference_number").onChange(e);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serial_number">No. Seri</Label>
                  <Input
                    id="serial_number"
                    type="text"
                    placeholder="SN123456"
                    {...register("serial_number")}
                    onChange={(e) => {
                      e.target.value = toAlphaNumericUpper(e.target.value);
                      register("serial_number").onChange(e);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="movement">Movement</Label>
                  <Input
                    id="movement"
                    type="text"
                    placeholder="Automatic"
                    {...register("movement")}
                    onChange={(e) => {
                      e.target.value = toTitleCase(e.target.value);
                      register("movement").onChange(e);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    type="text"
                    placeholder="Stainless Steel"
                    {...register("material")}
                    onChange={(e) => {
                      e.target.value = toTitleCase(e.target.value);
                      register("material").onChange(e);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <FormCombobox
                        value={field.value ?? ""}
                        onValueChange={(val) =>
                          field.onChange(val as ProductFormValues["gender"])
                        }
                        options={GENDER_OPTIONS}
                        placeholder="Pilih gender"
                        hasError={!!errors.gender}
                      />
                    )}
                  />
                  {errors.gender && (
                    <span className="text-sm text-red-500">{errors.gender.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">
                    Kondisi <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="condition"
                    render={({ field }) => (
                      <FormCombobox
                        value={field.value ?? ""}
                        onValueChange={(val) =>
                          field.onChange(val as ProductFormValues["condition"])
                        }
                        options={CONDITION_OPTIONS}
                        placeholder="Pilih kondisi"
                        hasError={!!errors.condition}
                      />
                    )}
                  />
                  {errors.condition && (
                    <span className="text-sm text-red-500">
                      {errors.condition.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="release_year">Tahun Rilis</Label>
                  <Input
                    id="release_year"
                    type="text"
                    inputMode="numeric"
                    placeholder="2022"
                    {...register("release_year")}
                    onChange={(e) => {
                      e.target.value = toDigitsOnly(e.target.value);
                      register("release_year").onChange(e);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_idr">
                    Harga (IDR) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price_idr"
                    type="number"
                    placeholder="150000000"
                    {...register("price_idr")}
                    className={errors.price_idr ? "border-red-500" : ""}
                  />
                  {errors.price_idr && (
                    <span className="text-sm text-red-500">
                      {errors.price_idr.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock_status">
                    Status Stok <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="stock_status"
                    render={({ field }) => (
                      <FormCombobox
                        value={field.value ?? ""}
                        onValueChange={(val) =>
                          field.onChange(val as ProductFormValues["stock_status"])
                        }
                        options={STOCK_STATUS_OPTIONS}
                        placeholder="Pilih status stok"
                        hasError={!!errors.stock_status}
                      />
                    )}
                  />
                  {errors.stock_status && (
                    <span className="text-sm text-red-500">
                      {errors.stock_status.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inclusions">Kelengkapan</Label>
                <Input
                  id="inclusions"
                  type="text"
                  placeholder="Box, Card, Warranty"
                  {...register("inclusions")}
                  onChange={(e) => {
                    e.target.value = toTitleCase(e.target.value);
                    register("inclusions").onChange(e);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  placeholder="Kondisi mulus, full set"
                  rows={3}
                  {...register("description")}
                  onChange={(e) => {
                    e.target.value = toSentenceCase(e.target.value);
                    register("description").onChange(e);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="images"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Gambar Produk{" "}
                  {!isEdit && <span className="text-red-500">*</span>}
                  {isEdit && (
                    <span className="normal-case font-normal">
                      (opsional, tambahkan untuk mengganti)
                    </span>
                  )}
                </Label>

                <label
                  htmlFor="images"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOver(false);
                    handleFiles(Array.from(e.dataTransfer.files ?? []));
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors",
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/40",
                  )}
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Klik atau drag &amp; drop gambar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP — Bisa pilih lebih dari 1 file
                  </p>
                </label>

                <input
                  id="images"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple
                  onChange={handleFilesChange}
                  className="sr-only"
                />

                {imageError && (
                  <span className="text-sm text-red-500 block">{imageError}</span>
                )}

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 pt-2">
                    {images.map((img, index) => (
                      <div
                        key={img.preview + index}
                        className={cn(
                          "relative group rounded-md overflow-hidden border-2",
                          primaryIndex === index
                            ? "border-primary"
                            : "border-transparent",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.preview}
                          alt={`Product image ${index + 1}`}
                          className="h-20 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => setPrimaryIndex(index)}
                          title="Jadikan gambar utama"
                          className={cn(
                            "absolute top-1 left-1 rounded-full p-1 bg-black/50 hover:bg-black/70",
                            primaryIndex === index && "bg-primary",
                          )}
                        >
                          <Star
                            className={cn(
                              "h-3 w-3",
                              primaryIndex === index
                                ? "fill-white text-white"
                                : "text-white",
                            )}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          title="Hapus gambar"
                          className="absolute top-1 right-1 rounded-full p-1 bg-black/50 hover:bg-black/70"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : isEdit ? "Edit Produk" : "Tambah Produk"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}