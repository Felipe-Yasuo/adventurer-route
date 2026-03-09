import React from "react";

/**
 * Modal — shell de diálogo estilo pergaminho do projeto.
 * Renderiza um overlay com backdrop blur e um painel centralizado.
 */
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
      <div className="absolute inset-0 bg-[rgba(20,12,8,0.58)] backdrop-blur-[2px]" />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-[28px] border border-black/10 bg-[rgba(242,228,198,0.98)] shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
