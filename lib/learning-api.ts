import instance from "@/helper/axios";
import type { Course, PageResult } from "@/lib/course-api";

export type CourseProgress = {
  courseId: number;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  isCompleted: boolean;
};
export type LearningLesson = {
  id: string;
  title: string;
  time?: string;
  description?: string;
  thumbnailUrl?: string;
  status?: string;
  watchedSeconds: number;
  isCompleted: boolean;
};
export type LearningCourse = {
  course: Course;
  progress: CourseProgress;
  lessons: LearningLesson[];
};
export type Playback = {
  lessonId: string;
  title: string;
  videoUrl?: string;
  watchedSeconds: number;
  isCompleted: boolean;
};
export type LessonResource = {
  id: string;
  title: string;
  type?: string;
  createdAt?: string;
};
export type Enrollment = { id: string; enrolledAt: string; course: Course };
export type WishlistItem = { id: string; addedAt: string; course: Course };
export type Order = {
  id: string;
  courseId: number;
  courseTitle: string;
  planId?: string;
  planTitle?: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
};
export type Certificate = {
  id: string;
  certificateNumber: string;
  userName: string;
  courseTitle: string;
  issuedAt: string;
};

function entity<T>(response: any): T {
  if (!response?.status || response?.data == null)
    throw new Error(response?.message || "Request failed");
  return response.data as T;
}

function page<T>(response: any): PageResult<T> {
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

export async function getMyEnrollments(pageNumber = 1, limit = 50) {
  return page<Enrollment>(
    await instance.get("/users/me/enrollments", {
      params: { page: pageNumber, limit },
    }),
  );
}
export async function getMyEnrollment(courseId: number | string) {
  return entity<Enrollment>(
    await instance.get(`/users/me/enrollments/${courseId}`),
  );
}
export async function enrollCourse(courseId: number | string) {
  const response: any = await instance.post(`/courses/${courseId}/enrollments`);
  if (!response?.status)
    throw new Error(response?.message || "Unable to enroll");
}
export async function unenrollCourse(courseId: number | string) {
  const response: any = await instance.delete(
    `/courses/${courseId}/enrollments`,
  );
  if (!response?.status)
    throw new Error(response?.message || "Unable to unenroll");
}

export async function getWishlist(pageNumber = 1, limit = 50) {
  return page<WishlistItem>(
    await instance.get("/users/me/wishlist", {
      params: { page: pageNumber, limit },
    }),
  );
}
export async function addToWishlist(courseId: number | string) {
  const response: any = await instance.post(`/users/me/wishlist/${courseId}`);
  if (!response?.status)
    throw new Error(response?.message || "Unable to add wishlist item");
}
export async function removeFromWishlist(courseId: number | string) {
  const response: any = await instance.delete(`/users/me/wishlist/${courseId}`);
  if (!response?.status)
    throw new Error(response?.message || "Unable to remove wishlist item");
}

export async function createCheckout(
  courseId: number | string,
  pricingPlanId?: string,
) {
  return entity<Order>(
    await instance.post("/checkout/session", {
      courseId: Number(courseId),
      pricingPlanId,
    }),
  );
}
export async function getOrder(orderId: string) {
  return entity<Order>(await instance.get(`/orders/${orderId}`));
}

export async function getLearningCourse(courseId: number | string) {
  return entity<LearningCourse>(
    await instance.get(`/learning/courses/${courseId}`),
  );
}
export async function getPlayback(lessonId: string) {
  return entity<Playback>(await instance.get(`/lessons/${lessonId}/playback`));
}
export async function getLesson(lessonId: string) { return entity<LearningLesson>(await instance.get(`/lessons/${lessonId}`)) }
export async function updateProgress(lessonId: string, watchedSeconds: number) {
  return entity<Playback>(
    await instance.patch(`/lessons/${lessonId}/progress`, {
      watchedSeconds: Math.max(0, Math.floor(watchedSeconds)),
    }),
  );
}
export async function completeLesson(lessonId: string) {
  return entity<CourseProgress>(
    await instance.post(`/lessons/${lessonId}/complete`),
  );
}
export async function getLessonResources(lessonId: string) {
  return entity<LessonResource[]>(
    await instance.get(`/lessons/${lessonId}/resources`),
  );
}
export async function getResourceDownload(resourceId: string) {
  return entity<string>(
    await instance.get(`/resources/${resourceId}/download`),
  );
}
export async function getCourseProgress(courseId: number | string) {
  return entity<CourseProgress>(
    await instance.get(`/courses/${courseId}/progress`),
  );
}
export async function createCertificate(courseId: number | string) {
  return entity<Certificate>(
    await instance.post(`/courses/${courseId}/certificate`),
  );
}
export async function getCertificate(certificateId: string) {
  return entity<Certificate>(
    await instance.get(`/certificates/${certificateId}`),
  );
}
