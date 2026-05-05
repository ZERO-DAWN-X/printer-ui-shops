import { Info } from "lucide-react";

export const PrintHint = () => {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-[5px] border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
      <Info className="mt-0.5 size-[18px] shrink-0 text-zinc-500" aria-hidden />
      <div className="leading-relaxed">
        <p className="font-medium text-zinc-900">No print dialog?</p>
        <p className="mt-1 text-zinc-600">
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
