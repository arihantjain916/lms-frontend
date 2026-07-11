"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getExamReport, getMyReports, type Report } from "@/lib/exam-api";
import { useRequireAuth } from "@/hooks/use-authenticated";
export default function ResultsPage() {
  const auth = useRequireAuth();
  const params = useSearchParams();
  const examId = params.get("exam");
  const title = params.get("title");
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  useEffect(() => {
    if (auth.isAuthenticated)
      (examId ? getExamReport(examId).then((item) => [item]) : getMyReports())
        .then(setReports)
        .catch(() => setReports([]));
  }, [auth.isAuthenticated, examId]);
  const pages = Math.max(1, Math.ceil(reports.length / pageSize));
  const visible = reports.slice((page - 1) * pageSize, page * pageSize);
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">My results</h1>
      {title && (
        <p className="mt-2 text-muted-foreground">Result for {title}</p>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((report, index) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <p className="font-semibold">
                {examId
                  ? title || "Exam result"
                  : `Exam result ${(page - 1) * pageSize + index + 1}`}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">Grade</p>
              <p className="text-4xl font-bold text-blue-700">{report.grade}</p>
              <p className="mt-4">
                {report.obtainedMarks} / {report.totalMarks} marks
              </p>
              <p className="text-muted-foreground">{report.percentage}%</p>
            </CardContent>
          </Card>
        ))}
        {visible.length === 0 && (
          <p className="text-muted-foreground">No results available yet.</p>
        )}
      </div>
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
