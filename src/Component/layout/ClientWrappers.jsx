"use client";

import dynamic from 'next/dynamic';

export const ParticleField = dynamic(() => import("../3d/ParticleField.jsx"), { ssr: false });
export const CustomCursor = dynamic(() => import("../ui/CustomCursor.jsx"), { ssr: false });
export const ChatbotTrigger = dynamic(() => import("../../chatbot/ChatbotTrigger.jsx"), { ssr: false });
