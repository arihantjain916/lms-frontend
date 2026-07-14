"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock,
  GraduationCap,
  Star,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import instance from "@/helper/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePageRestoreKey } from "@/hooks/use-page-restore-key";

type Program = {
  id: string | number;
  title: string;
  description?: string;
  longDescription?: string;
  image?: string;
  category?: string;
  duration?: string;
  schedule?: string;
  startDate?: string;
  price?: string | number;
  rating?: number;
  reviews?: number;
  students?: number;
  certificate?: boolean;
  skills?: string[];
  outcomes?: string[];
  requirements?: string[];
  curriculum?: Array<{ title: string; description?: string }>;
  instructor?: { name?: string; title?: string; image?: string };
  applicationStatus?: string;
};

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const restoreKey = usePageRestoreKey();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");

  const loadProgram = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const response: any = await instance.get(`/programs/${id}`);
      const value = response?.data ?? response;
      if (!value?.id) throw new Error("Program not found");
      setProgram(value);
    } catch {
      setProgram(null);
      setError(
        "This program could not be found or is temporarily unavailable.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProgram();
  }, [loadProgram, restoreKey]);

  async function apply() {
    if (!program) return;
    setApplying(true);
    try {
      const response: any = await instance.post(
        `/programs/${program.id}/applications`,
      );
      if (response?.status === false) throw new Error(response?.message);
      setProgram((current) =>
        current ? { ...current, applicationStatus: "submitted" } : current,
      );
      toast.success("Application submitted successfully");
    } catch (error: any) {
      toast.error(error?.message || "Unable to submit your application");
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <main className="container min-h-[70vh] py-12">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-8 h-[460px] animate-pulse rounded-2xl bg-muted/60" />
      </main>
    );
  }

  if (!program || error) {
    return (
      <main className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="max-w-lg text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-5 text-3xl font-bold">Program unavailable</h1>
          <p className="mt-3 text-muted-foreground">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={loadProgram}>Try again</Button>
            <Button asChild variant="outline">
              <Link href="/programs">All programs</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const applied =
    program.applicationStatus === "submitted" ||
    program.applicationStatus === "approved";

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-blue-950 py-12 text-white">
        <div className="container">
          <Link
            href="/programs"
            className="mb-7 inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            All programs
          </Link>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_420px]">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {program.category && (
                  <Badge className="bg-blue-600 capitalize">
                    {program.category.replaceAll("-", " ")}
                  </Badge>
                )}
                {program.certificate && (
                  <Badge
                    variant="outline"
                    className="border-blue-300 text-blue-100"
                  >
                    <Award className="mr-1 h-3.5 w-3.5" />
                    Certificate included
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {program.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
                {program.description}
              </p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-100">
                {program.duration && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {program.duration}
                  </span>
                )}
                {program.schedule && (
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {program.schedule}
                  </span>
                )}
                {program.students !== undefined && (
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {program.students.toLocaleString()} learners
                  </span>
                )}
                {program.rating !== undefined && (
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {program.rating.toFixed(1)} ({program.reviews ?? 0} reviews)
                  </span>
                )}
              </div>
            </div>
            <div className="relative h-72 overflow-hidden rounded-2xl border border-white/10 bg-blue-900 shadow-2xl">
              <Image
                src={program.image || "/placeholder.svg"}
                alt={program.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-bold">About this program</h2>
            <p className="mt-4 whitespace-pre-line leading-7 text-muted-foreground">
              {program.longDescription || program.description}
            </p>
          </div>

          {!!program.outcomes?.length && (
            <div>
              <h2 className="text-2xl font-bold">What you will achieve</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {program.outcomes.map((item) => (
                  <div key={item} className="flex gap-3 rounded-lg border p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!!program.curriculum?.length && (
            <div>
              <h2 className="text-2xl font-bold">Program curriculum</h2>
              <div className="mt-5 space-y-3">
                {program.curriculum.map((item, index) => (
                  <Card key={`${item.title}-${index}`}>
                    <CardContent className="flex gap-4 p-5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.description && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!!program.requirements?.length && (
            <div>
              <h2 className="text-2xl font-bold">Requirements</h2>
              <ul className="mt-4 space-y-3">
                {program.requirements.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside>
          <Card className="sticky top-24 shadow-lg">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Program fee</p>
              <p className="mt-1 text-3xl font-bold">
                {program.price ?? "Contact us"}
              </p>
              {program.startDate && (
                <div className="mt-5 flex gap-3 rounded-lg bg-blue-50 p-4">
                  <CalendarDays className="h-5 w-5 text-blue-700" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Next start date
                    </p>
                    <p className="font-medium">{program.startDate}</p>
                  </div>
                </div>
              )}
              {!!program.skills?.length && (
                <div className="mt-6">
                  <p className="font-semibold">Skills covered</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {program.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button
                className="mt-7 w-full"
                size="lg"
                onClick={apply}
                disabled={applying || applied}
              >
                {applied
                  ? "Application submitted"
                  : applying
                    ? "Submitting…"
                    : "Apply now"}
              </Button>
              <Button asChild variant="outline" className="mt-3 w-full">
                <Link href="/contact">Ask a question</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
