"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

export function Modal({ open, onClose, title, children, size = "md" }: Props) {
  const handleClose = useCallback(onClose, [onClose]);

  // Sluit op Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const maxW = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" }[size];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "relative w-full rounded-2xl bg-white shadow-2xl",
          "max-h-[90vh] overflow-y-auto",
          maxW
        )}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-100 bg-white px-6 py-4">
          <h3
            id="modal-title"
            className="text-base font-semibold text-neutral-900"
          >
            {title}
          </h3>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Sluiten"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
