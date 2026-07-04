import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductsTable from "../table-transactions/components/data-table";

export default async function ProductsPage() {

    return (
        <Card className="m-8">
            <CardHeader>
                <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
                <ProductsTable />
            </CardContent>
        </Card>
    )
}