"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastAction = { label: string; href?: string; onClick?: () => void };
type Toast = { id: number; message: string; action?: ToastAction };

const ToastContext = createContext<{
  show: (message: string, action?: ToastAction) => void;
} | null>(null);

const VISIBLE_MS = 4000;
const EXIT_MS = 150;

/** One toast at a time, announced to screen readers, with an optional action (View cart, Undo). */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setLeaving(true);
    timer.current = setTimeout(() => {
      setToast(null);
      setLeaving(false);
    }, EXIT_MS);
  }, []);

  const show = useCallback(
    (message: string, action?: ToastAction) => {
      clearTimeout(timer.current);
      setLeaving(false);
      setToast({ id: Date.now(), message, action });
      timer.current = setTimeout(dismiss, VISIBLE_MS);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ show }), [show]);

  const actionClass =
    "press inline-flex h-11 shrink-0 items-center rounded-full bg-white/15 px-4 text-sm font-semibold hover:bg-white/25";

  return (
    <ToastContext.Provider value={value}>
      {children}
      <p className="sr-only" role="status" aria-live="polite">
        {toast?.message}
      </p>
      {toast && (
        <div
          key={toast.id}
          aria-hidden
          className={`fixed inset-x-4 bottom-24 z-[60] mx-auto flex max-w-sm items-center justify-between gap-3 rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-sm font-medium text-white shadow-xl shadow-black/25 lg:bottom-6 ${
            leaving ? "toast-out" : "rise-in"
          }`}
        >
          <span className="line-clamp-1">{toast.message}</span>
          {toast.action?.href ? (
            <Link href={toast.action.href} onClick={dismiss} className={actionClass}>
              {toast.action.label}
            </Link>
          ) : toast.action ? (
            <button
              onClick={() => {
                toast.action?.onClick?.();
                dismiss();
              }}
              className={actionClass}
            >
              {toast.action.label}
            </button>
          ) : null}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
