import { Info } from "lucide-react";

export const PrintHint = () => {
  return (
    <div className="mt-2 flex items-start gap-2 rounded-[5px] border border-zinc-200 bg-zinc-100 px-2.5 py-2 text-xs text-zinc-700 sm:gap-2.5 sm:px-3 sm:text-[13px]">
      <Info className="mt-px size-[16px] shrink-0 text-zinc-500 sm:size-[17px]" aria-hidden />
      <div className="min-w-0 leading-snug">
        <p className="font-medium text-zinc-900">No print dialog?</p>
        <p className="mt-1 text-[11px] text-zinc-600 sm:text-xs">
          Press <kbd className="rounded-[5px] border border-zinc-300 bg-zinc-200 px-1.5 py-0.5 font-mono text-xs text-zinc-800">Ctrl</kbd>{" "}
          +{" "}
          <kbd className="rounded-[5px] border border-zinc-300 bg-zinc-200 px-1.5 py-0.5 font-mono text-xs text-zinc-800">P</kbd>
          {" "}(Windows) or{" "}
          <kbd className="rounded-[5px] border border-zinc-300 bg-zinc-200 px-1.5 py-0.5 font-mono text-xs text-zinc-800">Cmd</kbd>{" "}
          +{" "}
          <kbd className="rounded-[5px] border border-zinc-300 bg-zinc-200 px-1.5 py-0.5 font-mono text-xs text-zinc-800">P</kbd>
          {" "}(Mac).
        </p>
      </div>
    </div>
  );
};
