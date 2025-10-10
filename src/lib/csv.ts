// Convierte un arreglo de objetos en CSV y fuerza descarga
export function toCSVAndDownload(rows: Record<string, unknown>[], filename='resumen.csv') {
if (!rows?.length) return;
const headers = Object.keys(rows[0]);
const csv = [headers.join(','), ...rows.map(r=> headers.map(h => escapeValue(r[h])).join(','))].join('\n');
const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = filename; a.click();
URL.revokeObjectURL(url);
}
function escapeValue(v: unknown){
if (v==null) return '';
const s = String(v).replace(/\n/g,' ').replace(/\r/g,' ');
return /[",\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s;
}