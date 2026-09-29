import { useEffect, useRef, useState } from "react";

interface Props {
  question: string;
  answer: string;
}

/**
 * Accessible accordion. Uses native <button> + aria-expanded, animates
 * the panel via CSS max-height/opacity.
 */
export default function Disclosure({ question, answer }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      const h = panel.scrollHeight;
      panel.style.maxHeight = reducedMotion ? `${h}px` : `${h}px`;
      panel.style.opacity = "1";
    } else {
      panel.style.maxHeight = "0px";
      panel.style.opacity = "0";
    }
  }, [open]);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-5 text-left text-fg hover:text-accent"
      >
        <span className="text-base font-medium">{question}</span>
        <span
          aria-hidden="true"
          className={
            "shrink-0 text-fg-muted transition-transform duration-200 " +
            (open ? "rotate-45" : "")
          }
        >
          <svg
            width="16"
            height="16"
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
        <p className="pb-5 pr-8 text-sm leading-relaxed text-fg-muted">{answer}</p>
      </div>
    </div>
  );
}