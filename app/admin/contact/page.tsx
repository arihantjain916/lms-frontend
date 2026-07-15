"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState, ErrorState, LoadingState, PageHeading, Pagination } from "../_components/admin-ui";
import { deleteAdminContact, getAdminContact, getAdminContacts, type AdminContact } from "@/lib/admin-api";

export default function AdminContactPage() {
  const [items, setItems] = useState<AdminContact[]>([]);
  const [selected, setSelected] = useState<AdminContact | null>(null);
  const [department, setDepartment] = useState<AdminContact["department"] | "">("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const result = await getAdminContacts(page, 10, department || undefined);
      setItems(result.data); setPages(result.totalPages); setTotal(result.totalElements);
    } catch (err: any) { setError(err?.message || "Unable to load contact submissions."); }
    finally { setLoading(false); }
  }, [department, page]);
  useEffect(() => { load(); }, [load]);

  async function view(item: AdminContact) {
    try { setSelected(await getAdminContact(item.id)); }
    catch (err: any) { toast.error(err?.message || "Unable to load message."); }
  }
  async function remove(item: AdminContact) {
    if (!window.confirm(`Delete the message from ${item.name}?`)) return;
    try { toast.success(await deleteAdminContact(item.id)); setSelected(null); await load(); }
    catch (err: any) { toast.error(err?.message || "Unable to delete message."); }
  }

  return <>
    <PageHeading title="Contact inbox" description={`${total} contact submissions.`} action={<select className="h-10 rounded-md border bg-white px-3 text-sm" value={department} onChange={(event) => { setDepartment(event.target.value as AdminContact["department"] | ""); setPage(1); }}><option value="">All departments</option>{["GENERAL", "TECHNICAL", "SALES", "BILLING"].map((value) => <option key={value} value={value}>{value}</option>)}</select>} />
    {loading ? <LoadingState /> : error ? <ErrorState message={error} retry={load} /> : <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {!items.length ? <EmptyState title="Inbox is empty" description="No submissions match this department." /> : <div className="divide-y">{items.map((item) => <div key={item.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="font-medium">{item.subject}</p><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{item.department}</span></div><p className="mt-1 text-sm text-slate-500">{item.name} · {item.email}{item.phone ? ` · ${item.phone}` : ""}</p><p className="mt-1 line-clamp-1 text-sm text-slate-600">{item.message}</p></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={() => view(item)}><Eye className="h-4 w-4" /></Button><Button variant="outline" size="icon" className="text-red-600" onClick={() => remove(item)}><Trash2 className="h-4 w-4" /></Button></div></div>)}</div>}
      <Pagination page={page} pages={pages} onChange={setPage} />
    </div>}
    <Dialog open={Boolean(selected)} onOpenChange={(value) => !value && setSelected(null)}><DialogContent><DialogHeader><DialogTitle>{selected?.subject}</DialogTitle><DialogDescription>{selected?.name} · {selected?.email}</DialogDescription></DialogHeader><div className="whitespace-pre-wrap py-4 text-sm leading-6">{selected?.message}</div><div className="flex justify-end"><Button variant="outline" className="text-red-600" onClick={() => selected && remove(selected)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button></div></DialogContent></Dialog>
  </>;
}
