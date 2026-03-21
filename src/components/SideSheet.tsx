"use client";

import { useEffect, useRef } from "react";

interface SideSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function SideSheet({ open, onClose, children }: SideSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[min(540px,93vw)] h-full bg-[#0d0f14] border-l border-white/[0.06] overflow-y-auto animate-slide-in"
      >
        <button
          onClick={onClose}
          className="sticky top-0 right-0 z-10 float-right m-3.5 px-3.5 py-1.5 text-sm text-gray-500 bg-white/[0.05] border border-white/[0.08] rounded-lg hover:bg-white/10 transition-colors font-sans"
        >
          ✕ Close
        </button>
        <div className="p-6 pb-12 clear-both">
          {children}
        </div>
      </div>
    </div>
  );
}
