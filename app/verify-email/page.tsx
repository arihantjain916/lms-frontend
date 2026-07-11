"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, MailCheck, XCircle } from "lucide-react"
import instance from "@/helper/axios"
import { notifyAuthStateChanged } from "@/hooks/use-authenticated"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Status = "verifying" | "success" | "error"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("verifying")
  const [loggedIn, setLoggedIn] = useState(false)
  const [message, setMessage] = useState("Verifying your email address…")
  const [email, setEmail] = useState("")
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState("")
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const token = new URLSearchParams(window.location.search).get("token")
    if (!token) { setStatus("error"); setMessage("This verification link is missing its security token."); return }
    instance.post("/auth/verify-email", { token }).then((response: any) => {
      if (!response?.status) throw new Error(response?.message)
      const accessToken = response?.token || response?.data?.token || (typeof response?.data === "string" ? response.data : "")
      if (accessToken) {
        localStorage.setItem("token", accessToken)
        notifyAuthStateChanged()
        setLoggedIn(true)
        setStatus("success"); setMessage("Your email has been verified. Signing you in…")
        setTimeout(() => router.replace("/"), 1500)
      } else {
        setStatus("success"); setMessage("Your email has been verified successfully.")
      }
    }).catch((error: any) => { setStatus("error"); setMessage(error?.message || "This verification link is invalid or expired.") })
  }, [router])

  async function resend(event: FormEvent) {
    event.preventDefault(); setResending(true); setResendMessage("")
    try {
      const response: any = await instance.post("/auth/resend-verification", { email: email.trim().toLowerCase() })
      if (!response?.status) throw new Error(response?.message)
      setResendMessage("If the account exists and is not verified, a new link has been sent.")
    } catch (error: any) { setResendMessage(error?.message || "Unable to resend verification email.") }
    finally { setResending(false) }
  }

  const Icon = status === "success" ? CheckCircle2 : status === "error" ? XCircle : MailCheck
  return <main className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-16"><Card className="w-full max-w-md shadow-xl"><CardHeader className="text-center"><div className={`mx-auto mb-3 rounded-full p-3 ${status === "success" ? "bg-green-100 text-green-700" : status === "error" ? "bg-red-100 text-red-700" : "animate-pulse bg-blue-100 text-blue-700"}`}><Icon className="h-7 w-7" /></div><h1 className="text-3xl font-bold">{status === "verifying" ? "Verifying email" : status === "success" ? "Email verified" : "Verification failed"}</h1><p className="mt-2 text-sm text-muted-foreground">{message}</p></CardHeader><CardContent>{status === "success" && <Button asChild className="w-full"><Link href={loggedIn ? "/" : "/login"}>{loggedIn ? "Continue to home" : "Continue to login"}</Link></Button>}{status === "error" && <form onSubmit={resend} className="space-y-4"><div className="space-y-2"><Label htmlFor="email">Email address</Label><Input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></div>{resendMessage && <Alert><AlertDescription>{resendMessage}</AlertDescription></Alert>}<Button className="w-full" disabled={resending}>{resending ? "Sending…" : "Send a new verification link"}</Button><Button asChild variant="ghost" className="w-full"><Link href="/login">Back to login</Link></Button></form>}</CardContent></Card></main>
}
