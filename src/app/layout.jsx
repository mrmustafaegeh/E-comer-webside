import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import ScrollToTop from "../components/ui/ScrollToTop.jsx";
import ClientTranslationProvider from "../components/ClientTranslationProvider.jsx";
import ReduxProvider from "./ReduxProvider.jsx";
import { AuthProvider } from "../contexts/AuthContext.js";
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
        <ReduxProvider>
          <AuthProvider>
            <ClientTranslationProvider>
              <Header />
              <ScrollToTop />
              <div className="flex-1 w-full">{children}</div>
              <Footer />
            </ClientTranslationProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
