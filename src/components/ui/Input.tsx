import React from 'react';

// The canonical bordered text field — h-9 to match Button's md size, rounded
// to match the app's radius scale, and a visible focus border (accent, the
// app's generic interactive color) rather than the barely-there
// line-strong some fields had drifted to.
const FIELD_STYLE =
  'w-full rounded-md border border-line bg-surface text-[13px] text-ink placeholder:text-muted-soft focus:border-accent focus:outline-none';

export function Input({ className = '', ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`h-9 px-3 ${FIELD_STYLE} ${className}`} {...rest} />;
}

export function Textarea({ className = '', rows = 2, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={`resize-none px-3 py-2.5 leading-relaxed ${FIELD_STYLE} ${className}`} {...rest} />;
}
