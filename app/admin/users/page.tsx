"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, ErrorState, LoadingState, PageHeading, Pagination } from "../_components/admin-ui";
import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
  type AdminUser,
} from "@/lib/admin-api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<AdminUser["role"] | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getAdminUsers(page, 10, {
        q: search || undefined,
        role: role || undefined,
      });
      setUsers(result.data);
      setPages(result.totalPages);
      setTotal(result.totalElements);
    } catch (err: any) {
      setError(err?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, role, search]);

  useEffect(() => { load(); }, [load]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    setSearch(query.trim());
  }

  async function changeRole(user: AdminUser, next: AdminUser["role"]) {
    try {
      toast.success(await updateAdminUserRole(user.id, next));
      setUsers((items) => items.map((item) => item.id === user.id ? { ...item, role: next } : item));
    } catch (err: any) {
      toast.error(err?.message || "Unable to update role.");
    }
  }

  async function toggleStatus(user: AdminUser, field: "isActive" | "isBanned") {
    const value = !user[field];
    try {
      toast.success(await updateAdminUserStatus(user.id, { [field]: value }));
      setUsers((items) => items.map((item) => item.id === user.id ? { ...item, [field]: value } : item));
    } catch (err: any) {
      toast.error(err?.message || "Unable to update account status.");
    }
  }

  async function remove(user: AdminUser) {
    if (!window.confirm(`Soft-delete ${user.name}'s account?`)) return;
    try {
      toast.success(await deleteAdminUser(user.id));
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete user.");
    }
  }

  return (
    <>
      <PageHeading title="Users" description={`${total} user accounts.`} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <form className="flex max-w-md flex-1 gap-2" onSubmit={submitSearch}>
          <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input className="pl-9" placeholder="Name, email, or username" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
          <Button type="submit" variant="outline">Search</Button>
        </form>
        <select className="h-10 rounded-md border bg-white px-3 text-sm" value={role} onChange={(event) => { setRole(event.target.value as AdminUser["role"] | ""); setPage(1); }}>
          <option value="">All roles</option><option value="STUDENT">Students</option><option value="INSTRUCTOR">Instructors</option><option value="ADMIN">Admins</option>
        </select>
      </div>
      {loading ? <LoadingState /> : error ? <ErrorState message={error} retry={load} /> : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {!users.length ? <EmptyState title="No users found" description="Try a different search or role." /> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y">{users.map((user) => <tr key={user.id} className={user.isDeleted ? "opacity-50" : ""}>
                <td className="px-5 py-4"><p className="font-medium">{user.name}</p><p className="text-xs text-slate-500">{user.email} · @{user.username}</p></td>
                <td className="px-5 py-4"><select className="h-9 rounded-md border bg-white px-2" value={user.role} disabled={user.isDeleted} onChange={(event) => changeRole(user, event.target.value as AdminUser["role"])}><option value="STUDENT">Student</option><option value="INSTRUCTOR">Instructor</option><option value="ADMIN">Admin</option></select></td>
                <td className="px-5 py-4"><div className="flex gap-2"><button className={`rounded-full px-2 py-1 text-xs ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`} disabled={user.isDeleted} onClick={() => toggleStatus(user, "isActive")}>{user.isActive ? "Active" : "Inactive"}</button><button className={`rounded-full px-2 py-1 text-xs ${user.isBanned ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"}`} disabled={user.isDeleted} onClick={() => toggleStatus(user, "isBanned")}>{user.isBanned ? "Banned" : "Allowed"}</button>{user.isDeleted && <span className="rounded-full bg-red-50 px-2 py-1 text-xs text-red-700">Deleted</span>}</div></td>
                <td className="px-5 py-4 text-slate-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                <td className="px-5 py-4 text-right"><Button variant="outline" size="icon" title="Soft-delete user" className="text-red-600" disabled={user.isDeleted} onClick={() => remove(user)}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>)}</tbody>
            </table></div>
          )}
          <Pagination page={page} pages={pages} onChange={setPage} />
        </div>
      )}
    </>
  );
}
