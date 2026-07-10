"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, GraduationCap, Mail } from "lucide-react"
import instance from "@/helper/axios"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const normalizedEmail = email.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      const response: any = await instance.post("/auth/forgot-password", { email: normalizedEmail })
      if (response?.status === false) throw new Error(response?.message || "Request failed")
      setSubmitted(true)
    } catch (requestError: any) {
      setError(requestError?.message || "We could not send the reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-16">
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      <Card className="relative w-full max-w-md border-blue-100 shadow-xl">
        <CardHeader className="space-y-5 pb-2 text-center">
          <Link href="/" className="mx-auto inline-flex items-center gap-2 text-xl font-bold text-blue-700">
            <span className="rounded-lg bg-blue-600 p-2 text-white"><GraduationCap className="h-5 w-5" /></span>
            EduPortal
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{submitted ? "Check your inbox" : "Reset your password"}</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {submitted
                ? `If an account exists for ${email.trim()}, we sent it a password reset link.`
                : "Enter the email associated with your account and we’ll send you a secure reset link."}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {submitted ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-11 w-11 text-green-600" />
                <p className="mt-3 font-medium text-green-950">Reset instructions sent</p>
                <p className="mt-1 text-sm leading-6 text-green-800">The link expires for your security. Check your spam folder if it does not arrive shortly.</p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => { setSubmitted(false); setError("") }}>Use a different email</Button>
              <Button asChild className="w-full"><Link href="/login">Return to login</Link></Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" name="email" type="email" autoComplete="email" autoFocus placeholder="you@example.com" value={email} onChange={(event) => { setEmail(event.target.value); if (error) setError("") }} className="pl-9" disabled={loading} />
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Sending reset link…" : "Send reset link"}</Button>
              <p className="text-center text-sm text-muted-foreground">Remember your password? <Link href="/login" className="font-medium text-blue-700 hover:underline">Sign in</Link></p>
            </form>
          )}

          <div className="mt-7 border-t pt-5 text-center">
            <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-blue-700"><ArrowLeft className="h-4 w-4" />Back to login</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
