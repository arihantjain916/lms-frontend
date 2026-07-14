"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  ArrowRight,
  Clock,
  CheckCircle2,
  LogOut,
  UserCircle,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-authenticated";
import { getPrograms, getSearchSuggestions, type Program } from "@/lib/content-api";
import { getCatalogCategories, type CatalogCategory } from "@/lib/course-api";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { type: string; title: string; slug: string }[]
  >([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    let active = true;
    const timer = window.setTimeout(
      () =>
        getSearchSuggestions(searchQuery.trim())
          .then((items) => {
            if (active) setSuggestions(items.slice(0, 8));
          })
          .catch(() => {
            if (active) setSuggestions([]);
          }),
      250,
    );
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    let active = true;
    Promise.all([getCatalogCategories(), getPrograms(1, 5)])
      .then(([categoryItems, programPage]) => {
        if (!active) return;
        setCategories(categoryItems.slice(0, 5));
        setPrograms(programPage.data.slice(0, 5));
      })
      .catch(() => {
        if (!active) return;
        setCategories([]);
        setPrograms([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const notifications: { id: string; title: string; message: string; time: string; read: boolean }[] = [];
  const unreadNotifications = notifications.filter((item) => !item.read).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-[68px] w-full max-w-[1520px] items-center gap-4 px-4 sm:px-6 lg:gap-6">
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">EduPortal</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden shrink-0 items-center gap-5 2xl:flex">
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition-colors">
              Courses
              <ChevronRight className="h-4 w-4 rotate-90 transition-transform group-hover:rotate-0" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-56 rounded-md border bg-background shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-2">
                <Link
                  href="/categories"
                  className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors"
                >
                  All Categories
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="block truncate rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
                {categories.length === 0 && (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    No categories available
                  </p>
                )}
                <div className="border-t my-1"></div>
                <Link
                  href="/categories"
                  className="flex items-center rounded-md px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  View All Categories
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition-colors">
              Programs
              <ChevronRight className="h-4 w-4 rotate-90 transition-transform group-hover:rotate-0" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-56 rounded-md border bg-background shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-2">
                {programs.map((program) => (
                  <Link
                    key={program.id}
                    href={`/programs/${program.slug}`}
                    className="block truncate rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors"
                  >
                    {program.title}
                  </Link>
                ))}
                {programs.length === 0 && (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    No active programs
                  </p>
                )}
                <div className="border-t my-1"></div>
                <Link
                  href="/programs"
                  className="flex items-center rounded-md px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  All Programs
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition-colors">
              Resources
              <ChevronRight className="h-4 w-4 rotate-90 transition-transform group-hover:rotate-0" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-56 rounded-md border bg-background shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-2">
                <Link
                  href="/blog"
                  className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/tutorials"
                  className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors"
                >
                  Tutorials
                </Link>
                <Link
                  href="/webinars"
                  className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors"
                >
                  Webinars
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/about"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2">
          <form
            action="/search"
            method="get"
            className="relative hidden lg:flex"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search courses..."
              className="w-[190px] rounded-full bg-muted pl-9 focus-visible:ring-blue-500 xl:w-[220px]"
            />
            {suggestions.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-md border bg-background shadow-lg">
                {suggestions.map((item) => (
                  <Link
                    key={`${item.type}-${item.slug}`}
                    href={`/${item.type === "course" ? "courses" : item.type === "tutorial" ? "tutorials" : item.type === "webinar" ? "webinars" : "blog"}/${item.slug}`}
                    onClick={() => setSuggestions([])}
                    className="block border-b px-4 py-3 text-sm last:border-0 hover:bg-muted"
                  >
                    <span className="mr-2 capitalize text-muted-foreground">
                      {item.type}
                    </span>
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Notification Bell */}
          {isAuthenticated && (
            <div className="relative" ref={notificationRef}>
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden lg:flex"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <motion.span
                    className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-medium text-white"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.2, 1] }}
                    transition={{ duration: 0.3, times: [0, 0.5, 1] }}
                  >
                    {unreadNotifications}
                  </motion.span>
                )}
              </Button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-80 rounded-md border bg-background shadow-lg z-50 overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      {unreadNotifications > 0 && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-600">
                          {unreadNotifications} new
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer ${!notification.read ? "bg-blue-50/50" : ""}`}
                        >
                          <div className="flex gap-3">
                            <div
                              className={`mt-1 rounded-full p-1 ${!notification.read ? "bg-blue-100 text-blue-600" : "bg-muted text-muted-foreground"}`}
                            >
                              {!notification.read ? (
                                <Bell className="h-4 w-4" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <Clock className="h-3 w-3 mr-1" />
                                {notification.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        <p>No notifications yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}
          {isAuthenticated ? (
            <div className="hidden items-center gap-1 xl:flex">
              {user?.role?.toUpperCase() === "ADMIN" && (
                <Button asChild variant="ghost">
                  <Link href="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button asChild variant="ghost">
                <Link href="/my-learning">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My learning
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="max-w-[170px] border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <Link href="/account">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span className="truncate">{user?.name || "Account"}</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Log out"
                onClick={async () => {
                  await logout();
                  window.location.href = "/";
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                className="hidden border-blue-200 hover:bg-blue-50 hover:text-blue-700 xl:inline-flex"
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="hidden bg-blue-600 hover:bg-blue-700 sm:inline-flex">
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="2xl:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          className="2xl:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container py-4 flex flex-col gap-4">
            <form action="/search" method="get" className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                placeholder="Search courses..."
                className="w-full pl-9 bg-muted"
              />
            </form>

            <div className="border rounded-md overflow-hidden">
              <Link
                href="/categories"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between bg-slate-50 p-3 hover:bg-blue-50"
              >
                <span className="text-sm font-semibold">Courses</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block border-t px-5 py-2.5 text-sm hover:bg-blue-50"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/programs"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between border-t bg-slate-50 p-3 hover:bg-blue-50"
              >
                <span className="text-sm font-semibold">Programs</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              {programs.map((program) => (
                <Link
                  key={program.id}
                  href={`/programs/${program.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block border-t px-5 py-2.5 text-sm hover:bg-blue-50"
                >
                  {program.title}
                </Link>
              ))}
              {[
                ["/blog", "Blog"],
                ["/tutorials", "Tutorials"],
                ["/webinars", "Webinars"],
                ["/about", "About Us"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setIsMenuOpen(false)} className="block border-t p-3 text-sm font-medium hover:bg-blue-50">
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile Notifications */}
            {isAuthenticated && <div className="border rounded-md overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Notifications</span>
                </div>
                {unreadNotifications > 0 && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-600">
                    {unreadNotifications} new
                  </Badge>
                )}
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {notifications.length ? notifications.slice(0, 2).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-t hover:bg-muted/50 transition-colors ${!notification.read ? "bg-blue-50/50" : ""}`}
                  >
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                )) : <p className="p-4 text-center text-sm text-muted-foreground">No notifications yet</p>}
              </div>
            </div>}

            {isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {user?.role?.toUpperCase() === "ADMIN" && (
                  <Button asChild variant="outline" className="col-span-2">
                    <Link href="/admin">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin workspace
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/my-learning">My learning</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/account">Account</Link>
                </Button>
                <Button
                  variant="destructive"
                  className="col-span-2"
                  onClick={async () => {
                    await logout();
                    window.location.href = "/";
                  }}
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Link href="/login">Log In</Link>
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
