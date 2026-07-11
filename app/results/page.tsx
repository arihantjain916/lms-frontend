"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { getExamReport, getMyReports, type Report } from "@/lib/exam-api"
export default function ResultsPage() { const examId = useSearchParams().get("exam"); const [reports, setReports] = useState<Report[]>([]); useEffect(() => { (examId ? getExamReport(examId).then((item) => [item]) : getMyReports()).then(setReports).catch(() => setReports([])) }, [examId]); return <main className="container py-10"><h1 className="text-3xl font-bold">My results</h1><div className="mt-6 grid gap-4 sm:grid-cols-2">{reports.map((report) => <Card key={report.id}><CardContent className="p-6"><p className="text-sm text-muted-foreground">Grade</p><p className="text-4xl font-bold text-blue-700">{report.grade}</p><p className="mt-4">{report.obtainedMarks} / {report.totalMarks} marks</p><p className="text-muted-foreground">{report.percentage}%</p></CardContent></Card>)}{reports.length === 0 && <p className="text-muted-foreground">No results available yet.</p>}</div></main> }
