"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search, Book, PlayCircle, Calendar, Clock, User, ArrowRight, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

// Mock data for search results
const mockResults = {
  courses: [
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      description: "Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js and more.",
      image: "/placeholder.svg?height=150&width=250",
      instructor: "Dr. Angela Yu",
      duration: "63 hours",
      level: "Beginner",
      rating: 4.8,
      reviews: 45872,
      category: "Web Development",
    },
    {
      id: "2",
      title: "Data Science and Machine Learning",
      description: "Master data science, machine learning, and Python with hands-on projects and real-world datasets.",
      image: "/placeholder.svg?height=150&width=250",
      instructor: "Jose Portilla",
      duration: "42 hours",
      level: "Intermediate",
      rating: 4.7,
      reviews: 32541,
      category: "Data Science",
    },
    {
      id: "3",
      title: "UI/UX Design Fundamentals",
      description: "Learn the principles of UI/UX design and create stunning user interfaces for web and mobile apps.",
      image: "/placeholder.svg?height=150&width=250",
      instructor: "Daniel Scott",
      duration: "28 hours",
      level: "Beginner",
      rating: 4.9,
      reviews: 18965,
      category: "Design",
    },
  ],
  tutorials: [
    {
      id: "1",
      title: "Building a Responsive Website with Tailwind CSS",
      description: "Learn how to build a responsive website using Tailwind CSS from scratch.",
      image: "/placeholder.svg?height=150&width=250",
      author: "Sarah Johnson",
      duration: "45 minutes",
      level: "Intermediate",
      category: "Web Development",
    },
    {
      id: "2",
      title: "Introduction to Python Programming",
      description: "Get started with Python programming language with this beginner-friendly tutorial.",
      image: "/placeholder.svg?height=150&width=250",
      author: "Michael Chen",
      duration: "30 minutes",
      level: "Beginner",
      category: "Programming",
    },
  ],
  webinars: [
    {
      id: "1",
      title: "Future of AI in Education",
      description: "Explore how artificial intelligence is transforming the education landscape.",
      image: "/placeholder.svg?height=150&width=250",
      speaker: "Dr. Emily Rodriguez",
      date: "June 15, 2024",
      time: "2:00 PM IST",
      duration: "90 minutes",
      category: "Technology",
    },
    {
      id: "2",
      title: "Effective Teaching Strategies for Online Learning",
      description: "Learn proven strategies for engaging students in virtual classrooms.",
      image: "/placeholder.svg?height=150&width=250",
      speaker: "Prof. James Wilson",
      date: "June 22, 2024",
      time: "1:00 PM IST",
      duration: "60 minutes",
      category: "Education",
    },
  ],
  blog: [
    {
      id: "1",
      title: "10 Tips for Effective Online Learning",
      description: "Discover strategies to maximize your productivity and learning outcomes in online courses.",
      image: "/placeholder.svg?height=150&width=250",
      author: "Lisa Thompson",
      date: "May 28, 2024",
      readTime: "8 min read",
      category: "Learning Tips",
    },
    {
      id: "2",
      title: "The Evolution of Distance Education",
      description:
        "Explore how distance education has evolved from correspondence courses to interactive online learning.",
      image: "/placeholder.svg?height=150&width=250",
      author: "Dr. Robert Brown",
      date: "May 20, 2024",
      readTime: "12 min read",
      category: "Education History",
    },
  ],
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("relevance")

  // Filter results based on search query
  const filterResults = (items: any[], query: string) => {
    if (!query.trim()) return items

    const lowerCaseQuery = query.toLowerCase()
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerCaseQuery) || item.description.toLowerCase().includes(lowerCaseQuery),
    )
  }

  // Get filtered results
  const filteredCourses = filterResults(mockResults.courses, searchQuery)
  const filteredTutorials = filterResults(mockResults.tutorials, searchQuery)
  const filteredWebinars = filterResults(mockResults.webinars, searchQuery)
  const filteredBlog = filterResults(mockResults.blog, searchQuery)

  // Total results count
  const totalResults = filteredCourses.length + filteredTutorials.length + filteredWebinars.length + filteredBlog.length

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would fetch results from an API here
  }

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Toggle level selection
  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedLevels([])
    setSortBy("relevance")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>

      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses, tutorials, webinars..."
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700">
            Search
          </Button>
        </div>
      </form>

      {/* Results summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <p className="text-muted-foreground">
            {totalResults} results for <span className="font-medium text-foreground">"{searchQuery}"</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
            Filters
            {(selectedCategories.length > 0 || selectedLevels.length > 0) && (
              <Badge className="ml-1 bg-blue-600">{selectedCategories.length + selectedLevels.length}</Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        {showFilters && (
          <div className="lg:col-span-1 bg-muted/30 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="lg:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {[
                    "Web Development",
                    "Data Science",
                    "Design",
                    "Business",
                    "Programming",
                    "Education",
                    "Technology",
                  ].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Levels */}
              <div>
                <h3 className="text-sm font-medium mb-3">Level</h3>
                <div className="space-y-2">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`level-${level}`}
                        checked={selectedLevels.includes(level)}
                        onCheckedChange={() => toggleLevel(level)}
                      />
                      <label
                        htmlFor={`level-${level}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Clear filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={clearFilters}
                disabled={selectedCategories.length === 0 && selectedLevels.length === 0}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Results content */}
        <div className={`${showFilters ? "lg:col-span-3" : "lg:col-span-4"}`}>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All Results
                <Badge className="ml-2 bg-muted text-muted-foreground">{totalResults}</Badge>
              </TabsTrigger>
              <TabsTrigger value="courses">
                Courses
                <Badge className="ml-2 bg-muted text-muted-foreground">{filteredCourses.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="tutorials">
                Tutorials
                <Badge className="ml-2 bg-muted text-muted-foreground">{filteredTutorials.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="webinars">
                Webinars
                <Badge className="ml-2 bg-muted text-muted-foreground">{filteredWebinars.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="blog">
                Blog
                <Badge className="ml-2 bg-muted text-muted-foreground">{filteredBlog.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {/* Courses section */}
              {filteredCourses.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Courses</h2>
                    <Button variant="link" className="text-blue-600" onClick={() => setActiveTab("courses")}>
                      View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCourses.slice(0, 2).map((course) => (
                      <Link href={`/courses/${course.id}`} key={course.id} className="group">
                        <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md">
                          <div className="aspect-video relative overflow-hidden">
                            <img
                              src={course.image || "/placeholder.svg"}
                              alt={course.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <Badge className="absolute top-2 right-2 bg-blue-600">{course.category}</Badge>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{course.description}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <User className="h-4 w-4 mr-1" />
                              <span>{course.instructor}</span>
                              <Separator orientation="vertical" className="mx-2 h-4" />
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{course.duration}</span>
                              <Separator orientation="vertical" className="mx-2 h-4" />
                              <span>{course.level}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tutorials section */}
              {filteredTutorials.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Tutorials</h2>
                    <Button variant="link" className="text-blue-600" onClick={() => setActiveTab("tutorials")}>
                      View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTutorials.slice(0, 2).map((tutorial) => (
                      <Link href={`/tutorials/${tutorial.id}`} key={tutorial.id} className="group">
                        <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md">
                          <div className="aspect-video relative overflow-hidden">
                            <img
                              src={tutorial.image || "/placeholder.svg"}
                              alt={tutorial.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <Badge className="absolute top-2 right-2 bg-purple-600">{tutorial.category}</Badge>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                              {tutorial.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{tutorial.description}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <User className="h-4 w-4 mr-1" />
                              <span>{tutorial.author}</span>
                              <Separator orientation="vertical" className="mx-2 h-4" />
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{tutorial.duration}</span>
                              <Separator orientation="vertical" className="mx-2 h-4" />
                              <span>{tutorial.level}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Webinars section */}
              {filteredWebinars.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Webinars</h2>
                    <Button variant="link" className="text-blue-600" onClick={() => setActiveTab("webinars")}>
                      View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredWebinars.slice(0, 2).map((webinar) => (
                      <Link href={`/webinars/${webinar.id}`} key={webinar.id} className="group">
                        <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md">
                          <div className="aspect-video relative overflow-hidden">
                            <img
                              src={webinar.image || "/placeholder.svg"}
                              alt={webinar.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <Badge className="absolute top-2 right-2 bg-green-600">{webinar.category}</Badge>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                              {webinar.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{webinar.description}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <User className="h-4 w-4 mr-1" />
                              <span>{webinar.speaker}</span>
                              <Separator orientation="vertical" className="mx-2 h-4" />
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{webinar.date}</span>
                              <Separator orientation="vertical" className="mx-2 h-4" />
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{webinar.duration}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog section */}
              {filteredBlog.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Blog</h2>
                    <Button variant="link" className="text-blue-600" onClick={() => setActiveTab("blog")}>
                      View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBlog.slice(0, 2).map((post) => (
                      <Link href={`/blog/${post.id}`} key={post.id} className="group">
                        <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md">
                          <div className="aspect-video relative overflow-hidden">
                            <img
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <Badge className="absolute top-2 right-2 bg-amber-600">{post.category}</Badge>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.description}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <User className="h-4 w-4 mr-1" />
                              <span>{post.author}</span>
                              <Separator orientation="vertical" className="mx-2 h-4" />
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{post.date}</span>
                              <Separator orientation="vertical" className="mx-2 h-4" />
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {totalResults === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No results found</h2>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any matches for "{searchQuery}". Try adjusting your search terms.
                  </p>
                  <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="courses">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <Link href={`/courses/${course.id}`} key={course.id} className="group">
                      <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <Badge className="absolute top-2 right-2 bg-blue-600">{course.category}</Badge>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 flex-1">{course.description}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-1" />
                            <span>{course.instructor}</span>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <Badge variant="outline">{course.level}</Badge>
                            <div className="flex items-center">
                              <span className="text-amber-500 mr-1">★</span>
                              <span className="font-medium">{course.rating}</span>
                              <span className="text-muted-foreground text-xs ml-1">
                                ({course.reviews.toLocaleString()})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No courses found</h2>
                  <p className="text-muted-foreground mb-6">We couldn't find any courses matching "{searchQuery}".</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tutorials">
              {filteredTutorials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTutorials.map((tutorial) => (
                    <Link href={`/tutorials/${tutorial.id}`} key={tutorial.id} className="group">
                      <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={tutorial.image || "/placeholder.svg"}
                            alt={tutorial.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <Badge className="absolute top-2 right-2 bg-purple-600">{tutorial.category}</Badge>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {tutorial.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 flex-1">{tutorial.description}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-1" />
                            <span>{tutorial.author}</span>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{tutorial.duration}</span>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge variant="outline">{tutorial.level}</Badge>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PlayCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No tutorials found</h2>
                  <p className="text-muted-foreground mb-6">We couldn't find any tutorials matching "{searchQuery}".</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="webinars">
              {filteredWebinars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWebinars.map((webinar) => (
                    <Link href={`/webinars/${webinar.id}`} key={webinar.id} className="group">
                      <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={webinar.image || "/placeholder.svg"}
                            alt={webinar.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <Badge className="absolute top-2 right-2 bg-green-600">{webinar.category}</Badge>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {webinar.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 flex-1">{webinar.description}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-1" />
                            <span>{webinar.speaker}</span>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{webinar.date}</span>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{webinar.duration}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No webinars found</h2>
                  <p className="text-muted-foreground mb-6">We couldn't find any webinars matching "{searchQuery}".</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="blog">
              {filteredBlog.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlog.map((post) => (
                    <Link href={`/blog/${post.id}`} key={post.id} className="group">
                      <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <Badge className="absolute top-2 right-2 bg-amber-600">{post.category}</Badge>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 flex-1">{post.description}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-1" />
                            <span>{post.author}</span>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{post.date}</span>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No blog posts found</h2>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any blog posts matching "{searchQuery}".
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
