import Header from "../components/ui/Header.jsx";
import Footer from "../components/ui/Footer.jsx";
import ScrollToTop from "../components/ui/ScrollToTop.jsx";
import ClientTranslationProvider from "../components/ClientTranslationProvider.jsx";
import ReduxProvider from "./ReduxProvider.jsx";
import "./globals.css";
import "./i18n.js";
import AuthRestore from "../components/auth/AuthRestore.jsx";

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
        <ReduxProvider>
          <AuthRestore />
          <ClientTranslationProvider>
            <Header />
            <ScrollToTop />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </ClientTranslationProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
