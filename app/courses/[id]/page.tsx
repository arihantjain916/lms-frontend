"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { BookOpen, CheckCircle2, ChevronLeft, Clock, GraduationCap, PlayCircle, Share2, Star, ThumbsDown, ThumbsUp, UserRound } from "lucide-react"
import toast from "react-hot-toast"
import { addCourseReview, Course, CourseReview, getCourse, getCourseCurriculum, getCourseInstructor, getCourseReviews, getRelatedCourses, Instructor, Lesson } from "@/lib/course-api"
import { useAuth } from "@/hooks/use-authenticated"
import CourseCard from "../course-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

function formatPrice(value?: number | null) {
  if (!value) return "Free"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
}

function formatDate(value?: string) {
  if (!value) return "Recently"
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(parsed)
}

function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return <span className="inline-flex">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`${size} ${star <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />)}</span>
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [reviews, setReviews] = useState<CourseReview[]>([])
  const [related, setRelated] = useState<Course[]>([])
  const [reviewTotal, setReviewTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [rating, setRating] = useState("5")
  const [comment, setComment] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)

  const loadReviews = useCallback(async () => {
    if (!id) return
    const result = await getCourseReviews(id, 1, 20)
    setReviews(result.data); setReviewTotal(result.totalElements)
  }, [id])

  const loadPage = useCallback(async () => {
    if (!id) return
    setLoading(true); setError("")
    try {
      const courseResult = await getCourse(id)
      setCourse(courseResult)
      const results = await Promise.allSettled([
        getCourseCurriculum(id, 1, 100),
        getCourseInstructor(id),
        getCourseReviews(id, 1, 20),
        getRelatedCourses(id, 4),
      ])
      if (results[0].status === "fulfilled") setLessons(results[0].value.data)
      if (results[1].status === "fulfilled") setInstructor(results[1].value)
      if (results[2].status === "fulfilled") { setReviews(results[2].value.data); setReviewTotal(results[2].value.totalElements) }
      if (results[3].status === "fulfilled") setRelated(results[3].value)
    } catch (requestError: any) {
      setError(requestError?.message || "This course could not be loaded.")
    } finally { setLoading(false) }
  }, [id])

  useEffect(() => { loadPage() }, [loadPage])

  async function submitReview(event: FormEvent) {
    event.preventDefault()
    if (!isAuthenticated) return
    setSubmittingReview(true)
    try {
      await addCourseReview(id, Number(rating), comment.trim())
      setComment(""); setRating("5"); await loadReviews(); toast.success("Your review was added")
    } catch (requestError: any) { toast.error(requestError?.message || "Unable to add review") }
    finally { setSubmittingReview(false) }
  }

  function share() {
    navigator.clipboard.writeText(window.location.href).then(() => toast.success("Course link copied"))
  }

  if (loading) return <main className="container min-h-[70vh] py-12"><div className="h-[420px] animate-pulse rounded-2xl bg-muted" /><div className="mt-8 h-96 animate-pulse rounded-2xl bg-muted/60" /></main>
  if (!course || error) return <main className="container flex min-h-[70vh] items-center justify-center py-16"><div className="max-w-lg text-center"><BookOpen className="mx-auto h-12 w-12 text-blue-600" /><h1 className="mt-5 text-3xl font-bold">Course unavailable</h1><p className="mt-3 text-muted-foreground">{error}</p><div className="mt-6 flex justify-center gap-3"><Button onClick={loadPage}>Try again</Button><Button asChild variant="outline"><Link href="/courses">All courses</Link></Button></div></div></main>

  const average = Number(course.avgRating ?? 0)
  return <main className="min-h-screen bg-background">
    <section className="bg-blue-950 py-10 text-white"><div className="container"><Link href="/courses" className="mb-7 inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white"><ChevronLeft className="h-4 w-4" />All courses</Link><div className="grid items-center gap-10 lg:grid-cols-[1fr_430px]"><div><div className="mb-4 flex flex-wrap gap-2">{course.category && <Badge className="bg-blue-600">{course.category.name}</Badge>}{course.isFeatured && <Badge variant="outline" className="border-amber-300 text-amber-200">Featured</Badge>}<Badge variant="outline" className="border-blue-300 text-blue-100">{course.level?.replaceAll("_", " ") || "All levels"}</Badge></div><h1 className="text-4xl font-bold tracking-tight md:text-5xl">{course.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">{course.description}</p><div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-blue-100"><span className="flex items-center gap-2"><Stars value={average} /><strong className="text-white">{average.toFixed(1)}</strong> ({course.totalRating ?? 0})</span><span className="flex items-center gap-2"><UserRound className="h-4 w-4" />{course.user?.name || instructor?.name || "EduPortal instructor"}</span><span className="flex items-center gap-2"><BookOpen className="h-4 w-4" />{lessons.length} lessons</span></div></div><div className="relative h-72 overflow-hidden rounded-2xl border border-white/10 bg-blue-900 shadow-2xl"><Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" priority /><div className="absolute inset-0 flex items-center justify-center bg-black/15"><PlayCircle className="h-16 w-16 fill-white text-white" /></div></div></div></div></section>

    <section className="container grid gap-10 py-12 lg:grid-cols-[1fr_340px]"><div className="space-y-12">
      <div><h2 className="text-2xl font-bold">About this course</h2><p className="mt-4 whitespace-pre-line leading-7 text-muted-foreground">{course.description || "Course details will be available soon."}</p><div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-blue-600" />{course.level?.replaceAll("_", " ") || "All levels"}</span><span className="flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-green-600" />{course.upvote ?? 0} upvotes</span><span className="flex items-center gap-2"><ThumbsDown className="h-4 w-4" />{course.downvote ?? 0} downvotes</span></div></div>

      <div><div className="flex items-end justify-between"><div><h2 className="text-2xl font-bold">Course curriculum</h2><p className="mt-1 text-sm text-muted-foreground">{lessons.length} lesson{lessons.length === 1 ? "" : "s"}</p></div></div><div className="mt-5 overflow-hidden rounded-xl border">{lessons.length ? lessons.map((lesson, index) => <div key={lesson.id} className="flex items-center justify-between gap-4 border-b p-4 last:border-0"><div className="flex min-w-0 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">{index + 1}</div><div><p className="font-medium">{lesson.title}</p>{lesson.description && <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{lesson.description}</p>}</div></div><div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">{lesson.time && <><Clock className="h-4 w-4" />{lesson.time}</>}{lesson.status && <Badge variant="outline" className="capitalize">{lesson.status.toLowerCase()}</Badge>}</div></div>) : <p className="p-8 text-center text-muted-foreground">Curriculum will be published soon.</p>}</div></div>

      {instructor && <Card><CardContent className="p-6"><h2 className="text-2xl font-bold">Your instructor</h2><div className="mt-5 flex gap-4"><Avatar className="h-20 w-20"><AvatarImage src={instructor.avatar || "/placeholder-user.jpg"} /><AvatarFallback className="text-xl">{instructor.name?.charAt(0) || "I"}</AvatarFallback></Avatar><div><h3 className="text-xl font-semibold">{instructor.name}</h3><p className="text-sm text-blue-700">@{instructor.username}</p><p className="mt-2 text-sm text-muted-foreground">Instructor for {instructor.totalCourses} course{instructor.totalCourses === 1 ? "" : "s"} on EduPortal.</p></div></div></CardContent></Card>}

      <div><div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">Student reviews</h2><p className="mt-1 text-sm text-muted-foreground">{reviewTotal} review{reviewTotal === 1 ? "" : "s"}</p></div><div className="text-right"><p className="text-3xl font-bold">{average.toFixed(1)}</p><Stars value={average} /></div></div>
        {isAuthenticated ? <Card className="mt-6"><CardContent className="p-5"><form onSubmit={submitReview} className="space-y-4"><div className="grid gap-4 sm:grid-cols-[150px_1fr]"><div className="space-y-2"><Label>Rating</Label><Select value={rating} onValueChange={setRating}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[5, 4, 3, 2, 1, 0].map((value) => <SelectItem key={value} value={String(value)}>{value} star{value === 1 ? "" : "s"}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="comment">Review</Label><Textarea id="comment" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Share your experience with this course" /></div></div><Button disabled={submittingReview}>{submittingReview ? "Submitting…" : "Submit review"}</Button></form></CardContent></Card> : <div className="mt-6 rounded-lg border bg-blue-50 p-5 text-sm"><Link href={`/login`} className="font-medium text-blue-700 hover:underline">Sign in</Link> to review this course.</div>}
        <div className="mt-6 space-y-4">{reviews.map((review) => <Card key={review.id}><CardContent className="p-5"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><Avatar><AvatarFallback>{review.user?.name?.charAt(0) || "S"}</AvatarFallback></Avatar><div><p className="font-semibold">{review.user?.name || "Student"}</p><p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p></div></div><Stars value={review.rating} /></div>{review.comment && <p className="mt-4 leading-7 text-muted-foreground">{review.comment}</p>}</CardContent></Card>)}{!reviews.length && <p className="rounded-lg border p-6 text-center text-muted-foreground">No reviews yet. Be the first to review this course.</p>}</div>
      </div>
    </div>

    <aside><Card className="sticky top-24 shadow-lg"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Course price</p><p className="mt-1 text-3xl font-bold">{formatPrice(course.price)}</p><Button asChild className="mt-6 w-full" size="lg"><Link href={`/courses/${course.id}/learn`}>{course.price ? "View learning content" : "Start learning"}</Link></Button><Button variant="outline" className="mt-3 w-full" onClick={share}><Share2 className="mr-2 h-4 w-4" />Share course</Button><div className="mt-6 space-y-3 border-t pt-5 text-sm"><p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" />Access course curriculum</p><p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" />Learn at your own pace</p><p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" />Expert instructor</p></div></CardContent></Card></aside>
    </section>

    {related.length > 0 && <section className="border-t bg-muted/20 py-12"><div className="container"><h2 className="text-2xl font-bold">Related courses</h2><p className="mt-1 text-muted-foreground">More courses from this category.</p><div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">{related.map((item) => <CourseCard key={item.id} course={item} />)}</div></div></section>}
  </main>
}
