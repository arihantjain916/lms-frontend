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
export type ResultAnswer = {
  questionAttemptId: string;
  questionId: string;
  questionType: string;
  title: string;
  description?: string | null;
  answer?: string | null;
  correctAnswer?: string | null;
  maximumMarks: number;
  awardedMarks?: number | null;
  feedback?: string | null;
  options?: ResultOption[];
};
export type ResultOption = {
  option: string;
  selected: boolean;
  correct: boolean;
};
export type DetailedResult = Omit<Report, "id"> & {
  reportId: string;
  attemptId?: string | null;
  examId: string;
  examTitle: string;
  courseId?: number | null;
  courseTitle?: string | null;
  submittedAt?: string | null;
  gradingStatus: "PENDING" | "IN_PROGRESS" | "FINALIZED";
  feedback?: string | null;
  answers: ResultAnswer[];
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
export async function getMyDetailedResults() {
  return entity<DetailedResult[]>(await instance.get("/report/me/details"));
}
export async function getMyDetailedResult(reportId: string) {
  const result = entity<DetailedResult>(
    await instance.get(`/report/me/${reportId}/details`),
  );
  const questions = await getExamQuestions(result.examId);
  const questionsById = new Map(
    questions.map((question) => [question.id, question]),
  );

  return {
    ...result,
    answers: result.answers.map((answer) => {
      const question = questionsById.get(answer.questionId);
      if (answer.questionType !== "MCQ" || !question?.options?.length) {
        return { ...answer, options: [] };
      }
      return {
        ...answer,
        options: question.options.map((option) => ({
          option: option.option,
          selected: option.option === answer.answer,
          correct: option.option === answer.correctAnswer,
        })),
      };
    }),
  } satisfies DetailedResult;
}
