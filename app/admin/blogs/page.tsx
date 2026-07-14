"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Edit3, ExternalLink, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
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
  deleteAdminBlog,
  getAdminBlogs,
  saveAdminBlog,
  type AdminBlog,
  type AdminBlogInput,
} from "@/lib/admin-api";

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

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AdminBlogInput>(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getAdminBlogs(page, 10);
      setBlogs(result.data);
      setPages(result.totalPages);
      setTotal(result.totalElements);
    } catch (err: any) {
      setError(err?.message || "Unable to load posts.");
    } finally {
      setLoading(false);
    }
  }, [page]);
  useEffect(() => {
    load();
  }, [load]);
  const filtered = useMemo(
    () =>
      blogs.filter((item) =>
        `${item.title} ${item.tag} ${item.status}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [blogs, search],
  );

  const startCreate = () => {
    setForm(emptyForm);
    setOpen(true);
  };
  const startEdit = (item: AdminBlog) => {
    const meta = item.blogMeta;
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      content: item.content,
      read_time: item.read_time,
      category: item.category || item.Category || "EDUCATION",
      tag: item.tag,
      status: item.status,
      image_url: item.imageUrl,
      blogMeta: {
        seoTitle: meta?.seoTitle || item.title.slice(0, 60),
        seoDescription: meta?.seoDescription || item.description.slice(0, 160),
        ogTitle: meta?.ogTitle || "",
        ogDescription: meta?.ogDescription || "",
        ogImageUrl: meta?.ogImageUrl || "",
        views: meta?.views || 0,
        likes: meta?.likes || 0,
        shares: meta?.shares || 0,
        indexable: meta?.indexable ?? true,
        followLinks: meta?.followLinks ?? true,
        featured: meta?.featured ?? Boolean(item.isFeatured),
      },
    });
    setOpen(true);
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const next = {
        ...form,
        blogMeta: {
          ...form.blogMeta,
          seoTitle: form.blogMeta.seoTitle || form.title.slice(0, 60),
          seoDescription:
            form.blogMeta.seoDescription || form.description.slice(0, 160),
        },
      };
      toast.success(await saveAdminBlog(next));
      setOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to save post.");
    } finally {
      setSaving(false);
    }
  }
  async function remove(item: AdminBlog) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    try {
      toast.success(await deleteAdminBlog(item.id));
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete post.");
    }
  }
  const updateMeta = (
    key: keyof AdminBlogInput["blogMeta"],
    value: string | boolean,
  ) => setForm({ ...form, blogMeta: { ...form.blogMeta, [key]: value } });

  return (
    <>
      <PageHeading
        title="Blog posts"
        description={`${total} posts across all editorial categories.`}
        action={
          <Button onClick={startCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New post
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
              title="No blog posts found"
              description="Create a post or try a different search."
            />
          ) : (
            <div className="divide-y">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-5 md:flex-row md:items-center"
                >
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{item.title}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : item.status === "DRAFT" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {item.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.category || item.Category} · {item.read_time} ·{" "}
                      {item.createdAt || ""}
                    </p>
                  </div>
                  <div className="flex gap-2 self-end md:self-auto">
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      title="View post"
                    >
                      <Link href={`/blog/${item.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Edit post"
                      onClick={() => startEdit(item)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Delete post"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => remove(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Pagination page={page} pages={pages} onChange={setPage} />
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit post" : "Create post"}</DialogTitle>
              <DialogDescription>
                Write the article, choose its publishing status, and add search
                metadata.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="post-title">Title</Label>
                <Input
                  id="post-title"
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                      slug: form.id ? form.slug : slugify(event.target.value),
                      blogMeta: {
                        ...form.blogMeta,
                        seoTitle: form.id
                          ? form.blogMeta.seoTitle
                          : event.target.value.slice(0, 60),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="post-slug">Slug</Label>
                <Input
                  id="post-slug"
                  required
                  value={form.slug}
                  onChange={(event) =>
                    setForm({ ...form, slug: slugify(event.target.value) })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="post-description">Summary</Label>
                <Textarea
                  id="post-description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                      blogMeta: {
                        ...form.blogMeta,
                        seoDescription: form.id
                          ? form.blogMeta.seoDescription
                          : event.target.value.slice(0, 160),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="post-content">Content</Label>
                <Textarea
                  id="post-content"
                  required
                  rows={10}
                  placeholder="Markdown and plain text are supported by the storefront."
                  value={form.content}
                  onChange={(event) =>
                    setForm({ ...form, content: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-category">Category</Label>
                <select
                  id="post-category"
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                >
                  {[
                    "CAREER",
                    "LEARNING",
                    "TECHNOLOGY",
                    "INDUSTRY",
                    "EDUCATION",
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-status">Status</Label>
                <select
                  id="post-status"
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                >
                  {["DRAFT", "PUBLISHED", "UNPUBLISHED"].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-tag">Tag</Label>
                <Input
                  id="post-tag"
                  required
                  value={form.tag}
                  onChange={(event) =>
                    setForm({ ...form, tag: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-time">Read time</Label>
                <Input
                  id="post-time"
                  required
                  value={form.read_time}
                  onChange={(event) =>
                    setForm({ ...form, read_time: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="post-image">Cover image URL</Label>
                <Input
                  id="post-image"
                  type="url"
                  required
                  value={form.image_url}
                  onChange={(event) =>
                    setForm({ ...form, image_url: event.target.value })
                  }
                />
              </div>
              <div className="mt-2 border-t pt-5 sm:col-span-2">
                <h3 className="font-semibold">Search metadata</h3>
                <p className="text-xs text-slate-500">
                  Used for browser and social previews.
                </p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="seo-title">SEO title</Label>
                <Input
                  id="seo-title"
                  required
                  maxLength={60}
                  value={form.blogMeta.seoTitle}
                  onChange={(event) =>
                    updateMeta("seoTitle", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="seo-description">SEO description</Label>
                <Textarea
                  id="seo-description"
                  required
                  maxLength={160}
                  rows={3}
                  value={form.blogMeta.seoDescription}
                  onChange={(event) =>
                    updateMeta("seoDescription", event.target.value)
                  }
                />
              </div>
              <div className="flex flex-wrap gap-5 sm:col-span-2">
                {[
                  ["indexable", "Allow indexing"],
                  ["followLinks", "Follow links"],
                  ["featured", "Featured post"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(
                        form.blogMeta[key as keyof typeof form.blogMeta],
                      )}
                      onChange={(event) =>
                        updateMeta(
                          key as keyof typeof form.blogMeta,
                          event.target.checked,
                        )
                      }
                    />
                    {label}
                  </label>
                ))}
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
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : form.id ? "Save changes" : "Create post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
