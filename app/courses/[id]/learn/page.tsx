"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Award, CheckCircle2, ChevronLeft, ChevronRight, Download, FileText, Loader2, Lock, PlayCircle } from "lucide-react"
import toast from "react-hot-toast"
import { completeLesson, createCertificate, getLearningCourse, getLessonResources, getPlayback, getResourceDownload, LearningCourse, LearningLesson, LessonResource, Playback, updateProgress } from "@/lib/learning-api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function CourseLearnPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastSaved = useRef(0)
  const [learning, setLearning] = useState<LearningCourse | null>(null)
  const [currentLesson, setCurrentLesson] = useState<LearningLesson | null>(null)
  const [playback, setPlayback] = useState<Playback | null>(null)
  const [resources, setResources] = useState<LessonResource[]>([])
  const [loading, setLoading] = useState(true)
  const [lessonLoading, setLessonLoading] = useState(false)
  const [error, setError] = useState("")
  const [completing, setCompleting] = useState(false)

  const loadCourse = useCallback(async (preferredLessonId?: string) => {
    setLoading(true); setError("")
    try {
      const result = await getLearningCourse(id)
      setLearning(result)
      const lesson = result.lessons.find((item) => item.id === preferredLessonId) || result.lessons.find((item) => !item.isCompleted) || result.lessons[0] || null
      setCurrentLesson(lesson)
    } catch (requestError: any) {
      setError(requestError?.message || "You must be enrolled to access this course.")
    } finally { setLoading(false) }
  }, [id])

  useEffect(() => { loadCourse() }, [loadCourse])

  useEffect(() => {
    if (!currentLesson) { setPlayback(null); setResources([]); return }
    setLessonLoading(true); lastSaved.current = currentLesson.watchedSeconds || 0
    Promise.all([getPlayback(currentLesson.id), getLessonResources(currentLesson.id)])
      .then(([playbackResult, resourceResult]) => { setPlayback(playbackResult); setResources(resourceResult) })
      .catch((requestError: any) => toast.error(requestError?.message || "Unable to load lesson"))
      .finally(() => setLessonLoading(false))
  }, [currentLesson])

  function selectLesson(lesson: LearningLesson) {
    const currentSeconds = videoRef.current?.currentTime
    if (currentLesson && currentSeconds !== undefined) updateProgress(currentLesson.id, currentSeconds).catch(() => undefined)
    setCurrentLesson(lesson); setPlayback(null); setResources([])
  }

  function saveWatchedTime() {
    if (!currentLesson || !videoRef.current) return
    const seconds = videoRef.current.currentTime
    if (Math.abs(seconds - lastSaved.current) < 10) return
    lastSaved.current = seconds
    updateProgress(currentLesson.id, seconds).catch(() => undefined)
  }

  async function markComplete() {
    if (!currentLesson) return
    setCompleting(true)
    try {
      if (videoRef.current) await updateProgress(currentLesson.id, videoRef.current.currentTime)
      const progress = await completeLesson(currentLesson.id)
      toast.success("Lesson completed")
      await loadCourse(currentLesson.id)
      if (progress.isCompleted) toast.success("Course completed! Your certificate is ready.")
    } catch (requestError: any) { toast.error(requestError?.message || "Unable to complete lesson") }
    finally { setCompleting(false) }
  }

  async function download(resource: LessonResource) {
    try {
      const url = await getResourceDownload(resource.id)
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (requestError: any) { toast.error(requestError?.message || "Unable to download resource") }
  }

  async function issueCertificate() {
    try { const certificate = await createCertificate(id); router.push(`/certificates/${certificate.id}`) }
    catch (requestError: any) { toast.error(requestError?.message || "Unable to issue certificate") }
  }

  if (loading) return <main className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-9 w-9 animate-spin text-blue-600" /></main>
  if (!learning || error) return <main className="container flex min-h-[70vh] items-center justify-center py-16"><div className="max-w-lg text-center"><Lock className="mx-auto h-12 w-12 text-blue-600" /><h1 className="mt-5 text-3xl font-bold">Learning content unavailable</h1><p className="mt-3 text-muted-foreground">{error}</p><div className="mt-6 flex justify-center gap-3"><Button asChild><Link href={`/courses/${id}`}>View course</Link></Button><Button asChild variant="outline"><Link href="/login">Sign in</Link></Button></div></div></main>

  const currentIndex = currentLesson ? learning.lessons.findIndex((item) => item.id === currentLesson.id) : -1
  const nextLesson = currentIndex >= 0 ? learning.lessons[currentIndex + 1] : undefined

  return <main className="min-h-screen bg-slate-950 text-white">
    <header className="border-b border-white/10 bg-blue-950 px-4 py-3"><div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><Button asChild variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white"><Link href={`/courses/${id}`}><ChevronLeft className="h-5 w-5" /></Link></Button><div className="min-w-0"><h1 className="truncate font-semibold">{learning.course.title}</h1><p className="text-xs text-blue-200">{learning.progress.completedLessons} of {learning.progress.totalLessons} lessons completed</p></div></div><div className="hidden w-64 items-center gap-3 sm:flex"><Progress value={learning.progress.progressPercent} className="h-2 bg-white/20" /><span className="text-sm font-semibold">{Math.round(learning.progress.progressPercent)}%</span></div>{learning.progress.isCompleted && <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={issueCertificate}><Award className="mr-2 h-4 w-4" />Certificate</Button>}</div></header>

    <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[340px_1fr]">
      <aside className="max-h-[calc(100vh-65px)] overflow-y-auto border-r border-white/10 bg-slate-900"><div className="sticky top-0 border-b border-white/10 bg-slate-900 p-4"><h2 className="font-semibold">Course content</h2><p className="mt-1 text-xs text-slate-400">Select a lesson to continue</p></div><div>{learning.lessons.map((lesson, index) => <button key={lesson.id} className={`flex w-full gap-3 border-b border-white/5 p-4 text-left transition hover:bg-white/5 ${lesson.id === currentLesson?.id ? "bg-blue-600/20" : ""}`} onClick={() => selectLesson(lesson)}><div className="mt-0.5 shrink-0">{lesson.isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-400" /> : lesson.id === currentLesson?.id ? <PlayCircle className="h-5 w-5 text-blue-400" /> : <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 text-[10px]">{index + 1}</span>}</div><div className="min-w-0"><p className="text-sm font-medium">{lesson.title}</p><div className="mt-1 flex gap-2 text-xs text-slate-400">{lesson.time && <span>{lesson.time}</span>}{lesson.watchedSeconds > 0 && !lesson.isCompleted && <span>• Resume at {Math.floor(lesson.watchedSeconds / 60)}m</span>}</div></div></button>)}</div></aside>

      <section className="min-w-0 bg-slate-950">
        <div className="aspect-video w-full bg-black">{lessonLoading ? <div className="flex h-full items-center justify-center"><Loader2 className="h-9 w-9 animate-spin" /></div> : playback?.videoUrl ? <video key={playback.lessonId} ref={videoRef} src={playback.videoUrl} controls className="h-full w-full" onLoadedMetadata={() => { if (videoRef.current && playback.watchedSeconds > 0) videoRef.current.currentTime = playback.watchedSeconds }} onTimeUpdate={saveWatchedTime} onPause={() => { if (currentLesson && videoRef.current) updateProgress(currentLesson.id, videoRef.current.currentTime).catch(() => undefined) }} onEnded={markComplete} /> : <div className="flex h-full flex-col items-center justify-center text-slate-400"><PlayCircle className="h-14 w-14" /><p className="mt-3">No playback video available for this lesson.</p></div>}</div>
        <div className="p-6 md:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row"><div><div className="mb-2 flex gap-2">{currentLesson?.status && <Badge variant="secondary" className="capitalize">{currentLesson.status.toLowerCase()}</Badge>}{currentLesson?.isCompleted && <Badge className="bg-green-600">Completed</Badge>}</div><h2 className="text-2xl font-bold">{currentLesson?.title || "Select a lesson"}</h2><p className="mt-3 max-w-3xl leading-7 text-slate-300">{currentLesson?.description}</p></div>{currentLesson && <div className="flex shrink-0 gap-2"><Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={markComplete} disabled={completing || currentLesson.isCompleted}>{currentLesson.isCompleted ? "Completed" : completing ? "Saving…" : "Mark complete"}</Button>{nextLesson && <Button onClick={() => selectLesson(nextLesson)}>Next lesson<ChevronRight className="ml-2 h-4 w-4" /></Button>}</div>}</div>

          <div className="mt-8 border-t border-white/10 pt-6"><h3 className="font-semibold">Lesson resources</h3>{resources.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{resources.map((resource) => <Card key={resource.id} className="border-white/10 bg-slate-900 text-white"><CardContent className="flex items-center justify-between gap-4 p-4"><div className="flex min-w-0 items-center gap-3"><FileText className="h-5 w-5 shrink-0 text-blue-400" /><div className="min-w-0"><p className="truncate font-medium">{resource.title}</p><p className="text-xs text-slate-400">{resource.type || "Resource"}</p></div></div><Button size="icon" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={() => download(resource)}><Download className="h-4 w-4" /></Button></CardContent></Card>)}</div> : <p className="mt-3 text-sm text-slate-400">No resources attached to this lesson.</p>}</div>
        </div>
      </section>
    </div>
  </main>
}
