"use client";

import { PricingPlansWorkspace } from "@/app/admin/pricing-plans/pricing-plans-workspace";
import { getInstructorCourses } from "@/lib/instructor-api";

export default function InstructorPricingPlansPage() {
  return (
    <PricingPlansWorkspace
      loadCourses={getInstructorCourses}
      title="Course pricing"
      description="Create and manage pricing plans for the courses you own."
    />
  );
}
