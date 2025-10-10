export type MailTemplate = {
  id: string;
  name: string;
  subject: string;
  html: string; // usa {{cliente}} y {{periodo}}
};

export const templates: MailTemplate[] = [
  {
    id: "bechapra-formal",
    name: "Formal Bechapra",
    subject: "Comprobantes fiscales – {{cliente}}",
    html: `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Comprobantes fiscales – {{cliente}}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    /* Resets básicos para correos */
    body,table,td,div,p,a{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;}
    img{border:0;outline:none;text-decoration:none;display:block}
    table{border-collapse:collapse}
    .btn:hover{opacity:.9}
    @media (max-width:600px){
      .container{width:100%!important;border-radius:0!important}
      .p-24{padding:16px!important}
      .text-center-sm{text-align:center!important}
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#f5f7fb;">
  <center style="width:100%; background:#f5f7fb;">
    <!-- Wrapper -->
    <table role="presentation" width="100%" bgcolor="#f5f7fb">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" class="container" width="600" style="max-width:600px; background:#ffffff; border-radius:16px; box-shadow:0 8px 28px rgba(0,0,0,0.07);">
            <!-- Header -->
            <tr>
              <td align="center" style="padding:28px 24px 8px 24px;">
                <!-- Si tienes logo, pon su URL en {{logo_url}} y descomenta la línea de <img> -->
                <!-- <img src="{{logo_url}}" width="140" alt="Bechapra" style="height:auto;"> -->
                <div style="font-weight:700; font-size:22px; color:#0d54d1; letter-spacing:.2px;">Bechapra</div>
              </td>
            </tr>

            <!-- Título -->
            <tr>
              <td class="p-24" style="padding:8px 24px 0 24px;">
                <h1 style="margin:0 0 12px 0; font-size:24px; line-height:1.25; color:#0e1726; font-weight:700;">
                  Comprobantes fiscales adjuntos
                </h1>
                <p style="margin:0 0 16px 0; color:#334155; font-size:15px; line-height:1.6;">
                  Estimado(a) <strong>{{cliente}}</strong>,<br>
                  adjuntamos los <strong>archivos PDF y XML</strong> correspondientes a sus comprobantes fiscales del periodo <strong>{{periodo}}</strong>.
                </p>
              </td>
            </tr>

            <!-- Tarjeta de detalles -->
            <tr>
              <td class="p-24" style="padding:0 24px 0 24px;">
                <table role="presentation" width="100%" style="background:#eef6ff; border:1px solid #d8e9ff; border-radius:12px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <table role="presentation" width="100%">
                        <tr>
                          <td style="color:#0b4ed1; font-weight:700; padding-bottom:8px;">
                            Resumen
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size:14px; color:#1f2937;">
                            <div style="margin:6px 0;"><strong>Cliente:</strong> {{cliente}}</div>
                            <div style="margin:6px 0;"><strong>Periodo:</strong> {{periodo}}</div>
                            <div style="margin:6px 0; color:#475569;">Se incluyen los archivos PDF y XML de sus comprobantes.</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- DETALLE DE COMPROBANTES ENVIADOS -->
            <tr>
              <td class="p-24" style="padding:16px 24px 0 24px;">
                <table role="presentation" width="100%" style="border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
                  <tr>
                    <td colspan="6" style="background:#0d54d1; color:#ffffff; font-weight:700; padding:10px 14px;">
                      Detalle de comprobantes enviados
                    </td>
                  </tr>
                  <tr>
                    <td colspan="6" style="padding:10px 14px; font-size:14px; color:#0f172a; background:#f8fafc; border-bottom:1px solid #e5e7eb;">
                      <strong>Cliente:</strong> {{cliente}} &nbsp;&nbsp; <strong>RFC:</strong> {{rfc}}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px; font-size:12px; color:#475569; font-weight:700; border-bottom:1px solid #e5e7eb;">Serie</td>
                    <td style="padding:10px 12px; font-size:12px; color:#475569; font-weight:700; border-bottom:1px solid #e5e7eb;">Folio</td>
                    <td style="padding:10px 12px; font-size:12px; color:#475569; font-weight:700; border-bottom:1px solid #e5e7eb;">UUID</td>
                    <td style="padding:10px 12px; font-size:12px; color:#475569; font-weight:700; border-bottom:1px solid #e5e7eb; text-align:right;">Total</td>
                    <td style="padding:10px 12px; font-size:12px; color:#475569; font-weight:700; border-bottom:1px solid #e5e7eb;">Fecha</td>
                    <td style="padding:10px 12px; font-size:12px; color:#475569; font-weight:700; border-bottom:1px solid #e5e7eb;">Moneda</td>
                  </tr>

                  <!-- AQUÍ INYECTA TU BACKEND LAS FILAS <tr>...</tr> POR CADA CFDI -->
                  {{tabla_comprobantes}}

                  <!-- Ejemplo de una fila (referencia visual)
                  <tr>
                    <td style="padding:10px 12px; font-size:13px; color:#1f2937;">A</td>
                    <td style="padding:10px 12px; font-size:13px; color:#1f2937;">12345</td>
                    <td style="padding:10px 12px; font-size:13px; color:#1f2937;">XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX</td>
                    <td style="padding:10px 12px; font-size:13px; color:#1f2937; text-align:right;">$12,345.67</td>
                    <td style="padding:10px 12px; font-size:13px; color:#1f2937;">2025-09-01</td>
                    <td style="padding:10px 12px; font-size:13px; color:#1f2937;">MXN</td>
                  </tr>
                  -->
                </table>
              </td>
            </tr>

            <!-- CTA opcional -->
            <tr>
              <td class="p-24 text-center-sm" align="left" style="padding:18px 24px 12px 24px;">
                <a href="mailto:v.martinez@bechapra.com?subject=Consulta sobre comprobantes fiscales" target="_blank" class="btn"
                   style="display:inline-block; background:#0d54d1; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 20px; border-radius:999px;">
                  Ponerse en contacto
                </a>
              </td>
            </tr>

            <!-- Nota / Soporte -->
            <tr>
              <td class="p-24" style="padding:4px 24px 24px 24px;">
                <p style="margin:0; color:#667085; font-size:13px; line-height:1.6;">
                  Si requieres aclaraciones o versiones adicionales de tus comprobantes,
                  por favor responde a este correo o contacta a nuestro equipo de soporte.
                </p>
              </td>
            </tr>

          </table>

          <!-- Footer -->
          <table role="presentation" width="600" style="max-width:600px; margin-top:14px;">
            <tr>
              <td align="center" style="color:#94a3b8; font-size:12px;">
                © Bechapra · Este mensaje fue enviado de forma automática.
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </center>
</body>
</html>`
  },
  {
    id: "resumen-minimo",
    name: "Resumen mínimo",
    subject: "CFDI del periodo {{periodo}} – {{cliente}}",
    html: `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
body,table,td,p{font-family:Arial,Helvetica,sans-serif}table{border-collapse:collapse}
.card{border:1px solid #e5e7eb;border-radius:12px}
</style></head><body style="margin:0;background:#f6f7fb;">
<center style="width:100%;padding:24px 10px;">
  <table width="600" style="max-width:600px;background:#fff;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,.06);">
    <tr><td style="padding:22px 22px 8px 22px;">
      <h2 style="margin:0 0 10px 0;color:#0f172a;">Comprobantes fiscales</h2>
      <p style="margin:0;color:#334155;font-size:14px">Cliente: <strong>{{cliente}}</strong> · Periodo: <strong>{{periodo}}</strong></p>
    </td></tr>
    <tr><td style="padding:0 22px 18px 22px;">
      <div class="card" style="padding:14px 16px;margin-top:12px;">
        Adjuntamos los archivos <strong>XML</strong> y <strong>PDF</strong> correspondientes a su facturación del periodo indicado.
      </div>
    </td></tr>
    <tr><td style="padding:0 22px 22px 22px;color:#64748b;font-size:12px">Este es un envío automático, no es necesario responder.</td></tr>
  </table>
</center></body></html>`
  },
  {
    id: "nota-corta",
    name: "Nota corta + firma",
    subject: "Entrega de comprobantes – {{cliente}} ({{periodo}})",
    html: `<!doctype html><html lang="es"><head><meta charset="utf-8"></head>
<body style="margin:0;background:#f7fafc;">
<center style="width:100%;padding:20px 10px;">
  <table width="560" style="max-width:560px;background:#ffffff;border-radius:14px;border:1px solid #e6e6e6;">
    <tr><td style="padding:22px;">
      <p style="margin:0 0 12px 0;color:#0f172a;font-size:16px;font-weight:700">Comprobantes del periodo {{periodo}}</p>
      <p style="margin:0 0 14px 0;color:#334155;font-size:14px;">Hola <strong>{{cliente}}</strong>, compartimos los comprobantes de este periodo. Encontrarás los <strong>PDF</strong> y <strong>XML</strong> adjuntos a este mensaje.</p>
      <p style="margin:0 0 16px 0;color:#475569;font-size:13px;">Si requieres algún ajuste o duplicado, con gusto te apoyamos.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0;">
      <table width="100%"><tr>
        <td width="48"><div style="width:40px;height:40px;border-radius:999px;background:#0d54d1"></div></td>
        <td style="font-size:12px;color:#475569">
          <div style="font-weight:700;color:#0f172a">Equipo Bechapra</div>
          <div>automatizaciones@bechapra.com.mx</div>
        </td>
      </tr></table>
    </td></tr>
  </table>
</center></body></html>`
  }
];
