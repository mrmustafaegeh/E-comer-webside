import ClientTranslationProvider from "../Component/ClientTranslationProvider.jsx";
import ReduxProvider from "../providers/ReduxProvider.jsx";
import ReactQueryProvider from "../providers/ReactQueryProvider.jsx";
import { AuthProvider } from "../contexts/AuthContext.js";
import { Inter, Outfit } from "next/font/google";
import StoreLayoutWrapper from "../Component/layout/StoreLayoutWrapper.jsx";

import "@/lib/env";
import "./globals.css";
import "./i18n.js";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: true,
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  adjustFontFallback: true,
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://quickqart.com"),
  title: {
    template: "%s | QuickQart",
    default: "QuickQart — Shop electronics, fashion & home",
  },
  description:
    "Curated products with clear pricing, secure checkout, and fast delivery.",
  keywords: ["e-commerce", "shop", "quickqart", "electronics", "fashion"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "QuickQart — Shop electronics, fashion & home",
    description: "Curated products with clear pricing and secure checkout.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable}`}
    >
      <body
        className="min-h-screen w-full font-body antialiased bg-[var(--bg)] text-[var(--text)]"
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          <ReduxProvider>
            <AuthProvider>
              <ClientTranslationProvider>
                <StoreLayoutWrapper>{children}</StoreLayoutWrapper>
              </ClientTranslationProvider>
            </AuthProvider>
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
