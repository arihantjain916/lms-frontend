"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Clock, GraduationCap, Search, Star, Users } from "lucide-react"
import instance from "@/helper/axios"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Course = {
  id: string | number
  title: string
  description?: string
  image?: string
  level?: string
  duration?: string
  lectures?: number
  price?: number | string
  discountPrice?: number | string
  avgRating?: number
  totalRating?: number
  students?: number
  isFeatured?: boolean
  category?: { id?: string | number; name?: string } | string
  user?: { name?: string }
  instructor?: { name?: string }
}

type Category = { id: string | number; name: string }

function unwrapList<T>(response: any): T[] {
  const value = response?.data ?? response
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.content)) return value.content
  if (Array.isArray(value?.items)) return value.items
  return []
}

function formatPrice(value?: number | string) {
  if (value === undefined || value === null || value === "") return "Free"
  if (typeof value === "string" && /[^0-9.]/.test(value)) return value
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value))
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState("popular")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadCourses = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const response: any = await instance.get("/course")
      setCourses(unwrapList<Course>(response))
    } catch {
      setError("We could not load the course catalog. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCourses()
    instance
      .get("/category")
      .then((response: any) => setCategories(unwrapList<Category>(response)))
      .catch(() => setCategories([]))
  }, [loadCourses])

  const visibleCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = courses.filter((course) => {
      const categoryValue = typeof course.category === "string" ? course.category : String(course.category?.id ?? "")
      const categoryName = typeof course.category === "string" ? course.category : course.category?.name ?? ""
      const matchesCategory = category === "all" || categoryValue === category || categoryName === category
      const matchesQuery =
        !normalizedQuery ||
        course.title.toLowerCase().includes(normalizedQuery) ||
        course.description?.toLowerCase().includes(normalizedQuery) ||
        categoryName.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })

    return [...filtered].sort((a, b) => {
      if (sort === "rating") return (b.avgRating ?? 0) - (a.avgRating ?? 0)
      if (sort === "newest") return Number(b.id) - Number(a.id)
      if (sort === "price-low") return Number(a.discountPrice ?? a.price ?? 0) - Number(b.discountPrice ?? b.price ?? 0)
      return (b.students ?? b.totalRating ?? 0) - (a.students ?? a.totalRating ?? 0)
    })
  }, [category, courses, query, sort])

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-b from-blue-50 to-background py-14">
        <div className="container">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Course catalog</Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">Find the right course for your next goal</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore expert-led courses, compare learning paths, and continue learning at your own pace.
          </p>
          <div className="mt-8 grid gap-3 rounded-xl border bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses or skills" className="pl-9" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most popular</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: low to high</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">All courses</h2>
            {!loading && !error && <p className="mt-1 text-sm text-muted-foreground">{visibleCourses.length} course{visibleCourses.length === 1 ? "" : "s"} found</p>}
          </div>
        </div>

        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading courses">
            {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-[390px] animate-pulse rounded-xl border bg-muted/50" />)}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
            <h2 className="text-xl font-semibold">Course catalog unavailable</h2>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <Button onClick={loadCourses} className="mt-5">Try again</Button>
          </div>
        )}

        {!loading && !error && visibleCourses.length === 0 && (
          <div className="rounded-xl border bg-muted/20 p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-blue-600" />
            <h2 className="mt-4 text-xl font-semibold">No courses found</h2>
            <p className="mt-2 text-muted-foreground">Try a different search or category.</p>
            <Button variant="outline" className="mt-5" onClick={() => { setQuery(""); setCategory("all") }}>Clear filters</Button>
          </div>
        )}

        {!loading && !error && visibleCourses.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleCourses.map((course) => {
              const instructor = course.instructor?.name ?? course.user?.name ?? "EduPortal instructor"
              const categoryName = typeof course.category === "string" ? course.category : course.category?.name
              return (
                <Card key={course.id} className="group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                  <Link href={`/courses/${course.id}`} className="relative block h-48 overflow-hidden bg-blue-50">
                    <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover transition duration-300 group-hover:scale-105" />
                    {course.isFeatured && <Badge className="absolute left-4 top-4 bg-blue-600">Featured</Badge>}
                  </Link>
                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Badge variant="outline">{categoryName || course.level || "Course"}</Badge>
                      <span className="flex items-center gap-1 text-sm font-medium"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{Number(course.avgRating ?? 0).toFixed(1)}</span>
                    </div>
                    <Link href={`/courses/${course.id}`}><h3 className="line-clamp-2 text-xl font-semibold group-hover:text-blue-700">{course.title}</h3></Link>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.description || `Learn with ${instructor}.`}</p>
                    <p className="mt-3 text-sm text-muted-foreground">By {instructor}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration || "Self-paced"}</span>
                      <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{course.level || "All levels"}</span>
                      {course.students !== undefined && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.students.toLocaleString()}</span>}
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t pt-5">
                      <span className="text-lg font-bold text-blue-700">{formatPrice(course.discountPrice ?? course.price)}</span>
                      <Button asChild size="sm"><Link href={`/courses/${course.id}`}>View course</Link></Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
