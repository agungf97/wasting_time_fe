import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Suspense } from "react";

export default async function DashboardPage() {
  return (
    <Suspense fallback={null}>
    <ContentLayout>
      <div className="space-y-6 relative">
        Test
      </div>
    </ContentLayout>
    </Suspense>
  );
}