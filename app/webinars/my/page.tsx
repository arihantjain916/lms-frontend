"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getMyWebinarRegistrations, unregisterFromWebinar, type WebinarRegistration } from "@/lib/catalog-api"
import { useToast } from "@/hooks/use-toast"

export default function MyWebinarsPage() {
  const [items, setItems] = useState<WebinarRegistration[]>([]); const { toast } = useToast()
  const load = () => getMyWebinarRegistrations().then((r) => setItems(r.data)).catch((e) => toast({ title: "Unable to load registrations", description: e?.message, variant: "destructive" }))
  useEffect(() => { void load() }, [])
  async function cancel(item: WebinarRegistration) { try { await unregisterFromWebinar(item.webinar.id); setItems((current) => current.filter((value) => value.id !== item.id)); toast({ title: "Registration cancelled" }) } catch (e: any) { toast({ title: "Unable to cancel", description: e?.message, variant: "destructive" }) } }
  return <main className="container py-10"><h1 className="text-3xl font-bold">My webinar registrations</h1><div className="mt-7 grid gap-4">{items.map((item) => <Card key={item.id}><CardContent className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><Link className="text-lg font-semibold hover:text-blue-700" href={`/webinars/${item.webinar.slug}`}>{item.webinar.title}</Link><p className="text-sm text-muted-foreground">{new Date(item.webinar.scheduledAt).toLocaleString()}</p></div><Button variant="outline" onClick={() => cancel(item)}>Cancel registration</Button></CardContent></Card>)}{items.length === 0 && <p className="rounded border p-8 text-center text-muted-foreground">You have no webinar registrations.</p>}</div></main>
}
