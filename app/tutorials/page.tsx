"use client";

import { Separator } from "@/components/ui/separator";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  BarChart,
  Play,
  BookOpen,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTutorials } from "@/lib/content-api";
import { usePageRestoreKey } from "@/hooks/use-page-restore-key";

export default function TutorialsPage() {
  const restoreKey = usePageRestoreKey();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [apiTutorials, setApiTutorials] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Filter options
  const filterOptions = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
    { id: "programming", label: "Programming" },
    { id: "design", label: "Design" },
    { id: "data-science", label: "Data Science" },
    { id: "business", label: "Business" },
    { id: "free", label: "Free" },
    { id: "certificate", label: "Certificate Available" },
  ];

  // Toggle filter selection
  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  // Tutorials data
  const sampleTutorials = [
    {
      id: 1,
      title: "Introduction to HTML and CSS",
      slug: "intro-html-css",
      description:
        "Learn the fundamentals of web development with HTML and CSS.",
      image: "/placeholder.svg?height=300&width=600",
      duration: "2 hours",
      level: "beginner",
      category: "programming",
      instructor: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      rating: 4.8,
      reviews: 245,
      lessons: 12,
      progress: 0,
      free: true,
      certificate: false,
      featured: true,
      tags: ["HTML", "CSS", "Web Development"],
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      slug: "javascript-fundamentals",
      description: "Master the basics of JavaScript programming language.",
      image: "/placeholder.svg?height=300&width=600",
      duration: "4 hours",
      level: "beginner",
      category: "programming",
      instructor: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      rating: 4.7,
      reviews: 189,
      lessons: 18,
      progress: 0,
      free: true,
      certificate: false,
      featured: true,
      tags: ["JavaScript", "Programming", "Web Development"],
    },
    {
      id: 3,
      title: "Advanced React Patterns",
      slug: "advanced-react-patterns",
      description:
        "Learn advanced React patterns and techniques for building scalable applications.",
      image: "/placeholder.svg?height=300&width=600",
      duration: "6 hours",
      level: "advanced",
      category: "programming",
      instructor: {
        name: "David Wilson",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      rating: 4.9,
      reviews: 156,
      lessons: 24,
      progress: 0,
      free: false,
      certificate: true,
      featured: true,
      tags: ["React", "JavaScript", "Advanced", "Web Development"],
    },
    {
      id: 4,
      title: "UI/UX Design Principles",
      slug: "ui-ux-design-principles",
      description:
        "Learn the fundamental principles of user interface and user experience design.",
      image: "/placeholder.svg?height=300&width=600",
      duration: "5 hours",
      level: "intermediate",
      category: "design",
      instructor: {
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      rating: 4.6,
      reviews: 132,
      lessons: 20,
      progress: 0,
      free: false,
      certificate: true,
      featured: false,
      tags: ["UI", "UX", "Design", "User Experience"],
    },
    {
      id: 5,
      title: "Python for Data Science",
      slug: "python-data-science",
      description:
        "Learn how to use Python for data analysis and visualization.",
      image: "/placeholder.svg?height=300&width=600",
      duration: "8 hours",
      level: "intermediate",
      category: "data-science",
      instructor: {
        name: "Dr. Robert Kim",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      rating: 4.9,
      reviews: 278,
      lessons: 32,
      progress: 0,
      free: false,
      certificate: true,
      featured: false,
      tags: ["Python", "Data Science", "Data Analysis", "Visualization"],
    },
    {
      id: 6,
      title: "Digital Marketing Fundamentals",
      slug: "digital-marketing-fundamentals",
      description:
        "Learn the basics of digital marketing strategies and techniques.",
      image: "/placeholder.svg?height=300&width=600",
      duration: "4 hours",
      level: "beginner",
      category: "business",
      instructor: {
        name: "Jessica Martinez",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      rating: 4.5,
      reviews: 112,
      lessons: 16,
      progress: 0,
      free: true,
      certificate: false,
      featured: false,
      tags: ["Marketing", "Digital", "Business", "SEO"],
    },
    {
      id: 7,
      title: "Machine Learning with TensorFlow",
      slug: "machine-learning-tensorflow",
      description:
        "Learn how to build and train machine learning models using TensorFlow.",
      image: "/placeholder.svg?height=300&width=600",
      duration: "10 hours",
      level: "advanced",
      category: "data-science",
      instructor: {
        name: "Dr. Alan Zhang",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      rating: 4.8,
      reviews: 198,
      lessons: 40,
      progress: 0,
      free: false,
      certificate: true,
      featured: false,
      tags: ["Machine Learning", "TensorFlow", "AI", "Data Science"],
    },
    {
      id: 8,
      title: "Responsive Web Design",
      slug: "responsive-web-design",
      description:
        "Learn how to create websites that work on all devices and screen sizes.",
      image: "/placeholder.svg?height=300&width=600",
      duration: "3 hours",
      level: "intermediate",
      category: "programming",
      instructor: {
        name: "Thomas Brown",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      rating: 4.7,
      reviews: 145,
      lessons: 15,
      progress: 0,
      free: true,
      certificate: false,
      featured: false,
      tags: ["Responsive", "CSS", "HTML", "Web Design"],
    },
  ];

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setLoadError("");
      getTutorials({ q: searchQuery || undefined, page, limit: 12 })
        .then((response) => {
          if (!active) return;
          setApiTutorials(
            response.data.map((tutorial, index) => ({
              id: tutorial.id,
              title: tutorial.title,
              slug: tutorial.slug,
              description: tutorial.description || "",
              image: tutorial.thumbnailUrl || "/placeholder.svg",
              duration: "Self-paced",
              level: tutorial.level?.toLowerCase() || "all-levels",
              category: tutorial.categoryId || "general",
              instructor: {
                name: tutorial.author?.name || "EduPortal instructor",
                avatar: "/placeholder-user.jpg",
              },
              rating: 0,
              reviews: 0,
              lessons: 1,
              progress: 0,
              free: true,
              certificate: false,
              featured: index < 3,
              tags: [tutorial.categoryName, tutorial.level].filter(
                Boolean,
              ) as string[],
            })),
          );
          setTotalPages(Math.max(response.totalPages, 1));
        })
        .catch((error: any) => {
          if (active) {
            setApiTutorials([]);
            setLoadError(error?.message || "Unable to load tutorials");
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [page, restoreKey, searchQuery]);

  const tutorials = apiTutorials;

  // Filter tutorials based on search, filters, and tab
  const filteredTutorials = tutorials.filter((tutorial) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tutorial.title.toLowerCase().includes(query) ||
        tutorial.description.toLowerCase().includes(query) ||
        tutorial.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // Category filters
    if (selectedFilters.length > 0) {
      const levelMatch = selectedFilters.includes(tutorial.level);
      const categoryMatch = selectedFilters.includes(tutorial.category);
      const freeMatch = tutorial.free && selectedFilters.includes("free");
      const certificateMatch =
        tutorial.certificate && selectedFilters.includes("certificate");

      return levelMatch || categoryMatch || freeMatch || certificateMatch;
    }

    // Tab filter
    if (activeTab === "featured") {
      return tutorial.featured;
    }

    return true;
  });

  // Featured tutorials
  const featuredTutorials = tutorials.filter((tutorial) => tutorial.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-blue-50 py-8 md:py-12 border-b">
        <div className="container">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/tutorials" className="font-medium">
                  Tutorials
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Tutorials & Guides
              </h1>
              <p className="text-muted-foreground">
                Step-by-step tutorials to help you master new skills and
                technologies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="py-6 border-b sticky top-16 bg-background/95 backdrop-blur z-30">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tutorials..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className={`md:hidden ${showFilters ? "bg-blue-50 text-blue-600" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Tabs
                defaultValue="all"
                className="hidden md:block"
                onValueChange={setActiveTab}
              >
                <TabsList>
                  <TabsTrigger value="all">All Tutorials</TabsTrigger>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              className="md:hidden mt-4 p-4 border rounded-md bg-muted/20"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <h3 className="font-medium mb-3">Filter Tutorials</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-${option.id}`}
                      checked={selectedFilters.includes(option.id)}
                      onCheckedChange={() => toggleFilter(option.id)}
                    />
                    <Label htmlFor={`mobile-${option.id}`} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Tabs
                  defaultValue="all"
                  className="w-full"
                  onValueChange={setActiveTab}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">
                      All Tutorials
                    </TabsTrigger>
                    <TabsTrigger value="featured" className="flex-1">
                      Featured
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters (Desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-36">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-blue-50 p-4 border-b">
                    <h3 className="font-semibold">Filter Tutorials</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Difficulty Level</h4>
                        <div className="space-y-2">
                          {filterOptions.slice(0, 3).map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={option.id}
                                checked={selectedFilters.includes(option.id)}
                                onCheckedChange={() => toggleFilter(option.id)}
                              />
                              <Label htmlFor={option.id}>{option.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Category</h4>
                        <div className="space-y-2">
                          {filterOptions.slice(3, 7).map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={option.id}
                                checked={selectedFilters.includes(option.id)}
                                onCheckedChange={() => toggleFilter(option.id)}
                              />
                              <Label htmlFor={option.id}>{option.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Other</h4>
                        <div className="space-y-2">
                          {filterOptions.slice(7).map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={option.id}
                                checked={selectedFilters.includes(option.id)}
                                onCheckedChange={() => toggleFilter(option.id)}
                              />
                              <Label htmlFor={option.id}>{option.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="outline"
                        className="w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => setSelectedFilters([])}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tutorials Grid */}
            <div className="lg:col-span-3">
              {/* Featured Tutorials Section */}
              {!searchQuery &&
                selectedFilters.length === 0 &&
                activeTab === "all" && (
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold mb-6">
                      Featured Tutorials
                    </h2>
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      initial="hidden"
                      animate="visible"
                      variants={staggerContainer}
                    >
                      {featuredTutorials.map((tutorial) => (
                        <motion.div key={tutorial.id} variants={fadeIn}>
                          <Link href={`/tutorials/${tutorial.slug}`}>
                            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden">
                              <div className="relative">
                                <Image
                                  src={tutorial.image || "/placeholder.svg"}
                                  alt={tutorial.title}
                                  width={600}
                                  height={300}
                                  className="w-full h-[180px] object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <div className="bg-blue-600 rounded-full p-3">
                                    <Play
                                      className="h-6 w-6 text-white"
                                      fill="white"
                                    />
                                  </div>
                                </div>
                                <div className="absolute top-4 left-4">
                                  <Badge className="bg-blue-600">
                                    Featured
                                  </Badge>
                                </div>
                                {tutorial.free && (
                                  <div className="absolute top-4 right-4">
                                    <Badge
                                      variant="outline"
                                      className="bg-green-50 text-green-600 border-green-200"
                                    >
                                      Free
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge
                                    variant="outline"
                                    className={`capitalize ${
                                      tutorial.level === "beginner"
                                        ? "bg-green-50 text-green-600 border-green-200"
                                        : tutorial.level === "intermediate"
                                          ? "bg-blue-50 text-blue-600 border-blue-200"
                                          : "bg-purple-50 text-purple-600 border-purple-200"
                                    }`}
                                  >
                                    {tutorial.level}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="h-4 w-4 fill-amber-500" />
                                    <span className="text-sm font-medium">
                                      {tutorial.rating}
                                    </span>
                                  </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                  {tutorial.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                  {tutorial.description}
                                </p>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{tutorial.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" />
                                    <span>{tutorial.lessons} lessons</span>
                                  </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={
                                          tutorial.instructor.avatar ||
                                          "/placeholder.svg"
                                        }
                                        alt={tutorial.instructor.name}
                                      />
                                      <AvatarFallback>
                                        {tutorial.instructor.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">
                                      {tutorial.instructor.name}
                                    </span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="gap-1 text-blue-600 hover:text-blue-700 p-0"
                                  >
                                    Start
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                )}

              {/* All Tutorials */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {searchQuery
                      ? `Search Results (${filteredTutorials.length})`
                      : selectedFilters.length > 0
                        ? `Filtered Tutorials (${filteredTutorials.length})`
                        : activeTab === "featured"
                          ? "Featured Tutorials"
                          : "All Tutorials"}
                  </h2>
                  {(searchQuery || selectedFilters.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedFilters([]);
                      }}
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {filteredTutorials.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                      <Search className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No tutorials found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedFilters([]);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                  >
                    {loading && (
                      <p className="col-span-full py-12 text-center text-muted-foreground">
                        Loading tutorials…
                      </p>
                    )}
                    {loadError && (
                      <p className="col-span-full rounded border border-red-200 bg-red-50 p-6 text-center text-red-700">
                        {loadError}
                      </p>
                    )}
                    {!loading &&
                      !loadError &&
                      filteredTutorials.length === 0 && (
                        <p className="col-span-full py-12 text-center text-muted-foreground">
                          No tutorials found.
                        </p>
                      )}
                    {filteredTutorials.map((tutorial) => (
                      <motion.div key={tutorial.id} variants={fadeIn}>
                        <Link href={`/tutorials/${tutorial.slug}`}>
                          <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden">
                            <div className="relative">
                              <Image
                                src={tutorial.image || "/placeholder.svg"}
                                alt={tutorial.title}
                                width={600}
                                height={300}
                                className="w-full h-[180px] object-cover"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <div className="bg-blue-600 rounded-full p-3">
                                  <Play
                                    className="h-6 w-6 text-white"
                                    fill="white"
                                  />
                                </div>
                              </div>
                              {tutorial.featured && (
                                <div className="absolute top-4 left-4">
                                  <Badge className="bg-blue-600">
                                    Featured
                                  </Badge>
                                </div>
                              )}
                              {tutorial.free && (
                                <div className="absolute top-4 right-4">
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-600 border-green-200"
                                  >
                                    Free
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-5">
                              <div className="flex items-center justify-between mb-2">
                                <Badge
                                  variant="outline"
                                  className={`capitalize ${
                                    tutorial.level === "beginner"
                                      ? "bg-green-50 text-green-600 border-green-200"
                                      : tutorial.level === "intermediate"
                                        ? "bg-blue-50 text-blue-600 border-blue-200"
                                        : "bg-purple-50 text-purple-600 border-purple-200"
                                  }`}
                                >
                                  {tutorial.level}
                                </Badge>
                                <div className="flex items-center gap-1 text-amber-500">
                                  <Star className="h-4 w-4 fill-amber-500" />
                                  <span className="text-sm font-medium">
                                    {tutorial.rating}
                                  </span>
                                </div>
                              </div>
                              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                {tutorial.title}
                              </h3>
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {tutorial.description}
                              </p>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{tutorial.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  <span>{tutorial.lessons} lessons</span>
                                </div>
                              </div>
                              <Separator className="my-4" />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={
                                        tutorial.instructor.avatar ||
                                        "/placeholder.svg"
                                      }
                                      alt={tutorial.instructor.name}
                                    />
                                    <AvatarFallback>
                                      {tutorial.instructor.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">
                                    {tutorial.instructor.name}
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="gap-1 text-blue-600 hover:text-blue-700 p-0"
                                >
                                  Start
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Pagination */}
                {filteredTutorials.length > 0 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={page <= 1}
                        onClick={() => setPage((value) => value - 1)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                        <span className="sr-only">Previous</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 text-blue-600"
                      >
                        {page} / {totalPages}
                      </Button>
                      <Button variant="outline" size="sm" className="hidden">
                        2
                      </Button>
                      <Button variant="outline" size="sm" className="hidden">
                        3
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={page >= totalPages}
                        onClick={() => setPage((value) => value + 1)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                        <span className="sr-only">Next</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-blue-50 border-t">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Our Tutorials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our tutorials are designed to provide you with practical skills
              and knowledge that you can apply immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Expert Instructors
                    </h3>
                    <p className="text-muted-foreground">
                      Learn from industry professionals with years of experience
                      in their fields.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Practical Projects
                    </h3>
                    <p className="text-muted-foreground">
                      Apply what you learn with hands-on projects and real-world
                      examples.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <BarChart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Track Your Progress
                    </h3>
                    <p className="text-muted-foreground">
                      Monitor your learning journey with progress tracking and
                      achievement badges.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-blue-100 mb-8">
              Browse our collection of tutorials and start building your skills
              today. From beginner to advanced, we have something for everyone.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-blue-600 hover:bg-blue-50"
              >
                Explore All Tutorials
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white text-white hover:bg-blue-500"
              >
                View Learning Paths
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
