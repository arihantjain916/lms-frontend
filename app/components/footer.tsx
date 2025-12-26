"use client"

import type React from "react"

import Link from "next/link"
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  FileText,
  Info,
  Briefcase,
  Newspaper,
  Mail,
  Shield,
  Cookie,
  HelpCircle,
  LifeBuoy,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export default function Footer() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    })
    setEmail("")
  }

  return (
    <footer className="bg-blue-50/50 border-t py-16 px-4">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold">EduPortal</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-[400px]">
              Empowering individuals to achieve their personal and professional goals through quality education and
              lifelong learning opportunities.
            </p>
            <div className="flex gap-4">
              {[
                {
                  icon: <Twitter className="h-5 w-5" />,
                  label: "Twitter",
                  color: "hover:bg-blue-100 hover:text-blue-600",
                },
                {
                  icon: <Facebook className="h-5 w-5" />,
                  label: "Facebook",
                  color: "hover:bg-blue-100 hover:text-blue-600",
                },
                {
                  icon: <Instagram className="h-5 w-5" />,
                  label: "Instagram",
                  color: "hover:bg-purple-100 hover:text-purple-600",
                },
                {
                  icon: <Linkedin className="h-5 w-5" />,
                  label: "LinkedIn",
                  color: "hover:bg-blue-100 hover:text-blue-600",
                },
                {
                  icon: <Youtube className="h-5 w-5" />,
                  label: "YouTube",
                  color: "hover:bg-red-100 hover:text-red-600",
                },
              ].map((social, index) => (
                <Link
                  key={index}
                  href="#"
                  className={`h-10 w-10 flex items-center justify-center rounded-full bg-background border transition-colors ${social.color}`}
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 text-blue-800">Explore</h3>
            <ul className="space-y-4">
              {[
                { icon: <BookOpen className="h-4 w-4" />, label: "Courses", href: "/categories" },
                { icon: <GraduationCap className="h-4 w-4" />, label: "Programs", href: "/programs" },
                { icon: <Users className="h-4 w-4" />, label: "Instructors", href: "#" },
                { icon: <Calendar className="h-4 w-4" />, label: "Events", href: "#" },
                { icon: <FileText className="h-4 w-4" />, label: "Resources", href: "#" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 text-blue-800">Information</h3>
            <ul className="space-y-4">
              {[
                { icon: <Info className="h-4 w-4" />, label: "About Us", href: "/about" },
                { icon: <Briefcase className="h-4 w-4" />, label: "Careers", href: "#" },
                { icon: <Newspaper className="h-4 w-4" />, label: "Press", href: "#" },
                { icon: <Mail className="h-4 w-4" />, label: "Contact", href: "/contact" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 text-blue-800">Legal</h3>
            <ul className="space-y-4">
              {[
                { icon: <FileText className="h-4 w-4" />, label: "Terms", href: "/terms" },
                { icon: <Shield className="h-4 w-4" />, label: "Privacy", href: "/privacy" },
                { icon: <Cookie className="h-4 w-4" />, label: "Cookies", href: "/cookies" },
                { icon: <HelpCircle className="h-4 w-4" />, label: "Accessibility", href: "/accessibility" },
                { icon: <LifeBuoy className="h-4 w-4" />, label: "Support", href: "#" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 text-blue-800">Newsletter</h3>
            <p className="text-muted-foreground mb-4">Subscribe to get updates on new courses and features.</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                Cookie Policy
              </Link>
              <Link
                href="/accessibility"
                className="text-sm text-muted-foreground hover:text-blue-600 transition-colors"
              >
                Accessibility
              </Link>
            </div>
            <div className="flex flex-col md:flex-row md:justify-end gap-4 md:items-center">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <select className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none py-0">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} EduPortal. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
