"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCourseExams, startExam, type Exam } from "@/lib/exam-api";
import { useRequireAuth } from "@/hooks/use-authenticated";
import toast from "react-hot-toast";

type ExamAvailability = "upcoming" | "live" | "expired";

function parseExamDate(value?: string) {
  if (!value) return null;

  const match = value.match(
    /^(\d{2})-(\d{2})-(\d{2}|\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?/,
  );
  if (!match) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const [, day, month, rawYear, hour, minute, second = "0"] = match;
  const year = rawYear.length === 2 ? 2000 + Number(rawYear) : Number(rawYear);
  const parsed = new Date(
    year,
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function examAvailability(exam: Exam, now: number): ExamAvailability {
  const startsAt = parseExamDate(exam.startsAt)?.getTime();
  const endsAt = parseExamDate(exam.endsAt)?.getTime();
  if (startsAt !== undefined && startsAt !== null && startsAt > now)
    return "upcoming";
  if (endsAt !== undefined && endsAt !== null && endsAt <= now)
    return "expired";
  return "live";
}

function formatExamDate(value?: string) {
  const parsed = parseExamDate(value);
  if (!parsed) return value || "Not set";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export default function CourseExamsPage() {
  const auth = useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (auth.loading || !auth.isAuthenticated) return;
    let active = true;
    setLoading(true);
    setError("");
    getCourseExams(id)
      .then((items) => {
        if (active) setExams(Array.isArray(items) ? items : []);
      })
      .catch((e) => {
        if (!active) return;
        const message = e?.message || "Unable to load exams";
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [auth.isAuthenticated, auth.loading, id]);
  async function begin(exam: Exam) {
    if (examAvailability(exam, Date.now()) !== "live") {
      toast.error("This exam is not currently live.");
      return;
    }
    if (
      !window.confirm(
        `Start “${exam.title}” now? Your attempt will begin immediately.`,
      )
    )
      return;
    try {
      await startExam(exam.id);
      router.push(
        `/exams/${exam.id}?minutes=${exam.timeLimitMin || 0}&title=${encodeURIComponent(exam.title)}`,
      );
    } catch (e: any) {
      toast.error(e?.message || "Unable to start exam");
    }
  }
  return (
    <main className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Course exams</h1>
        <Button asChild variant="outline">
          <Link href={`/courses/${id}`}>Back to course</Link>
        </Button>
      </div>
      <div className="mt-6 grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center rounded border p-12 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading exams…
          </div>
        ) : error ? (
          <p className="rounded border border-red-200 bg-red-50 p-8 text-center text-red-700">
            {error}
          </p>
        ) : exams.length ? (
          exams.map((exam) => {
            const availability = examAvailability(exam, now);
            return (
              <Card key={exam.id}>
                <CardContent className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">{exam.title}</h2>
                      <Badge
                        className={
                          availability === "live"
                            ? "bg-green-600 hover:bg-green-600"
                            : availability === "upcoming"
                              ? "bg-amber-500 hover:bg-amber-500"
                              : "bg-slate-500 hover:bg-slate-500"
                        }
                      >
                        {availability === "live"
                          ? "Live"
                          : availability === "upcoming"
                            ? "Upcoming"
                            : "Expired"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exam.totalMarks} marks · Pass: {exam.passMarks} ·{" "}
                      {exam.timeLimitMin || "No"} minute limit
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatExamDate(exam.startsAt)} –{" "}
                      {formatExamDate(exam.endsAt)}
                    </p>
                  </div>
                  <Button
                    onClick={() => begin(exam)}
                    disabled={availability !== "live"}
                  >
                    {availability === "live"
                      ? "Start exam"
                      : availability === "upcoming"
                        ? "Not started"
                        : "Exam ended"}
                  </Button>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="rounded border p-8 text-center text-muted-foreground">
            No published exams.
          </p>
        )}
      </div>
    </main>
  );
}
