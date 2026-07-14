"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import instance from "@/helper/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { usePageRestoreKey } from "@/hooks/use-page-restore-key";

export default function BlogPage() {
  const router = useRouter();
  const restoreKey = usePageRestoreKey();
  const searchParams = useSearchParams();

  const search = searchParams.get("page");
  console.log("search", search);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [blogs, setAllBlogs] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(search || 1);
  const [totalPages, setTotalPages] = useState(1);

  function handlePageRouting(index: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", index);

    router.push(`?${params.toString()}`);
  }

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

  // Blog categories
  const categories = [
    { id: "", name: "All Posts" },
    { id: "EDUCATION", name: "Education" },
    { id: "TECHNOLOGY", name: "Technology" },
    { id: "CAREER", name: "Career Development" },
    { id: "LEARNING", name: "Learning Tips" },
    { id: "INDUSTRY", name: "Industry Insights" },
  ];

  useEffect(() => {
    async function handleGetAllBlogs() {
      try {
        const res: any = await instance.get(
          `/blog?page=${page}&category=${filter}`,
        );
        if (!res?.status) {
          return toast.error("Something went wrong");
        }
        console.log("res?.data", res?.data);
        setAllBlogs(res?.data);
        setTotalPages(Number(res?.totalPages || 1));
      } catch (e) {
        toast.error("Something went wrong");
      }
    }
    handleGetAllBlogs();
  }, [filter, page, restoreKey]);

  useEffect(() => {
    console.log("blogs", blogs);
  }, [blogs]);
  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Skills Every Data Scientist Needs in 2024",
      slug: "essential-skills-data-scientist-2024",
      excerpt:
        "Discover the most in-demand skills for data scientists this year, from machine learning to communication.",
      content: "",
      category: "technology",
      image: "/placeholder.svg?height=600&width=800",
      author: {
        name: "Dr. Sarah Chen",
        avatar: "/placeholder.svg?height=100&width=100",
        role: "Data Science Director",
      },
      date: "March 15, 2024",
      readTime: "8 min read",
      featured: true,
      tags: ["Data Science", "Career", "Technology", "Skills"],
      comments: 24,
    },
    {
      id: 2,
      title: "How to Create an Effective Learning Environment at Home",
      slug: "effective-learning-environment-home",
      excerpt:
        "Learn how to set up the perfect study space at home to maximize productivity and minimize distractions.",
      content: "",
      category: "learning",
      image: "/placeholder.svg?height=600&width=800",
      author: {
        name: "Michael Torres",
        avatar: "/placeholder.svg?height=100&width=100",
        role: "Education Specialist",
      },
      date: "March 10, 2024",
      readTime: "6 min read",
      featured: true,
      tags: ["Learning", "Productivity", "Home Study", "Environment"],
      comments: 18,
    },
    {
      id: 3,
      title: "The Future of Online Education: Trends to Watch in 2024",
      slug: "future-online-education-trends-2024",
      excerpt:
        "Explore the emerging trends that are shaping the future of online education and e-learning platforms.",
      content: "",
      category: "education",
      image: "/placeholder.svg?height=600&width=800",
      author: {
        name: "Dr. Emily Johnson",
        avatar: "/placeholder.svg?height=100&width=100",
        role: "Education Technology Researcher",
      },
      date: "March 5, 2024",
      readTime: "10 min read",
      featured: true,
      tags: ["Education", "E-Learning", "Technology", "Trends"],
      comments: 32,
    },
    {
      id: 4,
      title: "How to Land Your First Job in Web Development",
      slug: "land-first-job-web-development",
      excerpt:
        "Practical advice for new web developers looking to break into the industry and land their first professional role.",
      content: "",
      category: "career",
      image: "/placeholder.svg?height=600&width=800",
      author: {
        name: "Jason Martinez",
        avatar: "/placeholder.svg?height=100&width=100",
        role: "Senior Web Developer",
      },
      date: "February 28, 2024",
      readTime: "7 min read",
      featured: false,
      tags: ["Web Development", "Career", "Job Search", "Programming"],
      comments: 15,
    },
    {
      id: 5,
      title: "The Science of Memory: How to Retain What You Learn",
      slug: "science-memory-retain-learning",
      excerpt:
        "Understand the cognitive science behind memory and learn techniques to improve knowledge retention.",
      content: "",
      category: "learning",
      image: "/placeholder.svg?height=600&width=800",
      author: {
        name: "Dr. Robert Kim",
        avatar: "/placeholder.svg?height=100&width=100",
        role: "Cognitive Psychologist",
      },
      date: "February 25, 2024",
      readTime: "9 min read",
      featured: false,
      tags: ["Memory", "Learning", "Cognitive Science", "Study Techniques"],
      comments: 27,
    },
    {
      id: 6,
      title: "AI in Education: Transforming How We Teach and Learn",
      slug: "ai-education-transforming-teaching-learning",
      excerpt:
        "Explore how artificial intelligence is revolutionizing educational methods and creating new opportunities.",
      content: "",
      category: "technology",
      image: "/placeholder.svg?height=600&width=800",
      author: {
        name: "Alicia Wong",
        avatar: "/placeholder.svg?height=100&width=100",
        role: "AI Education Specialist",
      },
      date: "February 20, 2024",
      readTime: "8 min read",
      featured: false,
      tags: ["AI", "Education", "Technology", "Innovation"],
      comments: 21,
    },
    {
      id: 7,
      title: "5 Effective Study Methods Backed by Science",
      slug: "effective-study-methods-science",
      excerpt:
        "Discover research-backed study techniques that can help you learn faster and remember more.",
      content: "",
      category: "learning",
      image: "/placeholder.svg?height=600&width=800",
      author: {
        name: "Dr. Lisa Chen",
        avatar: "/placeholder.svg?height=100&width=100",
        role: "Learning Scientist",
      },
      date: "February 15, 2024",
      readTime: "6 min read",
      featured: false,
      tags: ["Study Methods", "Learning", "Science", "Productivity"],
      comments: 19,
    },
    {
      id: 8,
      title: "The Growing Demand for Cybersecurity Professionals",
      slug: "growing-demand-cybersecurity-professionals",
      excerpt:
        "Learn about the expanding job market for cybersecurity experts and how to position yourself for success.",
      content: "",
      category: "industry",
      image: "/placeholder.svg?height=600&width=800",
      author: {
        name: "Marcus Johnson",
        avatar: "/placeholder.svg?height=100&width=100",
        role: "Cybersecurity Director",
      },
      date: "February 10, 2024",
      readTime: "7 min read",
      featured: false,
      tags: ["Cybersecurity", "Career", "Technology", "Industry"],
      comments: 14,
    },
  ];

  // Featured posts
  const featuredPosts = blogs?.filter((post) => post.isFeatured);

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
                <BreadcrumbLink href="/blog" className="font-medium">
                  Blog
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                EduPortal Blog
              </h1>
              <p className="text-muted-foreground">
                Insights, tips, and resources to help you succeed in your
                educational journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-6 border-b sticky top-16 bg-background/95 backdrop-blur z-30">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={filter === category.id ? "default" : "outline"}
                  className={`cursor-pointer whitespace-nowrap ${
                    filter === category.id
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "hover:bg-blue-50"
                  }`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setFilter(category.id);
                    setPage(1);
                    handlePageRouting("1");
                  }}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container">
          {/* Featured Posts */}
          {!filter && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {featuredPosts?.map((post, index) => (
                  <motion.div
                    key={post.id}
                    className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative">
                          <Image
                            src={post?.imageUrl || "/placeholder.svg"}
                            alt={post?.title}
                            width={800}
                            height={index === 0 ? 500 : 300}
                            className="w-full object-cover"
                            style={{ height: index === 0 ? "400px" : "220px" }}
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-blue-600">
                              {post?.category}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{post?.createdAt}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{post?.read_time} read time</span>
                            </div>
                          </div>
                          <h3
                            className={`font-bold mb-2 line-clamp-2 ${
                              index === 0 ? "text-2xl" : "text-xl"
                            }`}
                          >
                            {post?.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {post?.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={post?.user?.avatar || "/placeholder.svg"}
                                alt={post?.user?.name}
                              />
                              <AvatarFallback>
                                {post?.user?.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {post?.user?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {post?.user?.role || "Instructor"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All Posts or Filtered Posts */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {filter
                  ? `Search Results (${blogs?.length})`
                  : activeCategory !== "all"
                    ? `${
                        categories.find((c) => c.id === activeCategory)?.name
                      } (${blogs?.length})`
                    : "All Articles"}
              </h2>
              {filter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {blogs?.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No articles found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setFilter("");
                    setActiveCategory("all");
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
                {blogs?.map((post) => (
                  <motion.div key={post.id} variants={fadeIn}>
                    <Link href={`/blog/${post.slug}`}>
                      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative">
                          <Image
                            src={post?.imageUrl || "/placeholder.svg"}
                            alt={post?.title}
                            width={800}
                            height={300}
                            className="w-full h-[220px] object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-blue-600">
                              {post?.category}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{post?.createdAt}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{post?.read_time} read time</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-2 line-clamp-2">
                            {post?.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {post?.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={post?.user?.avatar || "/placeholder.svg"}
                                alt={post?.user?.name}
                              />
                              <AvatarFallback>
                                {post?.user?.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {post?.user?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {post?.user?.role || "Instructor"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {/* {filteredPosts.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" disabled>
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
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="icon">
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
            )} */}

            <div className="flex justify-center mt-12 gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <div
                  key={index}
                  className={`border p-3 rounded-md ${
                    page === index + 1 ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  <button
                    onClick={() => {
                      if (page === index + 1) {
                        return;
                      }
                      setPage(index + 1);
                      handlePageRouting((index + 1).toString());
                    }}
                  >
                    {index + 1}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-50 border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-muted-foreground mb-8">
              Get the latest articles, tutorials, and educational resources
              delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tags */}
      <section className="py-12 border-t">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Popular Topics
          </h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {[
              "Education",
              "Technology",
              "Learning",
              "Career Development",
              "Programming",
              "Data Science",
              "AI",
              "Web Development",
              "Study Tips",
              "Online Learning",
              "Productivity",
              "Student Life",
              "Teaching",
              "Industry Insights",
              "Professional Skills",
            ].map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-sm py-1.5 px-3 hover:bg-blue-50 cursor-pointer"
                onClick={() => {
                  setSearchQuery(tag);
                  setFilter(tag);
                }}
              >
                <Tag className="h-3.5 w-3.5 mr-1.5" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
