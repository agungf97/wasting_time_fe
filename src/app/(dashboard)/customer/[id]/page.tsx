import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarClock,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { getUserDetailAction } from "@/actions/user";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserAddress } from "@/lib/interface/user";

const formatDateTime = (value?: string) => {
  if (!value) return "-";

  const normalizedValue = value.includes(" ") && !value.includes("T") ? value.replace(" ", "T") : value;
  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) return value;

  return parsedDate.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAddress = (address: UserAddress) =>
  [address.address_line, `${address.city}, ${address.province}`, `${address.country} ${address.postal_code}`].filter(Boolean);

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) => (
  <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-4">
    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground">
      {icon}
    </div>
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  </div>
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await getUserDetailAction(id);

  return {
    title: data ? `${data.full_name} - Detail Customer` : "Detail Customer",
  };
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data, error } = await getUserDetailAction(id);

  return (
    <ContentLayout>
      <div className="space-y-6">
        <Button asChild variant="outline" size="sm" className="cursor-pointer">
            <Link href="/customer">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Kembali
            </Link>
        </Button>

        {!data || error ? (
          <Card>
            <CardHeader>
              <CardTitle>Data tidak ditemukan</CardTitle>
              <CardDescription>
                {error ?? "Customer tidak tersedia atau gagal dimuat."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/customer">Kembali</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Detail Customer</CardTitle>
              <CardDescription>
                Informasi lengkap data customer yang diambil dari getUserDetailAction.
              </CardDescription>
            </CardHeader>
            <Separator /> 
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">Informasi Utama</h3>
                  <p className="text-sm text-muted-foreground">Data identitas dan kontak customer.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <InfoRow
                    icon={<UserRound className="h-4 w-4" />}
                    label="Nama Lengkap"
                    value={data.full_name}
                  />
                  <InfoRow
                    icon={<UserRound className="h-4 w-4" />}
                    label="Username"
                    value={data.username || "-"}
                  />
                  <InfoRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={<span className="break-all">{data.email}</span>}
                  />
                  <InfoRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Nomor Telepon"
                    value={data.phone_number || "-"}
                  />
                  <InfoRow
                    icon={<ShieldCheck className="h-4 w-4" />}
                    label="Role"
                    value={<span className="capitalize">{data.role}</span>}
                  />
                  <InfoRow
                    icon={<UserRound className="h-4 w-4" />}
                    label="ID Customer"
                    value={`#${data.id}`}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">Ringkasan</h3>
                  <p className="text-sm text-muted-foreground">Info singkat customer dan metadata akun.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <InfoRow
                    icon={<CalendarClock className="h-4 w-4" />}
                    label="Dibuat"
                    value={formatDateTime(data.created_at)}
                  />
                  <InfoRow
                    icon={<Clock3 className="h-4 w-4" />}
                    label="Terakhir update"
                    value={formatDateTime(data.last_update ?? data.updated_at)}
                  />
                  <InfoRow
                    icon={<Clock3 className="h-4 w-4" />}
                    label="Login terakhir"
                    value={formatDateTime(data.last_login)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">Alamat</h3>
                  <p className="text-sm text-muted-foreground">Daftar alamat yang tersimpan untuk customer ini.</p>
                </div>
                {data.address?.length ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {data.address.map((address, index) => (
                      <div
                        key={`${address.address_line}-${index}`}
                        className="rounded-lg border bg-muted/20 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>Alamat {index + 1}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{address.address_line}</p>
                          </div>
                          {address.is_default && (
                            <Badge variant="secondary" className="shrink-0">
                              Default
                            </Badge>
                          )}
                        </div>

                        <Separator className="my-3" />

                        <div className="space-y-1 text-sm text-muted-foreground">
                          {formatAddress(address).map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Alamat belum tersedia.</p>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">Audit Data</h3>
                  <p className="text-sm text-muted-foreground">Informasi pembuat dan pengubah data customer.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <InfoRow
                    icon={<UserRound className="h-4 w-4" />}
                    label="Dibuat oleh"
                    value={data.created_by || "-"}
                  />
                  <InfoRow
                    icon={<CalendarClock className="h-4 w-4" />}
                    label="Tanggal dibuat"
                    value={formatDateTime(data.created_at)}
                  />
                  <InfoRow
                    icon={<UserRound className="h-4 w-4" />}
                    label="Diperbarui oleh"
                    value={data.updated_by || "-"}
                  />
                  <InfoRow
                    icon={<CalendarClock className="h-4 w-4" />}
                    label="Tanggal diperbarui"
                    value={formatDateTime(data.updated_at ?? data.last_update)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ContentLayout>
  );
}