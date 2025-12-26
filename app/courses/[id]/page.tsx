"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BookOpen,
  Clock,
  Star,
  Award,
  CheckCircle,
  Play,
  Users,
  BarChart,
  Calendar,
  Globe,
  ChevronRight,
  FileText,
  Download,
  Share2,
  BookmarkPlus,
  ThumbsUp,
  AlertCircle,
  Lock,
  PlayCircle,
  File,
  Laptop,
  BadgeIcon as Certificate,
  Infinity,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"

export default function CoursePage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

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

  // Mock course data
  const courseData = {
    id: params.id,
    title: "Complete Web Development Bootcamp 2024",
    subtitle:
      "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, MongoDB and more!",
    rating: 4.8,
    reviews: 12547,
    students: 245890,
    lastUpdated: "March 2024",
    language: "English",
    price: 89.99,
    discountPrice: 19.99,
    discountEnds: "3 days",
    level: "All Levels",
    duration: "63 hours",
    lectures: 614,
    articles: 28,
    exercises: 42,
    downloadable: 124,
    lifetime: true,
    mobile: true,
    certificate: true,
    image: "/placeholder.svg?height=600&width=1200",
    preview: "/placeholder.svg?height=600&width=1200",
    category: "Web Development",
    subcategory: "Full Stack",
    bestseller: true,
    featured: true,
    tags: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Express"],
    description: [
      "Build 16 web development projects for your portfolio, ready to apply for junior developer jobs",
      "Learn the latest technologies, including Javascript, React, Node and even Web3 development",
      "Build fully-fledged websites and web apps for your startup or business",
      "Master frontend development with React and backend development with Node",
      "Learn professional developer best practices",
    ],
    fullDescription:
      "Welcome to the Complete Web Development Bootcamp, the only course you need to learn to code and become a full-stack web developer. With over 245,000 ratings and a 4.8 average, this course is one of the HIGHEST RATED courses in the history of Udemy!\n\nAt 63+ hours, this Web Development course is without a doubt the most comprehensive web development course available online. Even if you have zero programming experience, this course will take you from beginner to mastery.",
    requirements: [
      "No programming experience needed - I'll teach you everything you need to know",
      "A computer with access to the internet",
      "No paid software required",
      "I'll walk you through, step-by-step how to get all the software installed and set up",
    ],
    targetAudience: [
      "If you want to learn to code through building fun and useful projects, then take this course",
      "If you want to start your own startup by building your own websites and web apps",
      "If you are a seasoned programmer, then take this course to to get up to speed quickly with the latest frameworks and NodeJS",
      "If you want to take ONE COURSE and learn everything you need to know about web development, take this course",
    ],
    instructor: {
      name: "Dr. Angela Yu",
      title: "Developer and Lead Instructor",
      bio: "I'm Angela, I'm a developer with a passion for teaching. I'm the lead instructor at the London App Brewery, London's leading Programming Bootcamp. I've helped hundreds of thousands of students learn to code and change their lives by becoming a developer. I've been invited by companies such as Twitter, Facebook and Google to teach their employees.",
      rating: 4.7,
      reviews: 187432,
      students: 2145670,
      courses: 12,
      image: "/placeholder.svg?height=200&width=200",
    },
    curriculum: [
      {
        id: "section-1",
        title: "Introduction to Web Development",
        duration: "2 hours",
        lectures: [
          {
            id: "lecture-1-1",
            title: "Course Overview",
            duration: "5:42",
            preview: true,
            type: "video",
          },
          {
            id: "lecture-1-2",
            title: "How the Internet Works",
            duration: "12:36",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-1-3",
            title: "How Websites Work",
            duration: "14:18",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-1-4",
            title: "Setting Up Your Development Environment",
            duration: "18:54",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-1-5",
            title: "Introduction Resources",
            duration: "N/A",
            preview: false,
            type: "article",
          },
        ],
      },
      {
        id: "section-2",
        title: "HTML Foundations",
        duration: "4.5 hours",
        lectures: [
          {
            id: "lecture-2-1",
            title: "Introduction to HTML",
            duration: "16:24",
            preview: true,
            type: "video",
          },
          {
            id: "lecture-2-2",
            title: "HTML Document Structure",
            duration: "14:52",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-2-3",
            title: "HTML Text Elements",
            duration: "22:18",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-2-4",
            title: "HTML Lists",
            duration: "15:42",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-2-5",
            title: "HTML Links and Images",
            duration: "24:36",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-2-6",
            title: "HTML Tables",
            duration: "18:24",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-2-7",
            title: "HTML Forms",
            duration: "32:18",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-2-8",
            title: "HTML Challenge",
            duration: "N/A",
            preview: false,
            type: "exercise",
          },
          {
            id: "lecture-2-9",
            title: "HTML Project: Personal Website",
            duration: "45:12",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-2-10",
            title: "HTML Resources",
            duration: "N/A",
            preview: false,
            type: "download",
          },
        ],
      },
      {
        id: "section-3",
        title: "CSS Fundamentals",
        duration: "6 hours",
        lectures: [
          {
            id: "lecture-3-1",
            title: "Introduction to CSS",
            duration: "18:36",
            preview: true,
            type: "video",
          },
          {
            id: "lecture-3-2",
            title: "CSS Selectors",
            duration: "24:48",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-3-3",
            title: "CSS Box Model",
            duration: "28:12",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-3-4",
            title: "CSS Typography",
            duration: "22:54",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-3-5",
            title: "CSS Colors and Backgrounds",
            duration: "26:18",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-3-6",
            title: "CSS Layout: Display and Positioning",
            duration: "34:42",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-3-7",
            title: "CSS Flexbox",
            duration: "42:18",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-3-8",
            title: "CSS Grid",
            duration: "38:24",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-3-9",
            title: "CSS Responsive Design",
            duration: "36:54",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-3-10",
            title: "CSS Challenge",
            duration: "N/A",
            preview: false,
            type: "exercise",
          },
          {
            id: "lecture-3-11",
            title: "CSS Project: Portfolio Website",
            duration: "58:36",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-3-12",
            title: "CSS Resources",
            duration: "N/A",
            preview: false,
            type: "download",
          },
        ],
      },
      {
        id: "section-4",
        title: "JavaScript Basics",
        duration: "8 hours",
        lectures: [
          {
            id: "lecture-4-1",
            title: "Introduction to JavaScript",
            duration: "16:48",
            preview: true,
            type: "video",
          },
          {
            id: "lecture-4-2",
            title: "JavaScript Variables and Data Types",
            duration: "28:24",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-4-3",
            title: "JavaScript Operators",
            duration: "22:36",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-4-4",
            title: "JavaScript Control Flow",
            duration: "32:18",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-4-5",
            title: "JavaScript Functions",
            duration: "42:54",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-4-6",
            title: "JavaScript Arrays",
            duration: "36:12",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-4-7",
            title: "JavaScript Objects",
            duration: "38:36",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-4-8",
            title: "JavaScript DOM Manipulation",
            duration: "48:24",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-4-9",
            title: "JavaScript Events",
            duration: "34:48",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-4-10",
            title: "JavaScript Challenge",
            duration: "N/A",
            preview: false,
            type: "exercise",
          },
          {
            id: "lecture-4-11",
            title: "JavaScript Project: Interactive Website",
            duration: "1:12:36",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-4-12",
            title: "JavaScript Resources",
            duration: "N/A",
            preview: false,
            type: "download",
          },
        ],
      },
      {
        id: "section-5",
        title: "Advanced JavaScript",
        duration: "7 hours",
        lectures: [
          {
            id: "lecture-5-1",
            title: "JavaScript ES6+ Features",
            duration: "42:18",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-5-2",
            title: "JavaScript Promises and Async/Await",
            duration: "48:36",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-5-3",
            title: "JavaScript Fetch API",
            duration: "36:24",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-5-4",
            title: "JavaScript Error Handling",
            duration: "28:12",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-5-5",
            title: "JavaScript Modules",
            duration: "32:48",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-5-6",
            title: "JavaScript Design Patterns",
            duration: "54:36",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-5-7",
            title: "JavaScript Testing",
            duration: "46:24",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-5-8",
            title: "Advanced JavaScript Challenge",
            duration: "N/A",
            preview: false,
            type: "exercise",
          },
          {
            id: "lecture-5-9",
            title: "Advanced JavaScript Project: Weather App",
            duration: "1:24:48",
            preview: false,
            type: "video",
          },
          {
            id: "lecture-5-10",
            title: "Advanced JavaScript Resources",
            duration: "N/A",
            preview: false,
            type: "download",
          },
        ],
      },
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        date: "March 15, 2024",
        rating: 5,
        comment:
          "This course is absolutely amazing! I started with zero coding knowledge and now I'm building full-stack applications. Angela is an incredible instructor who explains complex concepts in a way that's easy to understand. The projects are fun and practical, and I feel confident in my abilities now. Highly recommend!",
        helpful: 342,
      },
      {
        id: 2,
        name: "Michael Chen",
        date: "March 10, 2024",
        rating: 5,
        comment:
          "Best web development course I've taken! The curriculum is comprehensive and up-to-date with the latest technologies. I particularly enjoyed the React and Node.js sections. Angela's teaching style is engaging and she provides plenty of exercises to reinforce learning. I've already landed a junior developer job thanks to this course!",
        helpful: 287,
      },
      {
        id: 3,
        name: "Emily Rodriguez",
        date: "March 5, 2024",
        rating: 4,
        comment:
          "Great course overall! The content is extensive and well-structured. I found the JavaScript sections particularly helpful. My only critique is that some of the later sections feel a bit rushed compared to the earlier ones. Nevertheless, I learned a ton and feel much more confident in my web development skills.",
        helpful: 156,
      },
      {
        id: 4,
        name: "David Wilson",
        date: "February 28, 2024",
        rating: 5,
        comment:
          "This course exceeded my expectations! Angela breaks down complex topics into manageable chunks, and the projects help reinforce what you've learned. I especially appreciated the sections on databases and authentication. The course is constantly updated with new content, which is a huge plus in the fast-changing world of web development.",
        helpful: 203,
      },
      {
        id: 5,
        name: "Jessica Lee",
        date: "February 20, 2024",
        rating: 5,
        comment:
          "I can't recommend this course enough! As someone who tried to learn coding multiple times before, this was the first course that actually made everything click for me. The projects are practical and build upon each other nicely. Angela is an excellent teacher who clearly explains everything. Worth every penny!",
        helpful: 178,
      },
    ],
    relatedCourses: [
      {
        id: "2",
        title: "The Complete JavaScript Course 2024",
        instructor: "Jonas Schmedtmann",
        rating: 4.7,
        students: 158432,
        price: 89.99,
        discountPrice: 16.99,
        image: "/placeholder.svg?height=200&width=400",
        bestseller: true,
      },
      {
        id: "3",
        title: "React - The Complete Guide 2024",
        instructor: "Maximilian Schwarzmüller",
        rating: 4.8,
        students: 187654,
        price: 89.99,
        discountPrice: 17.99,
        image: "/placeholder.svg?height=200&width=400",
        bestseller: true,
      },
      {
        id: "4",
        title: "Node.js, Express, MongoDB & More",
        instructor: "Jonas Schmedtmann",
        rating: 4.7,
        students: 124567,
        price: 89.99,
        discountPrice: 15.99,
        image: "/placeholder.svg?height=200&width=400",
        bestseller: false,
      },
    ],
  }

  // Calculate total course content
  const totalLectures = courseData.curriculum.reduce((acc, section) => acc + section.lectures.length, 0)
  const totalVideos = courseData.curriculum.reduce(
    (acc, section) => acc + section.lectures.filter((lecture) => lecture.type === "video").length,
    0,
  )
  const totalArticles = courseData.curriculum.reduce(
    (acc, section) => acc + section.lectures.filter((lecture) => lecture.type === "article").length,
    0,
  )
  const totalExercises = courseData.curriculum.reduce(
    (acc, section) => acc + section.lectures.filter((lecture) => lecture.type === "exercise").length,
    0,
  )
  const totalDownloads = courseData.curriculum.reduce(
    (acc, section) => acc + section.lectures.filter((lecture) => lecture.type === "download").length,
    0,
  )

  // Calculate total course duration
  const calculateTotalDuration = () => {
    let totalMinutes = 0
    courseData.curriculum.forEach((section) => {
      section.lectures.forEach((lecture) => {
        if (lecture.duration !== "N/A" && lecture.type === "video") {
          const parts = lecture.duration.split(":")
          if (parts.length === 2) {
            totalMinutes += Number.parseInt(parts[0]) + Number.parseInt(parts[1]) / 60
          } else if (parts.length === 3) {
            totalMinutes += Number.parseInt(parts[0]) * 60 + Number.parseInt(parts[1]) + Number.parseInt(parts[2]) / 60
          }
        }
      })
    })
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.round(totalMinutes % 60)
    return `${hours}h ${minutes}m`
  }

  // Toggle video play/pause
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  // Handle enrollment
  const handleEnroll = () => {
    toast({
      title: "Enrollment Successful!",
      description: "You have successfully enrolled in this course.",
    })
  }

  // Handle wishlist
  const handleWishlist = () => {
    toast({
      title: "Added to Wishlist",
      description: "This course has been added to your wishlist.",
    })
  }

  // Handle share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied!",
      description: "Course link has been copied to clipboard.",
    })
  }

  // Format rating display
  const formatRating = (rating: number) => {
    return rating.toFixed(1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Course Header */}
      <section className="bg-blue-900 text-white py-8 md:py-12">
        <div className="container">
          <Breadcrumb className="mb-4 text-blue-100">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-white">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-blue-200" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/categories" className="hover:text-white">
                  Categories
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-blue-200" />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/categories/web-development`} className="hover:text-white">
                  {courseData.category}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-blue-200" />
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="font-medium">
                  {courseData.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {courseData.bestseller && (
                  <Badge className="bg-amber-500 text-white hover:bg-amber-600">Bestseller</Badge>
                )}
                {courseData.featured && <Badge className="bg-blue-600 text-white hover:bg-blue-700">Featured</Badge>}
                <Badge variant="outline" className="bg-blue-800/50 text-blue-100 border-blue-700">
                  {courseData.subcategory}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">{courseData.title}</h1>
              <p className="text-lg text-blue-100 mb-4">{courseData.subtitle}</p>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.floor(courseData.rating) ? "fill-amber-400 text-amber-400" : "text-blue-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">{formatRating(courseData.rating)}</span>
                  <Link href="#reviews" className="ml-2 text-blue-200 hover:text-white underline">
                    ({courseData.reviews.toLocaleString()} reviews)
                  </Link>
                </div>
                <div className="flex items-center gap-1 text-blue-100">
                  <Users className="h-4 w-4" />
                  <span>{courseData.students.toLocaleString()} students</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Last updated {courseData.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{courseData.language}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  <span>{courseData.level}</span>
                </div>
              </div>

              <div className="mt-6 hidden lg:block">
                <div className="flex flex-wrap gap-2">
                  <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={handleEnroll}>
                    <CheckCircle className="h-4 w-4" />
                    Enroll Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 bg-blue-800/50 text-blue-100 border-blue-700 hover:bg-blue-800 hover:text-white"
                    onClick={handleWishlist}
                  >
                    <BookmarkPlus className="h-4 w-4" />
                    Add to Wishlist
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-blue-800/50 text-blue-100 border-blue-700 hover:bg-blue-800 hover:text-white"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-blue-200 text-sm mt-2">30-Day Money-Back Guarantee</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="relative rounded-lg overflow-hidden border-4 border-blue-800 shadow-xl">
                {!isVideoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <Button
                      size="icon"
                      className="h-16 w-16 rounded-full bg-blue-600/90 hover:bg-blue-700 text-white"
                      onClick={toggleVideo}
                    >
                      <Play className="h-8 w-8 ml-1" />
                    </Button>
                  </div>
                )}
                <video
                  ref={videoRef}
                  poster={courseData.preview}
                  className="w-full aspect-video object-cover"
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onEnded={() => setIsVideoPlaying(false)}
                  controls={isVideoPlaying}
                >
                  <source src="/placeholder-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Enrollment Card */}
      <div className="lg:hidden sticky top-16 z-30 bg-white border-b shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">${courseData.discountPrice}</div>
              <div className="text-sm line-through text-muted-foreground">${courseData.price}</div>
            </div>
            <div className="flex gap-2">
              <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={handleEnroll}>
                <CheckCircle className="h-4 w-4" />
                Enroll
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-blue-200 hover:bg-blue-50"
                onClick={handleWishlist}
              >
                <BookmarkPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Course Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="curriculum" className="mb-8">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* Curriculum Tab */}
                <TabsContent value="curriculum" className="pt-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Course Content</h2>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {totalLectures} lectures • {calculateTotalDuration()} total length
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{totalVideos} videos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <span>{totalArticles} articles</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span>{totalDownloads} downloadable resources</span>
                      </div>
                    </div>
                  </div>

                  <Accordion type="multiple" className="border rounded-md">
                    {courseData.curriculum.map((section, index) => (
                      <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left gap-2">
                            <div>
                              <span className="font-medium">
                                Section {index + 1}: {section.title}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {section.duration} • {section.lectures.length} lectures
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-0 pb-0">
                          <div className="divide-y">
                            {section.lectures.map((lecture) => (
                              <div
                                key={lecture.id}
                                className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
                              >
                                <div className="flex-shrink-0">
                                  {lecture.type === "video" ? (
                                    <PlayCircle className="h-5 w-5 text-blue-600" />
                                  ) : lecture.type === "article" ? (
                                    <FileText className="h-5 w-5 text-purple-600" />
                                  ) : lecture.type === "exercise" ? (
                                    <Laptop className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <Download className="h-5 w-5 text-amber-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium truncate">{lecture.title}</span>
                                      {lecture.preview && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-600">
                                          Preview
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                      {lecture.duration !== "N/A" && (
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {lecture.duration}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {!lecture.preview && <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>

                {/* Overview Tab */}
                <TabsContent value="overview" className="pt-6">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{courseData.fullDescription}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-4">What You'll Learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {courseData.description.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-4">Requirements</h3>
                      <ul className="space-y-2">
                        {courseData.requirements.map((item, index) => (
                          <li key={index} className="flex gap-2">
                            <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-4">Who This Course is For</h3>
                      <ul className="space-y-2">
                        {courseData.targetAudience.map((item, index) => (
                          <li key={index} className="flex gap-2">
                            <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-4">Featured Review</h3>
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <Avatar className="h-12 w-12 border">
                              <AvatarImage src="/placeholder.svg?height=48&width=48" />
                              <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{courseData.reviews[0].name}</h4>
                                <span className="text-sm text-muted-foreground">{courseData.reviews[0].date}</span>
                              </div>
                              <div className="flex mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= courseData.reviews[0].rating
                                        ? "fill-amber-500 text-amber-500"
                                        : "text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-muted-foreground">{courseData.reviews[0].comment}</p>
                              <div className="flex items-center gap-2 mt-3">
                                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                                  <ThumbsUp className="h-4 w-4" />
                                  Helpful ({courseData.reviews[0].helpful})
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Instructor Tab */}
                <TabsContent value="instructor" className="pt-6">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Meet Your Instructor</h2>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4">
                        <Avatar className="h-32 w-32 rounded-md border">
                          <AvatarImage src={courseData.instructor.image || "/placeholder.svg"} />
                          <AvatarFallback className="text-2xl">
                            {courseData.instructor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="md:w-3/4">
                        <h3 className="text-xl font-bold">{courseData.instructor.name}</h3>
                        <p className="text-muted-foreground mb-3">{courseData.instructor.title}</p>

                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <span>
                              {courseData.instructor.rating} Instructor Rating (
                              {courseData.instructor.reviews.toLocaleString()} reviews)
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-blue-600" />
                            <span>{courseData.instructor.courses} Courses</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>{courseData.instructor.students.toLocaleString()} Students</span>
                          </div>
                        </div>

                        <div className="prose max-w-none">
                          <p className="whitespace-pre-line">{courseData.instructor.bio}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="pt-6" id="reviews">
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="md:w-1/3 bg-muted/30 p-6 rounded-lg">
                        <div className="text-center mb-4">
                          <div className="text-5xl font-bold text-blue-600">{formatRating(courseData.rating)}</div>
                          <div className="flex justify-center my-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= Math.floor(courseData.rating) ? "fill-amber-500 text-amber-500" : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Course Rating • {courseData.reviews.toLocaleString()} reviews
                          </div>
                        </div>

                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            // Mock percentages for the rating distribution
                            const percentage =
                              rating === 5 ? 78 : rating === 4 ? 16 : rating === 3 ? 4 : rating === 2 ? 1 : 1
                            return (
                              <div key={rating} className="flex items-center gap-2">
                                <div className="flex items-center gap-1 w-16">
                                  <span>{rating}</span>
                                  <Star
                                    className={`h-4 w-4 ${rating > 3 ? "fill-amber-500 text-amber-500" : "text-muted"}`}
                                  />
                                </div>
                                <Progress value={percentage} className="h-2 flex-1" />
                                <div className="w-10 text-right text-sm text-muted-foreground">{percentage}%</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="md:w-2/3">
                        <h3 className="text-xl font-bold mb-4">Student Reviews</h3>
                        <div className="space-y-6">
                          {courseData.reviews.map((review) => (
                            <Card key={review.id}>
                              <CardContent className="p-6">
                                <div className="flex gap-4">
                                  <Avatar className="h-10 w-10 border">
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                    <AvatarFallback>
                                      {review.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold">{review.name}</h4>
                                      <span className="text-sm text-muted-foreground">{review.date}</span>
                                    </div>
                                    <div className="flex mb-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-4 w-4 ${
                                            star <= review.rating ? "fill-amber-500 text-amber-500" : "text-muted"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <p className="text-muted-foreground">{review.comment}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                                        <ThumbsUp className="h-4 w-4" />
                                        Helpful ({review.helpful})
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Course Info Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-36">
                <Card className="border-2 border-blue-100 shadow-lg overflow-hidden">
                  <div className="bg-blue-600 text-white p-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">${courseData.discountPrice}</span>
                      <span className="text-lg line-through opacity-80">${courseData.price}</span>
                      <span className="text-sm bg-white text-blue-600 px-2 py-0.5 rounded-md font-medium">
                        {Math.round(((courseData.price - courseData.discountPrice) / courseData.price) * 100)}% off
                      </span>
                    </div>
                    <p className="text-sm mt-1">Sale ends in {courseData.discountEnds}</p>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Button
                        className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleEnroll}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Enroll Now
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full gap-2 border-blue-200 hover:bg-blue-50"
                        onClick={handleWishlist}
                      >
                        <BookmarkPlus className="h-4 w-4" />
                        Add to Wishlist
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">30-Day Money-Back Guarantee</p>

                      <div className="pt-4">
                        <h3 className="font-semibold mb-3">This course includes:</h3>
                        <ul className="space-y-3">
                          <li className="flex gap-3">
                            <PlayCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <span>{courseData.duration} on-demand video</span>
                          </li>
                          <li className="flex gap-3">
                            <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <span>{courseData.articles} articles</span>
                          </li>
                          <li className="flex gap-3">
                            <Download className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <span>{courseData.downloadable} downloadable resources</span>
                          </li>
                          <li className="flex gap-3">
                            <Laptop className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <span>{courseData.exercises} coding exercises</span>
                          </li>
                          {courseData.lifetime && (
                            <li className="flex gap-3">
                              <Infinity className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              <span>Full lifetime access</span>
                            </li>
                          )}
                          {courseData.mobile && (
                            <li className="flex gap-3">
                              <Smartphone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              <span>Access on mobile and TV</span>
                            </li>
                          )}
                          {courseData.certificate && (
                            <li className="flex gap-3">
                              <Certificate className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              <span>Certificate of completion</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="pt-2 flex justify-center gap-4">
                        <Button variant="link" size="sm" className="text-muted-foreground" onClick={handleShare}>
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="link" size="sm" className="text-muted-foreground">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Training 5 or more people?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get your team access to 25,000+ top courses anytime, anywhere.
                  </p>
                  <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    Get EduPortal Business
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      <section className="py-12 bg-muted/30 border-t">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Students Also Bought</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData.relatedCourses.map((course) => (
              <Card
                key={course.id}
                className="h-full overflow-hidden transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="relative">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    width={400}
                    height={200}
                    alt={course.title}
                    className="w-full h-[160px] object-cover"
                  />
                  {course.bestseller && (
                    <Badge className="absolute top-4 left-4 bg-amber-500 text-white hover:bg-amber-600">
                      Bestseller
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {course.instructor}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="font-medium">{course.rating}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.floor(course.rating) ? "fill-amber-500 text-amber-500" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({course.students.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-lg">${course.discountPrice}</span>
                      <span className="text-sm line-through text-muted-foreground ml-2">${course.price}</span>
                    </div>
                    <Link href={`/courses/${course.id}`}>
                      <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                        View Course
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
