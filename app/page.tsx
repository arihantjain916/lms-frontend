"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Users,
  Award,
  ChevronRight,
  Menu,
  X,
  Search,
  Star,
  ArrowRight,
  Bell,
  Calendar,
  FileText,
  Info,
  Briefcase,
  Newspaper,
  Mail,
  Shield,
  Cookie,
  HelpCircle,
  LifeBuoy,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useMobile } from "@/hooks/use-mobile";
import instance from "@/helper/axios";
import { getIcon } from "@/lib/getIcon";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function HomePage() {
  const router = useRouter();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const notificationRef = useRef<HTMLDivElement>(null);
  const [courseCategories, setCourseCategories] = useState<any[]>([]);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function handleFetchAllCategories() {
      try {
        const res: any = await instance.get("/category");
        if (!res?.status) {
          return toast.error("Something went wrong");
        }
        const topCategories = [...res?.data]
          .sort((a, b) => b.courseCount - a.courseCount)
          .slice(0, 4);

        setCourseCategories(topCategories);
      } catch (e) {
        // setCourseCategories([]);
      }
    }
    handleFetchAllCategories();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Subscribed!");
    setEmail("");
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const notifications = [
    {
      id: 1,
      title: "New Course Available",
      message: "Advanced Python Programming is now available",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Assignment Reminder",
      message: "Your Web Development project is due tomorrow",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Live Webinar",
      message: "Join our AI in Education webinar this Friday",
      time: "1 day ago",
      read: true,
    },
  ];

  // const courseCategories = [
  //   {
  //     title: "Web Development",
  //     count: 42,
  //     icon: <BookOpen className="h-6 w-6" />,
  //     color: "bg-blue-100 text-blue-700",
  //   },
  //   {
  //     title: "Data Science",
  //     count: 36,
  //     icon: <GraduationCap className="h-6 w-6" />,
  //     color: "bg-purple-100 text-purple-700",
  //   },
  //   {
  //     title: "Business",
  //     count: 28,
  //     icon: <Users className="h-6 w-6" />,
  //     color: "bg-amber-100 text-amber-700",
  //   },
  //   {
  //     title: "Design",
  //     count: 24,
  //     icon: <Award className="h-6 w-6" />,
  //     color: "bg-emerald-100 text-emerald-700",
  //   },
  // ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Web Developer",
      image: "/placeholder.svg?height=80&width=80",
      content:
        "The courses on this platform completely transformed my career. I went from knowing nothing about coding to landing a full-time developer position in just 6 months.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      image: "/placeholder.svg?height=80&width=80",
      content:
        "The data science program offered here is comprehensive and up-to-date with industry standards. The instructors are experienced professionals who provide valuable insights.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      image: "/placeholder.svg?height=80&width=80",
      content:
        "As someone transitioning into design, I found the courses here incredibly practical. The projects helped me build a portfolio that impressed employers.",
      rating: 4,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-background pt-16 pb-12 md:py-20 lg:py-28">
          <div className="container relative">
            <motion.div
              className="grid gap-8 md:grid-cols-2 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div
                className="flex flex-col gap-4 text-center md:text-left p-4"
                variants={fadeIn}
              >
                <Badge
                  className="w-fit mx-auto md:mx-0 bg-green-100 text-green-700 hover:bg-green-200"
                  variant="secondary"
                >
                  Transform Your Future
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight p-2">
                  Learn Without <span className="text-blue-600">Limits</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-[600px]">
                  Discover thousands of courses taught by expert instructors to
                  help you achieve your goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 mx-auto md:mx-0">
                  <Button
                    size="lg"
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Explore Courses
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    View Programs
                  </Button>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Avatar
                        key={i}
                        className="border-2 border-background w-8 h-8"
                      >
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32`}
                        />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Join{" "}
                    <span className="font-medium text-foreground">10,000+</span>{" "}
                    students
                  </p>
                </div>
              </motion.div>
              <motion.div className="relative" variants={fadeIn}>
                <div className="relative mx-auto max-w-[500px]">
                  <div className="absolute -top-4 -left-4 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
                  <Image
                    src="/placeholder.svg?height=600&width=600"
                    width={600}
                    height={600}
                    alt="Students learning"
                    className="relative z-10 rounded-xl shadow-xl"
                    priority
                  />
                  <motion.div
                    className="absolute -bottom-6 -right-6 rounded-lg bg-background p-4 shadow-lg z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-green-100 p-2">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Trusted by</p>
                        <p className="text-2xl font-bold">500+ Companies</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y">
          <div className="container">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                { label: "Courses", value: "1,000+", color: "text-blue-600" },
                {
                  label: "Students",
                  value: "50,000+",
                  color: "text-purple-600",
                },
                {
                  label: "Instructors",
                  value: "200+",
                  color: "text-green-600",
                },
                {
                  label: "Success Rate",
                  value: "95%",
                  color: "text-amber-600",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center"
                  variants={fadeIn}
                >
                  <h3
                    className={`text-3xl md:text-4xl font-bold ${stat.color}`}
                  >
                    {stat.value}
                  </h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Explore Top Categories
              </h2>
              <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
                Browse our most popular course categories and find the right
                path for your career goals.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {courseCategories.map((category: any, index: number) => {
                const { Icon, bg } = getIcon(category.icon);
                return (
                  <motion.div key={index} variants={fadeIn}>
                    {/* {"arihant"} */}
                    <Link href={`/categories/${category.slug}`}>
                      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
                        <CardContent className="p-6">
                          <div
                            className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${bg}`}
                          >
                            {/* {React.createElement(getIcon(category.icon))} */}
                            <Icon className="h-6 w-6" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">
                            {category?.name}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {category?.courseCount} courses
                          </p>
                          <div className="flex items-center text-blue-600 text-sm font-medium">
                            Explore Courses
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => {
                  router.push("/categories");
                }}
              >
                View All Categories
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-16 md:py-24 bg-blue-50/50 px-4">
          <div className="container">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Featured Courses
                </h2>
                <p className="text-muted-foreground text-lg max-w-[600px]">
                  Expand your skills with our most popular and highly-rated
                  courses.
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                View All Courses
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>

            {/* <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[1, 2, 3].map((course) => (
                <motion.div key={course} variants={fadeIn}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="relative">
                      <Image
                        src={`/placeholder.svg?height=200&width=400`}
                        width={400}
                        height={200}
                        alt={`Course ${course}`}
                        className="w-full h-[200px] object-cover"
                      />
                      <Badge
                        className="absolute top-4 left-4"
                        variant="secondary"
                      >
                        Bestseller
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          variant="outline"
                          className={courseCategories[course % 4].color}
                        >
                          {courseCategories[course % 4].title}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span className="ml-1 text-sm font-medium">4.8</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {course === 1
                          ? "Complete Web Development Bootcamp"
                          : course === 2
                          ? "Data Science: Machine Learning Fundamentals"
                          : "UX/UI Design Masterclass"}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {course === 1
                          ? "Learn HTML, CSS, JavaScript, React, Node and more to become a full-stack developer."
                          : course === 2
                          ? "Master the essentials of data science and machine learning with Python."
                          : "Create stunning user interfaces and experiences with modern design principles."}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback>IN</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">John Smith</span>
                        </div>
                        <p className="font-bold text-blue-600">$49.99</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div> */}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our Students Say
              </h2>
              <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
                Hear from our students who have transformed their careers
                through our courses.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < testimonial.rating
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                      </div>
                      <p className="italic mb-6">"{testimonial.content}"</p>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src={testimonial.image || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {testimonial.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-blue-600 text-white">
          <div className="container">
            <motion.div
              className="max-w-[800px] mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Join thousands of students already learning on our platform. Get
                started today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 bg-white text-blue-600 hover:bg-blue-50"
                >
                  Get Started Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-blue-500"
                >
                  Browse Courses
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 md:py-24 bg-blue-50">
          <div className="container">
            <motion.div
              className="max-w-[600px] mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-8">
                Subscribe to our newsletter for the latest course updates,
                educational tips, and special offers.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
