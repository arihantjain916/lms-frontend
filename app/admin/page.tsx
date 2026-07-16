"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  FileText,
  FolderTree,
  CalendarDays,
  BriefcaseBusiness,
  Users,
  ShoppingCart,
  Star,
  MessagesSquare,
} from "lucide-react";
import { PageHeading, LoadingState, ErrorState } from "./_components/admin-ui";
import {
  getAdminBlogs,
  getAdminCourses,
  getAdminDashboard,
  type AdminBlog,
  type AdminCourse,
} from "@/lib/admin-api";

type DashboardData = {
  courses: AdminCourse[];
  blogs: AdminBlog[];
  totalCourses: number;
  totalBlogs: number;
  programs: number;
  webinars: number;
  users: number;
  enrollments: number;
  revenue: number;
  openTickets: number;
  awaitingReply: number;
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [courses, blogs, stats] = await Promise.all([
        getAdminCourses(1, 6),
        getAdminBlogs(1, 5),
        getAdminDashboard(),
      ]);
      setData({
        courses: courses.data,
        blogs: blogs.data,
        totalCourses: courses.totalElements,
        totalBlogs: blogs.totalElements,
        programs: stats.content.programs,
        webinars: stats.content.webinars,
        users: stats.users.total,
        enrollments: stats.engagement.enrollments,
        revenue: stats.orders.revenue || 0,
        openTickets: stats.support?.openTickets || 0,
        awaitingReply: stats.support?.awaitingReply || 0,
      });
    } catch (err: any) {
      setError(err?.message || "The server did not return dashboard data.");
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
          description="A quick look at your learning platform."
        />
        <LoadingState />
      </>
    );
  if (error)
    return (
      <>
        <PageHeading
          title="Overview"
          description="A quick look at your learning platform."
        />
        <ErrorState message={error} retry={load} />
      </>
    );
  if (!data) return null;

  const stats = [
    {
      label: "Total courses",
      value: data.totalCourses,
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Users",
      value: data.users,
      icon: Users,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Blog posts",
      value: data.totalBlogs,
      icon: FileText,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Active programs",
      value: data.programs,
      icon: BriefcaseBusiness,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Upcoming webinars",
      value: data.webinars,
      icon: CalendarDays,
      color: "bg-rose-50 text-rose-600",
    },
    {
      label: "Enrollments",
      value: data.enrollments,
      icon: FolderTree,
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      label: "Revenue",
      value: data.revenue.toLocaleString(),
      icon: ShoppingCart,
      color: "bg-lime-50 text-lime-700",
    },
    {
      label: "Open support tickets",
      value: data.openTickets,
      icon: MessagesSquare,
      color: "bg-orange-50 text-orange-700",
    },
    {
      label: "Awaiting reply",
      value: data.awaitingReply,
      icon: MessagesSquare,
      color: "bg-red-50 text-red-700",
    },
  ];

  return (
    <>
      <PageHeading
        title="Overview"
        description="A quick look at your learning platform."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div
              className={`mb-4 grid h-10 w-10 place-items-center rounded-xl ${color}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-semibold">Recent courses</h2>
              <p className="text-sm text-slate-500">
                Latest additions to the catalog
              </p>
            </div>
            <Link
              href="/admin/courses"
              className="flex items-center text-sm font-medium text-blue-600"
            >
              Manage <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y">
            {data.courses.map((course) => (
              <div key={course.id} className="flex items-center gap-4 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 font-semibold text-slate-600">
                  {course.title.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{course.title}</p>
                  <p className="truncate text-xs text-slate-500">
                    {course.category?.name || "Uncategorized"} ·{" "}
                    {course.level?.replaceAll("_", " ")}
                  </p>
                </div>
                <div className="hidden items-center gap-1 text-sm text-slate-500 sm:flex">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {course.avgRating ?? 0}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-semibold">Recent posts</h2>
            <p className="text-sm text-slate-500">Latest editorial activity</p>
          </div>
          <div className="divide-y">
            {data.blogs.map((blog) => (
              <div key={blog.id} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium">{blog.title}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${blog.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                  >
                    {blog.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {blog.createdAt || blog.read_time}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/admin/blogs"
            className="flex items-center justify-center border-t p-4 text-sm font-medium text-blue-600"
          >
            View all posts <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
