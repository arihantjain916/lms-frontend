"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  Clock,
  Calendar,
  Users,
  Filter,
  Search,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { getPrograms } from "@/lib/content-api";
import { usePageRestoreKey } from "@/hooks/use-page-restore-key";

export default function ProgramsPage() {
  const restoreKey = usePageRestoreKey();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [apiPrograms, setApiPrograms] = useState<any[]>([]);
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
    { id: "certificate", label: "Certificate Programs" },
    { id: "degree", label: "Degree Programs" },
    { id: "professional", label: "Professional Training" },
    { id: "bootcamp", label: "Bootcamps" },
    { id: "self-paced", label: "Self-Paced Learning" },
  ];

  // Toggle filter selection
  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  // Programs data
  const samplePrograms = [
    {
      id: 1,
      title: "Full Stack Web Development Bootcamp",
      category: "bootcamp",
      description:
        "Become a full-stack web developer in 12 weeks. Learn HTML, CSS, JavaScript, React, Node.js, and more.",
      duration: "12 weeks",
      schedule: "Full-time",
      startDate: "January 15, 2024",
      students: 1245,
      rating: 4.8,
      reviews: 342,
      image: "/placeholder.svg?height=300&width=600",
      featured: true,
      certificate: true,
      price: "$8,995",
      skills: [
        "HTML/CSS",
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB",
        "Express",
      ],
    },
    {
      id: 2,
      title: "Data Science Professional Certificate",
      category: "certificate",
      description:
        "Master the skills needed to succeed in data science and machine learning. Includes Python, statistics, data visualization, and ML algorithms.",
      duration: "6 months",
      schedule: "Part-time",
      startDate: "February 1, 2024",
      students: 987,
      rating: 4.7,
      reviews: 215,
      image: "/placeholder.svg?height=300&width=600",
      featured: true,
      certificate: true,
      price: "$2,495",
      skills: [
        "Python",
        "Statistics",
        "Data Visualization",
        "Machine Learning",
        "SQL",
        "Data Analysis",
      ],
    },
    {
      id: 3,
      title: "Bachelor of Science in Computer Science",
      category: "degree",
      description:
        "A comprehensive undergraduate degree program covering computer science fundamentals, programming, algorithms, and software engineering.",
      duration: "4 years",
      schedule: "Full-time",
      startDate: "September 2024",
      students: 2456,
      rating: 4.9,
      reviews: 567,
      image: "/placeholder.svg?height=300&width=600",
      featured: false,
      certificate: false,
      price: "$15,000/year",
      skills: [
        "Programming",
        "Algorithms",
        "Data Structures",
        "Software Engineering",
        "Computer Architecture",
      ],
    },
    {
      id: 4,
      title: "UX/UI Design Professional Training",
      category: "professional",
      description:
        "Learn user experience and user interface design principles and tools. Create portfolio-ready projects and prepare for a career in design.",
      duration: "4 months",
      schedule: "Part-time",
      startDate: "March 15, 2024",
      students: 756,
      rating: 4.6,
      reviews: 189,
      image: "/placeholder.svg?height=300&width=600",
      featured: false,
      certificate: true,
      price: "$3,495",
      skills: [
        "UI Design",
        "UX Research",
        "Wireframing",
        "Prototyping",
        "Figma",
        "User Testing",
      ],
    },
    {
      id: 5,
      title: "Digital Marketing Certification",
      category: "certificate",
      description:
        "Comprehensive training in digital marketing strategies, SEO, social media marketing, content creation, and analytics.",
      duration: "3 months",
      schedule: "Self-paced",
      startDate: "Anytime",
      students: 1823,
      rating: 4.7,
      reviews: 412,
      image: "/placeholder.svg?height=300&width=600",
      featured: true,
      certificate: true,
      price: "$1,995",
      skills: [
        "SEO",
        "Social Media Marketing",
        "Content Marketing",
        "Google Analytics",
        "Email Marketing",
      ],
    },
    {
      id: 6,
      title: "Master of Business Administration (MBA)",
      category: "degree",
      description:
        "Develop advanced business and management skills with our comprehensive MBA program. Specialize in finance, marketing, or entrepreneurship.",
      duration: "2 years",
      schedule: "Full-time or Part-time",
      startDate: "September 2024",
      students: 1245,
      rating: 4.8,
      reviews: 356,
      image: "/placeholder.svg?height=300&width=600",
      featured: false,
      certificate: false,
      price: "$25,000/year",
      skills: [
        "Leadership",
        "Finance",
        "Marketing",
        "Strategy",
        "Operations Management",
      ],
    },
    {
      id: 7,
      title: "Cybersecurity Bootcamp",
      category: "bootcamp",
      description:
        "Intensive training in cybersecurity fundamentals, network security, ethical hacking, and security operations.",
      duration: "14 weeks",
      schedule: "Full-time",
      startDate: "February 12, 2024",
      students: 678,
      rating: 4.9,
      reviews: 145,
      image: "/placeholder.svg?height=300&width=600",
      featured: true,
      certificate: true,
      price: "$9,995",
      skills: [
        "Network Security",
        "Ethical Hacking",
        "Security Operations",
        "Cryptography",
        "Risk Management",
      ],
    },
    {
      id: 8,
      title: "Python Programming Fundamentals",
      category: "self-paced",
      description:
        "Learn Python programming from scratch. Perfect for beginners with no prior coding experience.",
      duration: "2 months",
      schedule: "Self-paced",
      startDate: "Anytime",
      students: 3456,
      rating: 4.7,
      reviews: 789,
      image: "/placeholder.svg?height=300&width=600",
      featured: false,
      certificate: true,
      price: "$499",
      skills: [
        "Python",
        "Programming Basics",
        "Data Types",
        "Functions",
        "Object-Oriented Programming",
      ],
    },
  ];

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    getPrograms(page, 12)
      .then((response) => {
        if (!active) return;
        setApiPrograms(
          response.data.map((program, index) => ({
            id: program.id,
            slug: program.slug,
            title: program.title,
            category: "program",
            description: program.description || "",
            duration: program.durationWeeks
              ? `${program.durationWeeks} weeks`
              : "Flexible",
            schedule: "Flexible",
            startDate: program.startDate
              ? new Date(program.startDate).toLocaleDateString(undefined, {
                  dateStyle: "long",
                })
              : "Contact us",
            students: 0,
            rating: 0,
            reviews: 0,
            image: program.thumbnailUrl || "/placeholder.svg",
            featured: index < 3,
            certificate: true,
            price:
              program.price == null
                ? "Contact us"
                : new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: program.currency || "USD",
                  }).format(program.price),
            skills: [],
          })),
        );
        setTotalPages(Math.max(response.totalPages, 1));
      })
      .catch((error: any) => {
        setLoadError(error?.message || "Unable to load programs");
        toast({
          title: "Unable to load programs",
          description: error?.message || "Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, [page, restoreKey, toast]);

  const programs = apiPrograms;

  // Filter programs based on search and filters
  const filteredPrograms = programs.filter((program) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        program.title.toLowerCase().includes(query) ||
        program.description.toLowerCase().includes(query) ||
        program.category.toLowerCase().includes(query)
      );
    }

    // Category filters
    if (selectedFilters.length > 0) {
      return selectedFilters.includes(program.category);
    }

    return true;
  });

  // Featured programs
  const featuredPrograms = programs.filter((program) => program.featured);

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
                <BreadcrumbLink href="/programs" className="font-medium">
                  Programs
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Educational Programs
              </h1>
              <p className="text-muted-foreground">
                Discover our comprehensive range of educational programs
                designed to help you achieve your goals
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
                placeholder="Search programs..."
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
              <div className="hidden md:flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
                {filterOptions.slice(0, 3).map((option) => (
                  <Badge
                    key={option.id}
                    variant={
                      selectedFilters.includes(option.id)
                        ? "default"
                        : "outline"
                    }
                    className={`cursor-pointer ${
                      selectedFilters.includes(option.id)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "hover:bg-blue-50"
                    }`}
                    onClick={() => toggleFilter(option.id)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
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
              <h3 className="font-medium mb-3">Filter Programs</h3>
              <div className="grid grid-cols-1 gap-2">
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
                    <h3 className="font-semibold">Filter Programs</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {filterOptions.map((option) => (
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

            {/* Programs Grid */}
            <div className="lg:col-span-3">
              {/* Featured Programs Section */}
              {!searchQuery && selectedFilters.length === 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-6">Featured Programs</h2>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                  >
                    {featuredPrograms.map((program) => (
                      <motion.div key={program.id} variants={fadeIn}>
                        <Link href={`/programs/${program.slug || program.id}`}>
                          <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden">
                            <div className="relative">
                              <Image
                                src={program.image || "/placeholder.svg"}
                                alt={program.title}
                                width={600}
                                height={300}
                                className="w-full h-[200px] object-cover"
                              />
                              <Badge className="absolute top-4 left-4 bg-blue-600">
                                Featured
                              </Badge>
                            </div>
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold">
                                  {program.title}
                                </h3>
                                {program.certificate && (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-600"
                                  >
                                    Certificate
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                {program.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {program.skills
                                  .slice(0, 3)
                                  .map((skill: string, idx: number) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="bg-blue-50 text-blue-600"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                {program.skills.length > 3 && (
                                  <Badge variant="outline">
                                    +{program.skills.length - 3} more
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{program.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{program.startDate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                  <span>
                                    {program.rating} ({program.reviews})
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                <div className="font-bold text-blue-600">
                                  {program.price}
                                </div>
                                <Button
                                  size="sm"
                                  className="gap-1 bg-blue-600 hover:bg-blue-700"
                                >
                                  Learn More
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

              {/* All Programs */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {searchQuery
                      ? `Search Results (${filteredPrograms.length})`
                      : selectedFilters.length > 0
                        ? `Filtered Programs (${filteredPrograms.length})`
                        : "All Programs"}
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

                {filteredPrograms.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                      <Search className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No programs found
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
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                      >
                        {loading && (
                          <p className="col-span-full py-12 text-center text-muted-foreground">
                            Loading programs…
                          </p>
                        )}
                        {loadError && (
                          <p className="col-span-full rounded border border-red-200 bg-red-50 p-6 text-center text-red-700">
                            {loadError}
                          </p>
                        )}
                        {!loading &&
                          !loadError &&
                          filteredPrograms.length === 0 && (
                            <p className="col-span-full py-12 text-center text-muted-foreground">
                              No programs found.
                            </p>
                          )}
                        {filteredPrograms.map((program) => (
                          <motion.div key={program.id} variants={fadeIn}>
                            <Link href={`/programs/${program.slug || program.id}`}>
                              <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden">
                                <div className="relative">
                                  <Image
                                    src={program.image || "/placeholder.svg"}
                                    alt={program.title}
                                    width={600}
                                    height={300}
                                    className="w-full h-[200px] object-cover"
                                  />
                                  {program.featured && (
                                    <Badge className="absolute top-4 left-4 bg-blue-600">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <CardContent className="p-6">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-semibold">
                                      {program.title}
                                    </h3>
                                    {program.certificate && (
                                      <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-600"
                                      >
                                        Certificate
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                    {program.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {program.skills
                                      .slice(0, 3)
                                      .map((skill: string, idx: number) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="bg-blue-50 text-blue-600"
                                        >
                                          {skill}
                                        </Badge>
                                      ))}
                                    {program.skills.length > 3 && (
                                      <Badge variant="outline">
                                        +{program.skills.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span>{program.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span>{program.startDate}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                      <span>
                                        {program.rating} ({program.reviews})
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                    <div className="font-bold text-blue-600">
                                      {program.price}
                                    </div>
                                    <Button
                                      size="sm"
                                      className="gap-1 bg-blue-600 hover:bg-blue-700"
                                    >
                                      Learn More
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="list" className="mt-6">
                      <motion.div
                        className="space-y-6"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                      >
                        {filteredPrograms.map((program) => (
                          <motion.div key={program.id} variants={fadeIn}>
                            <Link href={`/programs/${program.slug || program.id}`}>
                              <Card className="transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                  <div className="relative md:w-1/3">
                                    <Image
                                      src={program.image || "/placeholder.svg"}
                                      alt={program.title}
                                      width={600}
                                      height={300}
                                      className="w-full h-[200px] md:h-full object-cover"
                                    />
                                    {program.featured && (
                                      <Badge className="absolute top-4 left-4 bg-blue-600">
                                        Featured
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="text-xl font-semibold">
                                        {program.title}
                                      </h3>
                                      {program.certificate && (
                                        <Badge
                                          variant="outline"
                                          className="bg-green-50 text-green-600"
                                        >
                                          Certificate
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">
                                      {program.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {program.skills.map(
                                        (skill: string, idx: number) => (
                                          <Badge
                                            key={idx}
                                            variant="outline"
                                            className="bg-blue-50 text-blue-600"
                                          >
                                            {skill}
                                          </Badge>
                                        ),
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>{program.duration}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>{program.startDate}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>{program.students} students</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                        <span>
                                          {program.rating} ({program.reviews}{" "}
                                          reviews)
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                      <div className="font-bold text-blue-600">
                                        {program.price}
                                      </div>
                                      <Button className="gap-1 bg-blue-600 hover:bg-blue-700">
                                        Learn More
                                        <ChevronRight className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
          </div>
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Programs */}
      <section className="py-16 bg-blue-50 border-t">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Programs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our educational programs are designed to provide you with the
              skills and knowledge you need to succeed in today's competitive
              world.
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
                      in their fields. Our instructors are passionate about
                      teaching and committed to your success.
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
                      Industry-Recognized Credentials
                    </h3>
                    <p className="text-muted-foreground">
                      Earn certificates and degrees that are respected by
                      employers worldwide. Our programs are designed with
                      industry needs in mind.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Supportive Community
                    </h3>
                    <p className="text-muted-foreground">
                      Join a community of learners and professionals who will
                      support you throughout your educational journey and
                      beyond.
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
              Ready to Advance Your Career?
            </h2>
            <p className="text-blue-100 mb-8">
              Take the next step in your educational journey. Browse our
              programs and find the perfect fit for your goals and aspirations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-blue-600 hover:bg-blue-50"
              >
                Explore All Programs
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white text-white hover:bg-blue-500"
              >
                Contact an Advisor
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
