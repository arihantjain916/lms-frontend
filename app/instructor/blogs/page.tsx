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
} from "@/app/admin/_components/admin-ui";
import {
  deleteInstructorBlog,
  getInstructorBlogs,
  saveInstructorBlog,
  type AdminBlogInput,
  type InstructorBlog,
} from "@/lib/instructor-api";

const emptyForm: AdminBlogInput = {
  title: "",
  slug: "",
  description: "",
  content: "",
  read_time: "5 min read",
  category: "EDUCATION",
  tag: "Education",
  status: "DRAFT",
  image_url: "",
  blogMeta: {
    seoTitle: "",
    seoDescription: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: "",
    views: 0,
    likes: 0,
    shares: 0,
    indexable: true,
    followLinks: true,
    featured: false,
  },
};
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function InstructorBlogsPage() {
  const [items, setItems] = useState<InstructorBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AdminBlogInput>(emptyForm);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await getInstructorBlogs());
    } catch (err: any) {
      setError(err?.message || "Unable to load your posts.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  function edit(item?: InstructorBlog) {
    setForm(
      item
        ? {
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description || "",
            content: item.content || "",
            read_time: item.read_time || "5 min read",
            category: item.category || item.Category || "EDUCATION",
            tag: item.tag || "Education",
            status: item.status || "DRAFT",
            image_url: item.imageUrl || "",
            blogMeta: {
              seoTitle: item.blogMeta?.seoTitle || item.title,
              seoDescription:
                item.blogMeta?.seoDescription || item.description || "",
              ogTitle: item.blogMeta?.ogTitle || item.title,
              ogDescription:
                item.blogMeta?.ogDescription || item.description || "",
              ogImageUrl: item.blogMeta?.ogImageUrl || item.imageUrl || "",
              views: item.blogMeta?.views || 0,
              likes: item.blogMeta?.likes || 0,
              shares: item.blogMeta?.shares || 0,
              indexable: item.blogMeta?.indexable ?? true,
              followLinks: item.blogMeta?.followLinks ?? true,
              featured: item.blogMeta?.featured ?? false,
            },
          }
        : emptyForm,
    );
    setOpen(true);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        blogMeta: {
          ...form.blogMeta,
          seoTitle: form.blogMeta.seoTitle || form.title,
          seoDescription: form.blogMeta.seoDescription || form.description,
          ogTitle: form.blogMeta.ogTitle || form.title,
          ogDescription: form.blogMeta.ogDescription || form.description,
          ogImageUrl: form.blogMeta.ogImageUrl || form.image_url,
        },
      };
      toast.success(await saveInstructorBlog(payload));
      setOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to save post.");
    } finally {
      setSaving(false);
    }
  }
  async function remove(item: InstructorBlog) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    try {
      toast.success(await deleteInstructorBlog(item.id));
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete post.");
    }
  }
  return (
    <>
      <PageHeading
        title="My blog posts"
        description={`${items.length} posts authored by you.`}
        action={
          <Button onClick={() => edit()}>
            <Plus className="mr-2 h-4 w-4" />
            New post
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
            <EmptyState title="No posts" description="Write your first post." />
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{item.title}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {item.description}
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
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit post" : "Create post"}</DialogTitle>
              <DialogDescription>
                Write in Markdown and save as a draft until it is ready.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="i-blog-title">Title</Label>
                <Input
                  id="i-blog-title"
                  required
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
                <Label htmlFor="i-blog-slug">Slug</Label>
                <Input
                  id="i-blog-slug"
                  required
                  value={form.slug}
                  onChange={(event) =>
                    setForm({ ...form, slug: slugify(event.target.value) })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="i-blog-description">Description</Label>
                <Textarea
                  id="i-blog-description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="i-blog-content">Content</Label>
                <Textarea
                  id="i-blog-content"
                  required
                  rows={12}
                  value={form.content}
                  onChange={(event) =>
                    setForm({ ...form, content: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="i-blog-status">Status</Label>
                <select
                  id="i-blog-status"
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="i-blog-read">Read time</Label>
                <Input
                  id="i-blog-read"
                  value={form.read_time}
                  onChange={(event) =>
                    setForm({ ...form, read_time: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="i-blog-category">Category</Label>
                <Input
                  id="i-blog-category"
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="i-blog-tag">Tag</Label>
                <Input
                  id="i-blog-tag"
                  value={form.tag}
                  onChange={(event) =>
                    setForm({ ...form, tag: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="i-blog-image">Image URL</Label>
                <Input
                  id="i-blog-image"
                  type="url"
                  value={form.image_url}
                  onChange={(event) =>
                    setForm({ ...form, image_url: event.target.value })
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
                {saving ? "Saving…" : "Save post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
