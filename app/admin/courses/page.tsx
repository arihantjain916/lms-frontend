"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Search, Star, Trash2 } from "lucide-react";
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
  PageHeading,
  LoadingState,
  ErrorState,
  EmptyState,
  Pagination,
} from "../_components/admin-ui";
import {
  deleteAdminCourse,
  getAdminCategories,
  getAdminCourses,
  saveAdminCourse,
  type AdminCategory,
  type AdminCourse,
} from "@/lib/admin-api";

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

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [coursePage, categoryList] = await Promise.all([
        getAdminCourses(page, 10),
        getAdminCategories(),
      ]);
      setCourses(coursePage.data);
      setPages(coursePage.totalPages);
      setTotal(coursePage.totalElements);
      setCategories(categoryList);
    } catch (err: any) {
      setError(err?.message || "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  }, [page]);
  useEffect(() => {
    load();
  }, [load]);
  const filtered = useMemo(
    () =>
      courses.filter((item) =>
        `${item.title} ${item.category?.name || ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [courses, search],
  );

  const startCreate = () => {
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    setOpen(true);
  };
  const startEdit = (item: AdminCourse) => {
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description || "",
      categoryId: item.category?.id || "",
      isFeatured: Boolean(item.isFeatured),
      level: item.level || "BEGINNER",
    });
    setOpen(true);
  };
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const message = await saveAdminCourse({
        ...form,
        id: form.id || undefined,
      });
      toast.success(message);
      setOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to save course.");
    } finally {
      setSaving(false);
    }
  }
  async function remove(item: AdminCourse) {
    if (!window.confirm(`Delete “${item.title}” and its associated content?`))
      return;
    try {
      toast.success(await deleteAdminCourse(item.id));
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete course.");
    }
  }

  return (
    <>
      <PageHeading
        title="Courses"
        description={`${total} courses in your learning catalog.`}
        action={
          <Button onClick={startCreate} disabled={!categories.length}>
            <Plus className="mr-2 h-4 w-4" />
            New course
          </Button>
        }
      />
      <div className="mb-4 max-w-sm relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          className="pl-9"
          placeholder="Search this page…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} retry={load} />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {filtered.length === 0 ? (
            <EmptyState
              title="No courses found"
              description="Create a course or try a different search."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Course</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Level</th>
                    <th className="px-5 py-3 font-medium">Rating</th>
                    <th className="px-5 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 font-semibold text-blue-600">
                            {item.title.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="max-w-xs truncate font-medium">
                                {item.title}
                              </p>
                              {item.isFeatured && (
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              )}
                            </div>
                            <p className="max-w-xs truncate text-xs text-slate-500">
                              /{item.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {item.category?.name || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">
                          {item.level?.replaceAll("_", " ") || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {item.avgRating?.toFixed?.(1) ?? "0.0"}{" "}
                        <span className="text-xs text-slate-400">
                          ({item.totalRating || 0})
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            title="Edit course"
                            onClick={() => startEdit(item)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Delete course"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => remove(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={page} pages={pages} onChange={setPage} />
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
                Set the core catalog information. Lessons and exams can be
                managed from their course tools later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="course-title">Title</Label>
                <Input
                  id="course-title"
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
                <Label htmlFor="course-slug">Slug</Label>
                <Input
                  id="course-slug"
                  required
                  maxLength={255}
                  value={form.slug}
                  onChange={(event) =>
                    setForm({ ...form, slug: slugify(event.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-category">Category</Label>
                <select
                  id="course-category"
                  required
                  className="flex h-10 w-full rounded-md border bg-white px-3 text-sm"
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm({ ...form, categoryId: event.target.value })
                  }
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-level">Level</Label>
                <select
                  id="course-level"
                  className="flex h-10 w-full rounded-md border bg-white px-3 text-sm"
                  value={form.level}
                  onChange={(event) =>
                    setForm({ ...form, level: event.target.value })
                  }
                >
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"].map(
                    (level) => (
                      <option key={level} value={level}>
                        {level.replaceAll("_", " ")}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="course-description">Description</Label>
                <Textarea
                  id="course-description"
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
                  className="h-4 w-4"
                />
                <span>
                  <span className="block font-medium">Featured course</span>
                  <span className="text-slate-500">
                    Promote this course in featured catalog areas.
                  </span>
                </span>
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
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Saving…"
                  : form.id
                    ? "Save changes"
                    : "Create course"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
