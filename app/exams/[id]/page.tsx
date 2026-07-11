"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getExamQuestions,
  submitExam,
  type ExamQuestion,
} from "@/lib/exam-api";
import { useRequireAuth } from "@/hooks/use-authenticated";
import toast from "react-hot-toast";

export default function ExamPage() {
  const auth = useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const initialSeconds = Math.max(0, Number(params.get("minutes") || 0) * 60);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const unanswered = useMemo(
    () => questions.filter((question) => !answers[question.id]),
    [questions, answers],
  );
  useEffect(() => {
    if (auth.isAuthenticated)
      getExamQuestions(id)
        .then(setQuestions)
        .catch((e) => toast.error(e?.message || "Unable to load questions"));
  }, [auth.isAuthenticated, id]);
  useEffect(() => {
    if (!initialSeconds || submitting) return;
    const timer = window.setInterval(
      () => setRemaining((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [initialSeconds, submitting]);
  useEffect(() => {
    if (initialSeconds && remaining === 0 && questions.length && !submitting)
      void finish(true);
  }, [remaining]);
  async function finish(auto = false) {
    if (submitting) return;
    if (!auto && unanswered.length) {
      toast.error(
        `Answer all ${unanswered.length} remaining question${unanswered.length === 1 ? "" : "s"}.`,
      );
      return;
    }
    if (
      !auto &&
      !window.confirm(
        "Submit this exam? You cannot change your answers afterward.",
      )
    )
      return;
    setSubmitting(true);
    try {
      await submitExam(id, answers);
      toast.success(auto ? "Time expired. Exam submitted." : "Exam submitted");
      router.replace(
        `/results?exam=${id}&title=${encodeURIComponent(params.get("title") || "Exam")}`,
      );
    } catch (e: any) {
      toast.error(e?.message || "Unable to submit exam");
      setSubmitting(false);
    }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    void finish(false);
  }
  return (
    <main className="container max-w-3xl py-10">
      <div className="sticky top-16 z-20 mb-6 flex items-center justify-between rounded-lg border bg-background p-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">
            {params.get("title") || "Exam"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {unanswered.length} unanswered
          </p>
        </div>
        {initialSeconds > 0 && (
          <div
            className={`font-mono text-xl font-bold ${remaining < 300 ? "text-red-600" : ""}`}
          >
            {Math.floor(remaining / 60)}:
            {String(remaining % 60).padStart(2, "0")}
          </div>
        )}
      </div>
      <form onSubmit={submit} className="space-y-5">
        {questions.map((question, index) => (
          <Card
            key={question.id}
            className={!answers[question.id] ? "border-amber-200" : ""}
          >
            <CardContent className="p-5">
              <h2 className="font-semibold">
                {index + 1}. {question.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {question.description}
              </p>
              <div className="mt-4 space-y-2">
                {question.type === "MCQ" ? (
                  question.options?.map((option) => (
                    <label
                      key={option.id}
                      className="flex gap-2 rounded border p-3"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={answers[question.id] === option.id}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: option.id,
                          }))
                        }
                      />
                      {option.option}
                    </label>
                  ))
                ) : question.type === "TRUE_FALSE" ? (
                  ["true", "false"].map((value) => (
                    <label
                      key={value}
                      className="flex gap-2 rounded border p-3 capitalize"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={answers[question.id] === value}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: value,
                          }))
                        }
                      />
                      {value}
                    </label>
                  ))
                ) : (
                  <Input
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        <Button size="lg" disabled={!questions.length || submitting}>
          {submitting ? "Submitting…" : "Submit exam"}
        </Button>
      </form>
    </main>
  );
}
