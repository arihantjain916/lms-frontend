import instance from "@/helper/axios";

export type SearchItem = {
  type: "course" | "tutorial" | "webinar" | "blog";
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  level?: string;
};
export type Facet = { id: string; name: string; count: number };
export type SearchResponse = {
  courses: SearchItem[];
  tutorials: SearchItem[];
  webinars: SearchItem[];
  blogs: SearchItem[];
  totals: Record<string, number>;
  page: number;
  limit: number;
};
export type SearchFacets = {
  types: Record<string, number>;
  categories: Facet[];
  levels: Facet[];
};
export type Webinar = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "upcoming" | "past";
  categoryId?: string;
  categoryName?: string;
  host: { id: string; username: string; name: string };
  registrationCount: number;
  recordingAvailable: boolean;
};

function entity<T>(response: any): T {
  if (!response?.status || response?.data == null)
    throw new Error(response?.message || "Request failed");
  return response.data as T;
}

export async function searchCatalog(params: {
  q?: string;
  types?: string;
  categories?: string;
  levels?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  return entity<SearchResponse>(await instance.get("/search", { params }));
}

export async function getSearchFacets(q?: string) {
  return entity<SearchFacets>(
    await instance.get("/search/facets", { params: { q } }),
  );
}

export async function getWebinars(
  params: {
    status?: string;
    q?: string;
    category?: string;
    page?: number;
    limit?: number;
  } = {},
) {
  const response: any = await instance.get("/webinars", { params });
  if (response?.status === false)
    throw new Error(response?.message || "Unable to load webinars");
  return {
    data: (response?.data || []) as Webinar[],
    totalElements: Number(response?.totalElements || 0),
    totalPages: Number(response?.totalPages || 0),
  };
}

export async function registerForWebinar(id: string) {
  const response: any = await instance.post(`/webinars/${id}/registrations`);
  if (!response?.status)
    throw new Error(response?.message || "Unable to register");
}

export type WebinarRegistration = { id: string; registeredAt: string; webinar: Webinar }
export type WebinarResource = { id: string; title: string; type?: string; createdAt?: string }

export async function getWebinar(slug: string) { return entity<Webinar>(await instance.get(`/webinars/${slug}`)) }
export async function unregisterFromWebinar(id: string) { const response: any = await instance.delete(`/webinars/${id}/registrations`); if (!response?.status) throw new Error(response?.message || "Unable to cancel registration") }
export async function getMyWebinarRegistrations(page = 1, limit = 50) { const response: any = await instance.get("/users/me/webinar-registrations", { params: { page, limit } }); return { data: (response?.data || []) as WebinarRegistration[], totalElements: Number(response?.totalElements || 0) } }
export async function getWebinarRecording(id: string) { return entity<string>(await instance.get(`/webinars/${id}/recording`)) }
export async function getWebinarResources(id: string) { return entity<WebinarResource[]>(await instance.get(`/webinars/${id}/resources`)) }
export async function applyToHostWebinar(input: { name: string; email: string; topic: string; message: string }) { const response: any = await instance.post("/webinar-host-applications", input); if (!response?.status) throw new Error(response?.message || "Unable to submit application") }
