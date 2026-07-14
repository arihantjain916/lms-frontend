"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";
import instance from "@/helper/axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () =>
      setToken(new URLSearchParams(window.location.search).get("token") || ""),
    [],
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!token)
      return setError("This reset link is missing its security token.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");
    setLoading(true);
    try {
      const response: any = await instance.post("/auth/reset-password", {
        token,
        password,
      });
      if (!response?.status)
        throw new Error(response?.message || "Unable to reset password");
      setSuccess(true);
    } catch (requestError: any) {
      setError(
        requestError?.message || "This reset link is invalid or expired.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-16">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 rounded-full bg-blue-100 p-3 text-blue-700">
            {success ? (
              <CheckCircle2 className="h-7 w-7" />
            ) : (
              <KeyRound className="h-7 w-7" />
            )}
          </div>
          <h1 className="text-3xl font-bold">
            {success ? "Password updated" : "Create a new password"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {success
              ? "You can now sign in with your new password."
              : "Choose a strong password you have not used before."}
          </p>
        </CardHeader>
        <CardContent>
          {success ? (
            <Button asChild className="w-full" size="lg">
              <Link href="/login">Continue to login</Link>
            </Button>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pr-10"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Updating…" : "Reset password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
