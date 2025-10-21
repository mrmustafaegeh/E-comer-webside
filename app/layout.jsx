import Header from "../components/ui/Header.jsx";
import Footer from "../components/ui/Footer.jsx";
import ScrollToTop from "../components/ui/ScrollToTop.jsx";
import { CartProvider } from "../context/cartContext.jsx";
import ClientTranslationProvider from "../components/ClientTranslationProvider.jsx";
import "./globals.css";
import "./i18n.js";

export const metadata = {
  title: {
    template: "%s | QuickCart",
    default: "QuickCart - Best Electronics Store",
  },
  description:
    "Best products, unbeatable service. Your trusted partner for quality electronics.",
  keywords: "electronics, gadgets, smartphones, laptops, tech, online store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen w-full">
        <ClientTranslationProvider>
          <CartProvider>
            <Header />
            <ScrollToTop />
            <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </ClientTranslationProvider>
      </body>
    </html>
  );
}
