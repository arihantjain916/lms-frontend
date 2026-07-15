"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, BookOpen, ClipboardCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import CourseCard from "@/app/courses/course-card";
import {
  Enrollment,
  getMyEnrollments,
  getWishlist,
  removeFromWishlist,
  unenrollCourse,
  WishlistItem,
} from "@/lib/learning-api";
import { useAuth } from "@/hooks/use-authenticated";
import { loginHref } from "@/lib/auth-navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyLearningPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    const [enrolledResult, wishlistResult] = await Promise.allSettled([
      getMyEnrollments(1, 100),
      getWishlist(1, 100),
    ]);
    setEnrollments(
      enrolledResult.status === "fulfilled" ? enrolledResult.value.data : [],
    );
    setWishlist(
      wishlistResult.status === "fulfilled" ? wishlistResult.value.data : [],
    );
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  async function unenroll(courseId: number) {
    try {
      await unenrollCourse(courseId);
      setEnrollments((items) =>
        items.filter((item) => item.course.id !== courseId),
      );
      toast.success("Unenrolled successfully");
    } catch (error: any) {
      toast.error(error?.message || "Unable to unenroll");
    }
  }

  async function removeWish(courseId: number) {
    try {
      await removeFromWishlist(courseId);
      setWishlist((items) =>
        items.filter((item) => item.course.id !== courseId),
      );
      toast.success("Removed from wishlist");
    } catch (error: any) {
      toast.error(error?.message || "Unable to update wishlist");
    }
  }

  if (authLoading || (isAuthenticated && loading))
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </main>
    );
  if (!isAuthenticated)
    return (
      <main className="container flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign in to view your learning</h1>
          <Button asChild className="mt-5">
            <Link href={loginHref("/my-learning")}>Sign in</Link>
          </Button>
        </div>
      </main>
    );

  return (
    <main className="container min-h-[70vh] py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">My learning</h1>
        <p className="mt-2 text-muted-foreground">
          Continue enrolled courses or revisit your wishlist.
        </p>
      </div>
      <Tabs
        defaultValue={
          searchParams.get("tab") === "exams" ? "exams" : "enrolled"
        }
      >
        <TabsList>
          <TabsTrigger value="enrolled">
            Enrolled ({enrollments.length})
          </TabsTrigger>
          <TabsTrigger value="wishlist">
            Wishlist ({wishlist.length})
          </TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
        </TabsList>
        <TabsContent value="enrolled" className="mt-7">
          {enrollments.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((item) => (
                <div key={item.id} className="space-y-2">
                  <CourseCard course={item.course} />
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/courses/${item.course.id}/learn`}>
                        Continue
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600"
                      onClick={() => unenroll(item.course.id)}
                    >
                      Unenroll
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon={<BookOpen className="h-10 w-10" />}
              title="No enrolled courses"
              action="Browse courses"
              href="/courses"
            />
          )}
        </TabsContent>
        <TabsContent value="exams" className="mt-7">
          {enrollments.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm"
                >
                  <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold">
                      {item.course.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      View available course exams
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/courses/${item.course.id}/exams`}>
                      View exams
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon={<ClipboardCheck className="h-10 w-10" />}
              title="Enroll in a course to access its exams"
              action="Browse courses"
              href="/courses"
            />
          )}
        </TabsContent>
        <TabsContent value="wishlist" className="mt-7">
          {wishlist.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((item) => (
                <div key={item.id} className="space-y-2">
                  <CourseCard course={item.course} />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => removeWish(item.course.id)}
                  >
                    Remove from wishlist
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon={<Bookmark className="h-10 w-10" />}
              title="Your wishlist is empty"
              action="Discover courses"
              href="/courses"
            />
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

function Empty({
  icon,
  title,
  action,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  action: string;
  href: string;
}) {
  return (
    <div className="rounded-xl border bg-muted/20 p-12 text-center">
      <div className="mx-auto flex justify-center text-blue-600">{icon}</div>
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      <Button asChild className="mt-5">
        <Link href={href}>{action}</Link>
      </Button>
    </div>
  );
}
