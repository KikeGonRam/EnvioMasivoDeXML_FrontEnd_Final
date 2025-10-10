"use client";
import { useMemo, useState } from "react";
import { templates, type MailTemplate } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clipboard, Eye, Check } from "lucide-react";
import { toast } from "sonner";

function replaceTags(html: string, vars: Record<string, string>) {
  return html
    .replace(/{{\s*cliente\s*}}/g, vars.cliente ?? "")
    .replace(/{{\s*periodo\s*}}/g, vars.periodo ?? "")
    .replace(/{{\s*portal_url\s*}}/g, vars.portal_url ?? "#");
}

export function EmailTemplates({
  periodo,
  onPick,              // devuelve la plantilla elegida
  defaultId = "bechapra-formal",
}: {
  periodo: string;
  onPick: (tpl: MailTemplate) => void;
  defaultId?: string;
}) {
  const [selected, setSelected] = useState<string>(defaultId);

  const current = useMemo(
    () => templates.find(t => t.id === selected) ?? templates[0],
    [selected]
  );

  const previewHtml = useMemo(
    () =>
      replaceTags(current.html, {
        cliente: "Cliente Ejemplo S.A. de C.V.",
        periodo: periodo || "Agosto 2025",
        portal_url: "#",
      }),
    [current, periodo]
  );

  function copyRaw() {
    navigator.clipboard.writeText(current.html).then(
      () => toast.success("HTML copiado"),
      () => toast.error("No se pudo copiar")
    );
  }
  function copyPreview() {
    navigator.clipboard.writeText(previewHtml).then(
      () => toast.success("Previsualización copiada"),
      () => toast.error("No se pudo copiar")
    );
  }
  function useThis() {
    onPick(current);
    toast.success("Plantilla seleccionada");
  }

  return (
    <Card className="rounded-2xl border-slate-200 bg-white text-slate-900 shadow-sm">
      <CardContent className="p-4 space-y-3">
        {/* Selector simple */}
        <div className="flex flex-wrap gap-2">
          {templates.map(t => (
            <Button
              key={t.id}
              variant={t.id === selected ? "default" : "secondary"}
              className={t.id === selected
                ? "rounded-full bg-sky-600 hover:bg-sky-700 text-white"
                : "rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"}
              onClick={() => setSelected(t.id)}
            >
              {t.id === selected && <Check className="h-4 w-4 mr-2" />}
              {t.name}
            </Button>
          ))}
        </div>

        {/* Subject de la plantilla elegida */}
        <div className="text-sm text-slate-600">
          <span className="font-medium text-slate-800">Asunto:&nbsp;</span>
          {current.subject}
        </div>

        {/* Botones de copiar y usar */}
        <div className="flex flex-wrap gap-2">
          <Button className="rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50" onClick={copyRaw}>
            <Clipboard className="h-4 w-4 mr-2" /> Copiar HTML
          </Button>
          <Button className="rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50" onClick={copyPreview}>
            <Eye className="h-4 w-4 mr-2" /> Copiar previsualización
          </Button>
          <Button className="rounded-xl bg-sky-600 hover:bg-sky-700" onClick={useThis}>
            Usar esta plantilla
          </Button>
        </div>

        {/* Previsualización */}
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-3 py-2 text-xs text-slate-600">
            Vista previa (con cliente y periodo de ejemplo)
          </div>
          <div
            className="bg-white max-h-[520px] overflow-auto"
            // correo inline preview
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
