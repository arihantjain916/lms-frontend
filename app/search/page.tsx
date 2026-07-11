"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Search, Filter, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSearchFacets, searchCatalog, type SearchFacets, type SearchItem, type SearchResponse } from "@/lib/catalog-api"

const emptyResults: SearchResponse = { courses: [], tutorials: [], webinars: [], blogs: [], totals: {}, page: 1, limit: 12 }
const paths = { course: "/courses", tutorial: "/tutorials", webinar: "/webinars", blog: "/blog" }

export default function SearchPage() {
  const initialQuery = useSearchParams().get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery)
  const [sort, setSort] = useState("newest")
  const [categories, setCategories] = useState<string[]>([])
  const [levels, setLevels] = useState<string[]>([])
  const [results, setResults] = useState(emptyResults)
  const [facets, setFacets] = useState<SearchFacets>({ types: {}, categories: [], levels: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setError("")
    try {
      const [items, available] = await Promise.all([
        searchCatalog({ q: submittedQuery || undefined, categories: categories.join(",") || undefined, levels: levels.join(",") || undefined, sort, limit: 24 }),
        getSearchFacets(submittedQuery || undefined),
      ])
      setResults(items); setFacets(available)
    } catch (e: any) { setError(e?.message || "Unable to load search results") }
    finally { setLoading(false) }
  }, [submittedQuery, categories, levels, sort])

  useEffect(() => { void load() }, [load])
  const toggle = (value: string, values: string[], setter: (next: string[]) => void) => setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value])
  const submit = (event: React.FormEvent) => { event.preventDefault(); setSubmittedQuery(query.trim()) }
  const items = [...results.courses, ...results.tutorials, ...results.webinars, ...results.blogs]
  const total = Object.values(results.totals).reduce((sum, count) => sum + count, 0)

  return <main className="container py-8">
    <h1 className="mb-6 text-3xl font-bold">Search Results</h1>
    <form onSubmit={submit} className="relative mb-7">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input value={query} onChange={(e) => setQuery(e.target.value)} className="py-6 pl-10 pr-28 text-lg" placeholder="Search courses, webinars and articles..." />
      <Button className="absolute right-1 top-1/2 -translate-y-1/2">Search</Button>
    </form>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-muted-foreground">{total} result{total === 1 ? "" : "s"}{submittedQuery && <> for <strong className="text-foreground">“{submittedQuery}”</strong></>}</p>
      <div className="flex gap-2">
        <Select value={sort} onValueChange={setSort}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest</SelectItem><SelectItem value="oldest">Oldest</SelectItem><SelectItem value="title">Title A–Z</SelectItem><SelectItem value="title-desc">Title Z–A</SelectItem></SelectContent></Select>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}><Filter className="mr-2 h-4 w-4" />Filters</Button>
      </div>
    </div>
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className={`${showFilters ? "block" : "hidden"} space-y-6 rounded-lg border p-4 lg:block`}>
        <div><h2 className="mb-3 font-semibold">Categories</h2>{facets.categories.map((facet) => <label key={facet.id} className="mb-2 flex items-center gap-2 text-sm"><Checkbox checked={categories.includes(facet.id)} onCheckedChange={() => toggle(facet.id, categories, setCategories)} /><span className="flex-1">{facet.name}</span><span className="text-muted-foreground">{facet.count}</span></label>)}</div>
        <div><h2 className="mb-3 font-semibold">Course level</h2>{facets.levels.map((facet) => <label key={facet.id} className="mb-2 flex items-center gap-2 text-sm"><Checkbox checked={levels.includes(facet.id)} onCheckedChange={() => toggle(facet.id, levels, setLevels)} /><span className="flex-1">{facet.name.replaceAll("_", " ")}</span><span className="text-muted-foreground">{facet.count}</span></label>)}</div>
        {(categories.length > 0 || levels.length > 0) && <Button variant="ghost" className="w-full" onClick={() => { setCategories([]); setLevels([]) }}>Clear filters</Button>}
      </aside>
      <section>
        {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div> : error ? <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">{error}<Button variant="link" onClick={() => void load()}>Try again</Button></div> : items.length === 0 ? <div className="rounded-lg border p-12 text-center text-muted-foreground">No matching content found.</div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <ResultCard key={`${item.type}-${item.id}`} item={item} />)}</div>}
      </section>
    </div>
  </main>
}

function ResultCard({ item }: { item: SearchItem }) {
  return <Link href={`${paths[item.type]}/${item.slug || item.id}`} className="group overflow-hidden rounded-xl border bg-card transition hover:-translate-y-1 hover:shadow-lg">
    <div className="relative h-40 bg-muted"><Image src={item.imageUrl || "/placeholder.svg"} alt="" fill className="object-cover" /></div>
    <div className="p-5"><div className="mb-3 flex gap-2"><Badge variant="secondary" className="capitalize">{item.type}</Badge>{item.category && <Badge variant="outline">{item.category}</Badge>}</div><h2 className="line-clamp-2 text-lg font-semibold group-hover:text-blue-700">{item.title}</h2><p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.description || "View details"}</p>{item.level && <p className="mt-4 text-xs font-medium text-blue-700">{item.level.replaceAll("_", " ")}</p>}</div>
  </Link>
}
