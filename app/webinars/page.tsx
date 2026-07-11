"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search,
  Calendar,
  Clock,
  Users,
  Video,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Play,
  Download,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { getWebinars, registerForWebinar } from "@/lib/catalog-api"

export default function WebinarsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [apiWebinars, setApiWebinars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Handle registration
  const handleRegister = async (webinarId: string, webinarTitle: string) => {
    try {
      await registerForWebinar(webinarId)
      toast({ title: "Registration successful!", description: `You have registered for "${webinarTitle}".` })
    } catch (error: any) {
      toast({ title: "Registration failed", description: error?.message || "Please sign in and try again.", variant: "destructive" })
    }
  }

  // Webinars data
  const fallbackWebinars = [
    {
      id: 1,
      title: "The Future of AI in Education",
      slug: "future-ai-education",
      description:
        "Join us for an insightful discussion on how artificial intelligence is transforming the educational landscape.",
      image: "/placeholder.svg?height=300&width=600",
      date: "April 15, 2024",
      time: "2:00 PM - 3:30 PM IST",
      duration: "90 minutes",
      status: "upcoming",
      speakers: [
        {
          name: "Dr. Sarah Chen",
          role: "AI Education Specialist",
          avatar: "/placeholder.svg?height=100&width=100",
        },
        {
          name: "Prof. Michael Johnson",
          role: "Director of Educational Technology",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      ],
      attendees: 245,
      category: "Technology",
      featured: true,
      free: true,
      tags: ["AI", "Education", "Technology", "Future"],
    },
    {
      id: 2,
      title: "Effective Teaching Strategies for Online Learning",
      slug: "effective-teaching-online-learning",
      description:
        "Learn practical strategies for engaging students and improving outcomes in virtual learning environments.",
      image: "/placeholder.svg?height=300&width=600",
      date: "April 20, 2024",
      time: "1:00 PM - 2:30 PM IST",
      duration: "90 minutes",
      status: "upcoming",
      speakers: [
        {
          name: "Dr. Emily Rodriguez",
          role: "Online Education Expert",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      ],
      attendees: 189,
      category: "Teaching",
      featured: true,
      free: false,
      price: "$29",
      tags: ["Teaching", "Online Learning", "Education", "Strategies"],
    },
    {
      id: 3,
      title: "Data Science Career Paths and Opportunities",
      slug: "data-science-career-paths",
      description:
        "Explore various career paths in data science and learn about the skills needed to succeed in this growing field.",
      image: "/placeholder.svg?height=300&width=600",
      date: "April 25, 2024",
      time: "3:00 PM - 4:00 PM IST",
      duration: "60 minutes",
      status: "upcoming",
      speakers: [
        {
          name: "Alex Thompson",
          role: "Lead Data Scientist",
          avatar: "/placeholder.svg?height=100&width=100",
        },
        {
          name: "Jessica Lee",
          role: "Data Science Recruiter",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      ],
      attendees: 156,
      category: "Career",
      featured: false,
      free: true,
      tags: ["Data Science", "Career", "Technology", "Skills"],
    },
    {
      id: 4,
      title: "Building Accessible Web Applications",
      slug: "building-accessible-web-applications",
      description:
        "Learn how to create web applications that are accessible to all users, including those with disabilities.",
      image: "/placeholder.svg?height=300&width=600",
      date: "May 5, 2024",
      time: "2:00 PM - 3:30 PM IST",
      duration: "90 minutes",
      status: "upcoming",
      speakers: [
        {
          name: "David Wilson",
          role: "Accessibility Specialist",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      ],
      attendees: 132,
      category: "Development",
      featured: false,
      free: false,
      price: "$19",
      tags: ["Accessibility", "Web Development", "Inclusion", "Design"],
    },
    {
      id: 5,
      title: "Mastering JavaScript: Advanced Concepts",
      slug: "mastering-javascript-advanced",
      description: "Dive deep into advanced JavaScript concepts including closures, prototypes, async/await, and more.",
      image: "/placeholder.svg?height=300&width=600",
      date: "March 15, 2024",
      time: "1:00 PM - 3:00 PM IST",
      duration: "120 minutes",
      status: "past",
      speakers: [
        {
          name: "Jason Martinez",
          role: "Senior JavaScript Developer",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      ],
      attendees: 278,
      category: "Development",
      featured: true,
      free: false,
      price: "$39",
      recording: true,
      tags: ["JavaScript", "Programming", "Web Development", "Advanced"],
    },
    {
      id: 6,
      title: "Student Success Strategies for Remote Learning",
      slug: "student-success-remote-learning",
      description: "Discover effective strategies for students to succeed in remote and online learning environments.",
      image: "/placeholder.svg?height=300&width=600",
      date: "March 10, 2024",
      time: "2:00 PM - 3:00 PM IST",
      duration: "60 minutes",
      status: "past",
      speakers: [
        {
          name: "Dr. Robert Kim",
          role: "Educational Psychologist",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      ],
      attendees: 198,
      category: "Education",
      featured: false,
      free: true,
      recording: true,
      tags: ["Student Success", "Remote Learning", "Education", "Study Skills"],
    },
    {
      id: 7,
      title: "Cybersecurity Essentials for Educators",
      slug: "cybersecurity-essentials-educators",
      description: "Learn essential cybersecurity practices to protect educational data and systems.",
      image: "/placeholder.svg?height=300&width=600",
      date: "February 28, 2024",
      time: "1:00 PM - 2:30 PM IST",
      duration: "90 minutes",
      status: "past",
      speakers: [
        {
          name: "Marcus Johnson",
          role: "Cybersecurity Expert",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      ],
      attendees: 145,
      category: "Technology",
      featured: false,
      free: false,
      price: "$29",
      recording: true,
      tags: ["Cybersecurity", "Education", "Technology", "Data Protection"],
    },
    {
      id: 8,
      title: "Inclusive Teaching Practices",
      slug: "inclusive-teaching-practices",
      description:
        "Explore strategies for creating inclusive learning environments that support diverse student populations.",
      image: "/placeholder.svg?height=300&width=600",
      date: "February 20, 2024",
      time: "3:00 PM - 4:30 PM IST",
      duration: "90 minutes",
      status: "past",
      speakers: [
        {
          name: "Dr. Lisa Chen",
          role: "Diversity in Education Specialist",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      ],
      attendees: 212,
      category: "Teaching",
      featured: true,
      free: true,
      recording: true,
      tags: ["Inclusion", "Diversity", "Teaching", "Education"],
    },
  ]

  useEffect(() => {
    let active = true
    setLoading(true)
    const timer = window.setTimeout(async () => {
      try {
        const response = await getWebinars({ status: activeTab, q: searchQuery || undefined, limit: 50 })
        if (active) setApiWebinars(response.data.map((webinar, index) => ({
          id: webinar.id,
          title: webinar.title,
          slug: webinar.slug,
          description: webinar.description || "",
          image: webinar.thumbnailUrl || "/placeholder.svg",
          date: new Date(webinar.scheduledAt).toLocaleDateString(undefined, { dateStyle: "long" }),
          time: new Date(webinar.scheduledAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
          duration: `${webinar.durationMinutes} minutes`,
          status: webinar.status,
          speakers: [{ name: webinar.host.name, role: `@${webinar.host.username}`, avatar: "/placeholder-user.jpg" }],
          attendees: webinar.registrationCount,
          category: webinar.categoryName || "General",
          featured: index < 2,
          free: true,
          recording: webinar.recordingAvailable,
          tags: [webinar.categoryName || "General"],
        })))
      } catch (error: any) {
        if (active) toast({ title: "Unable to load webinars", description: error?.message || "Please try again.", variant: "destructive" })
      } finally { if (active) setLoading(false) }
    }, 250)
    return () => { active = false; window.clearTimeout(timer) }
  }, [activeTab, searchQuery, toast])

  const webinars = apiWebinars

  // Filter webinars based on search and tab
  const filteredWebinars = webinars.filter((webinar) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        webinar.title.toLowerCase().includes(query) ||
        webinar.description.toLowerCase().includes(query) ||
        webinar.category.toLowerCase().includes(query) ||
        webinar.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
        webinar.speakers.some((speaker: any) => speaker.name.toLowerCase().includes(query))
      )
    }

    // Tab filter
    return webinar.status === activeTab
  })

  // Featured webinars
  const featuredWebinars = webinars.filter((webinar) => webinar.featured && webinar.status === activeTab)

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-blue-50 py-8 md:py-12 border-b">
        <div className="container">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/webinars" className="font-medium">
                  Webinars
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Educational Webinars</h1>
              <p className="text-muted-foreground">
                Join our live webinars or watch recordings to learn from industry experts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Tabs Bar */}
      <section className="py-6 border-b sticky top-16 bg-background/95 backdrop-blur z-30">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search webinars..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="upcoming" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="upcoming" className="flex-1 md:flex-initial">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="past" className="flex-1 md:flex-initial">
                  Past Webinars
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container">
          {/* Featured Webinars */}
          {!searchQuery && featuredWebinars.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Featured Webinars</h2>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {featuredWebinars.map((webinar) => (
                  <motion.div key={webinar.id} variants={fadeIn}>
                    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative md:w-2/5">
                          <Image
                            src={webinar.image || "/placeholder.svg"}
                            alt={webinar.title}
                            width={600}
                            height={300}
                            className="w-full h-[200px] md:h-full object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-blue-600">Featured</Badge>
                          </div>
                          {webinar.free && (
                            <div className="absolute top-4 right-4">
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                Free
                              </Badge>
                            </div>
                          )}
                          {webinar.status === "past" && webinar.recording && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="bg-blue-600 rounded-full p-3">
                                <Play className="h-6 w-6 text-white" fill="white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1">
                          <Badge variant="outline" className="mb-2">
                            {webinar.category}
                          </Badge>
                          <h3 className="font-bold text-xl mb-2"><Link href={`/webinars/${webinar.slug}`} className="hover:text-blue-700">{webinar.title}</Link></h3>
                          <p className="text-muted-foreground text-sm mb-4">{webinar.description}</p>
                          <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{webinar.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{webinar.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{webinar.attendees} attendees</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {webinar.speakers.map((speaker: any, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={speaker.avatar || "/placeholder.svg"} alt={speaker.name} />
                                  <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{speaker.name}</p>
                                  <p className="text-xs text-muted-foreground">{speaker.role}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          {webinar.status === "upcoming" ? (
                            <Button
                              className="w-full gap-1 bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleRegister(String(webinar.id), webinar.title)}
                            >
                              {webinar.free ? "Register Now" : `Register Now (${webinar.price})`}
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button className="flex-1 gap-1 bg-blue-600 hover:bg-blue-700">
                                Watch Recording
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* All Webinars */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {searchQuery
                  ? `Search Results (${filteredWebinars.length})`
                  : activeTab === "upcoming"
                    ? "Upcoming Webinars"
                    : "Past Webinars & Recordings"}
              </h2>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </div>

            {filteredWebinars.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No webinars found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
                <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {filteredWebinars.map((webinar) => (
                  <motion.div key={webinar.id} variants={fadeIn}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative md:w-1/4">
                          <Image
                            src={webinar.image || "/placeholder.svg"}
                            alt={webinar.title}
                            width={600}
                            height={300}
                            className="w-full h-[200px] md:h-full object-cover"
                          />
                          {webinar.featured && (
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-blue-600">Featured</Badge>
                            </div>
                          )}
                          {webinar.free && (
                            <div className="absolute top-4 right-4">
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                Free
                              </Badge>
                            </div>
                          )}
                          {webinar.status === "past" && webinar.recording && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="bg-blue-600 rounded-full p-3">
                                <Play className="h-6 w-6 text-white" fill="white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">{webinar.category}</Badge>
                            {webinar.tags.slice(0, 2).map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="font-bold text-xl mb-2"><Link href={`/webinars/${webinar.slug}`} className="hover:text-blue-700">{webinar.title}</Link></h3>
                          <p className="text-muted-foreground text-sm mb-4">{webinar.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{webinar.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{webinar.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Video className="h-4 w-4 text-muted-foreground" />
                              <span>{webinar.duration}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                              {webinar.speakers.map((speaker: any, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={speaker.avatar || "/placeholder.svg"} alt={speaker.name} />
                                    <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">{speaker.name}</p>
                                    <p className="text-xs text-muted-foreground">{speaker.role}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {webinar.status === "upcoming" ? (
                              <Button
                                className="gap-1 bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleRegister(String(webinar.id), webinar.title)}
                              >
                                {webinar.free ? "Register Now" : `Register Now (${webinar.price})`}
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            ) : (
                              <div className="flex gap-2">
                                <Button className="gap-1 bg-blue-600 hover:bg-blue-700">
                                  Watch Recording
                                  <Play className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" title="Download Resources">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" title="Share">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {filteredWebinars.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" disabled>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span className="sr-only">Previous</span>
                  </Button>
                  <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    <span className="sr-only">Next</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Host a Webinar Section */}
      <section className="py-16 bg-blue-50 border-t">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Want to Host a Webinar?</h2>
              <p className="text-muted-foreground mb-6">
                Share your expertise with our community. We're looking for educators, industry experts, and thought
                leaders to host webinars on a variety of topics.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Reach thousands of engaged learners",
                  "Establish yourself as an industry expert",
                  "Get professional support for your presentation",
                  "Receive recordings and analytics after your webinar",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700"><Link href="/webinars/host">Apply to Host <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Host a webinar"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Our webinars reached</p>
                    <p className="text-xl font-bold">10,000+ learners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Never Miss a Webinar</h2>
            <p className="text-blue-100 mb-8">
              Subscribe to our newsletter to get notifications about upcoming webinars and access to exclusive content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
