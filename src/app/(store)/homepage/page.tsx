import Image from "next/image";
import ProductList from "./components/ProductList";
import Categories from "./components/categories";

const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) => {
  const category = (await searchParams).category;
  return (
    <div className="px-6 lg:px-16 w-full">
      <div className="relative aspect-3/1 mb-12">
        <Image src="/featured.png" alt="Featured Product" fill sizes="100vw"/>
      </div>
      <Categories />
      <ProductList category={category} params="homepage"/>
    </div>
  );
};

export default HomePage;
