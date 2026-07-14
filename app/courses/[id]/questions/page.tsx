"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  MessageCircle,
  Pencil,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-authenticated";
import {
  addQuestionReply,
  askCourseQuestion,
  deleteCourseQuestion,
  getCourseQuestions,
  getQuestionReplies,
  markQuestionHelpful,
  unmarkQuestionHelpful,
  updateCourseQuestion,
  type CourseQuestion,
  type QuestionReply,
} from "@/lib/content-api";
import toast from "react-hot-toast";
import { loginHref } from "@/lib/auth-navigation";

export default function CourseQuestionsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CourseQuestion[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [question, setQuestion] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, QuestionReply[]>>({});
  const [reply, setReply] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [helpful, setHelpful] = useState<Set<string>>(new Set());
  const load = useCallback(async () => {
    try {
      const result = await getCourseQuestions(id, page, 10);
      setItems(result.data);
      setPages(Math.max(result.totalPages, 1));
    } catch (e: any) {
      toast.error(e?.message || "Unable to load questions");
    }
  }, [id, page]);
  useEffect(() => {
    void load();
  }, [load]);
  async function postQuestion(event: FormEvent) {
    event.preventDefault();
    try {
      await askCourseQuestion(id, question.trim());
      setQuestion("");
      setPage(1);
      await load();
      toast.success("Question posted");
    } catch (e: any) {
      toast.error(e?.message || "Unable to post question");
    }
  }
  async function openThread(questionId: string) {
    if (openId === questionId) return setOpenId(null);
    setOpenId(questionId);
    try {
      const loaded = await getQuestionReplies(questionId);
      setReplies((current) => ({ ...current, [questionId]: loaded }));
    } catch (e: any) {
      toast.error(e?.message || "Unable to load replies");
    }
  }
  async function postReply(event: FormEvent, questionId: string) {
    event.preventDefault();
    try {
      const created = await addQuestionReply(questionId, reply.trim());
      setReplies((current) => ({
        ...current,
        [questionId]: [...(current[questionId] || []), created],
      }));
      setReply("");
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Unable to reply");
    }
  }
  async function toggleHelpful(item: CourseQuestion) {
    if (!isAuthenticated) {
      router.push(loginHref(`/courses/${id}/questions`));
      return;
    }
    try {
      if (helpful.has(item.id)) {
        await unmarkQuestionHelpful(item.id);
        setHelpful((current) => {
          const next = new Set(current);
          next.delete(item.id);
          return next;
        });
      } else {
        await markQuestionHelpful(item.id);
        setHelpful((current) => new Set(current).add(item.id));
      }
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Unable to update helpful vote");
    }
  }
  async function saveEdit(item: CourseQuestion) {
    try {
      await updateCourseQuestion(item.id, editText.trim());
      setEditingId(null);
      await load();
      toast.success("Question updated");
    } catch (e: any) {
      toast.error(e?.message || "Unable to update question");
    }
  }
  async function remove(item: CourseQuestion) {
    if (!window.confirm("Delete this question and all of its replies?")) return;
    try {
      await deleteCourseQuestion(item.id);
      await load();
      toast.success("Question deleted");
    } catch (e: any) {
      toast.error(e?.message || "Unable to delete question");
    }
  }
  return (
    <main className="container max-w-4xl py-10">
      <Button asChild variant="ghost">
        <Link href={`/courses/${id}`}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to course
        </Link>
      </Button>
      <h1 className="mt-4 text-3xl font-bold">Course discussion</h1>
      {isAuthenticated ? (
        <Card className="mt-6">
          <CardContent className="p-5">
            <form onSubmit={postQuestion}>
              <Textarea
                required
                maxLength={2000}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about this course"
              />
              <Button className="mt-3">Post question</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <p className="mt-5 rounded border bg-blue-50 p-4">
          <Link
            href={loginHref(`/courses/${id}/questions`)}
            className="font-medium text-blue-700"
          >
            Sign in
          </Link>{" "}
          to participate.
        </p>
      )}
      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const canManage =
            user?.id === item.user?.id || user?.role === "ADMIN";
          return (
            <Card key={item.id}>
              <CardContent className="p-5">
                {editingId === item.id ? (
                  <div>
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={() => saveEdit(item)}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="leading-7">{item.content}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{item.user?.name || "Learner"}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleHelpful(item)}
                  >
                    <ThumbsUp
                      className={`mr-1 h-4 w-4 ${helpful.has(item.id) ? "fill-blue-600 text-blue-600" : ""}`}
                    />
                    {item.helpfulCount || 0}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openThread(item.id)}
                  >
                    <MessageCircle className="mr-1 h-4 w-4" />
                    {item.repliesCount || 0} replies
                  </Button>
                  {canManage && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditText(item.content);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => remove(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                {openId === item.id && (
                  <div className="mt-4 border-t pt-4">
                    <div className="space-y-3">
                      {(replies[item.id] || []).map((value) => (
                        <div key={value.id} className="rounded bg-muted/50 p-3">
                          <p>{value.content}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {value.user?.name || "Learner"}
                          </p>
                        </div>
                      ))}
                      {(replies[item.id] || []).length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No replies yet.
                        </p>
                      )}
                    </div>
                    {isAuthenticated && (
                      <form
                        className="mt-3"
                        onSubmit={(event) => postReply(event, item.id)}
                      >
                        <Textarea
                          required
                          maxLength={2000}
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          placeholder="Write a reply"
                        />
                        <Button className="mt-2" size="sm">
                          Reply
                        </Button>
                      </form>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {items.length === 0 && (
          <p className="rounded border p-8 text-center text-muted-foreground">
            No questions yet.
          </p>
        )}
      </div>
      {pages > 1 && (
        <div className="mt-8 flex justify-center gap-3">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
          >
            Previous
          </Button>
          <span className="self-center text-sm">
            Page {page} of {pages}
          </span>
          <Button
            variant="outline"
            disabled={page >= pages}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}
