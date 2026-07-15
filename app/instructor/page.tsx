"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BookOpen, FileText, GraduationCap } from "lucide-react";
import {
  ErrorState,
  LoadingState,
  PageHeading,
} from "@/app/admin/_components/admin-ui";
import {
  getInstructorBlogs,
  getInstructorCourses,
  getInstructorTutorials,
  type InstructorCourse,
} from "@/lib/instructor-api";

export default function InstructorDashboard() {
  const [data, setData] = useState<{
    courses: InstructorCourse[];
    blogs: number;
    tutorials: number;
  } | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setError("");
    try {
      const [courses, blogs, tutorials] = await Promise.all([
        getInstructorCourses(),
        getInstructorBlogs(),
        getInstructorTutorials(1, 1),
      ]);
      setData({
        courses,
        blogs: blogs.length,
        tutorials: tutorials.totalElements,
      });
    } catch (err: any) {
      setError(err?.message || "Unable to load teaching overview.");
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  if (!data && !error)
    return (
      <>
        <PageHeading
          title="Overview"
          description="Your teaching activity at a glance."
        />
        <LoadingState />
      </>
    );
  if (error)
    return (
      <>
        <PageHeading
          title="Overview"
          description="Your teaching activity at a glance."
        />
        <ErrorState message={error} retry={load} />
      </>
    );
  if (!data) return null;
  const stats = [
    {
      label: "My courses",
      value: data.courses.length,
      icon: BookOpen,
      href: "/instructor/courses",
    },
    {
      label: "Blog posts",
      value: data.blogs,
      icon: FileText,
      href: "/instructor/blogs",
    },
    {
      label: "Tutorials",
      value: data.tutorials,
      icon: GraduationCap,
      href: "/instructor/tutorials",
    },
  ];
  return (
    <>
      <PageHeading
        title="Overview"
        description="Your teaching activity at a glance."
      />
      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border bg-white p-5 shadow-sm transition hover:border-emerald-300"
          >
            <Icon className="mb-4 h-5 w-5 text-emerald-600" />
            <p className="text-3xl font-bold">{value}</p>
            <p className="mt-1 flex items-center text-sm text-slate-500">
              {label}
              <ArrowRight className="ml-auto h-4 w-4" />
            </p>
          </Link>
        ))}
      </section>
      <section className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">Your courses</h2>
          <p className="text-sm text-slate-500">
            Open a course to manage lessons and exams.
          </p>
        </div>
        {!data.courses.length ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No courses yet.
          </div>
        ) : (
          <div className="divide-y">
            {data.courses.slice(0, 6).map((course) => (
              <Link
                key={course.id}
                href={`/instructor/courses/${course.id}`}
                className="flex items-center justify-between p-4 hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium">{course.title}</p>
                  <p className="text-xs text-slate-500">
                    {course.category?.name || "Uncategorized"} ·{" "}
                    {course.level?.replaceAll("_", " ")}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
