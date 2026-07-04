import ProductList from "../homepage/components/ProductList";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) => {
  const category = (await searchParams).category;
  return (
    <div className="px-6 lg:px-16 w-full">
      <ProductList category={category} params="products"/>
    </div>
  );
};

export default ProductsPage;
