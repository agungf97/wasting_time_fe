import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "./components/data-table";

export default async function UsersPage() {

    return (
        <Card className="m-8">
            <CardHeader>
                <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
                <UsersTable />
            </CardContent>
        </Card>
    )
}