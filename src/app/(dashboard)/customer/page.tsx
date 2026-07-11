import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomerTable from "./component/customer-table";
import { getCustomerAction } from "@/actions/customer";

export default async function Customers() {
  const { data } = await getCustomerAction();

  return (
    <ContentLayout>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerTable initialData={data ?? []} />
        </CardContent>
      </Card>
    </ContentLayout>
  );
}