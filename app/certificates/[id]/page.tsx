"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Award, CheckCircle2, Loader2 } from "lucide-react"
import { Certificate, getCertificate } from "@/lib/learning-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>()
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const load = useCallback(async () => { try { setCertificate(await getCertificate(id)); setError("") } catch (requestError: any) { setError(requestError?.message || "Certificate not found") } finally { setLoading(false) } }, [id])
  useEffect(() => { load() }, [load])
  if (loading) return <main className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></main>
  if (!certificate || error) return <main className="container flex min-h-[70vh] items-center justify-center"><div className="text-center"><Award className="mx-auto h-12 w-12 text-muted-foreground" /><h1 className="mt-4 text-3xl font-bold">Certificate not found</h1><p className="mt-2 text-muted-foreground">{error}</p><Button asChild className="mt-5"><Link href="/">Go home</Link></Button></div></main>
  return <main className="flex min-h-[75vh] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50 px-4 py-16"><Card className="w-full max-w-4xl border-4 border-double border-amber-300 shadow-2xl"><CardContent className="p-10 text-center md:p-16"><Award className="mx-auto h-16 w-16 text-amber-500" /><p className="mt-5 uppercase tracking-[0.35em] text-blue-700">Certificate of completion</p><h1 className="mt-7 text-4xl font-serif font-bold md:text-6xl">{certificate.userName}</h1><p className="mt-5 text-lg text-muted-foreground">has successfully completed</p><h2 className="mt-3 text-2xl font-bold text-blue-950 md:text-3xl">{certificate.courseTitle}</h2><div className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700"><CheckCircle2 className="h-4 w-4" />Verified by EduPortal</div><div className="mt-10 grid gap-4 border-t pt-6 text-sm sm:grid-cols-2"><div><p className="text-muted-foreground">Certificate number</p><p className="font-mono font-semibold">{certificate.certificateNumber}</p></div><div><p className="text-muted-foreground">Issued</p><p className="font-semibold">{new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(certificate.issuedAt))}</p></div></div></CardContent></Card></main>
}
