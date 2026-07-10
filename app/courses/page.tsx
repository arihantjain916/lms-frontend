"use client"

import { useCallback, useEffect, useState } from "react"
import { BookOpen, Search, SlidersHorizontal } from "lucide-react"
import instance from "@/helper/axios"
import { Course, getCourses, getFeaturedCourses } from "@/lib/course-api"
import CourseCard from "./course-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Category = { id: string; name: string }

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [categoryId, setCategoryId] = useState("all")
  const [level, setLevel] = useState("all")
  const [price, setPrice] = useState("all")
  const [rating, setRating] = useState("all")
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const timer = window.setTimeout(() => { setDebouncedQuery(query.trim()); setPage(1) }, 350)
    return () => window.clearTimeout(timer)
  }, [query])

  const loadCourses = useCallback(async () => {
    setLoading(true); setError("")
    try {
      const result = await getCourses({
        q: debouncedQuery || undefined,
        categoryId: categoryId === "all" ? undefined : categoryId,
        level: level === "all" ? undefined : level,
        price: price === "all" ? undefined : price,
        rating: rating === "all" ? undefined : Number(rating),
        featured: featuredOnly || undefined,
        sort,
        page,
        limit: 12,
      })
      setCourses(result.data); setTotalPages(result.totalPages); setTotalElements(result.totalElements)
    } catch (requestError: any) {
      setCourses([]); setError(requestError?.message || "We could not load the course catalog.")
    } finally { setLoading(false) }
  }, [categoryId, debouncedQuery, featuredOnly, level, page, price, rating, sort])

  useEffect(() => { loadCourses() }, [loadCourses])
  useEffect(() => {
    getFeaturedCourses(3).then(setFeaturedCourses).catch(() => setFeaturedCourses([]))
    instance.get("/category").then((response: any) => setCategories(Array.isArray(response?.data) ? response.data : [])).catch(() => setCategories([]))
  }, [])

  function resetFilters() {
    setQuery(""); setDebouncedQuery(""); setCategoryId("all"); setLevel("all"); setPrice("all"); setRating("all"); setFeaturedOnly(false); setSort("newest"); setPage(1)
  }

  const filtersActive = Boolean(debouncedQuery || categoryId !== "all" || level !== "all" || price !== "all" || rating !== "all" || featuredOnly)

  return <main className="min-h-screen bg-background">
    <section className="border-b bg-gradient-to-b from-blue-50 to-background py-14"><div className="container"><Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Course catalog</Badge><h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">Find the right course for your next goal</h1><p className="mt-4 max-w-2xl text-lg text-muted-foreground">Search the full catalog and filter by category, level, price, rating, or featured status.</p>
      <div className="mt-8 rounded-xl border bg-white p-4 shadow-sm"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses or skills" className="pl-9" /></div><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Select value={categoryId} onValueChange={(value) => { setCategoryId(value); setPage(1) }}><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{categories.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}</SelectContent></Select>
        <Select value={level} onValueChange={(value) => { setLevel(value); setPage(1) }}><SelectTrigger><SelectValue placeholder="Level" /></SelectTrigger><SelectContent><SelectItem value="all">All levels</SelectItem><SelectItem value="BEGINNER">Beginner</SelectItem><SelectItem value="INTERMEDIATE">Intermediate</SelectItem><SelectItem value="ADVANCED">Advanced</SelectItem><SelectItem value="ALL_LEVELS">All levels courses</SelectItem></SelectContent></Select>
        <Select value={price} onValueChange={(value) => { setPrice(value); setPage(1) }}><SelectTrigger><SelectValue placeholder="Price" /></SelectTrigger><SelectContent><SelectItem value="all">Any price</SelectItem><SelectItem value="free">Free</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="50">Under $50</SelectItem><SelectItem value="100">Under $100</SelectItem></SelectContent></Select>
        <Select value={rating} onValueChange={(value) => { setRating(value); setPage(1) }}><SelectTrigger><SelectValue placeholder="Rating" /></SelectTrigger><SelectContent><SelectItem value="all">Any rating</SelectItem><SelectItem value="4">4.0 and above</SelectItem><SelectItem value="3">3.0 and above</SelectItem><SelectItem value="2">2.0 and above</SelectItem></SelectContent></Select>
        <Select value={sort} onValueChange={(value) => { setSort(value); setPage(1) }}><SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger><SelectContent><SelectItem value="newest">Newest</SelectItem><SelectItem value="oldest">Oldest</SelectItem><SelectItem value="title">Title A–Z</SelectItem><SelectItem value="title-desc">Title Z–A</SelectItem></SelectContent></Select>
      </div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><Label className="flex cursor-pointer items-center gap-2"><Checkbox checked={featuredOnly} onCheckedChange={(checked) => { setFeaturedOnly(checked === true); setPage(1) }} />Featured courses only</Label>{filtersActive && <Button variant="ghost" size="sm" onClick={resetFilters}>Clear filters</Button>}</div></div>
    </div></section>

    {!filtersActive && page === 1 && featuredCourses.length > 0 && <section className="container pt-12"><div className="mb-6 flex items-center gap-2"><SlidersHorizontal className="h-5 w-5 text-blue-600" /><h2 className="text-2xl font-bold">Featured courses</h2></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{featuredCourses.map((course) => <CourseCard key={course.id} course={course} />)}</div></section>}

    <section className="container py-12"><div className="mb-7"><h2 className="text-2xl font-bold">All courses</h2>{!loading && !error && <p className="mt-1 text-sm text-muted-foreground">{totalElements} course{totalElements === 1 ? "" : "s"} found</p>}</div>
      {loading && <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading courses">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-[360px] animate-pulse rounded-xl border bg-muted/50" />)}</div>}
      {!loading && error && <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center"><h2 className="text-xl font-semibold">Course catalog unavailable</h2><p className="mt-2 text-muted-foreground">{error}</p><Button onClick={loadCourses} className="mt-5">Try again</Button></div>}
      {!loading && !error && courses.length === 0 && <div className="rounded-xl border bg-muted/20 p-12 text-center"><BookOpen className="mx-auto h-10 w-10 text-blue-600" /><h2 className="mt-4 text-xl font-semibold">No courses found</h2><p className="mt-2 text-muted-foreground">Try changing or clearing your filters.</p><Button variant="outline" className="mt-5" onClick={resetFilters}>Clear filters</Button></div>}
      {!loading && !error && courses.length > 0 && <><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{courses.map((course) => <CourseCard key={course.id} course={course} />)}</div><div className="mt-10 flex items-center justify-center gap-3"><Button variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span className="text-sm text-muted-foreground">Page {page} of {Math.max(totalPages, 1)}</span><Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>Next</Button></div></>}
    </section>
  </main>
}
