import instance from "@/helper/axios";
import type {
  AdminBlog,
  AdminBlogInput,
  AdminCategory,
  AdminCourse,
  AdminCourse as InstructorCourse,
  AdminTutorial,
  AdminTutorialInput,
} from "@/lib/admin-api";

export type {
  AdminBlogInput,
  AdminCategory,
  InstructorCourse,
  AdminTutorialInput,
};
export type InstructorBlog = AdminBlog;

export type InstructorLesson = {
  id: string;
  time: string;
  description: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type InstructorLessonResource = {
  id: string;
  title: string;
  type?: string;
  createdAt?: string;
};

export type InstructorExam = {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";
  shuffleQuestions: boolean;
  showScoreImmediately: boolean;
  maxAttempts: number;
  totalMarks: number;
  passMarks: number;
  startsAt: string;
  endsAt: string;
  timeLimitMin: number;
};

export type InstructorQuestion = {
  id: string;
  type: "TEXT" | "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER" | "LONG_ANSWER";
  marks: string;
  title: string;
  description: string;
  options?: { id?: string; option: string; isCorrect?: boolean }[];
};

export type GradingStatus = "PENDING" | "IN_PROGRESS" | "FINALIZED";

export type SubmissionSummary = {
  attemptId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  gradingStatus: GradingStatus;
};

export type SubmittedAnswer = {
  questionAttemptId: string;
  questionId: string;
  questionType: string;
  title: string;
  answer: string;
  maximumMarks: number;
  awardedMarks: number | null;
  feedback: string | null;
};

export type SubmissionDetail = {
  attemptId: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  gradingStatus: GradingStatus;
  feedback: string | null;
  answers: SubmittedAnswer[];
};

export type Page<T> = {
  data: T[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

function entity<T>(response: any): T {
  if (response?.status === false || response?.data == null)
    throw new Error(response?.message || "Request failed");
  return response.data as T;
}

function page<T>(response: any): Page<T> {
  if (response?.status === false)
    throw new Error(response?.message || "Request failed");
  return {
    data: Array.isArray(response?.data) ? response.data : [],
    currentPage: Number(response?.currentPage ?? 1),
    size: Number(response?.size ?? 10),
    totalElements: Number(response?.totalElements ?? 0),
    totalPages: Number(response?.totalPages ?? 0),
  };
}

function message(response: any) {
  if (response?.status === false)
    throw new Error(response.message || "Request failed");
  return response?.message || "Saved successfully";
}

export async function getInstructorCourses() {
  return entity<AdminCourse[]>(await instance.get("/course/me"));
}

export async function getCourseForManagement(id: number) {
  return entity<AdminCourse>(await instance.get(`/course/${id}`));
}

export async function saveInstructorCourse(input: {
  id?: number;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  isFeatured: boolean;
  level: string;
}) {
  return message(
    input.id
      ? await instance.put("/course/update", input)
      : await instance.post("/course/add", input),
  );
}

export async function deleteInstructorCourse(id: number) {
  return message(await instance.delete(`/course/delete/${id}`));
}

export async function getInstructorBlogs() {
  return entity<AdminBlog[]>(await instance.get("/blog/me"));
}

export async function saveInstructorBlog(input: AdminBlogInput) {
  return message(
    input.id
      ? await instance.put("/blog/update", input)
      : await instance.post("/blog/add", input),
  );
}

export async function deleteInstructorBlog(id: string) {
  return message(await instance.delete(`/blog/delete/${id}`));
}

export async function getInstructorTutorials(pageNumber = 1, limit = 10) {
  return page<AdminTutorial>(
    await instance.get("/tutorials/me", {
      params: { page: pageNumber, limit },
    }),
  );
}

export async function saveInstructorTutorial(input: AdminTutorialInput) {
  const { id, ...payload } = input;
  return message(
    id
      ? await instance.put(`/tutorials/${id}`, payload)
      : await instance.post("/tutorials", payload),
  );
}

export async function deleteInstructorTutorial(id: string) {
  return message(await instance.delete(`/tutorials/${id}`));
}

export type InstructorLessonInput = Omit<
  InstructorLesson,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
  courseId: number;
};

export async function getInstructorLessons(courseId: number, pageNumber = 1) {
  return page<InstructorLesson>(
    await instance.get(`/lesson/${courseId}`, {
      params: { page: pageNumber, size: 50, sortBy: "createdAt", order: "asc" },
    }),
  );
}

export async function saveInstructorLesson(input: InstructorLessonInput) {
  return message(
    input.id
      ? await instance.put("/lesson/update", input)
      : await instance.post("/lesson/add", input),
  );
}

export async function deleteInstructorLesson(id: string) {
  return message(await instance.delete(`/lesson/delete/${id}`));
}

export async function getInstructorLessonResources(lessonId: string) {
  return entity<InstructorLessonResource[]>(
    await instance.get(`/lessons/${lessonId}/resources`),
  );
}

export async function uploadLessonResourceFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return entity<string>(
    await instance.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
}

export async function addInstructorLessonResource(
  lessonId: string,
  input: { title: string; url: string; type?: string },
) {
  return entity<InstructorLessonResource>(
    await instance.post(`/lessons/${lessonId}/resources`, input),
  );
}

export async function deleteInstructorLessonResource(
  lessonId: string,
  resourceId: string,
) {
  return message(
    await instance.delete(`/lessons/${lessonId}/resources/${resourceId}`),
  );
}

export type InstructorExamInput = Omit<InstructorExam, "id" | "status"> & {
  id?: string;
  courseId: number;
};

export async function getInstructorExams(courseId: number) {
  return entity<InstructorExam[]>(
    await instance.get(`/exam/manage/${courseId}`),
  );
}

export async function saveInstructorExam(input: InstructorExamInput) {
  return message(
    input.id
      ? await instance.put("/exam/update", input)
      : await instance.post("/exam/create", input),
  );
}

export async function setInstructorExamStatus(
  id: string,
  status: InstructorExam["status"],
) {
  return message(await instance.put(`/exam/${id}/${status}`));
}

export async function deleteInstructorExam(id: string) {
  return message(await instance.delete(`/exam/${id}/delete`));
}

export async function getInstructorQuestions(examId: string) {
  return entity<InstructorQuestion[]>(
    await instance.get(`/question/${examId}`),
  );
}

export type InstructorQuestionInput = {
  id?: string;
  examId: string;
  type: InstructorQuestion["type"];
  marks: number;
  title: string;
  description: string;
  correctOption?: boolean;
  position?: number;
  options?: { id?: string; option: string; isCorrect: boolean }[];
};

export async function saveInstructorQuestion(input: InstructorQuestionInput) {
  return message(
    input.id
      ? await instance.put("/question/update", input)
      : await instance.post("/question/add", input),
  );
}

export async function deleteInstructorQuestion(id: string) {
  return message(await instance.delete(`/question/delete/${id}`));
}

export async function getExamSubmissions(examId: string) {
  return entity<SubmissionSummary[]>(
    await instance.get(`/grading/exams/${examId}/submissions`),
  );
}

export async function getSubmissionDetail(attemptId: string) {
  return entity<SubmissionDetail>(
    await instance.get(`/grading/submissions/${attemptId}`),
  );
}

export async function gradeSubmissionAnswer(
  attemptId: string,
  questionAttemptId: string,
  input: { awardedMarks: number; feedback?: string },
) {
  return entity<SubmittedAnswer>(
    await instance.put(
      `/grading/submissions/${attemptId}/answers/${questionAttemptId}`,
      input,
    ),
  );
}

export async function finalizeSubmissionGrading(
  attemptId: string,
  feedback?: string,
) {
  return entity<SubmissionDetail>(
    await instance.post(`/grading/submissions/${attemptId}/finalize`, {
      feedback: feedback || null,
    }),
  );
}
