import React from "react";

export function Modal({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-[28px] border border-(--color-border) bg-(--color-surface) shadow-(--shadow-cardStrong)">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
