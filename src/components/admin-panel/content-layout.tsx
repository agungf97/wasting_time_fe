import { ContentLayoutProps } from "@/lib/interface/custom";
import { ClientOnly } from "../client-only";
import { Header } from "../header";

export async function ContentLayout({ children }: ContentLayoutProps) {

  return (
    <ClientOnly>
      <Header variant="admin" />
      <div className="p-6">{children}</div>
    </ClientOnly>
  );
}