"use client";
import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar solicitudes…",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={
        "flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 " +
        "text-white " +
        className
      }
    >
      <Search className="h-4 w-4 opacity-70" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent placeholder:text-white/60 focus:outline-none"
      />
    </div>
  );
}
