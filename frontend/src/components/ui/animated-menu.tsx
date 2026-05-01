"use client";

import React from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility Function ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STAGGER = 0.035;

// --- Helper Component (Renamed from Component to TextRoll) ---
const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className }) => {
  return (
    <span className={cn("relative inline-block", className)}>
      {children}
    </span>
  );
};

export { TextRoll };
