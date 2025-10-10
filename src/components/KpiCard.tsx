import { Card, CardContent } from "@/components/ui/card";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

type Color = "green" | "red" | "yellow" | "blue";
const rings: Record<Color, string> = {
  green: "ring-emerald-400/50",
  red: "ring-rose-400/50",
  yellow: "ring-amber-300/60",
  blue: "ring-sky-400/50",
};

export function KpiCard({
  title,
  value,
  color = "blue",
  icon: Icon,
}: {
  title: string;
  value: number;
  color?: Color;
  icon?: LucideIcon;
}) {
  return (
    <Card
      className={clsx(
        "relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl",
        "border border-white/15 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)]",
        "ring-1",
        rings[color]
      )}
    >
      <CardContent className="p-5 flex items-center gap-4">
        {Icon && (
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 border border-white/20">
            <Icon className="h-5 w-5 opacity-90" />
          </div>
        )}
        <div>
          <p className="text-sm text-white/80">{title}</p>
          <div className="mt-1.5 text-3xl font-semibold tracking-tight">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
