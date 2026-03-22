import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>{children}</main>
      <Footer />
    </>
  );
}
