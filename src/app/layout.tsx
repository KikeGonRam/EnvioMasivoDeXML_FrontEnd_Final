// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Envío Masivo de Facturas",
  description: "PDF + XML por cliente",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    // Ignora diferencias de atributos que inserten extensiones
    <html lang="es" suppressHydrationWarning>
      {/* También ignoramos diferencias en <body> */}
      <body
        suppressHydrationWarning
        className="min-h-screen bg-gradient-to-b from-[#0B51CF] to-[#0F2C8C] text-white"
      >
        {/* Elimina cualquier style inline que alguna extensión haya puesto en <body> 
            ANTES de que React hidrate (evita el mismatch). */}
        <Script id="strip-body-style" strategy="beforeInteractive">
          {`try{document && document.body && document.body.removeAttribute('style');}catch(e){}`}
        </Script>

        <div className="mx-auto max-w-7xl p-6 md:p-8">
          {children}
        </div>

        {/* Client component dentro de layout server: OK */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
