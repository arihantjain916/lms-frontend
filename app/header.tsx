"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { GraduationCap, ChevronRight, Menu, X, Search, Bell, ArrowRight, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useAuthenticated } from "@/hooks/use-authenticated"

export default function Header() {
  const isAuthenticated = useAuthenticated()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const notifications = [
    {
      id: 1,
      title: "New Course Available",
      message: "Advanced Python Programming is now available",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Assignment Reminder",
      message: "Your Web Development project is due tomorrow",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Live Webinar",
      message: "Join our AI in Education webinar this Friday",
      time: "1 day ago",
      read: true,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">EduPortal</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
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
                <Link href="#" className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors">
                  Web Development
                </Link>
                <Link href="#" className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors">
                  Data Science
                </Link>
                <Link href="#" className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors">
                  Business
                </Link>
                <Link href="#" className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors">
                  Design
                </Link>
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
                <Link href="#" className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors">
                  Degree Programs
                </Link>
                <Link href="#" className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors">
                  Certificates
                </Link>
                <Link href="#" className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors">
                  Professional Training
                </Link>
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
                <Link href="/blog" className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors">
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
                <Link href="#" className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 transition-colors">
                  E-books
                </Link>
                <div className="border-t my-1"></div>
                <Link
                  href="#"
                  className="flex items-center rounded-md px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Resource Library
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <Link href="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <form action="/search" method="get" className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              placeholder="Search courses..."
              className="w-[200px] pl-9 rounded-full bg-muted focus-visible:ring-blue-500"
            />
          </form>

          {/* Notification Bell */}
          {isAuthenticated && <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden md:flex"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell className="h-5 w-5" />
              <motion.span
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white"
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.2, 1] }}
                transition={{ duration: 0.3, times: [0, 0.5, 1] }}
              >
                {notifications.filter((n) => !n.read).length}
              </motion.span>
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
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                      {notifications.filter((n) => !n.read).length} New
                    </Badge>
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
                            {!notification.read ? <Bell className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{notification.title}</p>
                              {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-600"></span>}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
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
                <div className="p-2 border-t bg-muted/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    View all notifications
                  </Button>
                </div>
              </motion.div>
            )}
          </div>}
          <Button
            variant="outline"
            className="hidden md:inline-flex border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <Link href="/login">Log In</Link>
          </Button>

          <Button className="bg-blue-600 hover:bg-blue-700">
            <Link href="/register">Sign Up</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container py-4 flex flex-col gap-4">
            <form action="/search" method="get" className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" name="q" placeholder="Search courses..." className="w-full pl-9 bg-muted" />
            </form>

            {isAuthenticated && <div className="border rounded-md overflow-hidden">
              <Link
                href="/categories"
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50"
              >
                <span className="text-sm font-medium">All Categories</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50" onClick={() => {}}>
                <span className="text-sm font-medium">Courses</span>
                <ChevronRight className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50" onClick={() => {}}>
                <span className="text-sm font-medium">Programs</span>
                <ChevronRight className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50" onClick={() => {}}>
                <span className="text-sm font-medium">Resources</span>
                <ChevronRight className="h-4 w-4" />
              </div>
              <Link href="#" className="block p-3 text-sm font-medium hover:bg-blue-50">
                About Us
              </Link>
              <Link href="#" className="block p-3 text-sm font-medium hover:bg-blue-50">
                Contact
              </Link>
            </div>}

            {/* Mobile Notifications */}
            <div className="border rounded-md overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Notifications</span>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-600">
                  {notifications.filter((n) => !n.read).length} New
                </Badge>
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {notifications.slice(0, 2).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-t hover:bg-muted/50 transition-colors ${!notification.read ? "bg-blue-50/50" : ""}`}
                  >
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t bg-muted/20">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  View all
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" className="flex-1 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                Log In
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Sign Up</Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}
