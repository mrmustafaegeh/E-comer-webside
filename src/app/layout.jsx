// src/app/layout.jsx
import ClientTranslationProvider from "../Component/ClientTranslationProvider.jsx";
import ReduxProvider from "../providers/ReduxProvider.jsx";
import ReactQueryProvider from "../providers/ReactQueryProvider.jsx";
import { AuthProvider } from "../contexts/AuthContext.js";
import { Inter, Syne, Space_Mono, Outfit } from "next/font/google";
import StoreLayoutWrapper from "../Component/layout/StoreLayoutWrapper.jsx";

import "@/lib/env";
import "./globals.css";
import "./i18n.js";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap', adjustFontFallback: true });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: 'swap', adjustFontFallback: true });
const spaceMono = Space_Mono({ 
  subsets: ["latin"], 
  weight: ["400", "700"], 
  variable: "--font-space-mono",
  display: 'swap',
  adjustFontFallback: true
});
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: 'swap', adjustFontFallback: true });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://example.com"),
  title: {
    template: "%s | QUICKQART COMMERCE",
    default: "QuickQart // SHOP THE VOID",
  },
  description: "Experience the future of commerce. QuickQart shopping inside the infinite void. 2026 E-commerce Protocol.",
  keywords: ["e-commerce", "3d", "quickqart", "future", "luxury"],
  authors: [{ name: "QUICKQART ARCHITECT" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "QuickQart // SHOP THE VOID",
    description: "QuickQart shopping inside the infinite void.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${syne.variable} ${spaceMono.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link 
          href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className="min-h-screen w-full font-body antialiased bg-[#000208] text-[#F0F4FF] relative overflow-x-hidden selection:bg-cyan-400 selection:text-black"
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          <ReduxProvider>
            <AuthProvider>
              <ClientTranslationProvider>
                <StoreLayoutWrapper>
                  {children}
                </StoreLayoutWrapper>
              </ClientTranslationProvider>
            </AuthProvider>
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
