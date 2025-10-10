'use client';
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

export function FileDrop({
  onZips,
  onCsv,
}: {
  onZips: (f: File[]) => void;
  onCsv: (f: File | null) => void;
}) {
  const zipInput = useRef<HTMLInputElement>(null);
  const csvInput = useRef<HTMLInputElement>(null);
  const [zipNames, setZipNames] = useState<string[]>([]);
  const [csvName, setCsvName] = useState<string>('');

  const pickZips = useCallback(() => zipInput.current?.click(), []);
  const pickCsv = useCallback(() => csvInput.current?.click(), []);

  const onZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.name.toLowerCase().endsWith('.zip')
    );
    if (!files.length) return toast.error('Selecciona al menos un .zip');
    setZipNames(files.map((f) => f.name));
    onZips(files);
  };
  const onCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = (e.target.files || [])[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.csv'))
      return toast.error('El archivo debe ser .csv');
    setCsvName(f.name);
    onCsv(f);
  };

  const cardCls =
    'rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]';

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className={cardCls}>
        <p className="mb-2 font-medium">ZIP(s) con PDF/XML</p>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={pickZips}
            className="rounded-xl bg-white/15 text-white hover:bg-white/20"
          >
            <Upload className="mr-2 h-4 w-4" /> Seleccionar ZIPs
          </Button>
          <input
            ref={zipInput}
            type="file"
            multiple
            accept=".zip"
            className="hidden"
            onChange={onZipChange}
          />
          <div className="text-sm opacity-80 truncate">
            {zipNames.length ? zipNames.join(', ') : 'Ningún ZIP seleccionado'}
          </div>
        </div>
      </div>

      <div className={cardCls}>
        <p className="mb-2 font-medium">Base de clientes (CSV)</p>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={pickCsv}
            className="rounded-xl bg-white/15 text-white hover:bg-white/20"
          >
            <Upload className="mr-2 h-4 w-4" /> Seleccionar CSV
          </Button>
          <input
            ref={csvInput}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={onCsvChange}
          />
          <div className="text-sm opacity-80 truncate">
            {csvName || 'Ningún CSV seleccionado'}
          </div>
        </div>
      </div>
    </div>
  );
}
