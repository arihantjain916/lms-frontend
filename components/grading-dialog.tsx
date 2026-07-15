"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  finalizeSubmissionGrading,
  getExamSubmissions,
  getSubmissionDetail,
  gradeSubmissionAnswer,
  type GradingStatus,
  type InstructorExam,
  type SubmissionDetail,
  type SubmissionSummary,
} from "@/lib/instructor-api";

type AnswerDraft = { marks: string; feedback: string };

function formatDate(value?: string) {
  if (!value) return "Unknown time";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function statusVariant(status: GradingStatus) {
  if (status === "FINALIZED") return "default" as const;
  if (status === "IN_PROGRESS") return "secondary" as const;
  return "outline" as const;
}

function statusLabel(status: GradingStatus) {
  return status.toLowerCase().replace("_", " ");
}

export function GradingDialog({
  exam,
  open,
  onOpenChange,
}: {
  exam: InstructorExam | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [selected, setSelected] = useState<SubmissionDetail | null>(null);
  const [drafts, setDrafts] = useState<Record<string, AnswerDraft>>({});
  const [finalFeedback, setFinalFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [savingAnswer, setSavingAnswer] = useState<string | null>(null);
  const [finalizing, setFinalizing] = useState(false);
  const [error, setError] = useState("");

  const loadSubmissions = useCallback(async () => {
    if (!exam) return;
    setLoading(true);
    setError("");
    try {
      setSubmissions(await getExamSubmissions(exam.id));
    } catch (err: any) {
      setError(err?.message || "Unable to load exam submissions.");
    } finally {
      setLoading(false);
    }
  }, [exam]);

  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setDrafts({});
    setFinalFeedback("");
    void loadSubmissions();
  }, [open, loadSubmissions]);

  function applyDetail(detail: SubmissionDetail) {
    setSelected(detail);
    setDrafts(
      Object.fromEntries(
        detail.answers.map((answer) => [
          answer.questionAttemptId,
          {
            marks:
              answer.awardedMarks == null ? "" : String(answer.awardedMarks),
            feedback: answer.feedback || "",
          },
        ]),
      ),
    );
    setFinalFeedback(detail.feedback || "");
  }

  async function openSubmission(attemptId: string) {
    setDetailLoading(true);
    setError("");
    try {
      applyDetail(await getSubmissionDetail(attemptId));
    } catch (err: any) {
      toast.error(err?.message || "Unable to load this submission.");
    } finally {
      setDetailLoading(false);
    }
  }

  const dirtyAnswerIds = useMemo(() => {
    if (!selected) return new Set<string>();
    return new Set(
      selected.answers
        .filter((answer) => {
          const draft = drafts[answer.questionAttemptId];
          if (!draft) return false;
          const savedMarks =
            answer.awardedMarks == null ? "" : String(answer.awardedMarks);
          return (
            draft.marks !== savedMarks ||
            draft.feedback !== (answer.feedback || "")
          );
        })
        .map((answer) => answer.questionAttemptId),
    );
  }, [drafts, selected]);

  const awardedTotal = useMemo(
    () =>
      selected?.answers.reduce(
        (sum, answer) => sum + (answer.awardedMarks || 0),
        0,
      ) || 0,
    [selected],
  );
  const maximumTotal = useMemo(
    () =>
      selected?.answers.reduce(
        (sum, answer) => sum + Number(answer.maximumMarks || 0),
        0,
      ) || 0,
    [selected],
  );

  async function saveAnswer(questionAttemptId: string) {
    if (!selected) return;
    const answer = selected.answers.find(
      (item) => item.questionAttemptId === questionAttemptId,
    );
    const draft = drafts[questionAttemptId];
    const marks = Number(draft?.marks);
    if (!answer || !draft || draft.marks === "" || !Number.isFinite(marks)) {
      toast.error("Enter awarded marks before saving.");
      return;
    }
    if (marks < 0 || marks > Number(answer.maximumMarks)) {
      toast.error(`Marks must be between 0 and ${answer.maximumMarks}.`);
      return;
    }
    setSavingAnswer(questionAttemptId);
    try {
      const saved = await gradeSubmissionAnswer(
        selected.attemptId,
        questionAttemptId,
        { awardedMarks: marks, feedback: draft.feedback.trim() || undefined },
      );
      setSelected((current) =>
        current
          ? {
              ...current,
              gradingStatus: "IN_PROGRESS",
              answers: current.answers.map((item) =>
                item.questionAttemptId === questionAttemptId ? saved : item,
              ),
            }
          : current,
      );
      setSubmissions((current) =>
        current.map((item) =>
          item.attemptId === selected.attemptId
            ? { ...item, gradingStatus: "IN_PROGRESS" }
            : item,
        ),
      );
      toast.success("Answer grade saved.");
    } catch (err: any) {
      toast.error(err?.message || "Unable to save this grade.");
    } finally {
      setSavingAnswer(null);
    }
  }

  async function finalize() {
    if (!selected) return;
    if (dirtyAnswerIds.size) {
      toast.error("Save all changed answer grades before finalizing.");
      return;
    }
    if (selected.answers.some((answer) => answer.awardedMarks == null)) {
      toast.error("Grade every submitted answer before finalizing.");
      return;
    }
    if (!window.confirm("Finalize these marks? They cannot be changed later."))
      return;
    setFinalizing(true);
    try {
      const finalized = await finalizeSubmissionGrading(
        selected.attemptId,
        finalFeedback.trim() || undefined,
      );
      applyDetail(finalized);
      setSubmissions((current) =>
        current.map((item) =>
          item.attemptId === finalized.attemptId
            ? { ...item, gradingStatus: "FINALIZED" }
            : item,
        ),
      );
      toast.success("Grading finalized and result published.");
    } catch (err: any) {
      toast.error(err?.message || "Unable to finalize grading.");
    } finally {
      setFinalizing(false);
    }
  }

  const finalized = selected?.gradingStatus === "FINALIZED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            {exam?.title || "Exam"} grading
          </DialogTitle>
          <DialogDescription>
            Review submitted answers, award marks, and publish final results.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[72vh] overflow-y-auto px-6 py-5">
          {loading || detailLoading ? (
            <div className="grid min-h-64 place-items-center text-sm text-slate-500">
              <Loader2 className="mb-2 h-6 w-6 animate-spin" />
              Loading submissions…
            </div>
          ) : error ? (
            <div className="grid min-h-64 place-items-center text-center">
              <div>
                <p className="text-sm text-red-600">{error}</p>
                <Button className="mt-4" variant="outline" onClick={loadSubmissions}>
                  Try again
                </Button>
              </div>
            </div>
          ) : !selected ? (
            !submissions.length ? (
              <div className="grid min-h-64 place-items-center text-center">
                <div>
                  <ClipboardCheck className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-3 font-medium">No submitted attempts</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Completed student attempts will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y rounded-xl border">
                {submissions.map((submission) => (
                  <button
                    key={submission.attemptId}
                    className="flex w-full flex-col gap-3 p-4 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center"
                    onClick={() => openSubmission(submission.attemptId)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{submission.studentName}</p>
                      <p className="truncate text-sm text-slate-500">
                        {submission.studentEmail}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Submitted {formatDate(submission.submittedAt)}
                      </p>
                    </div>
                    <Badge
                      className="w-fit capitalize"
                      variant={statusVariant(submission.gradingStatus)}
                    >
                      {statusLabel(submission.gradingStatus)}
                    </Badge>
                    <span className="text-sm font-medium text-blue-700">
                      Review answers
                    </span>
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center">
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  All submissions
                </Button>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{selected.studentName}</p>
                  <p className="text-xs text-slate-500">
                    Submitted {formatDate(selected.submittedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {awardedTotal} / {maximumTotal}
                  </p>
                  <p className="text-xs text-slate-500">marks awarded</p>
                </div>
                <Badge className="w-fit capitalize" variant={statusVariant(selected.gradingStatus)}>
                  {statusLabel(selected.gradingStatus)}
                </Badge>
              </div>

              {!selected.answers.length ? (
                <p className="rounded-xl border p-8 text-center text-sm text-slate-500">
                  This attempt contains no submitted answers.
                </p>
              ) : (
                selected.answers.map((answer, index) => {
                  const draft = drafts[answer.questionAttemptId] || {
                    marks: "",
                    feedback: "",
                  };
                  const dirty = dirtyAnswerIds.has(answer.questionAttemptId);
                  return (
                    <section key={answer.questionAttemptId} className="rounded-xl border p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Question {index + 1} · {answer.questionType.replaceAll("_", " ")}
                          </p>
                          <h3 className="mt-1 font-semibold">{answer.title}</h3>
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                          Maximum {answer.maximumMarks} marks
                        </p>
                      </div>
                      <div className="mt-4 rounded-lg bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Student answer
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm">
                          {answer.answer || "No answer provided"}
                        </p>
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr_auto] sm:items-end">
                        <div className="space-y-2">
                          <Label htmlFor={`marks-${answer.questionAttemptId}`}>Awarded marks</Label>
                          <Input
                            id={`marks-${answer.questionAttemptId}`}
                            type="number"
                            min="0"
                            max={answer.maximumMarks}
                            step="0.01"
                            disabled={finalized}
                            value={draft.marks}
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [answer.questionAttemptId]: {
                                  ...draft,
                                  marks: event.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`feedback-${answer.questionAttemptId}`}>
                            Feedback <span className="font-normal text-slate-400">(optional)</span>
                          </Label>
                          <Textarea
                            id={`feedback-${answer.questionAttemptId}`}
                            rows={2}
                            disabled={finalized}
                            value={draft.feedback}
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [answer.questionAttemptId]: {
                                  ...draft,
                                  feedback: event.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        {!finalized && (
                          <Button
                            type="button"
                            variant={dirty ? "default" : "outline"}
                            disabled={!dirty || savingAnswer !== null}
                            onClick={() => saveAnswer(answer.questionAttemptId)}
                          >
                            {savingAnswer === answer.questionAttemptId ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : answer.awardedMarks != null && !dirty ? (
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                            ) : null}
                            {answer.awardedMarks != null && !dirty ? "Saved" : "Save grade"}
                          </Button>
                        )}
                      </div>
                    </section>
                  );
                })
              )}

              <div className="rounded-xl border p-5">
                <Label htmlFor="final-feedback">Overall feedback</Label>
                <Textarea
                  id="final-feedback"
                  className="mt-2"
                  rows={3}
                  disabled={finalized}
                  placeholder="Optional feedback shown with the final result"
                  value={finalFeedback}
                  onChange={(event) => setFinalFeedback(event.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {selected && !finalized && (
            <Button
              onClick={finalize}
              disabled={
                finalizing ||
                savingAnswer !== null ||
                dirtyAnswerIds.size > 0 ||
                selected.answers.length === 0 ||
                selected.answers.some((answer) => answer.awardedMarks == null)
              }
            >
              {finalizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Finalize grading
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
