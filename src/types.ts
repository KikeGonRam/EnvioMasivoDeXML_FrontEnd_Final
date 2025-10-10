export type DryRunSummary = {
ok: boolean;
jobDir: string;
summary: {
totals: { destinatarios:number; advertencias:number };
detalle: Array<{ email:string; cliente:string; xml:number; pdf:number }>;
warnings: any[];
};
report: string;
};


export type SendResult = {
ok: boolean;
jobDir: string;
sent: number;
skipped: number;
warnings: any[];
log: Array<{ email:string; cliente:string; attachments?:number; mode?:string; sizeMB?:number; messageId?:string; error?:string }>;
};