import instance from "@/helper/axios"

export type Tutorial = { id: string; title: string; slug: string; description?: string; content?: string; videoUrl?: string; thumbnailUrl?: string; level?: string; categoryId?: string; categoryName?: string; author: { id: string; username: string; name: string }; createdAt?: string }
export type Program = { id: string; title: string; slug: string; description?: string; thumbnailUrl?: string; durationWeeks?: number; startDate?: string; price?: number; currency?: string; isActive: boolean; createdAt?: string }
export type Page<T> = { data: T[]; currentPage: number; size: number; totalElements: number; totalPages: number }

function page<T>(response: any): Page<T> {
  if (response?.status === false) throw new Error(response?.message || "Request failed")
  return { data: Array.isArray(response?.data) ? response.data : [], currentPage: Number(response?.currentPage || 1), size: Number(response?.size || 10), totalElements: Number(response?.totalElements || 0), totalPages: Number(response?.totalPages || 0) }
}

export async function getTutorials(params: { q?: string; category?: string; page?: number; limit?: number } = {}) {
  return page<Tutorial>(await instance.get("/tutorials", { params }))
}

export async function getPrograms(pageNumber = 1, limit = 50) {
  return page<Program>(await instance.get("/programs", { params: { page: pageNumber, limit } }))
}

export type CourseQuestion = { id: string; content: string; repliesCount?: number; helpfulCount?: number; createdAt?: string; user?: { id: string; name: string; username: string } }
export type QuestionReply = { id: string; content: string; createdAt?: string; user?: { id: string; name: string; username: string } }
export async function getCourseQuestions(courseId: string | number, pageNumber = 1, limit = 20) { return page<CourseQuestion>(await instance.get(`/courses/${courseId}/questions`, { params: { page: pageNumber, limit } })) }
export async function askCourseQuestion(courseId: string | number, content: string) { return instance.post(`/courses/${courseId}/questions`, { content }) }
export async function markQuestionHelpful(questionId: string) { return instance.post(`/questions/${questionId}/helpful`) }
export async function unmarkQuestionHelpful(questionId: string) { return instance.delete(`/questions/${questionId}/helpful`) }
export async function getQuestionReplies(questionId: string) { const response: any = await instance.get(`/questions/${questionId}/replies`); if (!response?.status) throw new Error(response?.message || "Unable to load replies"); return (response.data || []) as QuestionReply[] }
export async function addQuestionReply(questionId: string, content: string) { const response: any = await instance.post(`/questions/${questionId}/replies`, { content }); if (!response?.status) throw new Error(response?.message || "Unable to add reply"); return response.data as QuestionReply }
export async function updateCourseQuestion(questionId: string, content: string) { const response: any = await instance.patch(`/questions/${questionId}`, { content }); if (!response?.status) throw new Error(response?.message || "Unable to update question"); return response.data as CourseQuestion }
export async function deleteCourseQuestion(questionId: string) { const response: any = await instance.delete(`/questions/${questionId}`); if (!response?.status) throw new Error(response?.message || "Unable to delete question") }
export async function trackCourseView(courseId: string | number) { await instance.get(`/course/${courseId}/view`) }

export async function getSearchSuggestions(q: string) { const response: any = await instance.get("/search/suggestions", { params: { q } }); return (response?.data || []) as { type: string; title: string; slug: string }[] }
