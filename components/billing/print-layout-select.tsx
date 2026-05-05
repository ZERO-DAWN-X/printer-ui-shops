"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export const PRINT_LAYOUT_VALUES = ["type1", "type2", "type3", "type4"] as const;

export type PrintLayoutValue = (typeof PRINT_LAYOUT_VALUES)[number];

const OPTIONS: readonly { value: PrintLayoutValue; label: string }[] = [
  { value: "type1", label: "T1 · Classic bar" },
  { value: "type2", label: "T2 · Lined total" },
  { value: "type3", label: "T3 · Ribbon row" },
  { value: "type4", label: "T4 · Arrow value" },
] as const;

function collectScrollAncestors(el: HTMLElement | null): HTMLElement[] {
  const out: HTMLElement[] = [];
  let p = el?.parentElement;
  while (p) {
    const { overflowY } = getComputedStyle(p);
    if ((overflowY === "auto" || overflowY === "scroll") && p.scrollHeight > p.clientHeight + 1) {
      out.push(p);
    }
    p = p.parentElement;
  }
  return out;
}

type PrintLayoutSelectProps = {
  labelId: string;
  value: PrintLayoutValue;
  onChange: (next: PrintLayoutValue) => void;
};

export const PrintLayoutSelect = ({ labelId, value, onChange }: PrintLayoutSelectProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const currentLabel = OPTIONS.find((o) => o.value === value)?.label ?? "";
  const [placement, setPlacement] = useState<{ top: number; left: number; width: number } | null>(null);

  const syncPlacement = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setPlacement({
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 176),
    });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setPlacement(null);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      return undefined;
    }

    syncPlacement();

    const anchor = anchorRef.current;
    const scrollAncestors = collectScrollAncestors(anchor ?? null);

    scrollAncestors.forEach((host) => host.addEventListener("scroll", syncPlacement, { passive: true }));
    window.addEventListener("resize", syncPlacement, { passive: true });

    return () => {
      scrollAncestors.forEach((host) => host.removeEventListener("scroll", syncPlacement));
      window.removeEventListener("resize", syncPlacement);
    };
  }, [open, syncPlacement]);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent | PointerEvent) => {
      const root = rootRef.current;
      const target = event.target as Node | null;
      if (!target) return;
      if (root?.contains(target)) return;
      if (document.getElementById(listId)?.contains(target)) return;
      close();
    };
    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, [open, close, listId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const handleToggle = () => {
    if (open) {
      close();
      return;
    }
    syncPlacement();
    setOpen(true);
  };

  const listContent =
    open && placement !== null ? (
      <div
        id={listId}
        role="listbox"
        aria-label="Receipt layout"
        className="rounded-[5px] border border-zinc-200 bg-white p-1 ring-1 ring-zinc-900/15"
        style={{
          position: "fixed",
          top: placement.top,
          left: placement.left,
          width: placement.width,
          zIndex: 9999,
        }}
      >
        {OPTIONS.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                onChange(opt.value);
                close();
              }}
              className={`flex w-full items-center gap-2 rounded-[5px] px-2.5 py-2 text-left text-sm font-medium transition outline-none focus-visible:bg-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-inset ${
                selected ? "bg-zinc-900 text-white" : "text-zinc-800 hover:bg-zinc-50"
              }`}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-[5px] text-[11px] font-bold tabular-nums tracking-tight ${
                  selected ? "border border-white/20 bg-white/10 text-white" : "border border-zinc-200 bg-zinc-100 text-zinc-600"
                }`}
                aria-hidden
              >
                {selected ? <Check className="size-3.5 text-white/90" strokeWidth={2.25} /> : opt.value.replace("type", "")}
              </span>
              <span className="min-w-0 flex-1 truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
    ) : null;

  return (
    <>
      <div ref={rootRef} className="relative">
        <button
          ref={anchorRef}
          type="button"
          aria-labelledby={labelId}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listId : undefined}
          onClick={handleToggle}
          className="flex h-9 w-full items-center justify-between gap-2 rounded-[5px] border border-zinc-300 bg-zinc-100 px-2.5 text-left text-sm font-medium text-zinc-900 outline-none transition hover:border-zinc-400 hover:bg-zinc-50 focus-visible:border-zinc-500 focus-visible:bg-zinc-50 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
        >
          <span className="min-w-0 truncate">{currentLabel}</span>
          <ChevronDown
            className={`size-[17px] shrink-0 text-zinc-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            aria-hidden
            strokeWidth={2}
          />
        </button>
      </div>

      {typeof document !== "undefined" && listContent !== null ? createPortal(listContent, document.body) : null}
    </>
  );
};
