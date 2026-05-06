import type { ReactNode } from "react";

export const billingInputClass =
  "h-8 w-full rounded-[5px] border border-zinc-300 bg-zinc-100 px-2 text-xs text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500 focus:bg-zinc-50 sm:text-[13px]";

export const billingTextAreaClass =
  "min-h-[2.375rem] w-full resize-y rounded-[5px] border border-zinc-300 bg-zinc-100 px-2 py-1 text-xs text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500 focus:bg-zinc-50 sm:text-[13px]";

export const billingLabelClass = "mb-0.5 block text-[10px] font-medium text-zinc-600 sm:text-[11px]";

type SettingsSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export const SettingsSection = ({ title, description, children }: SettingsSectionProps) => {
  return (
    <section className="rounded-[5px] border border-zinc-200 bg-zinc-50 p-2 sm:p-2.5">
      <header className="mb-1.5 border-b border-zinc-200 pb-1.5 sm:pb-2">
        <h2 className="text-[11px] font-semibold tracking-tight text-zinc-900 sm:text-xs">{title}</h2>
        {description ? <p className="mt-px text-[9px] leading-snug text-zinc-500 sm:text-[10px]">{description}</p> : null}
      </header>
      <div className="space-y-2 sm:space-y-2.5">{children}</div>
    </section>
  );
};
