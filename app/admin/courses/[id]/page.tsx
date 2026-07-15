"use client";

import { CourseContentManager } from "@/app/instructor/courses/[id]/page";

export default function AdminCourseContentPage() {
  return <CourseContentManager allowAnyCourse />;
}
