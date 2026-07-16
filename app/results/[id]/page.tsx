"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Circle,
  Clock3,
  Loader2,
  MessageSquareText,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks/use-authenticated";
import { getMyDetailedResult, type DetailedResult } from "@/lib/exam-api";

function formatDate(value?: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export default function FullResultPage() {
  const { id } = useParams<{ id: string }>();
  const auth = useRequireAuth();
  const [result, setResult] = useState<DetailedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!id || !auth.isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      setResult(await getMyDetailedResult(id));
    } catch (requestError: any) {
      setError(requestError?.message || "Unable to load this result");
    } finally {
      setLoading(false);
    }
  }, [auth.isAuthenticated, id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (auth.loading || loading) {
    return (
      <main className="grid min-h-[70vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="container grid min-h-[70vh] place-items-center py-12">
        <div className="max-w-md text-center">
          <Award className="mx-auto h-12 w-12 text-slate-300" />
          <h1 className="mt-4 text-2xl font-bold">Result unavailable</h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <div className="mt-5 flex justify-center gap-3">
            <Button onClick={() => void load()}>Try again</Button>
            <Button asChild variant="outline">
              <Link href="/results">All results</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="container max-w-5xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/my-learning?tab=results">
            <ChevronLeft className="mr-1 h-4 w-4" /> Results
          </Link>
        </Button>

        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white/15 text-white hover:bg-white/20">
                    {result.gradingStatus.replaceAll("_", " ")}
                  </Badge>
                  {result.courseTitle && (
                    <span className="flex items-center gap-1 text-sm text-blue-100">
                      <BookOpen className="h-4 w-4" /> {result.courseTitle}
                    </span>
                  )}
                </div>
                <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
                  {result.examTitle}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-blue-100">
                  <Clock3 className="h-4 w-4" /> Submitted{" "}
                  {formatDate(result.submittedAt)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 px-7 py-5 text-center backdrop-blur">
                <p className="text-sm uppercase tracking-wider text-blue-100">
                  Grade
                </p>
                <p className="mt-1 text-5xl font-bold">{result.grade}</p>
              </div>
            </div>
          </div>

          <CardContent className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
            <div className="rounded-xl bg-blue-50 p-5">
              <p className="text-sm text-blue-700">Marks obtained</p>
              <p className="mt-1 text-3xl font-bold text-blue-950">
                {result.obtainedMarks}{" "}
                <span className="text-lg font-medium text-blue-700">
                  / {result.totalMarks}
                </span>
              </p>
            </div>
            <div className="rounded-xl bg-violet-50 p-5">
              <p className="text-sm text-violet-700">Percentage</p>
              <p className="mt-1 text-3xl font-bold text-violet-950">
                {result.percentage}%
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-5">
              <p className="text-sm text-emerald-700">Questions answered</p>
              <p className="mt-1 text-3xl font-bold text-emerald-950">
                {result.answers.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquareText className="h-5 w-5 text-blue-600" /> Overall
              grader feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
              {result.feedback ||
                (result.gradingStatus === "FINALIZED"
                  ? "No overall feedback was provided."
                  : "Grading is still in progress. Feedback will appear after finalization.")}
            </p>
          </CardContent>
        </Card>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Question breakdown</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your submitted answers, awarded marks, correct answers, and grader
              comments.
            </p>
          </div>

          <div className="space-y-5">
            {result.answers.map((answer, index) => {
              const graded = answer.awardedMarks != null;
              const fullMarks =
                graded &&
                Number(answer.awardedMarks) === Number(answer.maximumMarks);
              return (
                <Card key={answer.questionAttemptId}>
                  <CardHeader className="border-b bg-slate-50/70">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          <Badge variant="outline">
                            {answer.questionType.replaceAll("_", " ")}
                          </Badge>
                        </div>
                        <CardTitle className="mt-3 text-lg leading-7">
                          {answer.title}
                        </CardTitle>
                        {answer.description && (
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {answer.description}
                          </p>
                        )}
                      </div>
                      <div
                        className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold ${!graded ? "bg-amber-50 text-amber-700" : fullMarks ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}
                      >
                        {graded
                          ? `${answer.awardedMarks} / ${answer.maximumMarks} marks`
                          : `Awaiting grading · ${answer.maximumMarks} marks`}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 p-5 md:grid-cols-2">
                    {answer.questionType === "MCQ" &&
                      Boolean(answer.options?.length) && (
                        <div className="rounded-xl border bg-slate-50 p-4 md:col-span-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Options
                          </p>
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {answer.options!.map((option, optionIndex) => (
                              <div
                                key={`${answer.questionAttemptId}-${optionIndex}`}
                                className={`flex items-start gap-3 rounded-lg border p-3 ${
                                  option.correct
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                                    : option.selected
                                      ? "border-red-300 bg-red-50 text-red-950"
                                      : "bg-white"
                                }`}
                              >
                                {option.correct ? (
                                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                ) : option.selected ? (
                                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                ) : (
                                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="break-words">{option.option}</p>
                                  <div className="mt-1 flex flex-wrap gap-2 text-xs font-medium">
                                    {option.selected && (
                                      <span
                                        className={
                                          option.correct
                                            ? "text-emerald-700"
                                            : "text-red-700"
                                        }
                                      >
                                        Your selection
                                      </span>
                                    )}
                                    {option.correct && (
                                      <span className="text-emerald-700">
                                        Correct answer
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    <div className="rounded-xl border bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Your answer
                      </p>
                      <p className="mt-2 whitespace-pre-wrap break-words leading-7">
                        {answer.answer || "No answer submitted"}
                      </p>
                    </div>
                    {answer.correctAnswer && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                        <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" /> Correct answer
                        </p>
                        <p className="mt-2 whitespace-pre-wrap break-words leading-7 text-emerald-950">
                          {answer.correctAnswer}
                        </p>
                      </div>
                    )}
                    <div className="rounded-xl border bg-slate-50 p-4 md:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Question feedback
                      </p>
                      <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                        {answer.feedback ||
                          (graded
                            ? "No feedback was provided for this answer."
                            : "This answer has not been graded yet.")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {!result.answers.length && (
              <Card>
                <CardContent className="p-10 text-center text-muted-foreground">
                  No submitted answers were found for this result.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
