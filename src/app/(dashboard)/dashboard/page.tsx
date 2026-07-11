// import { cookies } from "next/headers";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Suspense } from "react";

// const EMPTY_FILTER_OPTIONS: FilterOptions = {
//   status: [],
//   nama_pelapor: [],
//   department_pelapor: [],
//   jabatan_pelapor: [],
//   lokasi_temuan: [],
//   detail_lokasi_temuan: [],
//   type_observasi: [],
// };

export default async function DashboardPage() {
  // const cookieStore = await cookies();
  // const name = cookieStore.get("name")?.value;

  // const [
  //   { data: initialData, meta: initialMeta },
  //   { data: filterOptions },
  // ] = await Promise.all([
  //   getObservasiDashboardAction(),
  //   getObservasiFilterOptionsAction(),
  // ]);

  return (
    <Suspense fallback={null}>
    <ContentLayout>
      <div className="space-y-6 relative">
        {/* <DashboardComponent
          initialData={initialData ?? null}
          initialMeta={initialMeta ?? null}
          filterOptions={filterOptions ?? EMPTY_FILTER_OPTIONS}
          name={name}
        /> */}
        Test
      </div>
    </ContentLayout>
    </Suspense>
  );
}