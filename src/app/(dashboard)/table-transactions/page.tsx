import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductsTable from "./components/data-table";

export default async function TransactionPage() {

    return (
        <Card className="m-8">
            <CardHeader>
                <CardTitle>Transaction</CardTitle>
            </CardHeader>
            <CardContent>
                <ProductsTable />
            </CardContent>
        </Card>
    )
}