import type { ReactNode } from "react";

export const billingInputClass =
  "h-9 w-full rounded-[5px] border border-zinc-300 bg-zinc-100 px-2.5 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500 focus:bg-zinc-50";

export const billingLabelClass = "mb-1 block text-[11px] font-medium text-zinc-600";

type SettingsSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export const SettingsSection = ({ title, description, children }: SettingsSectionProps) => {
  return (
    <section className="rounded-[5px] border border-zinc-200 bg-zinc-50 p-3">
      <header className="mb-2 border-b border-zinc-200 pb-2">
        <h2 className="text-xs font-semibold tracking-tight text-zinc-900">{title}</h2>
        {description ? <p className="mt-0.5 text-[10px] leading-snug text-zinc-500">{description}</p> : null}
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
};
