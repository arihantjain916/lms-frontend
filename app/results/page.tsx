"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart3, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMyDetailedResults, type DetailedResult } from "@/lib/exam-api";
import { useRequireAuth } from "@/hooks/use-authenticated";

export default function ResultsPage() {
  const auth = useRequireAuth();
  const params = useSearchParams();
  const examId = params.get("exam");
  const requestedTitle = params.get("title");
  const [reports, setReports] = useState<DetailedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    if (!auth.isAuthenticated) return;
    setLoading(true);
    setError("");
    getMyDetailedResults()
      .then((items) =>
        setReports(
          examId ? items.filter((item) => item.examId === examId) : items,
        ),
      )
      .catch((requestError: any) =>
        setError(requestError?.message || "Unable to load results"),
      )
      .finally(() => setLoading(false));
  }, [auth.isAuthenticated, examId]);

  const pages = Math.max(1, Math.ceil(reports.length / pageSize));
  const visible = reports.slice((page - 1) * pageSize, page * pageSize);

  if (auth.loading || loading) {
    return (
      <main className="grid min-h-[70vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </main>
    );
  }

  return (
    <main className="container min-h-[70vh] py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My results</h1>
          <p className="mt-2 text-muted-foreground">
            {requestedTitle
              ? `Result for ${requestedTitle}`
              : "Review your marks, answers, and grader feedback."}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/my-learning?tab=results">Back to My Learning</Link>
        </Button>
      </div>

      {error ? (
        <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      ) : (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((report) => (
            <Card key={report.reportId} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-full bg-violet-50 p-3 text-violet-600">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    Grade {report.grade}
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-semibold">
                  {report.examTitle}
                </h2>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {report.courseTitle || "Course exam"}
                </p>
                <p className="mt-4 text-3xl font-bold text-blue-700">
                  {report.obtainedMarks} / {report.totalMarks}
                </p>
                <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{report.percentage}%</span>
                  <span>{report.gradingStatus.replaceAll("_", " ")}</span>
                </div>
                <Button asChild className="mt-5 w-full">
                  <Link href={`/results/${report.reportId}`}>
                    Full result <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          {!visible.length && (
            <div className="col-span-full rounded-xl border bg-muted/20 p-12 text-center">
              <BarChart3 className="mx-auto h-10 w-10 text-blue-600" />
              <h2 className="mt-4 text-xl font-semibold">
                No results available yet
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Finalized and auto-graded exam results will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {reports.length > pageSize && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((value) => value - 1)}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {pages}
          </span>
          <Button
            variant="outline"
            disabled={page === pages}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}
