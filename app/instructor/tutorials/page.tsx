"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
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
  Pagination,
} from "@/app/admin/_components/admin-ui";
import {
  getAdminCategories,
  type AdminCategory,
  type AdminTutorial,
} from "@/lib/admin-api";
import {
  deleteInstructorTutorial,
  getInstructorTutorials,
  saveInstructorTutorial,
} from "@/lib/instructor-api";

const emptyForm = {
  id: "",
  title: "",
  description: "",
  content: "",
  videoUrl: "",
  thumbnailUrl: "",
  level: "BEGINNER" as NonNullable<AdminTutorial["level"]>,
  categoryId: "",
};

export default function InstructorTutorialsPage() {
  const [items, setItems] = useState<AdminTutorial[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [result, categoryList] = await Promise.all([
        getInstructorTutorials(page, 10),
        getAdminCategories(),
      ]);
      setItems(result.data);
      setPages(result.totalPages);
      setTotal(result.totalElements);
      setCategories(categoryList);
    } catch (err: any) {
      setError(err?.message || "Unable to load your tutorials.");
    } finally {
      setLoading(false);
    }
  }, [page]);
  useEffect(() => {
    load();
  }, [load]);
  function edit(item?: AdminTutorial) {
    setForm(
      item
        ? {
            id: item.id,
            title: item.title,
            description: item.description,
            content: item.content,
            videoUrl: item.videoUrl || "",
            thumbnailUrl: item.thumbnailUrl || "",
            level: item.level || "BEGINNER",
            categoryId: item.categoryId || "",
          }
        : emptyForm,
    );
    setOpen(true);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      toast.success(
        await saveInstructorTutorial({
          ...form,
          id: form.id || undefined,
          videoUrl: form.videoUrl || undefined,
          thumbnailUrl: form.thumbnailUrl || undefined,
          categoryId: form.categoryId || undefined,
        }),
      );
      setOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to save tutorial.");
    } finally {
      setSaving(false);
    }
  }
  async function remove(item: AdminTutorial) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    try {
      toast.success(await deleteInstructorTutorial(item.id));
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete tutorial.");
    }
  }
  return (
    <>
      <PageHeading
        title="My tutorials"
        description={`${total} tutorials authored by you.`}
        action={
          <Button onClick={() => edit()}>
            <Plus className="mr-2 h-4 w-4" />
            New tutorial
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
              title="No tutorials"
              description="Create your first tutorial."
            />
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {item.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.categoryName || "Uncategorized"} ·{" "}
                      {item.level?.replaceAll("_", " ")}
                    </p>
                  </div>
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
              ))}
            </div>
          )}
          <Pagination page={page} pages={pages} onChange={setPage} />
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>
                {form.id ? "Edit tutorial" : "Create tutorial"}
              </DialogTitle>
              <DialogDescription>
                Publish a focused learning guide under your instructor profile.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="it-title">Title</Label>
                <Input
                  id="it-title"
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="it-description">Description</Label>
                <Textarea
                  id="it-description"
                  required
                  maxLength={2000}
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="it-content">Content</Label>
                <Textarea
                  id="it-content"
                  required
                  rows={12}
                  value={form.content}
                  onChange={(event) =>
                    setForm({ ...form, content: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="it-category">Category</Label>
                <select
                  id="it-category"
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm({ ...form, categoryId: event.target.value })
                  }
                >
                  <option value="">Uncategorized</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="it-level">Level</Label>
                <select
                  id="it-level"
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                  value={form.level}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      level: event.target.value as NonNullable<
                        AdminTutorial["level"]
                      >,
                    })
                  }
                >
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"].map(
                    (level) => (
                      <option key={level}>{level}</option>
                    ),
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="it-video">Video URL</Label>
                <Input
                  id="it-video"
                  type="url"
                  value={form.videoUrl}
                  onChange={(event) =>
                    setForm({ ...form, videoUrl: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="it-thumbnail">Thumbnail URL</Label>
                <Input
                  id="it-thumbnail"
                  type="url"
                  value={form.thumbnailUrl}
                  onChange={(event) =>
                    setForm({ ...form, thumbnailUrl: event.target.value })
                  }
                />
              </div>
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
                {saving ? "Saving…" : "Save tutorial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
