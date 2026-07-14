"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Camera,
  KeyRound,
  Loader2,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import instance from "@/helper/axios";
import { useAuth } from "@/hooks/use-authenticated";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, refreshUser, logout } = useAuth();
  const [profile, setProfile] = useState({ name: "", username: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (user)
      setProfile({ name: user.name || "", username: user.username || "" });
  }, [user]);
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, router, user]);

  async function updateProfile(event: FormEvent) {
    event.preventDefault();
    setSavingProfile(true);
    try {
      const response: any = await instance.patch("/users/me", profile);
      if (!response?.status) throw new Error(response?.message);
      await refreshUser();
      toast.success("Account details updated");
    } catch (error: any) {
      toast.error(error?.message || "Unable to update account");
    } finally {
      setSavingProfile(false);
    }
  }

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
      return toast.error("Choose a PNG, JPG, or WEBP image");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Image must be smaller than 5 MB");
    const body = new FormData();
    body.append("file", file);
    setUploading(true);
    try {
      const response: any = await instance.post("/users/me/avatar", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response?.status) throw new Error(response?.message);
      await refreshUser();
      toast.success("Profile photo updated");
    } catch (error: any) {
      toast.error(error?.message || "Unable to upload image");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function updatePassword(event: FormEvent) {
    event.preventDefault();
    if (passwords.newPassword.length < 8)
      return toast.error("New password must be at least 8 characters");
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error("New passwords do not match");
    setSavingPassword(true);
    try {
      const response: any = await instance.patch("/users/me/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (!response?.status) throw new Error(response?.message);
      toast.success("Password updated. Please sign in again.");
      await logout().catch(() => undefined);
      router.replace("/login");
    } catch (error: any) {
      toast.error(error?.message || "Unable to update password");
    } finally {
      setSavingPassword(false);
    }
  }

  async function resendVerification() {
    if (!user) return;
    setResending(true);
    try {
      const response: any = await instance.post("/auth/resend-verification", {
        email: user.email,
      });
      if (!response?.status) throw new Error(response?.message);
      toast.success("Verification email requested");
    } catch (error: any) {
      toast.error(error?.message || "Unable to resend verification email");
    } finally {
      setResending(false);
    }
  }

  async function deleteAccount() {
    if (deleteText !== "DELETE") return;
    setDeleting(true);
    try {
      const response: any = await instance.delete("/users/me");
      if (!response?.status) throw new Error(response?.message);
      localStorage.removeItem("token");
      toast.success("Your account has been deleted");
      await logout().catch(() => undefined);
      router.replace("/");
    } catch (error: any) {
      toast.error(error?.message || "Unable to delete account");
    } finally {
      setDeleting(false);
    }
  }

  if (loading || !user)
    return (
      <main className="container flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </main>
    );

  return (
    <main className="min-h-screen bg-muted/20 py-10">
      <div className="container max-w-5xl">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3 bg-white">
            Account settings
          </Badge>
          <h1 className="text-3xl font-bold md:text-4xl">
            Manage your account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Update your public profile, security settings, and account data.
          </p>
        </div>

        {!user.isVerified && (
          <Alert className="mb-6 border-amber-300 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <AlertDescription className="flex flex-wrap items-center justify-between gap-3 text-amber-900">
              <span>Your email address has not been verified.</span>
              <Button
                size="sm"
                variant="outline"
                onClick={resendVerification}
                disabled={resending}
              >
                {resending ? "Sending…" : "Resend verification"}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="mx-auto h-28 w-28 border-4 border-white shadow">
                  <AvatarImage src={user.avatar || "/placeholder-user.jpg"} />
                  <AvatarFallback className="text-3xl">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
                <Badge className="mt-3 capitalize" variant="secondary">
                  {user.role.toLowerCase()}
                </Badge>
                <Label
                  htmlFor="avatar"
                  className="mt-5 flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading…" : "Change photo"}
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={uploadAvatar}
                  disabled={uploading}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-3 p-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="max-w-[160px] truncate font-medium">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={user.isVerified ? "secondary" : "outline"}>
                    {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-blue-600" />
                  Profile details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateProfile} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(event) =>
                          setProfile({ ...profile, name: event.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(event) =>
                          setProfile({
                            ...profile,
                            username: event.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email address</Label>
                    <Input value={user.email} disabled />
                    <p className="text-xs text-muted-foreground">
                      Email changes are not supported by the current API.
                    </p>
                  </div>
                  <Button disabled={savingProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    {savingProfile ? "Saving…" : "Save changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-blue-600" />
                  Change password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={updatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      value={passwords.currentPassword}
                      onChange={(event) =>
                        setPasswords({
                          ...passwords,
                          currentPassword: event.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        autoComplete="new-password"
                        value={passwords.newPassword}
                        onChange={(event) =>
                          setPasswords({
                            ...passwords,
                            newPassword: event.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={passwords.confirmPassword}
                        onChange={(event) =>
                          setPasswords({
                            ...passwords,
                            confirmPassword: event.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <Button disabled={savingPassword}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {savingPassword ? "Updating…" : "Update password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Trash2 className="h-5 w-5" />
                  Delete account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  This permanently disables your account and signs you out. Type{" "}
                  <strong>DELETE</strong> to confirm.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Input
                    value={deleteText}
                    onChange={(event) => setDeleteText(event.target.value)}
                    placeholder="Type DELETE"
                  />
                  <Button
                    variant="destructive"
                    disabled={deleteText !== "DELETE" || deleting}
                    onClick={deleteAccount}
                  >
                    {deleting ? "Deleting…" : "Delete account"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="ghost">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
