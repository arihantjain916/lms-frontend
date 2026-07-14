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
  createdAt?: string;
};

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
