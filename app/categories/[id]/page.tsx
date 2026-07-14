"use client";

import React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Code,
  Palette,
  Search,
  ArrowLeft,
  Star,
  Clock,
  BarChart,
  CheckCircle,
  BookmarkPlus,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import instance from "@/helper/axios";
import { getIcon } from "@/lib/getIcon";
import { useAuth } from "@/hooks/use-authenticated";
import { loginHref } from "@/lib/auth-navigation";
import { usePageRestoreKey } from "@/hooks/use-page-restore-key";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const restoreKey = usePageRestoreKey();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryData, setCategoryData] = useState<any>({});
  const [courses, setCourses] = useState<any[]>([]);
  const [Icon, setIcon] = useState<any>(null);

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

  useEffect(() => {
    async function fetchCategoryDetails() {
      try {
        const res: any = await instance.get(`/category/${id}`);

        if (!res?.status) {
          return toast.error("Something went wrong");
        }
        const { Icon, bg } = getIcon(res?.data?.icon);

        setCategoryData({
          ...res?.data,
          color: bg,
        });
        setIcon(Icon);
      } catch (e) {
        toast.error("Something went wrong");
      }
    }
    fetchCategoryDetails();
  }, [id, restoreKey]);

  useEffect(() => {
    if (!categoryData?.id) return;

    async function handleFetchAllCourses() {
      try {
        const res: any = await instance(`/course/category/${categoryData?.id}`);
        console.log(res);
        if (!res?.status) {
          return toast.error("Courses not found");
        }

        setCourses(res?.data);
      } catch (e) {
        toast.error("Something went wrong");
      }
    }
    handleFetchAllCourses();
  }, [categoryData?.id, restoreKey]);
  // Mock category data
  // const categoryData = {
  //   id: Number.parseInt(params.id),
  //   title: "Web Development",
  //   icon: <Code className="h-6 w-6" />,
  //   color: "bg-blue-100 text-blue-700",
  //   count: 142,
  //   featured: true,
  //   description:
  //     "Learn to build websites and web applications with modern technologies like HTML, CSS, JavaScript, React, and more. Master front-end and back-end development skills to create responsive and dynamic web experiences.",
  //   subcategories: ["HTML & CSS", "JavaScript", "React", "Node.js", "Full Stack"],
  //   instructors: 48,
  //   students: 24500,
  //   rating: 4.8,
  //   reviews: 3842,
  // }

  // Mock courses data
  // const courses = [
  //   {
  //     id: 1,
  //     title: "Complete Web Development Bootcamp",
  //     instructor: "John Smith",
  //     level: "Beginner",
  //     duration: "48 hours",
  //     lectures: 164,
  //     rating: 4.9,
  //     reviews: 1245,
  //     students: 12500,
  //     price: 49.99,
  //     image: "/placeholder.svg?height=200&width=400",
  //     featured: true,
  //     bestseller: true,
  //   },
  //   {
  //     id: 2,
  //     title: "Advanced JavaScript: From Fundamentals to Functional JS",
  //     instructor: "Sarah Johnson",
  //     level: "Intermediate",
  //     duration: "36 hours",
  //     lectures: 128,
  //     rating: 4.8,
  //     reviews: 987,
  //     students: 8750,
  //     price: 59.99,
  //     image: "/placeholder.svg?height=200&width=400",
  //     featured: true,
  //     bestseller: false,
  //   },
  //   {
  //     id: 3,
  //     title: "React & Redux: Build Modern Web Applications",
  //     instructor: "Michael Chen",
  //     level: "Intermediate",
  //     duration: "42 hours",
  //     lectures: 152,
  //     rating: 4.7,
  //     reviews: 876,
  //     students: 7890,
  //     price: 54.99,
  //     image: "/placeholder.svg?height=200&width=400",
  //     featured: false,
  //     bestseller: true,
  //   },
  //   {
  //     id: 4,
  //     title: "Node.js: The Complete Guide to Backend Development",
  //     instructor: "Emily Rodriguez",
  //     level: "Intermediate",
  //     duration: "38 hours",
  //     lectures: 145,
  //     rating: 4.8,
  //     reviews: 765,
  //     students: 6540,
  //     price: 49.99,
  //     image: "/placeholder.svg?height=200&width=400",
  //     featured: false,
  //     bestseller: false,
  //   },
  //   {
  //     id: 5,
  //     title: "Full Stack Web Development with MERN Stack",
  //     instructor: "David Wilson",
  //     level: "Advanced",
  //     duration: "52 hours",
  //     lectures: 178,
  //     rating: 4.9,
  //     reviews: 654,
  //     students: 5430,
  //     price: 69.99,
  //     image: "/placeholder.svg?height=200&width=400",
  //     featured: true,
  //     bestseller: true,
  //   },
  //   {
  //     id: 6,
  //     title: "Responsive Web Design: HTML5 & CSS3 Mastery",
  //     instructor: "Jessica Lee",
  //     level: "Beginner",
  //     duration: "32 hours",
  //     lectures: 124,
  //     rating: 4.7,
  //     reviews: 543,
  //     students: 4320,
  //     price: 44.99,
  //     image: "/placeholder.svg?height=200&width=400",
  //     featured: false,
  //     bestseller: false,
  //   },
  // ];

  // Filter courses based on search
  const filteredCourses = courses.filter((course) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        course?.title?.toLowerCase().includes(query) ||
        course?.user?.name?.toLowerCase().includes(query) ||
        course?.level?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <section className="bg-blue-50 py-8 md:py-12 border-b">
        <div className="container">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/categories/${id}`}
                  className="font-medium"
                >
                  {categoryData?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div
              className={`rounded-full w-16 h-16 flex items-center justify-center ${categoryData?.color} shrink-0`}
            >
              {Icon && <Icon className="w-8 h-8" />}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {categoryData?.name}
                </h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-600">
                    {categoryData?.courseCount} Courses
                  </Badge>
                  {categoryData?.featured && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-600"
                    >
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                {categoryData.description}
              </p>
              {/* <div className="flex flex-wrap gap-3 mb-4">
                {categoryData.subcategories.map((subcategory, index) => (
                  <Badge key={index} variant="outline" className="bg-background">
                    {subcategory}
                  </Badge>
                ))}
              </div> */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>{100}</strong> Students
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>{100}</strong> Instructors
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>
                    <strong>{5}</strong> ({4} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="py-6 border-b sticky top-16 bg-background/95 backdrop-blur z-30">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Link href="/categories">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-200 hover:bg-blue-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All Categories
                </Button>
              </Link>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container">
          {/* Featured Courses */}
          {!searchQuery && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {courses
                  .filter((course) => course.isFeatured)
                  .map((course) => (
                    <motion.div key={course.id} variants={fadeIn}>
                      <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="relative">
                          <Image
                            src={course.image || "/placeholder.svg"}
                            width={400}
                            height={200}
                            alt={course.title}
                            className="w-full h-[200px] object-cover"
                          />
                          {course?.bestseller && (
                            <Badge
                              className="absolute top-4 left-4"
                              variant="secondary"
                            >
                              Bestseller
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            by {course?.user?.name || "Unknown Instructor"}
                          </p>
                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= Math.floor(course.avgRating)
                                      ? "fill-amber-500 text-amber-500"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">
                              {course?.avgRating?.toFixed(1) || 0}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({course.totalRating})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 mb-4">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-600"
                            >
                              {course.level || "Beginner"}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3" />
                              {course.duration || "3 hours"}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <BookOpen className="h-3 w-3" />
                              {course.lectures || "12"} lectures
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <p className="font-bold text-lg text-blue-600">
                              ₹{course.price || "0"}
                            </p>
                            <Button
                              asChild
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Link
                                href={
                                  isAuthenticated
                                    ? `/courses/${course.slug || course.id}`
                                    : loginHref(`/courses/${course.slug || course.id}`)
                                }
                              >
                                Enroll Now
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          )}

          {/* All Courses */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {searchQuery
                  ? `Search Results (${filteredCourses.length})`
                  : "All Courses"}
              </h2>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </div>

            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria
                </p>
                <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
              </div>
            ) : (
              <Tabs defaultValue="grid" className="mb-6">
                <div className="flex justify-end">
                  <TabsList>
                    <TabsTrigger
                      value="grid"
                      className="flex items-center gap-1"
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
                      >
                        <rect width="7" height="7" x="3" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="14" rx="1" />
                        <rect width="7" height="7" x="3" y="14" rx="1" />
                      </svg>
                      Grid
                    </TabsTrigger>
                    <TabsTrigger
                      value="list"
                      className="flex items-center gap-1"
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
                      >
                        <line x1="3" x2="21" y1="6" y2="6" />
                        <line x1="3" x2="21" y1="12" y2="12" />
                        <line x1="3" x2="21" y1="18" y2="18" />
                      </svg>
                      List
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="grid" className="mt-6">
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                  >
                    {filteredCourses.map((course) => (
                      <motion.div key={course.id} variants={fadeIn}>
                        <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                          <div className="relative">
                            <Image
                              src={course.image || "/placeholder.svg"}
                              width={400}
                              height={200}
                              alt={course.title}
                              className="w-full h-[200px] object-cover"
                            />
                            {course.bestseller && (
                              <Badge
                                className="absolute top-4 left-4"
                                variant="secondary"
                              >
                                Bestseller
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              by {course?.user?.name || "Unknown Instructor"}
                            </p>
                            <div className="flex items-center gap-1 mb-3">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= Math.floor(course.avgRating)
                                        ? "fill-amber-500 text-amber-500"
                                        : "text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium">
                                {course?.avgRating?.toFixed(1) || 0}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({course.totalRating})
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-4">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-600"
                              >
                                {course?.level || "Beginner"}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs">
                                <Clock className="h-3 w-3" />
                                {course?.duration || "0h 0m"}
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <BookOpen className="h-3 w-3" />
                                {course?.lectures || "0"} lectures
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <p className="font-bold text-lg text-blue-600">
                                Starting from ₹{course?.price || 0}
                              </p>
                              <Button
                                asChild
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Link
                                  href={
                                    isAuthenticated
                                      ? `/courses/${course.slug || course.id}`
                                      : loginHref(`/courses/${course.slug || course.id}`)
                                  }
                                >
                                  Enroll Now
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>

                {/* <TabsContent value="list" className="mt-6">
                  <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                  >
                    {filteredCourses.map((course) => (
                      <motion.div key={course.id} variants={fadeIn}>
                        <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                          <div className="flex flex-col md:flex-row">
                            <div className="relative md:w-1/3 lg:w-1/4">
                              <Image
                                src={course.image || "/placeholder.svg"}
                                width={400}
                                height={200}
                                alt={course.title}
                                className="w-full h-[200px] md:h-full object-cover"
                              />
                              {course.bestseller && (
                                <Badge
                                  className="absolute top-4 left-4"
                                  variant="secondary"
                                >
                                  Bestseller
                                </Badge>
                              )}
                            </div>
                            <div className="p-6 flex-1">
                              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-xl font-semibold mb-2">
                                    {course.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    by {course.instructor}
                                  </p>
                                  <div className="flex items-center gap-1 mb-3">
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-4 w-4 ${
                                            star <= Math.floor(course.rating)
                                              ? "fill-amber-500 text-amber-500"
                                              : "text-muted"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm font-medium">
                                      {course.rating}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      ({course.reviews.toLocaleString()})
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-3 mb-4">
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 text-blue-600"
                                    >
                                      {course.level}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs">
                                      <Clock className="h-3 w-3" />
                                      {course.duration}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                      <BookOpen className="h-3 w-3" />
                                      {course.lectures} lectures
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                      <Users className="h-3 w-3" />
                                      {course.students.toLocaleString()}{" "}
                                      students
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4">
                                  <p className="font-bold text-lg text-blue-600">
                                    ₹{course.price}
                                  </p>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-blue-200 hover:bg-blue-50"
                                    >
                                      <BookmarkPlus className="h-4 w-4" />
                                      <span className="sr-only md:not-sr-only md:ml-2">
                                        Wishlist
                                      </span>
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      Enroll Now
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent> */}
              </Tabs>
            )}
          </div>
        </div>
      </section>

      {/* Category Stats */}
      <section className="py-12 bg-blue-50 border-t">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">
            Why Learn {categoryData.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <BarChart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      High Demand Skills
                    </h3>
                    <p className="text-muted-foreground">
                      Web development skills are among the most sought-after in
                      the job market, with consistent growth year over year.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Practical Skills
                    </h3>
                    <p className="text-muted-foreground">
                      Build real-world projects that you can add to your
                      portfolio and showcase to potential employers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-amber-100 p-3">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Industry Recognition
                    </h3>
                    <p className="text-muted-foreground">
                      Earn certificates that are recognized by top employers and
                      showcase your expertise in the field.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-12 border-t">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Related Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "Frontend Development",
                icon: <Code className="h-5 w-5" />,
                color: "bg-blue-100 text-blue-700",
                count: 86,
              },
              {
                title: "Backend Development",
                icon: <Code className="h-5 w-5" />,
                color: "bg-purple-100 text-purple-700",
                count: 74,
              },
              {
                title: "Mobile Development",
                icon: <Smartphone className="h-5 w-5" />,
                color: "bg-green-100 text-green-700",
                count: 68,
              },
              {
                title: "UI/UX Design",
                icon: <Palette className="h-5 w-5" />,
                color: "bg-amber-100 text-amber-700",
                count: 52,
              },
            ].map((category, index) => (
              <Link href="#" key={index}>
                <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden">
                  <div
                    className={`h-1 w-full ${category.color.split(" ")[0]}`}
                  />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${category.color}`}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{category.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {category.count} courses
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-blue-100 mb-8">
              Join thousands of students already learning {categoryData.title}.
              Get started today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-blue-600 hover:bg-blue-50"
              >
                Browse All Courses
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-blue-500"
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

function Smartphone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}
