"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ClipboardCheck,
  Clock,
  GraduationCap,
  MessageCircle,
  PlayCircle,
  Share2,
  Star,
  ThumbsDown,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  addCourseReview,
  Course,
  CourseReview,
  getCourse,
  getCourseCurriculum,
  getCourseInstructor,
  getCourseReviews,
  getRelatedCourses,
  Instructor,
  Lesson,
} from "@/lib/course-api";
import { useAuth } from "@/hooks/use-authenticated";
import {
  addToWishlist,
  CourseProgress,
  createCertificate,
  createCheckout,
  enrollCourse,
  getCourseProgress,
  getWishlist,
  removeFromWishlist,
  unenrollCourse,
} from "@/lib/learning-api";
import CourseCard from "../course-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  askCourseQuestion,
  getCourseQuestions,
  markQuestionHelpful,
  trackCourseView,
  type CourseQuestion,
} from "@/lib/content-api";
import { loginHref } from "@/lib/auth-navigation";
import { usePageRestoreKey } from "@/hooks/use-page-restore-key";

function formatPrice(value?: number | null) {
  if (!value) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "Recently";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(parsed);
}

function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${star <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
        />
      ))}
    </span>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const restoreKey = usePageRestoreKey();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [related, setRelated] = useState<Course[]>([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [questions, setQuestions] = useState<CourseQuestion[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [questionPage, setQuestionPage] = useState(1);
  const [questionPages, setQuestionPages] = useState(1);
  const resolvedCourseId = course?.id;

  const loadQuestions = useCallback(async () => {
    if (!resolvedCourseId) return;
    try {
      const result = await getCourseQuestions(
        resolvedCourseId,
        questionPage,
        10,
      );
      setQuestions(result.data);
      setQuestionPages(Math.max(result.totalPages, 1));
    } catch {
      setQuestions([]);
    }
  }, [questionPage, resolvedCourseId]);

  const loadReviews = useCallback(async () => {
    if (!resolvedCourseId) return;
    const result = await getCourseReviews(resolvedCourseId, 1, 20);
    setReviews(result.data);
    setReviewTotal(result.totalElements);
  }, [resolvedCourseId]);

  const loadPage = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const courseResult = await getCourse(id);
      setCourse(courseResult);
      setEnrolled(Boolean(courseResult.isEnrolled));
      const courseId = courseResult.id;
      const results = await Promise.allSettled([
        getCourseCurriculum(courseId, 1, 100),
        getCourseInstructor(courseId),
        getCourseReviews(courseId, 1, 20),
        getRelatedCourses(courseId, 4),
      ]);
      if (results[0].status === "fulfilled") setLessons(results[0].value.data);
      if (results[1].status === "fulfilled") setInstructor(results[1].value);
      if (results[2].status === "fulfilled") {
        setReviews(results[2].value.data);
        setReviewTotal(results[2].value.totalElements);
      }
      if (results[3].status === "fulfilled") setRelated(results[3].value);
    } catch (requestError: any) {
      setError(requestError?.message || "This course could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPage();
  }, [loadPage, restoreKey]);
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions, restoreKey]);
  useEffect(() => {
    if (resolvedCourseId)
      trackCourseView(resolvedCourseId).catch(() => undefined);
  }, [resolvedCourseId]);

  async function submitQuestion(event: FormEvent) {
    event.preventDefault();
    if (!isAuthenticated) return router.push(loginHref(`/courses/${id}`));
    try {
      if (!resolvedCourseId) return;
      await askCourseQuestion(resolvedCourseId, questionText.trim());
      setQuestionText("");
      await loadQuestions();
      toast.success("Question posted");
    } catch (e: any) {
      toast.error(e?.message || "Unable to post question");
    }
  }
  async function helpful(questionId: string) {
    try {
      await markQuestionHelpful(questionId);
      await loadQuestions();
    } catch (e: any) {
      toast.error(e?.message || "Unable to update question");
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !resolvedCourseId) {
      setEnrolled(false);
      setWishlisted(false);
      setCourseProgress(null);
      return;
    }
    setEnrolled(Boolean(course?.isEnrolled));
    if (course?.isEnrolled) {
      getCourseProgress(resolvedCourseId)
        .then(setCourseProgress)
        .catch(() => setCourseProgress(null));
    } else {
      setCourseProgress(null);
    }
    getWishlist(1, 100)
      .then((result) =>
        setWishlisted(
          result.data.some(
            (item) => String(item.course.id) === String(resolvedCourseId),
          ),
        ),
      )
      .catch(() => setWishlisted(false));
  }, [course?.isEnrolled, isAuthenticated, resolvedCourseId]);

  async function submitReview(event: FormEvent) {
    event.preventDefault();
    if (!isAuthenticated) return;
    setSubmittingReview(true);
    try {
      if (!resolvedCourseId) return;
      await addCourseReview(resolvedCourseId, Number(rating), comment.trim());
      setComment("");
      setRating("5");
      await loadReviews();
      toast.success("Your review was added");
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to add review");
    } finally {
      setSubmittingReview(false);
    }
  }

  function share() {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("Course link copied"));
  }

  async function toggleWishlist() {
    if (!isAuthenticated) return router.push(loginHref(`/courses/${id}`));
    if (!resolvedCourseId) return;
    setActionLoading(true);
    try {
      if (wishlisted) await removeFromWishlist(resolvedCourseId);
      else await addToWishlist(resolvedCourseId);
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to update wishlist");
    } finally {
      setActionLoading(false);
    }
  }

  async function startCourse() {
    if (!isAuthenticated) return router.push(loginHref(`/courses/${id}`));
    if (!resolvedCourseId) return;
    if (enrolled) return router.push(`/courses/${resolvedCourseId}/learn`);
    setActionLoading(true);
    try {
      if (!course?.price) {
        await enrollCourse(resolvedCourseId);
        setEnrolled(true);
        toast.success("Enrollment successful");
        router.push(`/courses/${resolvedCourseId}/learn`);
      } else {
        const order = await createCheckout(resolvedCourseId);
        router.push(`/orders/${order.id}`);
      }
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to start this course");
    } finally {
      setActionLoading(false);
    }
  }

  async function unenroll() {
    if (!resolvedCourseId) return;
    setActionLoading(true);
    try {
      await unenrollCourse(resolvedCourseId);
      setEnrolled(false);
      setCourseProgress(null);
      toast.success("You have unenrolled");
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to unenroll");
    } finally {
      setActionLoading(false);
    }
  }

  async function issueCertificate() {
    if (!resolvedCourseId) return;
    setActionLoading(true);
    try {
      const certificate = await createCertificate(resolvedCourseId);
      router.push(`/certificates/${certificate.id}`);
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to issue certificate");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading)
    return (
      <main className="container min-h-[70vh] py-12">
        <div className="h-[420px] animate-pulse rounded-2xl bg-muted" />
        <div className="mt-8 h-96 animate-pulse rounded-2xl bg-muted/60" />
      </main>
    );
  if (!course || error)
    return (
      <main className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="max-w-lg text-center">
          <BookOpen className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-5 text-3xl font-bold">Course unavailable</h1>
          <p className="mt-3 text-muted-foreground">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={loadPage}>Try again</Button>
            <Button asChild variant="outline">
              <Link href="/courses">All courses</Link>
            </Button>
          </div>
        </div>
      </main>
    );

  const average = Number(course.avgRating ?? 0);
  return (
    <main className="min-h-screen bg-background">
      <section className="bg-blue-950 py-10 text-white">
        <div className="container">
          <Link
            href="/courses"
            className="mb-7 inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            All courses
          </Link>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_430px]">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {course.category && (
                  <Badge className="bg-blue-600">{course.category.name}</Badge>
                )}
                {course.isFeatured && (
                  <Badge
                    variant="outline"
                    className="border-amber-300 text-amber-200"
                  >
                    Featured
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="border-blue-300 text-blue-100"
                >
                  {course.level?.replaceAll("_", " ") || "All levels"}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {course.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
                {course.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-blue-100">
                <span className="flex items-center gap-2">
                  <Stars value={average} />
                  <strong className="text-white">{average.toFixed(1)}</strong> (
                  {course.totalRating ?? 0})
                </span>
                <span className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  {course.user?.name ||
                    instructor?.name ||
                    "EduPortal instructor"}
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {lessons.length} lessons
                </span>
              </div>
            </div>
            <div className="relative h-72 overflow-hidden rounded-2xl border border-white/10 bg-blue-900 shadow-2xl">
              <Image
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                <PlayCircle className="h-16 w-16 fill-white text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold">About this course</h2>
            <p className="mt-4 whitespace-pre-line leading-7 text-muted-foreground">
              {course.description || "Course details will be available soon."}
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                {course.level?.replaceAll("_", " ") || "All levels"}
              </span>
              <span className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-green-600" />
                {course.upvote ?? 0} upvotes
              </span>
              <span className="flex items-center gap-2">
                <ThumbsDown className="h-4 w-4" />
                {course.downvote ?? 0} downvotes
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">Course curriculum</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {lessons.length} lesson{lessons.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <div className="mt-5 overflow-hidden rounded-xl border">
              {lessons.length ? (
                lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between gap-4 border-b p-4 last:border-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        {lesson.description && (
                          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                      {lesson.time && (
                        <>
                          <Clock className="h-4 w-4" />
                          {lesson.time}
                        </>
                      )}
                      {lesson.status && (
                        <Badge variant="outline" className="capitalize">
                          {lesson.status.toLowerCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-8 text-center text-muted-foreground">
                  Curriculum will be published soon.
                </p>
              )}
            </div>
          </div>

          {instructor && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold">Your instructor</h2>
                <div className="mt-5 flex gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={instructor.avatar || "/placeholder-user.jpg"}
                    />
                    <AvatarFallback className="text-xl">
                      {instructor.name?.charAt(0) || "I"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{instructor.name}</h3>
                    <p className="text-sm text-blue-700">
                      @{instructor.username}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Instructor for {instructor.totalCourses} course
                      {instructor.totalCourses === 1 ? "" : "s"} on EduPortal.
                    </p>
                    {enrolled && (
                      <Button asChild variant="outline" className="mt-4">
                        <Link
                          href={`/messages/new?recipientId=${encodeURIComponent(instructor.id)}&recipientName=${encodeURIComponent(instructor.name)}&courseId=${course.id}&courseTitle=${encodeURIComponent(course.title)}`}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Message instructor
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <h2 className="text-2xl font-bold">Course questions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask the instructor or help another learner.
            </p>
            {enrolled && (
              <Card className="mt-5">
                <CardContent className="p-5">
                  <form onSubmit={submitQuestion}>
                    <Textarea
                      value={questionText}
                      onChange={(event) => setQuestionText(event.target.value)}
                      required
                      maxLength={2000}
                      placeholder="Ask a question about this course"
                    />
                    <Button className="mt-3">Post question</Button>
                  </form>
                </CardContent>
              </Card>
            )}
            <div className="mt-5 space-y-3">
              {questions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="p-5">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p>{question.content}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {question.user?.name || "Learner"} ·{" "}
                          {formatDate(question.createdAt)} ·{" "}
                          {question.repliesCount || 0} replies
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => helpful(question.id)}
                      >
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {question.helpfulCount || 0}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {questions.length === 0 && (
                <p className="rounded border p-6 text-center text-muted-foreground">
                  No questions yet.
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Student reviews</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {reviewTotal} review{reviewTotal === 1 ? "" : "s"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{average.toFixed(1)}</p>
                <Stars value={average} />
              </div>
            </div>
            {isAuthenticated ? (
              <Card className="mt-6">
                <CardContent className="p-5">
                  <form onSubmit={submitReview} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <Select value={rating} onValueChange={setRating}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 4, 3, 2, 1, 0].map((value) => (
                              <SelectItem key={value} value={String(value)}>
                                {value} star{value === 1 ? "" : "s"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="comment">Review</Label>
                        <Textarea
                          id="comment"
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                          placeholder="Share your experience with this course"
                        />
                      </div>
                    </div>
                    <Button disabled={submittingReview}>
                      {submittingReview ? "Submitting…" : "Submit review"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="mt-6 rounded-lg border bg-blue-50 p-5 text-sm">
                <Link
                  href={loginHref(`/courses/${id}`)}
                  className="font-medium text-blue-700 hover:underline"
                >
                  Sign in
                </Link>{" "}
                to review this course.
              </div>
            )}
            <div className="mt-6 space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {review.user?.name?.charAt(0) || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {review.user?.name || "Student"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Stars value={review.rating} />
                    </div>
                    {review.comment && (
                      <p className="mt-4 leading-7 text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {!reviews.length && (
                <p className="rounded-lg border p-6 text-center text-muted-foreground">
                  No reviews yet. Be the first to review this course.
                </p>
              )}
            </div>
          </div>
        </div>

        <aside>
          <Card className="sticky top-24 shadow-lg">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Course price</p>
              <p className="mt-1 text-3xl font-bold">
                {formatPrice(course.price)}
              </p>
              {courseProgress && (
                <div className="mt-5 rounded-lg bg-blue-50 p-4">
                  <div className="flex justify-between text-sm">
                    <span>Your progress</span>
                    <strong>
                      {Math.round(courseProgress.progressPercent)}%
                    </strong>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${courseProgress.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={startCourse}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Please wait…"
                  : enrolled
                    ? "Continue learning"
                    : course.price
                      ? "Proceed to checkout"
                      : "Enroll for free"}
              </Button>
              {enrolled && (
                <Button asChild variant="outline" className="mt-3 w-full">
                  <Link href={`/courses/${course.id}/exams`}>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    View course exams
                  </Link>
                </Button>
              )}
              {enrolled && instructor && (
                <Button asChild variant="outline" className="mt-3 w-full">
                  <Link
                    href={`/messages/new?recipientId=${encodeURIComponent(instructor.id)}&recipientName=${encodeURIComponent(instructor.name)}&courseId=${course.id}&courseTitle=${encodeURIComponent(course.title)}`}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message instructor
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                className="mt-3 w-full"
                onClick={toggleWishlist}
                disabled={actionLoading}
              >
                {wishlisted ? (
                  <BookmarkCheck className="mr-2 h-4 w-4" />
                ) : (
                  <Bookmark className="mr-2 h-4 w-4" />
                )}
                {wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              </Button>
              {enrolled && (
                <Button
                  variant="ghost"
                  className="mt-2 w-full text-red-600"
                  onClick={unenroll}
                  disabled={actionLoading}
                >
                  Unenroll
                </Button>
              )}
              {courseProgress?.isCompleted && (
                <Button
                  className="mt-3 w-full bg-green-600 hover:bg-green-700"
                  onClick={issueCertificate}
                  disabled={actionLoading}
                >
                  Get certificate
                </Button>
              )}
              <Button variant="ghost" className="mt-2 w-full" onClick={share}>
                <Share2 className="mr-2 h-4 w-4" />
                Share course
              </Button>
              <div className="mt-6 space-y-3 border-t pt-5 text-sm">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Access course curriculum
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Learn at your own pace
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Expert instructor
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="border-t bg-muted/20 py-12">
          <div className="container">
            <h2 className="text-2xl font-bold">Related courses</h2>
            <p className="mt-1 text-muted-foreground">
              More courses from this category.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <CourseCard key={item.id} course={item} />
              ))}
            </div>
          </div>
        </section>
      )}
      {questionPages > 1 && (
        <div className="container flex items-center justify-center gap-3 pb-12">
          <Button
            variant="outline"
            disabled={questionPage <= 1}
            onClick={() => setQuestionPage((value) => value - 1)}
          >
            Previous questions
          </Button>
          <span className="text-sm text-muted-foreground">
            Question page {questionPage} of {questionPages}
          </span>
          <Button
            variant="outline"
            disabled={questionPage >= questionPages}
            onClick={() => setQuestionPage((value) => value + 1)}
          >
            Next questions
          </Button>
        </div>
      )}
      <div className="container pb-12 text-center">
        <Button asChild>
          <Link href={`/courses/${resolvedCourseId}/questions`}>
            Open full course discussion
          </Link>
        </Button>
      </div>
    </main>
  );
}
