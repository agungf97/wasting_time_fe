import { getProductsAction } from "@/actions/product";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductsTable from "./component/product-table";

export default async function Products() {
  const { data } = await getProductsAction();

  return (
    <ContentLayout>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductsTable initialData={data ?? []} />
        </CardContent>
      </Card>
    </ContentLayout>
  );
}