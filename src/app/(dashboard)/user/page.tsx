import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUsersAction } from "@/actions/user";
import UsersTable from "./component/user-table";

export default async function Users() {
  const { data } = await getUsersAction();

  return (
    <ContentLayout>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable initialData={data ?? []} />
        </CardContent>
      </Card>
    </ContentLayout>
  );
}