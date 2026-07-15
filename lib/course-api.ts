import instance from "@/helper/axios";

export type CourseUser = { id: string; username: string; name: string };
export type CourseCategory = { id: string; name: string };
export type CatalogCategory = CourseCategory & {
  slug: string;
  description?: string;
  courseCount?: number;
  isFeatured?: boolean;
};

export type Course = {
  id: number;
  slug?: string;
  title: string;
  description?: string;
  price?: number | null;
  user?: CourseUser;
  avgRating?: number | null;
  totalRating?: number | null;
  category?: CourseCategory;
  upvote?: number | null;
  downvote?: number | null;
  isFeatured?: boolean;
  level?: string;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  isEnrolled?: boolean;
};

export type Lesson = {
  id: string;
  time?: string;
  description?: string;
  title: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Instructor = {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  totalCourses: number;
};
export type CourseReview = {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
  user?: CourseUser;
};

export type PageResult<T> = {
  data: T[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
export type CourseFilters = {
  q?: string;
  categoryId?: string;
  subcategoryId?: string;
  level?: string;
  price?: string;
  rating?: number;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
};

function pageResult<T>(response: any): PageResult<T> {
  return {
    data: Array.isArray(response?.data) ? response.data : [],
    currentPage: Number(response?.currentPage ?? 1),
    size: Number(response?.size ?? 10),
    totalElements: Number(response?.totalElements ?? 0),
    totalPages: Number(response?.totalPages ?? 0),
  };
}

function entity<T>(response: any): T {
  if (!response?.status || response?.data == null)
    throw new Error(response?.message || "Request failed");
  return response.data as T;
}

export async function getCatalogCategories() {
  const response: any = await instance.get("/category");
  return entity<CatalogCategory[]>(response);
}

export async function getCourses(filters: CourseFilters = {}) {
  const response: any = await instance.get("/courses", { params: filters });
  if (response?.status === false)
    throw new Error(response?.message || "Unable to load courses");
  return pageResult<Course>(response);
}

export async function getFeaturedCourses(limit = 3) {
  const response: any = await instance.get("/courses/featured", {
    params: { limit },
  });
  return entity<Course[]>(response);
}

export async function getCourse(courseId: string | number) {
  const response: any = await instance.get(`/courses/${courseId}`);
  return entity<Course>(response);
}

export async function getCourseCurriculum(
  courseId: string | number,
  page = 1,
  limit = 50,
) {
  const response: any = await instance.get(`/courses/${courseId}/curriculum`, {
    params: { page, limit },
  });
  if (response?.status === false)
    throw new Error(response?.message || "Unable to load curriculum");
  return pageResult<Lesson>(response);
}

export async function getCourseInstructor(courseId: string | number) {
  const response: any = await instance.get(`/courses/${courseId}/instructor`);
  return entity<Instructor>(response);
}

export async function getCourseReviews(
  courseId: string | number,
  page = 1,
  limit = 10,
) {
  const response: any = await instance.get(`/courses/${courseId}/reviews`, {
    params: { page, limit },
  });
  if (response?.status === false)
    throw new Error(response?.message || "Unable to load reviews");
  return pageResult<CourseReview>(response);
}

export async function addCourseReview(
  courseId: string | number,
  rating: number,
  comment: string,
) {
  const response: any = await instance.post(`/courses/${courseId}/reviews`, {
    rating,
    comment,
  });
  return entity<CourseReview>(response);
}

export async function getRelatedCourses(courseId: string | number, limit = 4) {
  const response: any = await instance.get(`/courses/${courseId}/related`, {
    params: { limit },
  });
  return entity<Course[]>(response);
}
