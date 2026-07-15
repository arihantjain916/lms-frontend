"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Files, Plus, Trash2, Users } from "lucide-react";
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
  addAdminWebinarResource,
  deleteAdminWebinar,
  deleteAdminWebinarResource,
  getAdminCategories,
  getAdminHostApplications,
  getAdminWebinarRegistrations,
  getAdminWebinarResources,
  getAdminWebinars,
  saveAdminWebinar,
  updateAdminHostApplication,
  type AdminCategory,
  type AdminHostApplication,
  type AdminWebinar,
  type AdminWebinarRegistration,
  type AdminWebinarResource,
} from "@/lib/admin-api";

const emptyForm = {
  title: "",
  description: "",
  thumbnailUrl: "",
  meetingUrl: "",
  recordingUrl: "",
  scheduledAt: "",
  durationMinutes: "60",
  categoryId: "",
  hostId: "",
};

export default function AdminWebinarsPage() {
  const [webinars, setWebinars] = useState<AdminWebinar[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [managed, setManaged] = useState<AdminWebinar | null>(null);
  const [resources, setResources] = useState<AdminWebinarResource[]>([]);
  const [registrations, setRegistrations] = useState<
    AdminWebinarRegistration[]
  >([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [resourceForm, setResourceForm] = useState({
    title: "",
    url: "",
    type: "LINK",
  });
  const [hostOpen, setHostOpen] = useState(false);
  const [hostApplications, setHostApplications] = useState<
    AdminHostApplication[]
  >([]);
  const [hostsLoading, setHostsLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [response, categoryList] = await Promise.all([
        getAdminWebinars(page, 10, { status }),
        getAdminCategories(),
      ]);
      setWebinars(response.data);
      setPages(response.totalPages);
      setTotal(response.totalElements);
      setCategories(categoryList);
    } catch (err: any) {
      setError(err?.message || "Unable to load webinars.");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      toast.success(
        await saveAdminWebinar({
          title: form.title,
          description: form.description,
          thumbnailUrl: form.thumbnailUrl || undefined,
          meetingUrl: form.meetingUrl || undefined,
          recordingUrl: form.recordingUrl || undefined,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
          durationMinutes: form.durationMinutes
            ? Number(form.durationMinutes)
            : undefined,
          categoryId: form.categoryId || undefined,
          hostId: form.hostId || undefined,
        }),
      );
      setOpen(false);
      setForm(emptyForm);
      setStatus("upcoming");
      setPage(1);
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to create webinar.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(webinar: AdminWebinar) {
    if (!window.confirm(`Delete “${webinar.title}” and its registrations?`))
      return;
    try {
      toast.success(await deleteAdminWebinar(webinar.id));
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete webinar.");
    }
  }

  async function manage(webinar: AdminWebinar) {
    setManaged(webinar);
    setDetailsLoading(true);
    setResources([]);
    setRegistrations([]);
    try {
      const [resourceList, registrationPage] = await Promise.all([
        getAdminWebinarResources(webinar.id),
        getAdminWebinarRegistrations(webinar.id, 1, 100),
      ]);
      setResources(resourceList);
      setRegistrations(registrationPage.data);
    } catch (err: any) {
      toast.error(err?.message || "Unable to load webinar details.");
    } finally {
      setDetailsLoading(false);
    }
  }

  async function addResource(event: FormEvent) {
    event.preventDefault();
    if (!managed) return;
    try {
      toast.success(await addAdminWebinarResource(managed.id, resourceForm));
      setResourceForm({ title: "", url: "", type: "LINK" });
      setResources(await getAdminWebinarResources(managed.id));
    } catch (err: any) {
      toast.error(err?.message || "Unable to add resource.");
    }
  }

  async function removeResource(resource: AdminWebinarResource) {
    if (!managed || !window.confirm(`Delete resource “${resource.title}”?`))
      return;
    try {
      toast.success(await deleteAdminWebinarResource(managed.id, resource.id));
      setResources((items) => items.filter((item) => item.id !== resource.id));
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete resource.");
    }
  }

  async function showHosts() {
    setHostOpen(true);
    setHostsLoading(true);
    try {
      setHostApplications((await getAdminHostApplications(1, 100)).data);
    } catch (err: any) {
      toast.error(err?.message || "Unable to load host applications.");
    } finally {
      setHostsLoading(false);
    }
  }

  async function changeHostStatus(
    application: AdminHostApplication,
    next: AdminHostApplication["status"],
  ) {
    try {
      toast.success(await updateAdminHostApplication(application.id, next));
      setHostApplications((items) =>
        items.map((item) =>
          item.id === application.id ? { ...item, status: next } : item,
        ),
      );
    } catch (err: any) {
      toast.error(err?.message || "Unable to update host application.");
    }
  }

  return (
    <>
      <PageHeading
        title="Webinars"
        description={`${total} ${status} webinars.`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={showHosts}>
              <Users className="mr-2 h-4 w-4" /> Host applications
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New webinar
            </Button>
          </div>
        }
      />
      <div className="mb-4 flex gap-2">
        {(["upcoming", "past"] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant={status === value ? "default" : "outline"}
            onClick={() => {
              setStatus(value);
              setPage(1);
            }}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Button>
        ))}
      </div>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} retry={load} />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {!webinars.length ? (
            <EmptyState
              title={`No ${status} webinars`}
              description="Create a webinar or check the other schedule."
            />
          ) : (
            <div className="divide-y">
              {webinars.map((webinar) => (
                <div
                  key={webinar.id}
                  className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{webinar.title}</h2>
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {webinar.status}
                      </span>
                      {webinar.hasRecording && (
                        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700">
                          Recording
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {webinar.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(webinar.scheduledAt).toLocaleString()} ·{" "}
                      {webinar.durationMinutes || 0} min
                      {webinar.categoryName
                        ? ` · ${webinar.categoryName}`
                        : ""}{" "}
                      · {webinar.registrationsCount || 0} registrations
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => manage(webinar)}
                    >
                      <Files className="mr-2 h-4 w-4" /> Manage
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Delete webinar"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => remove(webinar)}
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
              <DialogTitle>Create webinar</DialogTitle>
              <DialogDescription>
                The authenticated admin is used as host unless a host ID is
                supplied.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="webinar-title">Title</Label>
                <Input
                  id="webinar-title"
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="webinar-description">Description</Label>
                <Textarea
                  id="webinar-description"
                  required
                  maxLength={2000}
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="webinar-thumbnail">Thumbnail URL</Label>
                <Input
                  id="webinar-thumbnail"
                  type="url"
                  value={form.thumbnailUrl}
                  onChange={(event) =>
                    setForm({ ...form, thumbnailUrl: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webinar-date">Scheduled at</Label>
                <Input
                  id="webinar-date"
                  required
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(event) =>
                    setForm({ ...form, scheduledAt: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webinar-duration">Duration (minutes)</Label>
                <Input
                  id="webinar-duration"
                  type="number"
                  min="1"
                  value={form.durationMinutes}
                  onChange={(event) =>
                    setForm({ ...form, durationMinutes: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webinar-category">Category</Label>
                <select
                  id="webinar-category"
                  className="flex h-10 w-full rounded-md border bg-white px-3 text-sm"
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm({ ...form, categoryId: event.target.value })
                  }
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webinar-host">Host user ID (optional)</Label>
                <Input
                  id="webinar-host"
                  value={form.hostId}
                  onChange={(event) =>
                    setForm({ ...form, hostId: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webinar-meeting">Meeting URL</Label>
                <Input
                  id="webinar-meeting"
                  type="url"
                  value={form.meetingUrl}
                  onChange={(event) =>
                    setForm({ ...form, meetingUrl: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webinar-recording">Recording URL</Label>
                <Input
                  id="webinar-recording"
                  type="url"
                  value={form.recordingUrl}
                  onChange={(event) =>
                    setForm({ ...form, recordingUrl: event.target.value })
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
              <Button type="submit" disabled={saving}>
                {saving ? "Creating…" : "Create webinar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(managed)}
        onOpenChange={(value) => !value && setManaged(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage {managed?.title}</DialogTitle>
            <DialogDescription>
              Resources and registration records returned by the backend.
            </DialogDescription>
          </DialogHeader>
          {detailsLoading ? (
            <LoadingState />
          ) : (
            <div className="grid max-h-[65vh] gap-6 overflow-y-auto py-3 md:grid-cols-2">
              <section>
                <h3 className="mb-3 font-semibold">Resources</h3>
                <form
                  className="mb-4 space-y-2 rounded-xl border p-3"
                  onSubmit={addResource}
                >
                  <Input
                    required
                    placeholder="Resource title"
                    value={resourceForm.title}
                    onChange={(event) =>
                      setResourceForm({
                        ...resourceForm,
                        title: event.target.value,
                      })
                    }
                  />
                  <Input
                    required
                    type="url"
                    placeholder="https://…"
                    value={resourceForm.url}
                    onChange={(event) =>
                      setResourceForm({
                        ...resourceForm,
                        url: event.target.value,
                      })
                    }
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type"
                      value={resourceForm.type}
                      onChange={(event) =>
                        setResourceForm({
                          ...resourceForm,
                          type: event.target.value,
                        })
                      }
                    />
                    <Button type="submit">Add</Button>
                  </div>
                </form>
                {!resources.length ? (
                  <p className="text-sm text-slate-500">No resources yet.</p>
                ) : (
                  <div className="divide-y rounded-xl border">
                    {resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between gap-3 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {resource.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {resource.type || "Resource"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => removeResource(resource)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              <section>
                <h3 className="mb-3 font-semibold">
                  Registrations ({registrations.length})
                </h3>
                <p className="mb-3 text-xs text-amber-700">
                  The backend currently omits registrant names and emails.
                </p>
                {!registrations.length ? (
                  <p className="text-sm text-slate-500">
                    No registrations yet.
                  </p>
                ) : (
                  <div className="divide-y rounded-xl border">
                    {registrations.map((registration) => (
                      <div key={registration.id} className="p-3 text-sm">
                        <p className="font-medium">
                          Registration {registration.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(registration.registeredAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={hostOpen} onOpenChange={setHostOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Host applications</DialogTitle>
            <DialogDescription>
              Approve or reject requests to host webinars.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[65vh] overflow-y-auto py-3">
            {hostsLoading ? (
              <LoadingState />
            ) : !hostApplications.length ? (
              <EmptyState
                title="No host applications"
                description="New applications will appear here."
              />
            ) : (
              <div className="divide-y rounded-xl border">
                {hostApplications.map((application) => (
                  <div
                    key={application.id}
                    className="space-y-3 p-4 sm:flex sm:justify-between sm:space-y-0"
                  >
                    <div>
                      <p className="font-medium">{application.name}</p>
                      <p className="text-sm text-slate-500">
                        {application.email} · {application.topic}
                      </p>
                      {application.message && (
                        <p className="mt-2 text-sm">{application.message}</p>
                      )}
                    </div>
                    <select
                      className="h-9 rounded-md border bg-white px-2 text-sm"
                      value={application.status}
                      onChange={(event) =>
                        changeHostStatus(
                          application,
                          event.target.value as AdminHostApplication["status"],
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
