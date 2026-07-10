"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { CheckCircle2, Clock3, Loader2, ReceiptText, XCircle } from "lucide-react"
import { getOrder, Order } from "@/lib/learning-api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const load = useCallback(async () => { try { setOrder(await getOrder(id)); setError("") } catch (requestError: any) { setError(requestError?.message || "Unable to load order") } finally { setLoading(false) } }, [id])
  useEffect(() => { load() }, [load])
  useEffect(() => { if (order?.status !== "PENDING") return; const timer = window.setInterval(load, 5000); return () => window.clearInterval(timer) }, [load, order?.status])
  if (loading) return <main className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></main>
  if (!order || error) return <main className="container flex min-h-[70vh] items-center justify-center"><div className="text-center"><XCircle className="mx-auto h-12 w-12 text-red-600" /><h1 className="mt-4 text-3xl font-bold">Order unavailable</h1><p className="mt-2 text-muted-foreground">{error}</p><Button asChild className="mt-5"><Link href="/courses">Return to courses</Link></Button></div></main>
  const paid = order.status === "PAID"
  return <main className="flex min-h-[70vh] items-center justify-center bg-muted/20 px-4 py-16"><Card className="w-full max-w-xl shadow-lg"><CardHeader className="text-center"><div className={`mx-auto mb-3 rounded-full p-3 ${paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{paid ? <CheckCircle2 className="h-8 w-8" /> : <Clock3 className="h-8 w-8" />}</div><CardTitle className="text-3xl">{paid ? "Payment complete" : "Order pending"}</CardTitle><p className="text-sm text-muted-foreground">Order #{order.id}</p></CardHeader><CardContent><div className="space-y-4 rounded-xl border p-5"><div className="flex justify-between gap-4"><span className="text-muted-foreground">Course</span><strong className="text-right">{order.courseTitle}</strong></div>{order.planTitle && <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><strong>{order.planTitle}</strong></div>}<div className="flex justify-between"><span className="text-muted-foreground">Amount</span><strong>{new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency || "INR" }).format(order.amount)}</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant={paid ? "secondary" : "outline"}>{order.status}</Badge></div></div>{order.status === "PENDING" && <p className="mt-5 text-center text-sm leading-6 text-muted-foreground">Waiting for payment confirmation. This page refreshes automatically after the payment webhook updates your order.</p>}<div className="mt-6 flex gap-3"><Button asChild className="flex-1"><Link href={paid ? `/courses/${order.courseId}/learn` : `/courses/${order.courseId}`}>{paid ? "Start learning" : "Back to course"}</Link></Button><Button variant="outline" size="icon" onClick={load} title="Refresh order"><ReceiptText className="h-4 w-4" /></Button></div></CardContent></Card></main>
}
