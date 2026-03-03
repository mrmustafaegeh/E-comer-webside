"use client";

import { usePathname } from 'next/navigation';
import NavbarFloat from "./NavbarFloat";
import { ParticleField, CustomCursor, ChatbotTrigger } from "./ClientWrappers";
import dynamic from 'next/dynamic';
import SmoothScrollProvider from "../../providers/SmoothScrollProvider";

const FooterZeroG = dynamic(() => import("./FooterZeroG"));

export default function StoreLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // If we are on an admin route, do NOT render the Store UI components (nav, footer, 3d effects)
  // and do NOT apply the top padding or min-h-screen which breaks the dashboard layout.
  if (isAdmin) {
    // Return early without store chrome to allow the AdminLayout to take full control of the screen
    return <main id="admin-root" className="w-full h-screen">{children}</main>;
  }

  // Render the original global UI for the public shop
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <ParticleField />
      <NavbarFloat />
      
      <main id="main-content" className="relative z-10 pt-32 min-h-screen flex flex-col">
        {children}
      </main>
      
      <FooterZeroG />
      <ChatbotTrigger />
    </SmoothScrollProvider>
  );
}
