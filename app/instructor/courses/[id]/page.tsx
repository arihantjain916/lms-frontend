"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowLeft, FileQuestion, Plus, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
} from "@/app/admin/_components/admin-ui";
import {
  deleteInstructorExam,
  deleteInstructorLesson,
  deleteInstructorQuestion,
  getCourseForManagement,
  getInstructorCourses,
  getInstructorExams,
  getInstructorLessons,
  getInstructorQuestions,
  saveInstructorExam,
  saveInstructorLesson,
  saveInstructorQuestion,
  setInstructorExamStatus,
  type InstructorCourse,
  type InstructorExam,
  type InstructorLesson,
  type InstructorQuestion,
} from "@/lib/instructor-api";

const emptyLesson = {
  id: "",
  title: "",
  description: "",
  time: "",
  videoUrl: "",
  thumbnailUrl: "",
  status: "DRAFT",
};
const emptyExam = {
  title: "",
  startsAt: "",
  endsAt: "",
  timeLimitMin: "60",
  maxAttempts: "1",
  totalMarks: "100",
  passMarks: "40",
  shuffleQuestions: true,
  showScoreImmediately: true,
};
const emptyQuestion = {
  examId: "",
  type: "MCQ" as InstructorQuestion["type"],
  marks: "1",
  title: "",
  description: "",
  options: [
    { option: "", isCorrect: true },
    { option: "", isCorrect: false },
  ],
};
const backendDate = (value: string) => value.replace("T", " ").slice(0, 16);

export function CourseContentManager({
  allowAnyCourse = false,
}: {
  allowAnyCourse?: boolean;
}) {
  const params = useParams<{ id: string }>();
  const courseId = Number(params.id);
  const [course, setCourse] = useState<InstructorCourse | null>(null);
  const [lessons, setLessons] = useState<InstructorLesson[]>([]);
  const [exams, setExams] = useState<InstructorExam[]>([]);
  const [section, setSection] = useState<"lessons" | "exams">("lessons");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lessonOpen, setLessonOpen] = useState(false);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [examOpen, setExamOpen] = useState(false);
  const [examForm, setExamForm] = useState(emptyExam);
  const [questionExam, setQuestionExam] = useState<InstructorExam | null>(null);
  const [questions, setQuestions] = useState<InstructorQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [managedCourse, lessonPage, examList] = await Promise.all([
        allowAnyCourse
          ? getCourseForManagement(courseId)
          : getInstructorCourses().then((courses) => {
              const owned = courses.find((item) => item.id === courseId);
              if (!owned)
                throw new Error(
                  "This course is not owned by your instructor account.",
                );
              return owned;
            }),
        getInstructorLessons(courseId),
        getInstructorExams(courseId),
      ]);
      setCourse(managedCourse);
      setLessons(lessonPage.data);
      setExams(examList);
    } catch (err: any) {
      setError(err?.message || "Unable to load course tools.");
    } finally {
      setLoading(false);
    }
  }, [allowAnyCourse, courseId]);
  useEffect(() => {
    load();
  }, [load]);

  function editLesson(item?: InstructorLesson) {
    setLessonForm(
      item
        ? {
            id: item.id,
            title: item.title,
            description: item.description,
            time: item.time,
            videoUrl: item.videoUrl,
            thumbnailUrl: item.thumbnailUrl,
            status: item.status,
          }
        : emptyLesson,
    );
    setLessonOpen(true);
  }
  async function submitLesson(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      toast.success(
        await saveInstructorLesson({
          ...lessonForm,
          id: lessonForm.id || undefined,
          courseId,
        }),
      );
      setLessonOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to save lesson.");
    } finally {
      setSaving(false);
    }
  }
  async function removeLesson(item: InstructorLesson) {
    if (!window.confirm(`Delete lesson “${item.title}”?`)) return;
    try {
      toast.success(await deleteInstructorLesson(item.id));
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete lesson.");
    }
  }
  async function submitExam(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      toast.success(
        await saveInstructorExam({
          courseId,
          title: examForm.title,
          startsAt: backendDate(examForm.startsAt),
          endsAt: backendDate(examForm.endsAt),
          timeLimitMin: Number(examForm.timeLimitMin),
          maxAttempts: Number(examForm.maxAttempts),
          totalMarks: Number(examForm.totalMarks),
          passMarks: Number(examForm.passMarks),
          shuffleQuestions: examForm.shuffleQuestions,
          showScoreImmediately: examForm.showScoreImmediately,
        }),
      );
      setExamOpen(false);
      setExamForm(emptyExam);
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to create exam.");
    } finally {
      setSaving(false);
    }
  }
  async function changeExamStatus(
    item: InstructorExam,
    status: InstructorExam["status"],
  ) {
    try {
      toast.success(await setInstructorExamStatus(item.id, status));
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to change exam status.");
    }
  }
  async function removeExam(item: InstructorExam) {
    if (!window.confirm(`Archive exam “${item.title}”?`)) return;
    try {
      toast.success(await deleteInstructorExam(item.id));
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to archive exam.");
    }
  }
  async function manageQuestions(item: InstructorExam) {
    setQuestionExam(item);
    setQuestionsLoading(true);
    try {
      setQuestions(await getInstructorQuestions(item.id));
    } catch (err: any) {
      toast.error(err?.message || "Unable to load questions.");
    } finally {
      setQuestionsLoading(false);
    }
  }
  function addQuestion() {
    if (!questionExam) return;
    setQuestionForm({ ...emptyQuestion, examId: questionExam.id });
    setQuestionOpen(true);
  }
  async function submitQuestion(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      toast.success(
        await saveInstructorQuestion({
          examId: questionForm.examId,
          type: questionForm.type,
          marks: Number(questionForm.marks),
          title: questionForm.title,
          description: questionForm.description,
          options:
            questionForm.type === "MCQ" ? questionForm.options : undefined,
          correctOption: questionForm.type === "TRUE_FALSE" ? true : undefined,
        }),
      );
      setQuestionOpen(false);
      if (questionExam)
        setQuestions(await getInstructorQuestions(questionExam.id));
    } catch (err: any) {
      toast.error(err?.message || "Unable to create question.");
    } finally {
      setSaving(false);
    }
  }
  async function removeQuestion(item: InstructorQuestion) {
    if (!window.confirm(`Delete question “${item.title}”?`)) return;
    try {
      toast.success(await deleteInstructorQuestion(item.id));
      setQuestions((values) => values.filter((value) => value.id !== item.id));
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete question.");
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} retry={load} />;
  if (!course) return null;
  return (
    <>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link
            href={allowAnyCourse ? "/admin/courses" : "/instructor/courses"}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to courses
          </Link>
        </Button>
      </div>
      <PageHeading
        title={course.title}
        description="Manage this course’s curriculum and assessments."
        action={
          <Button
            onClick={() =>
              section === "lessons" ? editLesson() : setExamOpen(true)
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            {section === "lessons" ? "New lesson" : "New exam"}
          </Button>
        }
      />
      <div className="mb-4 flex gap-2">
        <Button
          size="sm"
          variant={section === "lessons" ? "default" : "outline"}
          onClick={() => setSection("lessons")}
        >
          Lessons ({lessons.length})
        </Button>
        <Button
          size="sm"
          variant={section === "exams" ? "default" : "outline"}
          onClick={() => setSection("exams")}
        >
          Exams ({exams.length})
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {section === "lessons" ? (
          !lessons.length ? (
            <EmptyState
              title="No lessons"
              description="Add the first lesson to this course."
            />
          ) : (
            <div className="divide-y">
              {lessons.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 p-5">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-slate-500">
                      {item.time} · {item.status}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editLesson(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600"
                    onClick={() => removeLesson(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )
        ) : !exams.length ? (
          <EmptyState
            title="No exams"
            description="Create an assessment for this course."
          />
        ) : (
          <div className="divide-y">
            {exams.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    {item.totalMarks} marks · Pass {item.passMarks} ·{" "}
                    {item.timeLimitMin} minutes
                  </p>
                </div>
                <select
                  className="h-9 rounded-md border bg-white px-2 text-sm"
                  value={item.status}
                  onChange={(event) =>
                    changeExamStatus(
                      item,
                      event.target.value as InstructorExam["status"],
                    )
                  }
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => manageQuestions(item)}
                >
                  <FileQuestion className="mr-2 h-4 w-4" />
                  Questions
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600"
                  onClick={() => removeExam(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={lessonOpen} onOpenChange={setLessonOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={submitLesson}>
            <DialogHeader>
              <DialogTitle>
                {lessonForm.id ? "Edit lesson" : "Create lesson"}
              </DialogTitle>
              <DialogDescription>
                Add the lesson media and publication status.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Title</Label>
                <Input
                  required
                  value={lessonForm.title}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  required
                  rows={4}
                  value={lessonForm.description}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  required
                  placeholder="45 min"
                  value={lessonForm.time}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, time: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="h-10 w-full rounded-md border bg-white px-3"
                  value={lessonForm.status}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, status: e.target.value })
                  }
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input
                  required
                  type="url"
                  value={lessonForm.videoUrl}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, videoUrl: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input
                  required
                  type="url"
                  value={lessonForm.thumbnailUrl}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      thumbnailUrl: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLessonOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={saving}>
                {saving ? "Saving…" : "Save lesson"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={examOpen} onOpenChange={setExamOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={submitExam}>
            <DialogHeader>
              <DialogTitle>Create exam</DialogTitle>
              <DialogDescription>New exams begin as drafts.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Title</Label>
                <Input
                  required
                  value={examForm.title}
                  onChange={(e) =>
                    setExamForm({ ...examForm, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Starts at</Label>
                <Input
                  required
                  type="datetime-local"
                  value={examForm.startsAt}
                  onChange={(e) =>
                    setExamForm({ ...examForm, startsAt: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Ends at</Label>
                <Input
                  required
                  type="datetime-local"
                  value={examForm.endsAt}
                  onChange={(e) =>
                    setExamForm({ ...examForm, endsAt: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Time limit (minutes)</Label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={examForm.timeLimitMin}
                  onChange={(e) =>
                    setExamForm({ ...examForm, timeLimitMin: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum attempts</Label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={examForm.maxAttempts}
                  onChange={(e) =>
                    setExamForm({ ...examForm, maxAttempts: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Total marks</Label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={examForm.totalMarks}
                  onChange={(e) =>
                    setExamForm({ ...examForm, totalMarks: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Pass marks</Label>
                <Input
                  required
                  type="number"
                  min="0"
                  value={examForm.passMarks}
                  onChange={(e) =>
                    setExamForm({ ...examForm, passMarks: e.target.value })
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={examForm.shuffleQuestions}
                  onChange={(e) =>
                    setExamForm({
                      ...examForm,
                      shuffleQuestions: e.target.checked,
                    })
                  }
                />
                Shuffle questions
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={examForm.showScoreImmediately}
                  onChange={(e) =>
                    setExamForm({
                      ...examForm,
                      showScoreImmediately: e.target.checked,
                    })
                  }
                />
                Show score immediately
              </label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setExamOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={saving}>
                {saving ? "Creating…" : "Create exam"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(questionExam)}
        onOpenChange={(value) => !value && setQuestionExam(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{questionExam?.title} questions</DialogTitle>
            <DialogDescription>
              Create and remove assessment questions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button size="sm" onClick={addQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Add question
            </Button>
          </div>
          <div className="max-h-[55vh] overflow-y-auto py-3">
            {questionsLoading ? (
              <LoadingState />
            ) : !questions.length ? (
              <EmptyState
                title="No questions"
                description="Add the first question."
              />
            ) : (
              <div className="divide-y rounded-xl border">
                {questions.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-4">
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.type.replaceAll("_", " ")} · {item.marks} marks
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => removeQuestion(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={questionOpen} onOpenChange={setQuestionOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={submitQuestion}>
            <DialogHeader>
              <DialogTitle>Add question</DialogTitle>
              <DialogDescription>
                MCQ questions require at least one correct option.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  className="h-10 w-full rounded-md border bg-white px-3"
                  value={questionForm.type}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      type: e.target.value as InstructorQuestion["type"],
                    })
                  }
                >
                  {[
                    "MCQ",
                    "TRUE_FALSE",
                    "SHORT_ANSWER",
                    "LONG_ANSWER",
                    "TEXT",
                  ].map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Marks</Label>
                <Input
                  required
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={questionForm.marks}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, marks: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Title</Label>
                <Input
                  required
                  value={questionForm.title}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  required
                  rows={3}
                  value={questionForm.description}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              {questionForm.type === "MCQ" && (
                <div className="space-y-2 sm:col-span-2">
                  <Label>Options</Label>
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="radio"
                        name="correct-option"
                        checked={option.isCorrect}
                        onChange={() =>
                          setQuestionForm({
                            ...questionForm,
                            options: questionForm.options.map(
                              (value, optionIndex) => ({
                                ...value,
                                isCorrect: optionIndex === index,
                              }),
                            ),
                          })
                        }
                      />
                      <Input
                        required
                        placeholder={`Option ${index + 1}`}
                        value={option.option}
                        onChange={(e) =>
                          setQuestionForm({
                            ...questionForm,
                            options: questionForm.options.map(
                              (value, optionIndex) =>
                                optionIndex === index
                                  ? { ...value, option: e.target.value }
                                  : value,
                            ),
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuestionOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={saving}>
                {saving ? "Adding…" : "Add question"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function InstructorCourseContentPage() {
  return <CourseContentManager />;
}
