import HomePage from "./(store)/homepage/page";
import StoreLayout from "./(store)/layout";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) {
  return (
    <StoreLayout>
      <HomePage searchParams={searchParams} />
    </StoreLayout>
  );
}