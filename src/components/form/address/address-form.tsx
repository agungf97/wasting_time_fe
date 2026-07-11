'use client'

import * as z from "zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FilePlus } from "lucide-react";
import { toast } from "sonner";
import { createAddressAction, updateAddressAction } from "@/actions/address";
import { Address } from "@/lib/interface/address";

const addressSchema = z.object({
  address_line: z.string().min(1, "Alamat wajib diisi"),
  city: z.string().min(1, "Kota wajib diisi"),
  province: z.string().min(1, "Provinsi wajib diisi"),
  country: z.string().min(1, "Negara wajib diisi"),
  postal_code: z.string().min(1, "Kode pos wajib diisi"),
  is_default: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: Address;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddressForm({
  onSuccess,
  mode = "create",
  initialData,
  open: openProp,
  onOpenChange,
}: AddressFormProps) {
  const [openInternal, setOpenInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isEdit = mode === "edit";
  const open = isEdit ? (openProp ?? false) : openInternal;
  const setOpen = isEdit ? (val: boolean) => onOpenChange?.(val) : setOpenInternal;

    const {
    register,
    handleSubmit,
    reset,
    setValue,
    control, // add this
    formState: { errors },
    } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
        address_line: initialData?.address_line ?? "",
        city: initialData?.city ?? "",
        province: initialData?.province ?? "",
        country: initialData?.country ?? "Indonesia",
        postal_code: initialData?.postal_code ?? "",
        is_default: initialData?.is_default ?? false,
    },
    });

    const isDefault = useWatch({ control, name: "is_default" });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && !isEdit) {
      reset();
      setError("");
    }
  };

  const onSubmit = async (data: AddressFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const action = isEdit
        ? updateAddressAction(initialData!.id, data)
        : createAddressAction(data);

      const { error, message } = await action;

      if (error) {
        setError(error);
        return;
      }

      toast.success(
        message || (isEdit ? "Alamat berhasil diperbarui" : "Alamat berhasil ditambahkan"),
      );

      setOpen(false);
      if (!isEdit) reset();
      onSuccess?.();
    } catch (err) {
      console.error(isEdit ? "Update address error:" : "Create address error:", err);
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
          <span>Alamat</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="flex flex-col max-h-[90vh] p-0 gap-0 overflow-hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>{isEdit ? "Edit Alamat" : "Tambah Alamat"}</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah untuk {isEdit ? "memperbarui" : "menambahkan"} alamat.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 px-6 py-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md" role="alert">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="address_line">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address_line"
                  placeholder="Jl. Merdeka No. 1"
                  {...register("address_line")}
                  className={errors.address_line ? "border-red-500" : ""}
                />
                {errors.address_line && (
                  <span className="text-sm text-red-500">{errors.address_line.message}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    Kota <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="Malang"
                    {...register("city")}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <span className="text-sm text-red-500">{errors.city.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">
                    Provinsi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="province"
                    placeholder="Jawa Timur"
                    {...register("province")}
                    className={errors.province ? "border-red-500" : ""}
                  />
                  {errors.province && (
                    <span className="text-sm text-red-500">{errors.province.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">
                    Negara <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="country"
                    placeholder="Indonesia"
                    {...register("country")}
                    className={errors.country ? "border-red-500" : ""}
                  />
                  {errors.country && (
                    <span className="text-sm text-red-500">{errors.country.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">
                    Kode Pos <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="postal_code"
                    placeholder="65111"
                    {...register("postal_code")}
                    className={errors.postal_code ? "border-red-500" : ""}
                  />
                  {errors.postal_code && (
                    <span className="text-sm text-red-500">{errors.postal_code.message}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_default"
                  checked={isDefault}
                  onCheckedChange={(checked) => setValue("is_default", checked === true)}
                />
                <Label htmlFor="is_default" className="cursor-pointer">
                  Jadikan alamat utama
                </Label>
              </div>

              <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}