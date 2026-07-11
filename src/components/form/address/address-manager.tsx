'use client'

import { useCallback, useEffect, useState } from "react";
import { getAddressesAction, deleteAddressAction } from "@/actions/address";
import { Address } from "@/lib/interface/address";
import { AddressForm } from "./address-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Address | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    const { data, error } = await getAddressesAction();
    if (error) {
      toast.error(error);
    } else {
      setAddresses(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;

    (async () => {
      const { data, error } = await getAddressesAction();
      if (ignore) return;

      if (error) {
        toast.error(error);
      } else {
        setAddresses(data ?? []);
      }
      setLoading(false);
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id: string | number) => {
    const { error, message } = await deleteAddressAction(id);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(message || "Alamat berhasil dihapus");
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (address: Address) => {
    setEditTarget(address);
    setEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddressForm onSuccess={loadAddresses} />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Memuat alamat...</p>
      ) : addresses.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada alamat tersimpan.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="flex items-start justify-between py-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{address.address_line}</p>
                    {address.is_default && (
                      <Badge variant="secondary" className="text-xs">Utama</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {address.city}, {address.province}, {address.country} {address.postal_code}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => handleEdit(address)}
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="cursor-pointer">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus alamat ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                        <AlertDialogAction
                          className="cursor-pointer"
                          onClick={() => handleDelete(address.id)}
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editTarget && (
        <AddressForm
          mode="edit"
          initialData={editTarget}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSuccess={loadAddresses}
        />
      )}
    </div>
  );
}