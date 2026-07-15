"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, ErrorState, LoadingState, PageHeading, Pagination } from "../_components/admin-ui";
import {
  getAdminCertificates,
  getAdminEnrollments,
  getAdminOrders,
  revokeAdminCertificate,
  type AdminCertificate,
  type AdminEnrollment,
  type AdminOrder,
} from "@/lib/admin-api";

type Section = "orders" | "enrollments" | "certificates";

export default function AdminCommercePage() {
  const [section, setSection] = useState<Section>("orders");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([]);
  const [certificates, setCertificates] = useState<AdminCertificate[]>([]);
  const [orderStatus, setOrderStatus] = useState<AdminOrder["status"] | "">("");
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
      if (section === "orders") {
        const result = await getAdminOrders(page, 10, orderStatus || undefined);
        setOrders(result.data); setPages(result.totalPages); setTotal(result.totalElements);
      } else if (section === "enrollments") {
        const result = await getAdminEnrollments(page, 10, courseId);
        setEnrollments(result.data); setPages(result.totalPages); setTotal(result.totalElements);
      } else {
        const result = await getAdminCertificates(page, 10);
        setCertificates(result.data); setPages(result.totalPages); setTotal(result.totalElements);
      }
    } catch (err: any) { setError(err?.message || `Unable to load ${section}.`); }
    finally { setLoading(false); }
  }, [courseId, orderStatus, page, section]);
  useEffect(() => { load(); }, [load]);

  function changeSection(value: Section) { setSection(value); setPage(1); setError(""); }
  async function revoke(item: AdminCertificate) {
    if (!window.confirm(`Revoke certificate ${item.certificateNumber}?`)) return;
    try { toast.success(await revokeAdminCertificate(item.id)); await load(); }
    catch (err: any) { toast.error(err?.message || "Unable to revoke certificate."); }
  }

  const filters = section === "orders" ? <select className="h-10 rounded-md border bg-white px-3 text-sm" value={orderStatus} onChange={(event) => { setOrderStatus(event.target.value as AdminOrder["status"] | ""); setPage(1); }}><option value="">All statuses</option><option value="PENDING">Pending</option><option value="PAID">Paid</option><option value="FAILED">Failed</option></select> : section === "enrollments" ? <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); setCourseId(courseInput ? Number(courseInput) : undefined); setPage(1); }}><Input className="w-40" type="number" min="1" placeholder="Course ID" value={courseInput} onChange={(event) => setCourseInput(event.target.value)} /><Button variant="outline">Filter</Button></form> : undefined;

  return <>
    <PageHeading title="Commerce & learning" description={`${total} ${section}.`} action={filters} />
    <div className="mb-4 flex gap-2">{(["orders", "enrollments", "certificates"] as Section[]).map((value) => <Button key={value} size="sm" variant={section === value ? "default" : "outline"} onClick={() => changeSection(value)}>{value.charAt(0).toUpperCase() + value.slice(1)}</Button>)}</div>
    {loading ? <LoadingState /> : error ? <ErrorState message={error} retry={load} /> : <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {section === "orders" ? (!orders.length ? <EmptyState title="No orders" description="No orders match this status." /> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Course / plan</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th></tr></thead><tbody className="divide-y">{orders.map((item) => <tr key={item.id}><td className="px-5 py-4 font-mono text-xs">{item.id}</td><td className="px-5 py-4"><p>{item.courseTitle || "—"}</p><p className="text-xs text-slate-500">{item.planTitle || "No plan"}</p></td><td className="px-5 py-4 font-medium">{item.currency} {item.amount}</td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{item.status}</span></td><td className="px-5 py-4 text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}</td></tr>)}</tbody></table></div>) : section === "enrollments" ? (!enrollments.length ? <EmptyState title="No enrollments" description="No enrollments match this course." /> : <div className="divide-y">{enrollments.map((item) => <div key={item.id} className="flex flex-col justify-between gap-2 p-5 sm:flex-row"><div><p className="font-medium">{item.userName}</p><p className="text-sm text-slate-500">{item.userEmail}</p></div><div className="sm:text-right"><p className="text-sm font-medium">{item.courseTitle}</p><p className="text-xs text-slate-500">{new Date(item.enrolledAt).toLocaleString()}</p></div></div>)}</div>) : (!certificates.length ? <EmptyState title="No certificates" description="Issued certificates will appear here." /> : <div className="divide-y">{certificates.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 p-5"><div><p className="font-medium">{item.certificateNumber}</p><p className="text-sm text-slate-500">{item.userName} · {item.courseTitle}</p><p className="text-xs text-slate-400">Issued {new Date(item.issuedAt).toLocaleDateString()}</p></div><Button variant="outline" size="sm" className="text-red-600" onClick={() => revoke(item)}><Trash2 className="mr-2 h-4 w-4" />Revoke</Button></div>)}</div>)}
      <Pagination page={page} pages={pages} onChange={setPage} />
    </div>}
  </>;
}
