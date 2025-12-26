"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  FileText,
  Download,
  PlayCircle,
  BookOpen,
  MessageCircle,
  ThumbsUp,
  Send,
  Award,
  Users,
  Star,
  Menu,
  X,
  AlertCircle,
  HelpCircle,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

export default function CourseLearnPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const isMobile = useMobile()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [activeTab, setActiveTab] = useState("content")
  const [showSidebar, setShowSidebar] = useState(true)
  const [currentLessonId, setCurrentLessonId] = useState("lecture-1-1")
  const [question, setQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null)

  // Mock course data
  const courseData = {
    id: params.id,
    title: "Complete Web Development Bootcamp 2024",
    progress: 12, // percentage
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
        progress: 60, // percentage
        lectures: [
          {
            id: "lecture-1-1",
            title: "Course Overview",
            duration: "5:42",
            type: "video",
            completed: true,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
          {
            id: "lecture-1-2",
            title: "How the Internet Works",
            duration: "12:36",
            type: "video",
            completed: true,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
          {
            id: "lecture-1-3",
            title: "How Websites Work",
            duration: "14:18",
            type: "video",
            completed: false,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
          {
            id: "lecture-1-4",
            title: "Setting Up Your Development Environment",
            duration: "18:54",
            type: "video",
            completed: false,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
          {
            id: "lecture-1-5",
            title: "Introduction Resources",
            duration: "N/A",
            type: "article",
            completed: false,
            content: "This is a supplementary article with resources for the introduction section.",
          },
        ],
      },
      {
        id: "section-2",
        title: "HTML Foundations",
        progress: 0, // percentage
        lectures: [
          {
            id: "lecture-2-1",
            title: "Introduction to HTML",
            duration: "16:24",
            type: "video",
            completed: false,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
          {
            id: "lecture-2-2",
            title: "HTML Document Structure",
            duration: "14:52",
            type: "video",
            completed: false,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
          {
            id: "lecture-2-3",
            title: "HTML Text Elements",
            duration: "22:18",
            type: "video",
            completed: false,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
          {
            id: "lecture-2-4",
            title: "HTML Lists",
            duration: "15:42",
            type: "video",
            completed: false,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
          {
            id: "lecture-2-5",
            title: "HTML Challenge",
            duration: "N/A",
            type: "exercise",
            completed: false,
            content: "Complete the HTML challenge to test your knowledge.",
          },
        ],
      },
      {
        id: "section-3",
        title: "CSS Fundamentals",
        progress: 0, // percentage
        lectures: [
          {
            id: "lecture-3-1",
            title: "Introduction to CSS",
            duration: "18:36",
            type: "video",
            completed: false,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
          {
            id: "lecture-3-2",
            title: "CSS Selectors",
            duration: "24:48",
            type: "video",
            completed: false,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
          {
            id: "lecture-3-3",
            title: "CSS Box Model",
            duration: "28:12",
            type: "video",
            completed: false,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
        ],
      },
      {
        id: "section-4",
        title: "JavaScript Basics",
        progress: 0, // percentage
        lectures: [
          {
            id: "lecture-4-1",
            title: "Introduction to JavaScript",
            duration: "16:48",
            type: "video",
            completed: false,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
          {
            id: "lecture-4-2",
            title: "JavaScript Variables and Data Types",
            duration: "28:24",
            type: "video",
            completed: false,
            videoUrl: "/placeholder.svg?height=720&width=1280",
          },
        ],
      },
    ],
    questions: [
      {
        id: 1,
        user: {
          name: "Michael Chen",
          image: "/placeholder.svg?height=40&width=40",
        },
        date: "2 days ago",
        question:
          "In the HTML section, you mentioned semantic tags. Could you explain more about when to use <article> vs <section> tags?",
        answer: {
          instructor: true,
          text: "Great question! The <section> element represents a standalone section within a document, which doesn't have a more specific semantic element to represent it. It typically has a heading.\n\nThe <article> element represents a self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable. Examples include: a forum post, a magazine or newspaper article, a blog entry, a product card, etc.\n\nA simple rule of thumb: If the content could be syndicated (like in an RSS feed), use <article>. If it's a logical grouping of related content, use <section>.",
          date: "1 day ago",
          likes: 12,
        },
        likes: 8,
        replies: 1,
      },
      {
        id: 2,
        user: {
          name: "Sarah Johnson",
          image: "/placeholder.svg?height=40&width=40",
        },
        date: "1 week ago",
        question:
          "I'm having trouble with the CSS flexbox exercise. My items aren't aligning properly when I use 'justify-content: space-between'. Any tips on debugging this?",
        answer: {
          instructor: true,
          text: "When using 'justify-content: space-between' and things aren't aligning as expected, check these common issues:\n\n1. Make sure your container has 'display: flex' applied\n2. Check if your flex container has enough width - if it's the same width as its contents, space-between won't have any effect\n3. Ensure you don't have any margins on the flex items that might be affecting the spacing\n4. If you only have one item, space-between won't have a visible effect\n\nTry adding a border to your flex container to visualize its dimensions. This often helps identify the issue!",
          date: "6 days ago",
          likes: 15,
        },
        likes: 7,
        replies: 1,
      },
      {
        id: 3,
        user: {
          name: "David Wilson",
          image: "/placeholder.svg?height=40&width=40",
        },
        date: "2 weeks ago",
        question:
          "In the JavaScript section, you mentioned closures. I'm still confused about how they work in practical applications. Could you provide a real-world example?",
        answer: null,
        likes: 4,
        replies: 0,
      },
    ],
  }

  // Find current lesson
  const findCurrentLesson = () => {
    for (const section of courseData.curriculum) {
      const lesson = section.lectures.find((lecture) => lecture.id === currentLessonId)
      if (lesson) return lesson
    }
    return courseData.curriculum[0].lectures[0]
  }

  const currentLesson = findCurrentLesson()

  // Find next and previous lessons
  const findAdjacentLessons = () => {
    let prevLesson = null
    let nextLesson = null
    let foundCurrent = false

    for (const section of courseData.curriculum) {
      for (let i = 0; i < section.lectures.length; i++) {
        const lecture = section.lectures[i]

        if (foundCurrent) {
          nextLesson = lecture
          return { prevLesson, nextLesson }
        }

        if (lecture.id === currentLessonId) {
          foundCurrent = true
        } else {
          prevLesson = lecture
        }
      }
    }

    return { prevLesson, nextLesson }
  }

  const { prevLesson, nextLesson } = findAdjacentLessons()

  // Video controls
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      setDuration(video.duration)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }
    const handleEnded = () => {
      setIsPlaying(false)
      if (nextLesson) {
        toast({
          title: "Lesson completed",
          description: "Moving to the next lesson...",
        })
        setTimeout(() => setCurrentLessonId(nextLesson.id), 2000)
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("volumechange", handleVolumeChange)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("volumechange", handleVolumeChange)
      video.removeEventListener("ended", handleEnded)
    }
  }, [nextLesson, toast])

  // Handle fullscreen
  useEffect(() => {
    const container = videoContainerRef.current
    if (!container) return

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Auto-hide controls
  useEffect(() => {
    const container = videoContainerRef.current
    if (!container) return

    const handleMouseMove = () => {
      setShowControls(true)

      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current)
      }

      if (isPlaying) {
        controlsTimeout.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }

    const handleMouseLeave = () => {
      if (isPlaying) {
        setShowControls(false)
      }
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current)
      }
    }
  }, [isPlaying])

  // Handle sidebar visibility based on screen size
  useEffect(() => {
    // On mobile, show sidebar by default when page loads
    // On desktop, keep sidebar open
    setShowSidebar(true)
  }, [])

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
  }

  // Set volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = Number.parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)

    if (newVolume === 0) {
      video.muted = true
    } else if (video.muted) {
      video.muted = false
    }
  }

  // Seek video
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const seekTime = Number.parseFloat(e.target.value)
    video.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const container = videoContainerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00"

    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Navigate to lesson
  const navigateToLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId)
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  // Handle question submission
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Question Submitted",
        description: "Your question has been sent to the instructor.",
      })
      setQuestion("")
      setIsSubmitting(false)
    }, 1000)
  }

  // Handle like question
  const handleLikeQuestion = (questionId: number) => {
    toast({
      title: "Question Liked",
      description: "You found this question helpful.",
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <div className="bg-blue-900 text-white py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/courses/${params.id}`} className="flex items-center gap-1 text-blue-100 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to course</span>
          </Link>
          <Separator orientation="vertical" className="h-6 bg-blue-700" />
          <div className="truncate max-w-[200px] sm:max-w-md">
            <h1 className="text-sm font-medium truncate">{courseData.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-blue-200">Your progress</span>
            <div className="w-32 h-2 bg-blue-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${courseData.progress}%` }} />
            </div>
            <span className="text-xs font-medium">{courseData.progress}%</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-700 bg-blue-800/50 text-white hover:bg-blue-800 hover:text-white"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">{showSidebar ? "Hide" : "Show"} Sidebar</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isMobile ? "100%" : "350px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-muted/30 border-r overflow-y-auto flex-shrink-0 ${isMobile ? "fixed inset-0 z-50 bg-background" : ""}`}
            >
              <div className="p-4 sticky top-0 bg-background z-10 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Course Content</h2>
                  {isMobile && (
                    <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {courseData.curriculum.reduce((acc, section) => acc + section.lectures.length, 0)} lessons
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <Clock className="h-4 w-4" />
                  <span>63h total length</span>
                </div>
                <Progress value={courseData.progress} className="h-1.5 mt-3" />
              </div>

              <div className="p-2">
                <Accordion type="multiple" defaultValue={["section-1"]} className="w-full">
                  {courseData.curriculum.map((section) => (
                    <AccordionItem key={section.id} value={section.id} className="border rounded-md mb-2">
                      <AccordionTrigger className="px-3 py-2 hover:bg-muted/50 [&>svg]:h-4 [&>svg]:w-4">
                        <div className="flex flex-col items-start text-left">
                          <div className="font-medium">{section.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <span>{section.lectures.length} lessons</span>
                            <span>•</span>
                            <span>{section.progress}% complete</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 pb-0">
                        <div className="space-y-1">
                          {section.lectures.map((lecture) => (
                            <button
                              key={lecture.id}
                              className={`w-full flex items-center gap-3 p-2 rounded-md text-left text-sm transition-colors ${
                                currentLessonId === lecture.id ? "bg-blue-100 text-blue-900" : "hover:bg-muted"
                              }`}
                              onClick={() => navigateToLesson(lecture.id)}
                            >
                              <div className="flex-shrink-0">
                                {lecture.completed ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : currentLessonId === lecture.id ? (
                                  <PlayCircle className="h-4 w-4 text-blue-600" />
                                ) : lecture.type === "video" ? (
                                  <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                ) : lecture.type === "article" ? (
                                  <FileText className="h-4 w-4 text-purple-600" />
                                ) : (
                                  <Download className="h-4 w-4 text-amber-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{lecture.title}</div>
                                {lecture.duration !== "N/A" && (
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{lecture.duration}</span>
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player */}
          <div ref={videoContainerRef} className="relative bg-black w-full aspect-video">
            {currentLesson.type === "video" ? (
              <>
                <video
                  ref={videoRef}
                  src="/placeholder-video.mp4"
                  poster={currentLesson.videoUrl}
                  className="w-full h-full"
                  onClick={togglePlay}
                />

                {/* Video Controls */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-300 ${
                    showControls ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {/* Top Controls */}
                  <div className="p-4 flex justify-between items-center">
                    <div className="text-white text-sm font-medium truncate max-w-md">{currentLesson.title}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-900/70 text-white border-blue-700">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </Badge>
                    </div>
                  </div>

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {!isPlaying && (
                      <Button
                        size="icon"
                        className="h-16 w-16 rounded-full bg-blue-600/90 hover:bg-blue-700 text-white pointer-events-auto"
                        onClick={togglePlay}
                      >
                        <Play className="h-8 w-8 ml-1" />
                      </Button>
                    )}
                  </div>

                  {/* Bottom Controls */}
                  <div className="p-4 space-y-2">
                    {/* Progress Bar */}
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />

                    {/* Control Buttons */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => prevLesson && navigateToLesson(prevLesson.id)}
                          disabled={!prevLesson}
                        >
                          <SkipBack className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={togglePlay}
                        >
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => nextLesson && navigateToLesson(nextLesson.id)}
                          disabled={!nextLesson}
                        >
                          <SkipForward className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center gap-2 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={toggleMute}
                          >
                            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                          </Button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <Settings className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={toggleFullscreen}
                        >
                          <Maximize className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : currentLesson.type === "article" ? (
              <div className="absolute inset-0 bg-white p-6 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{currentLesson.title}</h2>
                <div className="prose max-w-none">
                  <p>{currentLesson.content}</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-white p-6 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{currentLesson.title}</h2>
                <div className="prose max-w-none">
                  <p>{currentLesson.content}</p>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      Exercise Instructions
                    </h3>
                    <p>Complete this exercise to test your knowledge. Submit your work when finished.</p>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Start Exercise</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Navigation */}
          <div className="bg-muted/30 border-y p-4 flex justify-between">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => prevLesson && navigateToLesson(prevLesson.id)}
              disabled={!prevLesson}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Lesson
            </Button>
            <Button
              className="gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => nextLesson && navigateToLesson(nextLesson.id)}
              disabled={!nextLesson}
            >
              Next Lesson
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="p-6">
            <Tabs defaultValue="content" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="content">Lesson Content</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="questions">Q&A</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
                    {currentLesson.type === "video" && (
                      <div className="flex items-center gap-1">
                        <PlayCircle className="h-4 w-4" />
                        <span>{currentLesson.duration} video</span>
                      </div>
                    )}
                    {currentLesson.type === "article" && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>Article</span>
                      </div>
                    )}
                    {currentLesson.type === "exercise" && (
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>Exercise</span>
                      </div>
                    )}
                  </div>

                  <div className="prose max-w-none">
                    <p>
                      In this lesson, you'll learn about {currentLesson.title.toLowerCase()}. This is an important
                      concept in web development that will help you build better websites and applications.
                    </p>

                    <h3>Key Takeaways</h3>
                    <ul>
                      <li>Understanding the fundamentals of {currentLesson.title.toLowerCase()}</li>
                      <li>How to apply these concepts in real-world scenarios</li>
                      <li>Best practices and common pitfalls to avoid</li>
                    </ul>

                    <h3>Additional Resources</h3>
                    <p>Check out these resources to deepen your understanding:</p>
                    <ul>
                      <li>
                        <a href="#" className="text-blue-600 hover:underline">
                          Official Documentation
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-600 hover:underline">
                          Supplementary Reading
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-600 hover:underline">
                          Practice Exercises
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    Need Help?
                  </h3>
                  <p className="mb-4">
                    If you're having trouble understanding this lesson or have specific questions, don't hesitate to ask
                    the instructor in the Q&A section.
                  </p>
                  <Button
                    variant="outline"
                    className="gap-2 border-blue-200 hover:bg-blue-50"
                    onClick={() => setActiveTab("questions")}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Go to Q&A
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
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
              </TabsContent>

              <TabsContent value="questions" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-6">Ask the Instructor</h2>
                  <form onSubmit={handleSubmitQuestion} className="space-y-4">
                    <div>
                      <label htmlFor="question" className="block text-sm font-medium mb-2">
                        Your Question
                      </label>
                      <Textarea
                        id="question"
                        placeholder="What would you like to ask about this lesson?"
                        className="min-h-32"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting || !question.trim()}
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Submitting..." : "Submit Question"}
                    </Button>
                  </form>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Student Questions</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type="search" placeholder="Search questions..." className="pl-9 w-[200px]" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {courseData.questions.map((question) => (
                      <div key={question.id} className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-muted/30">
                          <div className="flex gap-4">
                            <Avatar className="h-10 w-10 border">
                              <AvatarImage src={question.user.image || "/placeholder.svg"} />
                              <AvatarFallback>
                                {question.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{question.user.name}</div>
                                <div className="text-sm text-muted-foreground">{question.date}</div>
                              </div>
                              <p className="mt-2">{question.question}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1 text-muted-foreground"
                                  onClick={() => handleLikeQuestion(question.id)}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  Helpful ({question.likes})
                                </Button>
                                <div className="text-sm text-muted-foreground">
                                  {question.replies} {question.replies === 1 ? "reply" : "replies"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {question.answer && (
                          <div className="p-4 border-t bg-blue-50/50">
                            <div className="flex gap-4">
                              <Avatar className="h-10 w-10 border">
                                <AvatarImage src={courseData.instructor.image || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {courseData.instructor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">{courseData.instructor.name}</div>
                                    {question.answer.instructor && <Badge className="bg-blue-600">Instructor</Badge>}
                                  </div>
                                  <div className="text-sm text-muted-foreground">{question.answer.date}</div>
                                </div>
                                <p className="mt-2 whitespace-pre-line">{question.answer.text}</p>
                                <div className="flex items-center gap-4 mt-3">
                                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                                    <ThumbsUp className="h-4 w-4" />
                                    Helpful ({question.answer.likes})
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
