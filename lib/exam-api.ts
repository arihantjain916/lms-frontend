import instance from "@/helper/axios";
export type Exam = {
  id: string;
  title: string;
  maxAttempts: number;
  totalMarks: number;
  passMarks: number;
  startsAt?: string;
  endsAt?: string;
  timeLimitMin?: number;
};
export type ExamQuestion = {
  id: string;
  type: string;
  marks: string;
  title: string;
  description: string;
  options?: { id: string; option: string }[];
};
export type Report = {
  id: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
};
function entity<T>(response: any): T {
  if (!response?.status || response?.data == null)
    throw new Error(response?.message || "Request failed");
  return response.data as T;
}
export async function getCourseExams(courseId: string | number) {
  return entity<Exam[]>(await instance.get(`/exam/${courseId}`));
}
export async function startExam(examId: string) {
  const response: any = await instance.get(`/exam/attempt/${examId}`);
  if (!response?.status)
    throw new Error(response?.message || "Unable to start exam");
}
export async function getExamQuestions(examId: string) {
  return entity<ExamQuestion[]>(await instance.get(`/question/${examId}`));
}
export async function submitExam(
  examId: string,
  answers: Record<string, string>,
) {
  const response: any = await instance.put("/exam/submit", {
    examId,
    questions: Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    })),
  });
  if (!response?.status)
    throw new Error(response?.message || "Unable to submit exam");
}
export async function getMyReports() {
  return entity<Report[]>(await instance.get("/report/me"));
}
export async function getExamReport(examId: string) {
  return entity<Report>(await instance.get(`/report/${examId}/get`));
}
