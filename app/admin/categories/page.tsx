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
} from "../_components/admin-ui";
import {
  deleteAdminCategory,
  getAdminCategories,
  saveAdminCategory,
  type AdminCategory,
} from "@/lib/admin-api";

const emptyForm = { id: "", name: "", description: "", isFeatured: false };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
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
      setCategories(await getAdminCategories());
    } catch (err: any) {
      setError(err?.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      categories.filter((item) =>
        `${item.name} ${item.description}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [categories, search],
  );
  const startCreate = () => {
    setForm(emptyForm);
    setOpen(true);
  };
  const startEdit = (item: AdminCategory) => {
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      isFeatured: item.isFeatured,
    });
    setOpen(true);
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const message = await saveAdminCategory({
        ...form,
        id: form.id || undefined,
      });
      toast.success(message);
      setOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: AdminCategory) {
    if (
      !window.confirm(
        `Delete “${item.name}”? Courses in this category may prevent deletion.`,
      )
    )
      return;
    try {
      toast.success(await deleteAdminCategory(item.id));
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete category.");
    }
  }

  return (
    <>
      <PageHeading
        title="Categories"
        description="Organize courses into clear areas of study."
        action={
          <Button onClick={startCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New category
          </Button>
        }
      />
      <div className="mb-4 max-w-sm relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          className="pl-9"
          placeholder="Search categories…"
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
              title="No categories found"
              description="Create a category or try a different search."
            />
          ) : (
            <div className="divide-y">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-50 text-lg font-bold text-violet-600">
                    {item.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{item.name}</h2>
                      {item.isFeatured && (
                        <span className="flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          <Star className="mr-1 h-3 w-3 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {item.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.courseCount} course
                      {item.courseCount === 1 ? "" : "s"} · /{item.slug}
                    </p>
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="icon"
                      title="Edit category"
                      onClick={() => startEdit(item)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Delete category"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
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
        <DialogContent>
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>
                {form.id ? "Edit category" : "Create category"}
              </DialogTitle>
              <DialogDescription>
                Category slugs are generated automatically by the server.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <div className="space-y-2">
                <Label htmlFor="category-name">Name</Label>
                <Input
                  id="category-name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-description">Description</Label>
                <Textarea
                  id="category-description"
                  required
                  maxLength={500}
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) =>
                    setForm({ ...form, isFeatured: event.target.checked })
                  }
                  className="h-4 w-4"
                />
                <span>
                  <span className="block font-medium">Featured category</span>
                  <span className="text-slate-500">
                    Highlight this category on the storefront.
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
                    : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
