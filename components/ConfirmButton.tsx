"use client";

import type { ButtonHTMLAttributes } from "react";

export function ConfirmButton({
  confirmMessage,
  onBeforeSubmit,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { confirmMessage: string; onBeforeSubmit?: () => void }) {
  return (
    <button
      {...props}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
          return;
        }
        onBeforeSubmit?.();
      }}
    />
  );
}
