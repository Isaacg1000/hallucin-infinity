import React from 'react';
import { ShareIcon } from 'lucide-react';
import { Button } from './Button';
import { useToast } from './Toast';

interface ShareButtonProps {
  /** What's being shared, used only in the confirmation toast. */
  label: string;
  variant?: 'primary' | 'secondary';
}

/** Copies the current URL and confirms it — a real action, not a
 * decorative icon. No backend to actually notify a teammate, so this is
 * exactly what it claims to be: a shareable link, not a fabricated
 * "3 people are viewing this" signal. */
export function ShareButton({ label, variant = 'secondary' }: ShareButtonProps) {
  const { showToast } = useToast();

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(`Link copied — share ${label} with a teammate`, 'success');
    } catch {
      showToast("Couldn't copy the link — copy it from your browser's address bar instead");
    }
  }

  return (
    <Button variant={variant} onClick={handleShare}>
      <ShareIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
      Share
    </Button>
  );
}
