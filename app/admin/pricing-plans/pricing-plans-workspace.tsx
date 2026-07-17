"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  BadgeDollarSign,
  Edit3,
  Link2,
  Plus,
  Trash2,
  Unlink,
} from "lucide-react";
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
} from "../_components/admin-ui";
import {
  attachPricingPlan,
  createPricingPlan,
  deleteAdminPricingPlan,
  detachPricingPlan,
  getAdminCourses,
  getAdminPricingPlans,
  getPricingPlanCatalog,
  updatePricingPlan,
  type AdminCourse,
  type AdminPricingPlan,
} from "@/lib/admin-api";

const planTypes: AdminPricingPlan["planType"][] = [
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
  "LIFETIME",
];

const emptyForm = {
  id: "",
  title: "",
  description: "",
  currency: "INR",
  price: "",
  planType: "LIFETIME" as AdminPricingPlan["planType"],
};

function formatPrice(plan: AdminPricingPlan) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: plan.currency,
    }).format(plan.price);
  } catch {
    return `${plan.currency} ${plan.price}`;
  }
}

const loadAdminCourses = async () => (await getAdminCourses(1, 1000)).data;

export function PricingPlansWorkspace({
  loadCourses = loadAdminCourses,
  title = "Pricing plans",
  description = "Create and manage the purchase options available for each course.",
}: {
  loadCourses?: () => Promise<AdminCourse[]>;
  title?: string;
  description?: string;
}) {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [courseId, setCourseId] = useState(0);
  const [plans, setPlans] = useState<AdminPricingPlan[]>([]);
  const [catalog, setCatalog] = useState<AdminPricingPlan[]>([]);
  const [attachPlanId, setAttachPlanId] = useState("");
  const [attaching, setAttaching] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    async function loadCourseOptions() {
      setCoursesLoading(true);
      setError("");
      try {
        const response = await loadCourses();
        setCourses(response);
        setCourseId((current) => current || response[0]?.id || 0);
      } catch (err: any) {
        setError(err?.message || "Unable to load courses.");
      } finally {
        setCoursesLoading(false);
      }
    }
    loadCourseOptions();
  }, [loadCourses]);

  const loadPlans = useCallback(async () => {
    if (!courseId) {
      setPlans([]);
      return;
    }
    setPlansLoading(true);
    setError("");
    try {
      const [attachedPlans, allPlans] = await Promise.all([
        getAdminPricingPlans(courseId),
        getPricingPlanCatalog(),
      ]);
      setPlans(attachedPlans);
      setCatalog(allPlans);
      setAttachPlanId("");
    } catch (err: any) {
      setError(err?.message || "Unable to load pricing plans.");
    } finally {
      setPlansLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  function startEdit(plan?: AdminPricingPlan) {
    setForm(
      plan
        ? {
            id: plan.id,
            title: plan.title,
            description: plan.description,
            currency: plan.currency,
            price: plan.price.toString(),
            planType: plan.planType,
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
        title: form.title.trim(),
        description: form.description.trim(),
        currency: form.currency.trim().toUpperCase(),
        price: Number(form.price),
        planType: form.planType,
      };
      const result = form.id
        ? await updatePricingPlan(form.id, payload)
        : await createPricingPlan(courseId, payload);
      toast.success(result);
      setOpen(false);
      await loadPlans();
    } catch (err: any) {
      toast.error(err?.message || "Unable to save pricing plan.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(plan: AdminPricingPlan) {
    if (!window.confirm(`Delete the “${plan.title}” pricing plan?`)) return;
    try {
      toast.success(await deleteAdminPricingPlan(plan.id));
      await loadPlans();
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete pricing plan.");
    }
  }

  async function attach() {
    if (!attachPlanId || !courseId) return;
    setAttaching(true);
    try {
      toast.success(await attachPricingPlan(attachPlanId, courseId));
      await loadPlans();
    } catch (err: any) {
      toast.error(err?.message || "Unable to attach pricing plan.");
    } finally {
      setAttaching(false);
    }
  }

  async function detach(plan: AdminPricingPlan) {
    if (
      !window.confirm(
        `Detach “${plan.title}” from ${selectedCourse?.title || "this course"}?`,
      )
    )
      return;
    try {
      toast.success(await detachPricingPlan(plan.id, courseId));
      await loadPlans();
    } catch (err: any) {
      toast.error(err?.message || "Unable to detach pricing plan.");
    }
  }

  const selectedCourse = courses.find((course) => course.id === courseId);
  const editingPlan = catalog.find((plan) => plan.id === form.id);
  const attachedTypes = new Set(plans.map((plan) => plan.planType));
  const availablePlans = catalog.filter(
    (plan) =>
      !plan.courseIds.includes(courseId) && !attachedTypes.has(plan.planType),
  );

  return (
    <>
      <PageHeading
        title={title}
        description={description}
        action={
          <Button onClick={() => startEdit()} disabled={!courseId}>
            <Plus className="mr-2 h-4 w-4" /> New pricing plan
          </Button>
        }
      />

      <div className="mb-5 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pricing-course">Course</Label>
            <select
              id="pricing-course"
              className="flex h-10 w-full rounded-md border bg-white px-3 text-sm"
              value={courseId || ""}
              disabled={coursesLoading || !courses.length}
              onChange={(event) => setCourseId(Number(event.target.value))}
            >
              {!courses.length && (
                <option value="">No courses available</option>
              )}
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">
              Plans are unique by billing type for each course.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="attach-pricing-plan">Attach existing plan</Label>
            <div className="flex gap-2">
              <select
                id="attach-pricing-plan"
                className="flex h-10 min-w-0 flex-1 rounded-md border bg-white px-3 text-sm"
                value={attachPlanId}
                disabled={!courseId || !availablePlans.length || attaching}
                onChange={(event) => setAttachPlanId(event.target.value)}
              >
                <option value="">
                  {availablePlans.length
                    ? "Choose from pricing catalog"
                    : "No compatible plans available"}
                </option>
                {availablePlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.title} · {formatPrice(plan)} · {plan.planType}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                disabled={!attachPlanId || attaching}
                onClick={attach}
              >
                <Link2 className="mr-2 h-4 w-4" />
                {attaching ? "Attaching…" : "Attach"}
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Reusing a plan keeps its price synchronized across courses.
            </p>
          </div>
        </div>
      </div>

      {coursesLoading || plansLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} retry={loadPlans} />
      ) : !courses.length ? (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <EmptyState
            title="No courses available"
            description="Create a course before adding a pricing plan."
          />
        </div>
      ) : !plans.length ? (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <EmptyState
            title="No pricing plans"
            description={`Add the first pricing plan for ${selectedCourse?.title || "this course"}.`}
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Billing type</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                          <BadgeDollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{plan.title}</p>
                          <p className="mt-0.5 line-clamp-1 max-w-md text-xs text-slate-500">
                            {plan.description}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Used by {plan.courseIds.length} course
                            {plan.courseIds.length === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">
                        {plan.planType}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium">
                      {formatPrice(plan)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          title="Edit pricing plan"
                          onClick={() => startEdit(plan)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Detach pricing plan from this course"
                          onClick={() => detach(plan)}
                        >
                          <Unlink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title={
                            plan.courseIds.length > 1
                              ? "Shared plans must be detached, not deleted"
                              : "Delete pricing plan"
                          }
                          className="text-red-600 hover:bg-red-50"
                          disabled={plan.courseIds.length > 1}
                          onClick={() => remove(plan)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>
                {form.id ? "Edit pricing plan" : "Create pricing plan"}
              </DialogTitle>
              <DialogDescription>
                {editingPlan && editingPlan.courseIds.length > 1
                  ? `This shared plan is used by ${editingPlan.courseIds.length} courses. Saving changes reprices all of them.`
                  : selectedCourse
                    ? `Set the purchase option for ${selectedCourse.title}.`
                    : "Set the course purchase option."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="plan-title">Title</Label>
                <Input
                  id="plan-title"
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="Lifetime access"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="plan-description">Description</Label>
                <Textarea
                  id="plan-description"
                  required
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Describe what this plan includes."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-type">Billing type</Label>
                <select
                  id="plan-type"
                  required
                  className="flex h-10 w-full rounded-md border bg-white px-3 text-sm"
                  value={form.planType}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      planType: event.target
                        .value as AdminPricingPlan["planType"],
                    })
                  }
                >
                  {planTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-currency">Currency</Label>
                <Input
                  id="plan-currency"
                  required
                  minLength={3}
                  maxLength={3}
                  value={form.currency}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      currency: event.target.value.toUpperCase(),
                    })
                  }
                  placeholder="INR"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="plan-price">Price</Label>
                <Input
                  id="plan-price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                  placeholder="0.00"
                />
                <p className="text-xs text-slate-500">
                  Enter 0 to offer this plan for free.
                </p>
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
                {saving ? "Saving…" : "Save pricing plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AdminPricingPlansWorkspacePage() {
  return <PricingPlansWorkspace />;
}
