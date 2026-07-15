"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowRight, Edit3, Plus, Trash2 } from "lucide-react";
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
import { getAdminCategories, type AdminCategory } from "@/lib/admin-api";
import {
  deleteInstructorCourse,
  getInstructorCourses,
  saveInstructorCourse,
  type InstructorCourse,
} from "@/lib/instructor-api";

const emptyForm = {
  id: 0,
  title: "",
  slug: "",
  description: "",
  categoryId: "",
  isFeatured: false,
  level: "BEGINNER",
};
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function InstructorCoursesPage() {
  const [items, setItems] = useState<InstructorCourse[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [courses, categoryList] = await Promise.all([
        getInstructorCourses(),
        getAdminCategories(),
      ]);
      setItems(courses);
      setCategories(categoryList);
    } catch (err: any) {
      setError(err?.message || "Unable to load your courses.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  function edit(item?: InstructorCourse) {
    setForm(
      item
        ? {
            id: item.id,
            title: item.title,
            slug: item.slug || "",
            description: item.description || "",
            categoryId: item.category?.id || "",
            isFeatured: Boolean(item.isFeatured),
            level: item.level || "BEGINNER",
          }
        : { ...emptyForm, categoryId: categories[0]?.id || "" },
    );
    setOpen(true);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      toast.success(
        await saveInstructorCourse({ ...form, id: form.id || undefined }),
      );
      setOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to save course.");
    } finally {
      setSaving(false);
    }
  }
  async function remove(item: InstructorCourse) {
    if (!window.confirm(`Delete “${item.title}” and its content?`)) return;
    try {
      toast.success(await deleteInstructorCourse(item.id));
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete course.");
    }
  }
  return (
    <>
      <PageHeading
        title="My courses"
        description={`${items.length} courses owned by you.`}
        action={
          <Button onClick={() => edit()} disabled={!categories.length}>
            <Plus className="mr-2 h-4 w-4" />
            New course
          </Button>
        }
      />
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} retry={load} />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {!items.length ? (
            <EmptyState
              title="No courses"
              description="Create your first course to begin teaching."
            />
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {item.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.category?.name || "Uncategorized"} ·{" "}
                      {item.level?.replaceAll("_", " ")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/instructor/courses/${item.id}`}>
                        Lessons & exams
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => edit(item)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600"
                      onClick={() => remove(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>
                {form.id ? "Edit course" : "Create course"}
              </DialogTitle>
              <DialogDescription>
                Manage the core course information. Curriculum tools are
                available after creation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="i-course-title">Title</Label>
                <Input
                  id="i-course-title"
                  required
                  maxLength={255}
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                      slug: form.id ? form.slug : slugify(event.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="i-course-slug">Slug</Label>
                <Input
                  id="i-course-slug"
                  required
                  value={form.slug}
                  onChange={(event) =>
                    setForm({ ...form, slug: slugify(event.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="i-course-category">Category</Label>
                <select
                  id="i-course-category"
                  required
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm({ ...form, categoryId: event.target.value })
                  }
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="i-course-level">Level</Label>
                <select
                  id="i-course-level"
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                  value={form.level}
                  onChange={(event) =>
                    setForm({ ...form, level: event.target.value })
                  }
                >
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"].map(
                    (level) => (
                      <option key={level}>{level}</option>
                    ),
                  )}
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="i-course-description">Description</Label>
                <Textarea
                  id="i-course-description"
                  required
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </div>
              <label className="flex items-center gap-3 rounded-lg border p-3 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) =>
                    setForm({ ...form, isFeatured: event.target.checked })
                  }
                />
                Request featured placement
              </label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={saving}>
                {saving ? "Saving…" : "Save course"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
