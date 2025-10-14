'use client';

import * as React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Messaggio del prompt di conferma */
  confirmMessage?: string;
};

/** Bottone submit che chiede conferma lato client e, se annullato, blocca il submit */
export default function ConfirmSubmit({ children, className, confirmMessage = 'Sei sicuro?' }: Props) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
