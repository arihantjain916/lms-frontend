"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePageRestoreKey } from "@/hooks/use-page-restore-key";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileText,
  Lock,
  PlayCircle,
  Star,
} from "lucide-react";
import instance from "@/helper/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Lesson = {
  id: string | number;
  title: string;
  duration?: string;
  type?: string;
  preview?: boolean;
  completed?: boolean;
};
type Tutorial = {
  id: string | number;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  image?: string;
  duration?: string;
  level?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  free?: boolean;
  certificate?: boolean;
  progress?: number;
  tags?: string[];
  outcomes?: string[];
  requirements?: string[];
  instructor?: { name?: string; title?: string; bio?: string; avatar?: string };
  lessons?: Lesson[] | number;
};

export default function TutorialDetailPage() {
  const restoreKey = usePageRestoreKey();
  const { slug } = useParams<{ slug: string }>();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTutorial = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError("");
    try {
      const response: any = await instance.get(`/tutorials/${slug}`);
      const value = response?.data ?? response;
      if (!value?.id) throw new Error("Tutorial not found");
      setTutorial(value);
    } catch {
      setTutorial(null);
      setError(
        "This tutorial could not be found or is temporarily unavailable.",
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadTutorial();
  }, [loadTutorial, restoreKey]);

  if (loading)
    return (
      <main className="container min-h-[70vh] py-12">
        <div className="h-[500px] animate-pulse rounded-2xl bg-muted/60" />
      </main>
    );
  if (!tutorial || error)
    return (
      <main className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="max-w-lg text-center">
          <BookOpen className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-5 text-3xl font-bold">Tutorial unavailable</h1>
          <p className="mt-3 text-muted-foreground">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={loadTutorial}>Try again</Button>
            <Button asChild variant="outline">
              <Link href="/tutorials">All tutorials</Link>
            </Button>
          </div>
        </div>
      </main>
    );

  const lessons = Array.isArray(tutorial.lessons) ? tutorial.lessons : [];
  const instructorName = tutorial.instructor?.name || "EduPortal instructor";

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-blue-50 py-10">
        <div className="container">
          <Link
            href="/tutorials"
            className="mb-7 inline-flex items-center gap-1 text-sm text-blue-700 hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            All tutorials
          </Link>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_460px]">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge className="capitalize">
                  {tutorial.category || "Tutorial"}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {tutorial.level || "All levels"}
                </Badge>
                {tutorial.free && (
                  <Badge
                    variant="outline"
                    className="border-green-300 bg-green-50 text-green-700"
                  >
                    Free
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {tutorial.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                {tutorial.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-5 text-sm">
                {tutorial.duration && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    {tutorial.duration}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  {lessons.length ||
                    (typeof tutorial.lessons === "number"
                      ? tutorial.lessons
                      : 0)}{" "}
                  lessons
                </span>
                {tutorial.rating !== undefined && (
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {tutorial.rating.toFixed(1)} ({tutorial.reviews ?? 0})
                  </span>
                )}
                {tutorial.certificate && (
                  <span className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    Certificate
                  </span>
                )}
              </div>
              <div className="mt-7 flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={tutorial.instructor?.avatar || "/placeholder-user.jpg"}
                  />
                  <AvatarFallback>{instructorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-muted-foreground">Created by</p>
                  <p className="font-medium">{instructorName}</p>
                </div>
              </div>
            </div>
            <div className="relative h-72 overflow-hidden rounded-2xl border bg-white shadow-lg">
              <Image
                src={tutorial.image || "/placeholder.svg"}
                alt={tutorial.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="rounded-full bg-white/95 p-4 shadow">
                  <PlayCircle className="h-9 w-9 text-blue-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          {!!tutorial.outcomes?.length && (
            <div>
              <h2 className="text-2xl font-bold">What you will learn</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {tutorial.outcomes.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tutorial.content && (
            <div>
              <h2 className="text-2xl font-bold">About this tutorial</h2>
              <p className="mt-4 whitespace-pre-line leading-7 text-muted-foreground">
                {tutorial.content}
              </p>
            </div>
          )}
          <div>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">Tutorial content</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {lessons.length} lessons
                </p>
              </div>
            </div>
            <div className="mt-5 overflow-hidden rounded-xl border">
              {lessons.length ? (
                lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between gap-4 border-b p-4 last:border-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {lesson.type === "article" ? (
                        <FileText className="h-5 w-5 shrink-0 text-blue-600" />
                      ) : (
                        <PlayCircle className="h-5 w-5 shrink-0 text-blue-600" />
                      )}
                      <div>
                        <p className="font-medium">
                          {index + 1}. {lesson.title}
                        </p>
                        {lesson.duration && (
                          <p className="text-xs text-muted-foreground">
                            {lesson.duration}
                          </p>
                        )}
                      </div>
                    </div>
                    {lesson.preview || lesson.completed ? (
                      <Badge variant="outline">
                        {lesson.completed ? "Completed" : "Preview"}
                      </Badge>
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))
              ) : (
                <p className="p-6 text-center text-muted-foreground">
                  Lesson details will be available soon.
                </p>
              )}
            </div>
          </div>
          {!!tutorial.requirements?.length && (
            <div>
              <h2 className="text-2xl font-bold">Requirements</h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
                {tutorial.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {tutorial.instructor && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold">Your instructor</h2>
                <div className="mt-5 flex gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={
                        tutorial.instructor.avatar || "/placeholder-user.jpg"
                      }
                    />
                    <AvatarFallback>{instructorName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{instructorName}</h3>
                    <p className="text-sm text-blue-700">
                      {tutorial.instructor.title}
                    </p>
                    {tutorial.instructor.bio && (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {tutorial.instructor.bio}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <aside>
          <Card className="sticky top-24 shadow-lg">
            <CardContent className="p-6">
              {tutorial.progress !== undefined && tutorial.progress > 0 && (
                <div className="mb-6">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Your progress</span>
                    <strong>{tutorial.progress}%</strong>
                  </div>
                  <Progress value={tutorial.progress} />
                </div>
              )}
              <p className="text-2xl font-bold">
                {tutorial.free ? "Free" : "Start learning today"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Learn at your own pace with lifetime access to this tutorial.
              </p>
              <Button className="mt-6 w-full" size="lg">
                {tutorial.progress ? "Continue tutorial" : "Start tutorial"}
              </Button>
              {tutorial.certificate && (
                <div className="mt-5 flex gap-3 rounded-lg bg-blue-50 p-4 text-sm">
                  <Award className="h-5 w-5 shrink-0 text-blue-700" />
                  <span>
                    Earn a certificate when you complete every lesson.
                  </span>
                </div>
              )}
              {!!tutorial.tags?.length && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {tutorial.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
