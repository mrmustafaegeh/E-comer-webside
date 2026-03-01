// src/app/layout.jsx
import Header from "../Component/layout/Header.jsx";
import Footer from "../Component/layout/Footer.jsx";
import ScrollToTop from "../Component/ui/ScrollToTop.jsx";
import ClientTranslationProvider from "../Component/ClientTranslationProvider.jsx";
import ReduxProvider from "../providers/ReduxProvider.jsx";
import ReactQueryProvider from "../providers/ReactQueryProvider.jsx";
import { AuthProvider } from "../contexts/AuthContext.js";
import ChatbotTrigger from "../chatbot/ChatbotTrigger.jsx";
import { JetBrains_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import "./i18n.js";

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jb-mono",
  display: "swap",
  preload: true,
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  fallback: ["monospace"],
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
  preload: true,
  weight: "400",
  fallback: ["system-ui", "arial"],
});

export const metadata = {
  title: {
    template: "%s | SYSTEM ROOT",
    default: "// QUICKCART MODULE",
  },
  description:
    "// EXECUTIVE TERMINAL PROTOCOL INITIATED.",
  keywords: "executive, terminal, ecommerce, modular",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head />
      <body
        className={`${jbMono.variable} ${bebasNeue.variable} flex flex-col min-h-screen w-full font-mono antialiased bg-black text-white relative`}
        suppressHydrationWarning
      >
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('/noise.svg')] z-50"></div>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-[100]"
        >
          Skip to content
        </a>

        <ReactQueryProvider>
          <ReduxProvider>
            <AuthProvider>
              <ClientTranslationProvider>
                <Header />
                <ScrollToTop />
                <ChatbotTrigger />
                <main id="main-content" className="flex-1 w-full">
                  {children}
                </main>
                <Footer />
              </ClientTranslationProvider>
            </AuthProvider>
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
