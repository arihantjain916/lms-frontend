"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Award, CheckCircle2, Download, Loader2 } from "lucide-react";
import { Certificate, getCertificate } from "@/lib/learning-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character];
  });
}

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setCertificate(await getCertificate(id));
      setError("");
    } catch (requestError: any) {
      setError(requestError?.message || "Certificate not found");
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    load();
  }, [load]);

  function downloadCertificate() {
    if (!certificate) return;
    const issued = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    }).format(new Date(certificate.issuedAt));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="990" viewBox="0 0 1400 990">
      <defs>
        <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#eff6ff"/><stop offset="0.5" stop-color="#ffffff"/><stop offset="1" stop-color="#fffbeb"/>
        </linearGradient>
      </defs>
      <rect width="1400" height="990" fill="url(#paper)"/>
      <rect x="38" y="38" width="1324" height="914" rx="24" fill="none" stroke="#d97706" stroke-width="6"/>
      <rect x="56" y="56" width="1288" height="878" rx="18" fill="none" stroke="#fbbf24" stroke-width="2"/>
      <circle cx="700" cy="175" r="62" fill="#f59e0b"/><path d="M670 178l20 20 42-50" fill="none" stroke="white" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="700" y="285" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" letter-spacing="10" fill="#1d4ed8">CERTIFICATE OF COMPLETION</text>
      <text x="700" y="375" text-anchor="middle" font-family="Georgia, serif" font-size="68" font-weight="700" fill="#172554">${escapeXml(certificate.userName)}</text>
      <text x="700" y="435" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#64748b">has successfully completed</text>
      <text x="700" y="515" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#1e3a8a">${escapeXml(certificate.courseTitle)}</text>
      <line x1="280" y1="610" x2="1120" y2="610" stroke="#cbd5e1"/>
      <text x="360" y="680" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#64748b">CERTIFICATE NUMBER</text>
      <text x="360" y="720" text-anchor="middle" font-family="monospace" font-size="24" font-weight="700" fill="#0f172a">${escapeXml(certificate.certificateNumber)}</text>
      <text x="1040" y="680" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#64748b">ISSUED</text>
      <text x="1040" y="720" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#0f172a">${escapeXml(issued)}</text>
      <text x="700" y="855" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#15803d">VERIFIED BY EDUPORTAL</text>
    </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `EduPortal-${certificate.certificateNumber}.svg`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }
  if (loading)
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </main>
    );
  if (!certificate || error)
    return (
      <main className="container flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Award className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 text-3xl font-bold">Certificate not found</h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button asChild className="mt-5">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </main>
    );
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50 px-4 py-16">
      <div className="w-full max-w-4xl">
        <div className="mb-4 flex justify-end">
          <Button onClick={downloadCertificate}>
            <Download className="mr-2 h-4 w-4" />
            Download certificate
          </Button>
        </div>
        <Card className="w-full border-4 border-double border-amber-300 shadow-2xl">
          <CardContent className="p-10 text-center md:p-16">
            <Award className="mx-auto h-16 w-16 text-amber-500" />
            <p className="mt-5 uppercase tracking-[0.35em] text-blue-700">
              Certificate of completion
            </p>
            <h1 className="mt-7 text-4xl font-serif font-bold md:text-6xl">
              {certificate.userName}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              has successfully completed
            </p>
            <h2 className="mt-3 text-2xl font-bold text-blue-950 md:text-3xl">
              {certificate.courseTitle}
            </h2>
            <div className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Verified by EduPortal
            </div>
            <div className="mt-10 grid gap-4 border-t pt-6 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Certificate number</p>
                <p className="font-mono font-semibold">
                  {certificate.certificateNumber}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Issued</p>
                <p className="font-semibold">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "long",
                  }).format(new Date(certificate.issuedAt))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
