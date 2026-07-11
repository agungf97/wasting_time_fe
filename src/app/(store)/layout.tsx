import Footer from "@/components/footer";
import { Header } from "@/components/header";

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
