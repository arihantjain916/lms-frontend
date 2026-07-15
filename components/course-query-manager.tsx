"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, MessageCircle, Send } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  addQuestionReply,
  getCourseQuestions,
  getQuestionReplies,
  type CourseQuestion,
  type QuestionReply,
} from "@/lib/content-api";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function CourseQueryManager({ courseId }: { courseId: number }) {
  const [questions, setQuestions] = useState<CourseQuestion[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, QuestionReply[]>>({});
  const [repliesLoading, setRepliesLoading] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCourseQuestions(courseId, page, 10);
      setQuestions(result.data);
      setPages(Math.max(1, result.totalPages));
    } catch (error: any) {
      toast.error(error?.message || "Unable to load student queries.");
    } finally {
      setLoading(false);
    }
  }, [courseId, page]);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  async function toggleThread(questionId: string) {
    if (openId === questionId) {
      setOpenId(null);
      return;
    }
    setOpenId(questionId);
    if (replies[questionId]) return;
    setRepliesLoading(questionId);
    try {
      const loaded = await getQuestionReplies(questionId);
      setReplies((current) => ({ ...current, [questionId]: loaded }));
    } catch (error: any) {
      toast.error(error?.message || "Unable to load replies.");
    } finally {
      setRepliesLoading(null);
    }
  }

  async function reply(event: FormEvent, questionId: string) {
    event.preventDefault();
    const content = drafts[questionId]?.trim();
    if (!content) return;
    setSending(questionId);
    try {
      const created = await addQuestionReply(questionId, content);
      setReplies((current) => ({
        ...current,
        [questionId]: [...(current[questionId] || []), created],
      }));
      setQuestions((current) =>
        current.map((question) =>
          question.id === questionId
            ? { ...question, repliesCount: (question.repliesCount || 0) + 1 }
            : question,
        ),
      );
      setDrafts((current) => ({ ...current, [questionId]: "" }));
      toast.success("Reply posted.");
    } catch (error: any) {
      toast.error(error?.message || "Unable to post reply.");
    } finally {
      setSending(null);
    }
  }

  if (loading)
    return (
      <div className="flex min-h-52 items-center justify-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading student queries…
      </div>
    );

  if (!questions.length)
    return (
      <div className="grid min-h-52 place-items-center p-8 text-center">
        <div>
          <MessageCircle className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 font-medium">No student queries</p>
          <p className="mt-1 text-sm text-slate-500">
            Questions posted on this course will appear here.
          </p>
        </div>
      </div>
    );

  return (
    <div>
      <div className="divide-y">
        {questions.map((question) => {
          const threadOpen = openId === question.id;
          return (
            <section key={question.id} className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {question.user?.name || "Student"}
                    {question.createdAt && (
                      <span className="ml-2 font-normal text-slate-400">
                        {formatDate(question.createdAt)}
                      </span>
                    )}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap leading-7">
                    {question.content}
                  </p>
                </div>
                <Badge variant="secondary">
                  {question.repliesCount || 0} replies
                </Badge>
              </div>
              <Button
                className="mt-3"
                type="button"
                size="sm"
                variant="outline"
                onClick={() => toggleThread(question.id)}
              >
                {threadOpen ? (
                  <ChevronUp className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="mr-2 h-4 w-4" />
                )}
                {threadOpen ? "Close thread" : "View and reply"}
              </Button>

              {threadOpen && (
                <div className="mt-4 rounded-xl border bg-slate-50 p-4">
                  {repliesLoading === question.id ? (
                    <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading replies…
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(replies[question.id] || []).map((item) => (
                        <div key={item.id} className="rounded-lg bg-white p-3 shadow-sm">
                          <p className="whitespace-pre-wrap text-sm">{item.content}</p>
                          <p className="mt-2 text-xs text-slate-500">
                            {item.user?.name || "User"}
                            {item.createdAt ? ` · ${formatDate(item.createdAt)}` : ""}
                          </p>
                        </div>
                      ))}
                      {(replies[question.id] || []).length === 0 && (
                        <p className="py-2 text-sm text-slate-500">No replies yet.</p>
                      )}
                    </div>
                  )}

                  <form className="mt-4" onSubmit={(event) => reply(event, question.id)}>
                    <Textarea
                      required
                      maxLength={2000}
                      rows={3}
                      value={drafts[question.id] || ""}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [question.id]: event.target.value,
                        }))
                      }
                      placeholder="Write an answer for this student"
                      disabled={sending === question.id}
                    />
                    <Button
                      className="mt-2"
                      size="sm"
                      disabled={sending === question.id || !drafts[question.id]?.trim()}
                    >
                      {sending === question.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      {sending === question.id ? "Posting…" : "Post reply"}
                    </Button>
                  </form>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 border-t p-4">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => {
              setOpenId(null);
              setPage((value) => value - 1);
            }}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-500">Page {page} of {pages}</span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= pages}
            onClick={() => {
              setOpenId(null);
              setPage((value) => value + 1);
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
