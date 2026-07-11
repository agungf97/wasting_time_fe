"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, MapPin, Monitor, Lock } from "lucide-react";
import { AddressManager } from "@/components/form/address/address-manager";
import { SessionsList } from "@/components/form/sessions/sessions-list";
import { ProfileForm } from "./form/users/profile-form";
import { ChangePasswordInline } from "./form/auth/change-password-inline";

const TABS = [
  { id: "profile", label: "Data Pengguna", description: "Nama, email, telepon", icon: User },
  { id: "address", label: "Alamat", description: "Kelola alamat pengiriman", icon: MapPin },
  { id: "sessions", label: "Sesi Aktif", description: "Perangkat yang login", icon: Monitor },
  { id: "password", label: "Ganti Password", description: "Keamanan akun", icon: Lock },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface SettingsClientProps {
  role: string;
  initialData: {
    full_name: string;
    username: string;
    email: string;
    phone_number: string;
  };
}

export function SettingsClient({ role, initialData }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-1 mb-6">
        <h1 className="text-2xl font-bold">Pengaturan Akun</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi profil dan keamanan akun Anda
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        <nav className="space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-start gap-3 rounded-lg px-4 py-3 text-left transition-colors cursor-pointer",
                  isActive ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 mt-0.5 shrink-0",
                    isActive ? "text-primary-foreground" : "text-muted-foreground",
                  )}
                />
                <span>
                  <span className="block text-sm font-medium">{tab.label}</span>
                  <span
                    className={cn(
                      "block text-xs",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    {tab.description}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="bg-background rounded-xl border p-6">
          {activeTab === "profile" && <ProfileForm role={role} initialData={initialData} />}
          {activeTab === "address" && <AddressManager />}
          {activeTab === "sessions" && <SessionsList />}
          {activeTab === "password" && <ChangePasswordInline />}
        </div>
      </div>
    </div>
  );
}