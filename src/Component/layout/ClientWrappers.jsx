"use client";

import dynamic from "next/dynamic";

export const ChatbotTrigger = dynamic(
  () => import("../../chatbot/ChatbotTrigger.jsx"),
  { ssr: false }
);
