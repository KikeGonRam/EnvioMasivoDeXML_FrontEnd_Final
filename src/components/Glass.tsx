import clsx from "clsx";

export function Glass({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-xl",
        "shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      {children}
    </div>
  );
}
