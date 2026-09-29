import { useEffect, useRef, useState } from "react";

interface Props {
  repoUrl: string;
  qrUrl: string;
}

/**
 * Toggle that reveals the F-Droid repository install steps when opened.
 */
export default function FDroidSteps({ repoUrl, qrUrl }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      panel.style.maxHeight = reducedMotion ? `${panel.scrollHeight}px` : `${panel.scrollHeight}px`;
      panel.style.opacity = "1";
    } else {
      panel.style.maxHeight = "0px";
      panel.style.opacity = "0";
    }
  }, [open]);

  return (
    <div className="rounded-lg border border-border bg-bg-soft">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-fg hover:text-accent"
      >
        <span className="inline-flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Add the Kivixa F-Droid repo
        </span>
        <span
          aria-hidden="true"
          className={
            "text-fg-muted transition-transform duration-200 " + (open ? "rotate-45" : "")
          }
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <div
        ref={panelRef}
        style={{ maxHeight: 0, opacity: 0, overflow: "hidden" }}
        className="transition-[max-height,opacity] duration-300 ease-out"
      >
        <ol className="space-y-2 px-4 pb-4 text-sm leading-relaxed text-fg-muted">
          <li>1. Install F-Droid from f-droid.org.</li>
          <li>2. Open F-Droid and go to <span className="font-mono text-fg">Settings</span>.</li>
          <li>3. Tap <span className="font-mono text-fg">Repositories</span>.</li>
          <li>4. Tap the <span className="font-mono text-fg">+</span> icon.</li>
          <li>5. Scan the QR or paste the URL below:</li>
        </ol>
        <div className="flex items-center gap-4 px-4 pb-4">
          <img
            src={qrUrl}
            alt="F-Droid repository QR code"
            width={120}
            height={120}
            className="rounded-md border border-border bg-bg"
          />
          <code className="block flex-1 break-all rounded-md border border-border bg-bg px-3 py-2 font-mono text-xs text-fg">
            {repoUrl}
          </code>
        </div>
      </div>
    </div>
  );
}