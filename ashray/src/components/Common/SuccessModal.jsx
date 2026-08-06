import { useEffect } from "react";
import "./SuccessModal.css";

const DOT_COUNT = 16;
const DOT_COLORS = ["#4059aa", "#e8485b", "#f59e0b", "#10b981", "#8b5cf6", "#06b6d4"];

export default function SuccessModal({
  open,
  onClose,
  title = "Thank You!",
  message = "",
  actionLabel,
  onAction,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sm-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="sm-card" onClick={(e) => e.stopPropagation()}>
        <button className="sm-close" onClick={onClose} aria-label="Close dialog">
          ×
        </button>

        <div className="sm-burst" aria-hidden="true">
          {Array.from({ length: DOT_COUNT }).map((_, i) => {
            const angle = (i / DOT_COUNT) * Math.PI * 2;
            const dist = 110 + (i % 3) * 40;
            return (
              <span
                key={i}
                style={{
                  "--tx": `${Math.round(Math.cos(angle) * dist)}px`,
                  "--ty": `${Math.round(Math.sin(angle) * dist)}px`,
                  background: DOT_COLORS[i % DOT_COLORS.length],
                  animationDelay: `${i * 14}ms`,
                }}
              />
            );
          })}
        </div>

        <div className="sm-check">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h3 className="sm-title">{title}</h3>
        <p className="sm-message">{message}</p>

        {actionLabel && onAction && (
          <button className="btn-3d sm-action" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
