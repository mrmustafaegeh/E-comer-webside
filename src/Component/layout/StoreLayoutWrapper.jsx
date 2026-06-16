"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import NavbarFloat from "./NavbarFloat";
import Footer from "./Footer";

const ChatbotTrigger = dynamic(
  () => import("../../chatbot/ChatbotTrigger.jsx"),
  { ssr: false }
);

export default function StoreLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <NavbarFloat />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatbotTrigger />
    </div>
  );
}
