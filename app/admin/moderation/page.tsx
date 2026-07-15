"use client";

import { useCallback, useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, ErrorState, LoadingState, PageHeading, Pagination } from "../_components/admin-ui";
import {
  deleteAdminBlogComment,
  deleteAdminRating,
  getAdminBlogComments,
  getAdminRatings,
  type AdminBlogComment,
  type AdminRating,
} from "@/lib/admin-api";

type Section = "ratings" | "comments";

export default function AdminModerationPage() {
  const [section, setSection] = useState<Section>("ratings");
  const [ratings, setRatings] = useState<AdminRating[]>([]);
  const [comments, setComments] = useState<AdminBlogComment[]>([]);
  const [courseInput, setCourseInput] = useState("");
  const [courseId, setCourseId] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const result = section === "ratings"
        ? await getAdminRatings(page, 10, courseId)
        : await getAdminBlogComments(page, 10);
      if (section === "ratings") setRatings(result.data as AdminRating[]);
      else setComments(result.data as AdminBlogComment[]);
      setPages(result.totalPages); setTotal(result.totalElements);
    } catch (err: any) { setError(err?.message || "Unable to load moderation queue."); }
    finally { setLoading(false); }
  }, [courseId, page, section]);
  useEffect(() => { load(); }, [load]);

  async function removeRating(item: AdminRating) {
    if (!window.confirm("Delete this rating?")) return;
    try { toast.success(await deleteAdminRating(item.id)); await load(); }
    catch (err: any) { toast.error(err?.message || "Unable to delete rating."); }
  }
  async function removeComment(item: AdminBlogComment) {
    if (!window.confirm("Delete this comment and its direct replies?")) return;
    try { toast.success(await deleteAdminBlogComment(item.id)); await load(); }
    catch (err: any) { toast.error(err?.message || "Unable to delete comment."); }
  }

  return <>
    <PageHeading title="Moderation" description={`${total} ${section}.`} action={section === "ratings" ? <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); setCourseId(courseInput ? Number(courseInput) : undefined); setPage(1); }}><Input type="number" min="1" className="w-40" placeholder="Course ID" value={courseInput} onChange={(event) => setCourseInput(event.target.value)} /><Button variant="outline">Filter</Button></form> : undefined} />
    <div className="mb-4 flex gap-2"><Button size="sm" variant={section === "ratings" ? "default" : "outline"} onClick={() => { setSection("ratings"); setPage(1); }}>Ratings</Button><Button size="sm" variant={section === "comments" ? "default" : "outline"} onClick={() => { setSection("comments"); setPage(1); }}>Blog comments</Button></div>
    {loading ? <LoadingState /> : error ? <ErrorState message={error} retry={load} /> : <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {section === "ratings" ? (!ratings.length ? <EmptyState title="No ratings" description="No ratings match this course." /> : <div className="divide-y">{ratings.map((item) => <div key={item.id} className="flex items-start justify-between gap-4 p-5"><div><div className="flex items-center gap-2"><p className="font-medium">{item.user?.name || "Unknown user"}</p><span className="flex items-center text-sm text-amber-600"><Star className="mr-1 h-4 w-4 fill-current" />{item.rating}</span></div>{item.comment && <p className="mt-2 text-sm text-slate-600">{item.comment}</p>}<p className="mt-1 text-xs text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</p></div><Button variant="outline" size="icon" className="text-red-600" onClick={() => removeRating(item)}><Trash2 className="h-4 w-4" /></Button></div>)}</div>) : (!comments.length ? <EmptyState title="No comments" description="Blog comments will appear here." /> : <div className="divide-y">{comments.map((item) => <div key={item.id} className="flex items-start justify-between gap-4 p-5"><div><p className="font-medium">{item.user?.name || "Unknown user"}</p><p className="mt-1 text-sm text-slate-600">{item.comment}</p><p className="mt-2 text-xs text-slate-400">{item.replies?.length || 0} replies{item.createdAt ? ` · ${new Date(item.createdAt).toLocaleString()}` : ""}</p></div><Button variant="outline" size="icon" className="text-red-600" onClick={() => removeComment(item)}><Trash2 className="h-4 w-4" /></Button></div>)}</div>)}
      <Pagination page={page} pages={pages} onChange={setPage} />
    </div>}
    <p className="mt-4 text-xs text-slate-500">The backend exposes review deletion by ID but no admin review-list endpoint, so review rows cannot be surfaced yet.</p>
  </>;
}
