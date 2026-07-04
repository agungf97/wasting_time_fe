import Footer from "@/components/customer/footer";
import Header from "@/components/customer/header";

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <main className="w-full">
        <Header />
        <div className="p-4">
            {children}
        </div>
        <Footer />
    </main>
  );
}
