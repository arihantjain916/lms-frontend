"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  FileText,
  FolderTree,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldAlert,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-authenticated";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/blogs", label: "Blog posts", icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user)
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, pathname, router, user]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500">
        Checking access…
      </div>
    );
  }

  if (user.role?.toUpperCase() !== "ADMIN") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-amber-500" />
          <h1 className="text-xl font-semibold">Admin access required</h1>
          <p className="mt-2 text-sm text-slate-500">
            Your account does not have permission to open this workspace.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Return to EduPortal</Link>
          </Button>
        </div>
      </main>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-slate-950 text-slate-200">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="font-semibold text-white">EduPortal</p>
          <p className="text-xs text-slate-400">Admin workspace</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 px-2">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:bg-white/5 hover:text-white"
          onClick={async () => {
            await logout();
            window.location.href = "/";
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        {sidebar}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-72">
            {sidebar}
            <button
              className="absolute right-3 top-3 text-slate-400"
              onClick={() => setMobileOpen(false)}
            >
              <X />
            </button>
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/90 px-4 backdrop-blur md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden text-sm text-slate-500 lg:block">
            Manage your learning platform
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ChevronLeft className="mr-1 h-4 w-4" />
              View site
            </Link>
          </Button>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
