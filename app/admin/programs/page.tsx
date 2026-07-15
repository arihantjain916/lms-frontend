"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ClipboardList, Edit3, Plus, Trash2 } from "lucide-react";
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
} from "../_components/admin-ui";
import {
  deleteAdminProgram,
  getAdminProgramApplications,
  getAdminPrograms,
  saveAdminProgram,
  updateAdminProgramApplication,
  type AdminProgram,
  type AdminProgramApplication,
} from "@/lib/admin-api";

const emptyForm = {
  id: "",
  title: "",
  description: "",
  thumbnailUrl: "",
  durationWeeks: "",
  startDate: "",
  price: "",
  currency: "USD",
  isActive: true,
};

function dateInput(value?: string) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<AdminProgram[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState<AdminProgram | null>(null);
  const [applications, setApplications] = useState<AdminProgramApplication[]>(
    [],
  );
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminPrograms(page, 10);
      setPrograms(response.data);
      setPages(response.totalPages);
      setTotal(response.totalElements);
    } catch (err: any) {
      setError(err?.message || "Unable to load programs.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(program?: AdminProgram) {
    setForm(
      program
        ? {
            id: program.id,
            title: program.title,
            description: program.description,
            thumbnailUrl: program.thumbnailUrl || "",
            durationWeeks: program.durationWeeks?.toString() || "",
            startDate: dateInput(program.startDate),
            price: program.price?.toString() || "",
            currency: program.currency || "USD",
            isActive: program.isActive,
          }
        : emptyForm,
    );
    setOpen(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const result = await saveAdminProgram({
        id: form.id || undefined,
        title: form.title,
        description: form.description,
        thumbnailUrl: form.thumbnailUrl || undefined,
        durationWeeks: form.durationWeeks
          ? Number(form.durationWeeks)
          : undefined,
        startDate: form.startDate
          ? new Date(`${form.startDate}T00:00:00`).toISOString()
          : undefined,
        price: form.price ? Number(form.price) : undefined,
        currency: form.currency || undefined,
        isActive: form.isActive,
      });
      toast.success(result);
      setOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to save program.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(program: AdminProgram) {
    if (!window.confirm(`Delete “${program.title}” and its applications?`))
      return;
    try {
      toast.success(await deleteAdminProgram(program.id));
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete program.");
    }
  }

  async function showApplications(program: AdminProgram) {
    setSelected(program);
    setApplications([]);
    setApplicationsLoading(true);
    try {
      const response = await getAdminProgramApplications(program.id, 1, 100);
      setApplications(response.data);
    } catch (err: any) {
      toast.error(err?.message || "Unable to load applications.");
    } finally {
      setApplicationsLoading(false);
    }
  }

  async function changeApplication(
    application: AdminProgramApplication,
    status: AdminProgramApplication["status"],
  ) {
    try {
      toast.success(
        await updateAdminProgramApplication(application.id, status),
      );
      setApplications((items) =>
        items.map((item) =>
          item.id === application.id ? { ...item, status } : item,
        ),
      );
    } catch (err: any) {
      toast.error(err?.message || "Unable to update application.");
    }
  }

  return (
    <>
      <PageHeading
        title="Programs"
        description={`${total} active programs available to learners.`}
        action={
          <Button onClick={() => startEdit()}>
            <Plus className="mr-2 h-4 w-4" /> New program
          </Button>
        }
      />
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} retry={load} />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {!programs.length ? (
            <EmptyState
              title="No active programs"
              description="Create a program to get started."
            />
          ) : (
            <div className="divide-y">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{program.title}</h2>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Active
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {program.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {program.durationWeeks
                        ? `${program.durationWeeks} weeks · `
                        : ""}
                      {program.price != null
                        ? `${program.currency || "USD"} ${program.price}`
                        : "Free"}
                      {program.startDate
                        ? ` · Starts ${new Date(program.startDate).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showApplications(program)}
                    >
                      <ClipboardList className="mr-2 h-4 w-4" /> Applications
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Edit program"
                      onClick={() => startEdit(program)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Delete program"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => remove(program)}
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
        <DialogContent className="max-w-2xl">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>
                {form.id ? "Edit program" : "Create program"}
              </DialogTitle>
              <DialogDescription>
                The server generates the public program slug.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="program-title">Title</Label>
                <Input
                  id="program-title"
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="program-description">Description</Label>
                <Textarea
                  id="program-description"
                  required
                  maxLength={2000}
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="program-thumbnail">Thumbnail URL</Label>
                <Input
                  id="program-thumbnail"
                  type="url"
                  value={form.thumbnailUrl}
                  onChange={(event) =>
                    setForm({ ...form, thumbnailUrl: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program-duration">Duration (weeks)</Label>
                <Input
                  id="program-duration"
                  type="number"
                  min="1"
                  value={form.durationWeeks}
                  onChange={(event) =>
                    setForm({ ...form, durationWeeks: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program-start">Start date</Label>
                <Input
                  id="program-start"
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    setForm({ ...form, startDate: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program-price">Price</Label>
                <Input
                  id="program-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program-currency">Currency</Label>
                <Input
                  id="program-currency"
                  maxLength={3}
                  value={form.currency}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      currency: event.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <label className="flex items-center gap-3 rounded-lg border p-3 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm({ ...form, isActive: event.target.checked })
                  }
                />
                <span>
                  <span className="block font-medium">
                    Accepting applications
                  </span>
                  <span className="text-slate-500">
                    Inactive programs disappear from the current backend list.
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
                {saving ? "Saving…" : "Save program"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(value) => !value && setSelected(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selected?.title} applications</DialogTitle>
            <DialogDescription>
              Review and update applicant status.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto py-3">
            {applicationsLoading ? (
              <LoadingState />
            ) : !applications.length ? (
              <EmptyState
                title="No applications"
                description="No one has applied to this program yet."
              />
            ) : (
              <div className="divide-y rounded-xl border">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="space-y-3 p-4 sm:flex sm:items-start sm:justify-between sm:space-y-0"
                  >
                    <div>
                      <p className="font-medium">{application.name}</p>
                      <p className="text-sm text-slate-500">
                        {application.email}
                        {application.phone ? ` · ${application.phone}` : ""}
                      </p>
                      {application.message && (
                        <p className="mt-2 text-sm text-slate-600">
                          {application.message}
                        </p>
                      )}
                    </div>
                    <select
                      aria-label={`Status for ${application.name}`}
                      className="h-9 rounded-md border bg-white px-2 text-sm"
                      value={application.status}
                      onChange={(event) =>
                        changeApplication(
                          application,
                          event.target
                            .value as AdminProgramApplication["status"],
                        )
                      }
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
