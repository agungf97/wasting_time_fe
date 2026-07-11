'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop, Smartphone, X } from "lucide-react";
import { toast } from "sonner";
import {
  getActiveSessionsAction,
  logoutSessionByIdAction,
} from "@/actions/auth";
import { SessionItem } from "@/lib/interface/auth";

function getSessionId(session: SessionItem): string | undefined {
  const rawValue =
    session.session_id ??
    (session.sessionId as string | number | undefined) ??
    (session.id as string | number | undefined);

  if (rawValue === null || rawValue === undefined) return undefined;

  const normalized = String(rawValue).trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function SessionsList() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const loadSessions = async () => {
    const { data, error } = await getActiveSessionsAction();

    if (error) {
      toast.error(error);
      return;
    }

    setSessions(data ?? []);
  };

  useEffect(() => {
    let ignore = false;

    const initialLoad = async () => {
      const { data, error } = await getActiveSessionsAction();
      if (ignore) return;

      if (error) {
        toast.error(error);
      } else {
        setSessions(data ?? []);
      }
      setLoading(false);
    };

    initialLoad();

    return () => {
      ignore = true;
    };
  }, []);

  const handleRevoke = async (sessionId: string) => {
    setRevokingId(sessionId);
    const { error, message } = await logoutSessionByIdAction(sessionId);

    if (error) {
      toast.error(error);
    } else {
      toast.success(message || "Sesi berhasil dihentikan");
      setSessions((prev) => prev.filter((s) => getSessionId(s) !== sessionId));
      await loadSessions();
    }
    setRevokingId(null);
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat sesi...</p>;
  }

  if (sessions.length === 0) {
    return <p className="text-sm text-muted-foreground">Tidak ada sesi aktif.</p>;
  }

  return (
    <div className="space-y-3">
      {sessions.map((session, index) => {
        const sessionId = getSessionId(session);

        return (
        <Card
          key={
            sessionId ||
            `${session.device ?? "unknown"}-${session.ip_address ?? "ip-unknown"}-${index}`
          }
        >
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              {session.device?.toLowerCase().includes("mobile") ? (
                <Smartphone className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Laptop className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {session.device || "Perangkat tidak dikenal"}
                  {session.is_current && (
                    <span className="ml-2 text-xs text-green-600">(Sesi ini)</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.ip_address ?? "IP tidak diketahui"}
                  {session.last_active ? ` · Terakhir aktif ${session.last_active}` : ""}
                </p>
              </div>
            </div>

            {!session.is_current && (
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                disabled={!sessionId || revokingId === sessionId}
                onClick={() => {
                  if (!sessionId) {
                    toast.error("ID sesi tidak ditemukan");
                    return;
                  }
                  handleRevoke(sessionId);
                }}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
}