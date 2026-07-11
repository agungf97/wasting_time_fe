'use client'

import * as z from "zod";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { FormCombobox } from "@/components/form-combo-box";
import { FilePlus } from "lucide-react";
import { toast } from "sonner";
import {
  createUserAction,
  getUserFormOptionsAction,
  updateUserAction,
} from "@/actions/user";
import { OptionUserItem, UserFormProps } from "@/lib/interface/user";

const userSchema = z.object({
  username: z.string().optional(),
  email: z.string().email("Email tidak valid").min(1, "Email wajib diisi"),
  full_name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  phone_number: z.string().min(1, "Nomor telepon wajib diisi"),
  role: z.string().min(1, "Role wajib dipilih"),
});

type UserFormValues = z.infer<typeof userSchema>;

export function UserForm({
  onSuccess,
  mode = "create",
  initialData,
  open: openProp,
  onOpenChange,
}: UserFormProps) {
  const [openInternal, setOpenInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isEdit = mode === "edit";
  const open = isEdit ? (openProp ?? false) : openInternal;
  const setOpen = isEdit ? (val: boolean) => onOpenChange?.(val) : setOpenInternal;

  const [roleOptions, setRoleOptions] = useState<OptionUserItem[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: initialData?.username ?? "",
      email: initialData?.email ?? "",
      full_name: initialData?.full_name ?? "",
      phone_number: initialData?.phone_number ?? "",
      role: initialData?.role ?? "",
    },
  });

  useEffect(() => {
    if (!open) return;
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const { roleOptions } =
          await getUserFormOptionsAction();
        setRoleOptions(roleOptions);
      } catch (err) {
        console.error("Failed to load options:", err);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, [open]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const onSubmit = async (data: UserFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        ...data,
        username: data.username || undefined,
      };

      const action = isEdit
        ? updateUserAction({ ...payload, email: initialData!.email })
        : createUserAction(payload);
        
      const { data: result, message, error } = await action;

      if (error) {
        setError(error);
        return;
      }

      toast.success(
        message || (isEdit ? "User berhasil diperbarui" : "Pengguna berhasil ditambahkan"),
        { description: result?.full_name || result?.email },
      );

      setOpen(false);
      if (!isEdit) reset();
      onSuccess?.();
    } catch (err) {
      console.error(isEdit ? "Update user error:" : "Create user error:", err);
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
          <span>User</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="flex flex-col max-h-[90vh] p-0 gap-0 overflow-hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>{isEdit ? "Edit User" : "Tambah User"}</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah untuk {isEdit ? "memperbarui" : "menambahkan"} user.
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
                <Label htmlFor="full_name">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Input nama lengkap"
                  {...register("full_name")}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    register("full_name").onChange(e);
                  }}
                  className={errors.full_name ? "border-red-500" : ""}
                />
                {errors.full_name && (
                  <span className="text-sm text-red-500">{errors.full_name.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Input email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">{errors.email.message}</span>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone_number">
                  Nomor Telepon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone_number"
                  type="text"
                  placeholder="Input nomor telepon"
                  {...register("phone_number")}
                  className={errors.phone_number ? "border-red-500" : ""}
                />
                {errors.phone_number && (
                  <span className="text-sm text-red-500">{errors.phone_number.message}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">
                    Username <span className="text-muted-foreground">(opsional)</span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Input username"
                    {...register("username")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role_id">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <FormCombobox
                        value={field.value ?? ""}
                        onValueChange={(val) => field.onChange(val)}
                        options={roleOptions.map((o) => ({ value: o.id, label: o.label }))}
                        placeholder="Pilih role"
                        disabled={loadingOptions}
                        hasError={!!errors.role}
                      />
                    )}
                  />
                  {errors.role && (
                    <span className="text-sm text-red-500">{errors.role.message}</span>
                  )}
                </div>
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