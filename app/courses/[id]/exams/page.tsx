"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCourseExams, startExam, type Exam } from "@/lib/exam-api"
import toast from "react-hot-toast"
export default function CourseExamsPage() { const { id } = useParams<{ id: string }>(); const router = useRouter(); const [exams, setExams] = useState<Exam[]>([]); useEffect(() => { getCourseExams(id).then(setExams).catch((e) => toast.error(e?.message || "Unable to load exams")) }, [id]); async function begin(exam: Exam) { try { await startExam(exam.id); router.push(`/exams/${exam.id}`) } catch (e: any) { toast.error(e?.message || "Unable to start exam") } } return <main className="container py-10"><h1 className="text-3xl font-bold">Course exams</h1><div className="mt-6 grid gap-4">{exams.map((exam) => <Card key={exam.id}><CardContent className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><h2 className="text-lg font-semibold">{exam.title}</h2><p className="text-sm text-muted-foreground">{exam.totalMarks} marks · Pass: {exam.passMarks} · {exam.timeLimitMin || "No"} minute limit</p></div><Button onClick={() => begin(exam)}>Start exam</Button></CardContent></Card>)}{exams.length === 0 && <p className="rounded border p-8 text-center text-muted-foreground">No published exams.</p>}</div></main> }
