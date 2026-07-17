import instance from "@/helper/axios";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  courseCount: number;
  isFeatured: boolean;
};

export type AdminCourse = {
  id: number;
  title: string;
  slug: string;
  description: string;
  category?: { id: string; name: string };
  user?: { id: string; name: string; username: string };
  isFeatured: boolean;
  level: string;
  avgRating?: number;
  totalRating?: number;
  price?: number | null;
  createdAt?: string;
};

export type AdminPricingPlan = {
  id: string;
  courseIds: number[];
  title: string;
  description: string;
  currency: string;
  price: number;
  planType: "MONTHLY" | "QUARTERLY" | "YEARLY" | "LIFETIME";
  createdAt?: string;
  updatedAt?: string;
};

export type AdminPricingPlanInput = Pick<
  AdminPricingPlan,
  "title" | "description" | "currency" | "price" | "planType"
>;

export type AdminBlog = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  status: string;
  Category?: string;
  category?: string;
  read_time: string;
  tag: string;
  imageUrl: string;
  isFeatured?: boolean;
  createdAt?: string;
  user?: { name: string };
  blogMeta?: {
    featured: boolean;
    followLinks: boolean;
    indexable: boolean;
    seoTitle: string;
    seoDescription: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImageUrl?: string;
    views?: number;
    likes?: number;
    shares?: number;
  };
};

export type AdminPage<T> = {
  data: T[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type AdminProgram = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string;
  durationWeeks?: number;
  startDate?: string;
  price?: number;
  currency?: string;
  isActive: boolean;
  createdAt?: string;
};

export type AdminProgramApplication = {
  id: string;
  programId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
};

export type AdminWebinar = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string;
  scheduledAt: string;
  durationMinutes?: number;
  status: string;
  categoryId?: string;
  categoryName?: string;
  host?: { id: string; name: string; email?: string };
  registrationsCount: number;
  hasRecording: boolean;
};

export type AdminWebinarRegistration = {
  id: string;
  registeredAt: string;
  webinar: AdminWebinar;
};

export type AdminWebinarResource = {
  id: string;
  title: string;
  type?: string;
  createdAt?: string;
};

export type AdminHostApplication = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  user?: { id: string; name: string; email?: string };
  createdAt?: string;
};

export type AdminUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  avatar?: string;
  isVerified: boolean;
  isBanned: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
};

export type AdminContact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  department: "GENERAL" | "TECHNICAL" | "SALES" | "BILLING";
  phone?: string;
};

export type AdminOrder = {
  id: string;
  courseId?: number;
  courseTitle?: string;
  planId?: string;
  planTitle?: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED";
  paymentReference?: string;
  createdAt?: string;
};

export type AdminEnrollment = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: number;
  courseTitle: string;
  enrolledAt: string;
};

export type AdminCertificate = {
  id: string;
  certificateNumber: string;
  userName: string;
  courseTitle: string;
  issuedAt: string;
};

type AdminContentUser = { id: string; name: string; email?: string };

export type AdminRating = {
  id: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: AdminContentUser;
};

export type AdminBlogComment = {
  id: string;
  comment: string;
  createdAt?: string;
  replies: AdminBlogComment[];
  user?: AdminContentUser;
};

export type AdminDashboard = {
  users: {
    total: number;
    students: number;
    instructors: number;
    admins: number;
  };
  orders: {
    total: number;
    paid: number;
    pending: number;
    failed: number;
    revenue: number;
  };
  content: {
    courses: number;
    programs: number;
    webinars: number;
    tutorials: number;
    blogs: number;
  };
  engagement: {
    enrollments: number;
    certificates: number;
    ratings: number;
    blogComments: number;
    contactSubmissions: number;
  };
  support: {
    openTickets: number;
    closedTickets: number;
    awaitingReply: number;
    conversations: number;
    messages: number;
  };
};

export type AdminTutorial = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
  categoryId?: string;
  categoryName?: string;
  author?: { id: string; username: string; name: string };
  createdAt?: string;
  updatedAt?: string;
};

function toPage<T>(response: any): AdminPage<T> {
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

function data<T>(response: any): T {
  if (response?.status === false)
    throw new Error(response.message || "Request failed");
  return response?.data as T;
}

export async function getAdminCategories() {
  const response: any = await instance.get("/category");
  if (response?.status === false) throw new Error(response.message);
  return (
    Array.isArray(response?.data) ? response.data : []
  ) as AdminCategory[];
}

export async function saveAdminCategory(input: {
  id?: string;
  name: string;
  description: string;
  isFeatured: boolean;
}) {
  const response: any = input.id
    ? await instance.put("/category/update", input)
    : await instance.post("/category/add", input);
  return message(response);
}

export async function deleteAdminCategory(id: string) {
  return message(await instance.delete(`/category/delete/${id}`));
}

export async function getAdminCourses(page = 1, size = 10) {
  return toPage<AdminCourse>(
    await instance.get("/course/all", { params: { page, size } }),
  );
}

export async function saveAdminCourse(input: {
  id?: number;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  isFeatured: boolean;
  level: string;
  pricingPlanId?: string;
  price?: number;
  currency?: string;
  planType?: AdminPricingPlan["planType"];
}) {
  if (input.title.length > 255)
    throw new Error("Course title must be 255 characters or fewer.");
  if (input.slug.length > 255)
    throw new Error("Course slug must be 255 characters or fewer.");

  const response: any = input.id
    ? await instance.put("/course/update", input)
    : await instance.post("/course/add", input);
  return message(response);
}

export async function deleteAdminCourse(id: number) {
  return message(await instance.delete(`/course/delete/${id}`));
}

export async function getAdminPricingPlans(courseId: number) {
  return data<AdminPricingPlan[]>(
    await instance.get(`/pricing/course/${courseId}`),
  );
}

export async function getPricingPlanCatalog() {
  return data<AdminPricingPlan[]>(await instance.get("/pricing"));
}

export async function attachPricingPlan(planId: string, courseId: number) {
  return message(await instance.post(`/pricing/${planId}/courses/${courseId}`));
}

export async function detachPricingPlan(planId: string, courseId: number) {
  return message(
    await instance.delete(`/pricing/${planId}/courses/${courseId}`),
  );
}

export async function createPricingPlan(
  courseId: number,
  input: AdminPricingPlanInput,
) {
  return message(await instance.post(`/pricing/course/${courseId}`, input));
}

export async function updatePricingPlan(
  planId: string,
  input: AdminPricingPlanInput,
) {
  return message(await instance.put(`/pricing/${planId}`, input));
}

export async function deleteAdminPricingPlan(id: string) {
  return message(await instance.delete(`/pricing/${id}`));
}

export async function getAdminBlogs(page = 1, size = 10) {
  return toPage<AdminBlog>(
    await instance.get("/blog", { params: { page, size } }),
  );
}

export type AdminBlogInput = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  read_time: string;
  category: string;
  tag: string;
  status: string;
  image_url: string;
  blogMeta: {
    seoTitle: string;
    seoDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogImageUrl: string;
    views: number;
    likes: number;
    shares: number;
    indexable: boolean;
    followLinks: boolean;
    featured: boolean;
  };
};

export async function saveAdminBlog(input: AdminBlogInput) {
  const response: any = input.id
    ? await instance.put("/blog/update", input)
    : await instance.post("/blog/add", input);
  return message(response);
}

export async function deleteAdminBlog(id: string) {
  return message(await instance.delete(`/blog/delete/${id}`));
}

export type AdminProgramInput = {
  id?: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  durationWeeks?: number;
  startDate?: string;
  price?: number;
  currency?: string;
  isActive: boolean;
};

export async function getAdminPrograms(page = 1, limit = 10) {
  return toPage<AdminProgram>(
    await instance.get("/programs", { params: { page, limit } }),
  );
}

export async function saveAdminProgram(input: AdminProgramInput) {
  const { id, ...payload } = input;
  const response: any = id
    ? await instance.put(`/programs/${id}`, payload)
    : await instance.post("/programs", payload);
  return message(response);
}

export async function deleteAdminProgram(id: string) {
  return message(await instance.delete(`/programs/${id}`));
}

export async function getAdminProgramApplications(
  programId: string,
  page = 1,
  limit = 10,
) {
  return toPage<AdminProgramApplication>(
    await instance.get(`/programs/${programId}/applications`, {
      params: { page, limit },
    }),
  );
}

export async function updateAdminProgramApplication(
  applicationId: string,
  status: AdminProgramApplication["status"],
) {
  return message(
    await instance.patch(`/programs/applications/${applicationId}`, { status }),
  );
}

export type AdminWebinarInput = {
  id?: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  meetingUrl?: string;
  recordingUrl?: string;
  scheduledAt: string;
  durationMinutes?: number;
  categoryId?: string;
  hostId?: string;
};

export async function getAdminWebinars(
  page = 1,
  limit = 10,
  filters: { status?: "upcoming" | "past"; q?: string; category?: string } = {},
) {
  return toPage<AdminWebinar>(
    await instance.get("/webinars", {
      params: { page, limit, ...filters, q: filters.q || "%" },
    }),
  );
}

export async function saveAdminWebinar(input: AdminWebinarInput) {
  const { id, ...payload } = input;
  const response: any = id
    ? await instance.put(`/webinars/${id}`, payload)
    : await instance.post("/webinars", payload);
  return message(response);
}

export async function deleteAdminWebinar(id: string) {
  return message(await instance.delete(`/webinars/${id}`));
}

export async function getAdminWebinarRegistrations(
  webinarId: string,
  page = 1,
  limit = 10,
) {
  return toPage<AdminWebinarRegistration>(
    await instance.get(`/webinars/${webinarId}/registrations`, {
      params: { page, limit },
    }),
  );
}

export async function getAdminWebinarResources(webinarId: string) {
  return data<AdminWebinarResource[]>(
    await instance.get(`/webinars/${webinarId}/resources`),
  );
}

export async function addAdminWebinarResource(
  webinarId: string,
  input: { title: string; url: string; type?: string },
) {
  return message(
    await instance.post(`/webinars/${webinarId}/resources`, input),
  );
}

export async function deleteAdminWebinarResource(
  webinarId: string,
  resourceId: string,
) {
  return message(
    await instance.delete(`/webinars/${webinarId}/resources/${resourceId}`),
  );
}

export async function getAdminHostApplications(page = 1, limit = 10) {
  return toPage<AdminHostApplication>(
    await instance.get("/webinar-host-applications", {
      params: { page, limit },
    }),
  );
}

export async function updateAdminHostApplication(
  applicationId: string,
  status: AdminHostApplication["status"],
) {
  return message(
    await instance.patch(`/webinar-host-applications/${applicationId}`, {
      status,
    }),
  );
}

export async function getAdminUsers(
  page = 1,
  limit = 10,
  filters: { q?: string; role?: AdminUser["role"] } = {},
) {
  return toPage<AdminUser>(
    await instance.get("/admin/users", {
      params: { page, limit, ...filters, q: filters.q || "%" },
    }),
  );
}

export async function getAdminUser(id: string) {
  return data<AdminUser>(await instance.get(`/admin/users/${id}`));
}

export async function updateAdminUserRole(id: string, role: AdminUser["role"]) {
  return message(await instance.patch(`/admin/users/${id}/role`, { role }));
}

export async function updateAdminUserStatus(
  id: string,
  status: { isActive?: boolean; isBanned?: boolean },
) {
  return message(await instance.patch(`/admin/users/${id}/status`, status));
}

export async function deleteAdminUser(id: string) {
  return message(await instance.delete(`/admin/users/${id}`));
}

export async function getAdminContacts(
  page = 1,
  limit = 10,
  department?: AdminContact["department"],
) {
  return toPage<AdminContact>(
    await instance.get("/admin/contact", {
      params: { page, limit, department },
    }),
  );
}

export async function getAdminContact(id: string) {
  return data<AdminContact>(await instance.get(`/admin/contact/${id}`));
}

export async function deleteAdminContact(id: string) {
  return message(await instance.delete(`/admin/contact/${id}`));
}

export async function getAdminOrders(
  page = 1,
  limit = 10,
  status?: AdminOrder["status"],
) {
  return toPage<AdminOrder>(
    await instance.get("/admin/orders", { params: { page, limit, status } }),
  );
}

export async function confirmAdminOrder(
  orderId: string,
  paymentReference: string,
) {
  return message(
    await instance.post(`/admin/orders/${orderId}/confirm`, {
      paymentReference,
    }),
  );
}

export async function getAdminEnrollments(
  page = 1,
  limit = 10,
  courseId?: number,
) {
  return toPage<AdminEnrollment>(
    await instance.get("/admin/enrollments", {
      params: { page, limit, courseId },
    }),
  );
}

export async function getAdminCertificates(page = 1, limit = 10) {
  return toPage<AdminCertificate>(
    await instance.get("/admin/certificates", { params: { page, limit } }),
  );
}

export async function revokeAdminCertificate(id: string) {
  return message(await instance.delete(`/admin/certificates/${id}`));
}

export async function getAdminRatings(page = 1, limit = 10, courseId?: number) {
  return toPage<AdminRating>(
    await instance.get("/admin/ratings", { params: { page, limit, courseId } }),
  );
}

export async function deleteAdminRating(id: string) {
  return message(await instance.delete(`/admin/ratings/${id}`));
}

export async function deleteAdminReview(id: string) {
  return message(await instance.delete(`/admin/reviews/${id}`));
}

export async function getAdminBlogComments(page = 1, limit = 10) {
  return toPage<AdminBlogComment>(
    await instance.get("/admin/blog-comments", { params: { page, limit } }),
  );
}

export async function deleteAdminBlogComment(id: string) {
  return message(await instance.delete(`/admin/blog-comments/${id}`));
}

export async function getAdminDashboard() {
  return data<AdminDashboard>(await instance.get("/admin/dashboard"));
}

export type AdminTutorialInput = {
  id?: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  level?: AdminTutorial["level"];
  categoryId?: string;
};

export async function getAdminTutorials(
  page = 1,
  limit = 10,
  filters: { q?: string; category?: string } = {},
) {
  return toPage<AdminTutorial>(
    await instance.get("/tutorials", {
      params: { page, limit, ...filters, q: filters.q || "%" },
    }),
  );
}

export async function saveAdminTutorial(input: AdminTutorialInput) {
  const { id, ...payload } = input;
  return message(
    id
      ? await instance.put(`/tutorials/${id}`, payload)
      : await instance.post("/tutorials", payload),
  );
}

export async function deleteAdminTutorial(id: string) {
  return message(await instance.delete(`/tutorials/${id}`));
}
