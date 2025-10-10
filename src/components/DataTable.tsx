import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export type Row = { email: string; cliente: string; xml: number; pdf: number };

export function DataTable({
  rows,
  variant = "white", // "white" | "glass"
}: {
  rows: Row[];
  variant?: "white" | "glass";
}) {
  const wrap =
    variant === "white"
      ? "rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm"
      : "rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl text-white shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)]";

  const th =
    variant === "white" ? "text-slate-600" : "text-white/85";
  const td =
    variant === "white" ? "text-slate-800" : "text-white/90";
  const headerRow =
    variant === "white"
      ? "bg-slate-50 hover:bg-slate-50 border-b border-slate-200"
      : "bg-white/10 hover:bg-white/10 border-b border-white/10";
  const bodyRow =
    variant === "white"
      ? "border-slate-100 even:bg-slate-50 hover:bg-slate-100/70 transition-colors"
      : "border-white/10 even:bg-white/[0.04] hover:bg-white/[0.08] transition-colors";

  return (
    <div className={`overflow-x-auto ${wrap}`}>
      <Table>
        <TableHeader>
          <TableRow className={headerRow}>
            <TableHead className={th}>Email</TableHead>
            <TableHead className={th}>Cliente</TableHead>
            <TableHead className={th}>XML</TableHead>
            <TableHead className={th}>PDF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i} className={bodyRow}>
              <TableCell className={td}>{r.email}</TableCell>
              <TableCell className={td}>{r.cliente}</TableCell>
              <TableCell className={td}>{r.xml}</TableCell>
              <TableCell className={td}>{r.pdf}</TableCell>
            </TableRow>
          ))}
          {!rows.length && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 opacity-70">
                Sin resultados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
