import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

export function StatCard({
  title,
  value,
  icon: Icon,
  tone = "slate", // "green" | "rose" | "sky" | "slate"
}: {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  tone?: "green" | "rose" | "sky" | "slate";
}) {
  const toneCls: Record<string, string> = {
    green: "border-emerald-200/80",
    rose: "border-rose-200/80",
    sky: "border-sky-200/80",
    slate: "border-slate-200/80",
  };
  const badgeBg: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div
      className={clsx(
        "rounded-2xl bg-white text-slate-900",
        "border shadow-sm p-4",
        toneCls[tone]
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={clsx(
              "grid h-10 w-10 place-items-center rounded-xl border",
              badgeBg[tone]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <p className="text-sm text-slate-600">{title}</p>
          <div className="text-3xl font-semibold leading-tight">{value}</div>
        </div>
      </div>
    </div>
  );
}
