"use client";

import { useMemo, useState } from "react";
import { FileDrop } from "@/components/FileDrop";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Download, Filter, CheckCircle2, XCircle, Send, LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { toCSVAndDownload } from "@/lib/csv";
import type { DryRunSummary, SendResult } from "@/types";
import { Glass } from "@/components/Glass";
import { SearchBar } from "@/components/SearchBar";
import { StatCard } from "@/components/StatCard";
import { EmailTemplates } from "@/components/EmailTemplates";
import { templates } from "@/lib/templates";
import { AuthGuard, useAuth } from "@/components/AuthGuard";

type Mode = "idle" | "dry" | "sending";

function PageContent() {
  const { user, logout } = useAuth();
  const [mode, setMode] = useState<Mode>("idle");
  const [loading, setLoading] = useState(false);

  // Plantilla seleccionada + parámetros
  const [periodo, setPeriodo] = useState("Agosto 2025");
  const [subject, setSubject] = useState(templates[0].subject);
  const [message, setMessage] = useState(templates[0].html);
  const [maxMbInline, setMaxMbInline] = useState<number>(15);

  // Archivos
  const [zips, setZips] = useState<File[]>([]);
  const [csv, setCsv] = useState<File | null>(null);

  // Estado tabla/búsqueda
  const [query, setQuery] = useState("");
  const [drySummary, setDrySummary] = useState<DryRunSummary | null>(null);
  const [sendResult, setSendResult] = useState<SendResult | null>(null);

  const filteredRows = useMemo(() => {
    const rows =
      drySummary?.summary?.detalle ??
      sendResult?.log?.map((l) => ({ email: l.email, cliente: l.cliente, xml: 0, pdf: 0 })) ??
      [];
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) => r.email?.toLowerCase().includes(q) || r.cliente?.toLowerCase().includes(q)
    );
  }, [drySummary, sendResult, query]);

  // KPIs
  const enviados = sendResult?.sent ?? 0;
  const fallidos = sendResult?.skipped ?? 0;
  const enProceso = mode === "sending" ? (drySummary?.summary?.totals?.destinatarios ?? 0) : 0;

  async function onDryRun() {
    if (!csv || !zips.length) return toast.error("Sube al menos 1 ZIP y el CSV.");
    try {
      setLoading(true);
      setMode("dry");
      const fd = new FormData();
      zips.forEach((f) => fd.append("zips", f));
      fd.append("csv", csv);
      const data = await api.dryRun(fd);
      setDrySummary(data);
      setSendResult(null);
      toast.success("Simulación lista.");
    } catch (e: any) {
      toast.error(e?.message || "Error en simulación");
    } finally {
      setLoading(false);
    }
  }

  async function onSend() {
    if (!csv || !zips.length) return toast.error("Sube al menos 1 ZIP y el CSV.");
    try {
      setLoading(true);
      setMode("sending");
      const fd = new FormData();
      zips.forEach((f) => fd.append("zips", f));
      fd.append("csv", csv);
      // Usa la plantilla elegida (el backend hace replace de {{cliente}} y {{periodo}})
      fd.append("subject", subject);
      fd.append("message", message);
      fd.append("periodo", periodo);
      fd.append("maxMbInline", String(maxMbInline));
      const data = await api.send(fd);
      setSendResult(data);
      toast.success(`Envío finalizado: ${data.sent} OK / ${data.skipped} con error`);
    } catch (e: any) {
      toast.error(e?.message || "Error en envío");
    } finally {
      setLoading(false);
      setMode("idle");
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado con información de usuario */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Envío masivo de Facturas + XML</h1>
          <p className="opacity-80">
            Total: {drySummary?.summary?.totals?.destinatarios ?? 0} solicitudes procesadas
          </p>
        </div>
        
        {/* Información del usuario autenticado */}
        {user && (
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">{user.nombre}</p>
                <p className="text-xs opacity-70">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="rounded-lg hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* KPIs compactos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Correos enviados" value={enviados} icon={CheckCircle2} tone="green" />
        <StatCard title="Correos fallidos" value={fallidos} icon={XCircle} tone="rose" />
        <StatCard title="En proceso" value={enProceso} icon={Send} tone="sky" />
      </div>

      {/* Buscador + acciones */}
      <Glass>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <SearchBar value={query} onChange={setQuery} className="md:w-[420px]" />
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" className="rounded-xl bg-white/15 text-white border-white/20">
                <Filter className="mr-2 h-4 w-4" /> Filtros
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600"
                onClick={() => {
                  const detalle = drySummary?.summary?.detalle;
                  if (!detalle?.length) return toast.error("Nada que exportar");
                  toCSVAndDownload(detalle, "resumen.csv");
                }}
              >
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Glass>

      {/* Uploader */}
      <Glass>
        <CardContent className="p-4">
          <FileDrop onZips={setZips} onCsv={setCsv} />
        </CardContent>
      </Glass>

      {/* PLANTILLAS DE CORREO */}
      <EmailTemplates
        periodo={periodo}
        onPick={(tpl) => {
          setSubject(tpl.subject);
          setMessage(tpl.html);
        }}
      />

      {/* Controles de periodo y tamaño */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-4 grid md:grid-cols-2 gap-3">
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 bg-white"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            placeholder="Periodo (ej. Agosto 2025)"
          />
          <div className="flex items-center gap-3">
            <input
              type="number"
              className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 w-32 bg-white"
              value={maxMbInline}
              onChange={(e) => setMaxMbInline(Number(e.target.value) || 15)}
            />
            <span className="text-slate-600">MB máximo en adjuntos antes de comprimir</span>
          </div>
        </div>

        <div className="px-4 pb-4 flex flex-wrap gap-3">
          <Button disabled={loading} onClick={onDryRun} className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white">
            🔎 Simular
          </Button>
          <Button disabled={loading} onClick={onSend} className="rounded-xl bg-sky-600 hover:bg-sky-700">
            📤 Enviar
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="text-lg font-medium text-white/90">Solicitudes Procesadas</div>
      <div className="p-0">
        <DataTable rows={filteredRows} variant="white" />
      </div>
    </div>
  );
}

// Exportar la página con protección de autenticación
export default function Page() {
  return (
    <AuthGuard>
      <PageContent />
    </AuthGuard>
  );
}
