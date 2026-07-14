"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Code,
  Briefcase,
  Palette,
  Camera,
  Music,
  Heart,
  Globe,
  Microscope,
  Calculator,
  Lightbulb,
  Leaf,
  Search,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import instance from "@/helper/axios";
import { usePageRestoreKey } from "@/hooks/use-page-restore-key";
import { getIcon } from "@/lib/getIcon";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const restoreKey = usePageRestoreKey();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("popular");
  const [allCategories, setAllCategories] = useState<any[]>([]);

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
    async function handleFetchAllCategories() {
      try {
        const res: any = await instance.get("/category");
        if (!res?.status) {
          return toast.error("Something went wrong");
        }
        setAllCategories(res?.data);
      } catch (e) {
        // setCourseCategories([]);
      }
    }
    handleFetchAllCategories();
  }, [restoreKey]);

  // Category data with icons
  // const allCategories = [
  //   {
  //     id: 1,
  //     title: "Web Development",
  //     icon: <Code className="h-6 w-6" />,
  //     color: "bg-blue-100 text-blue-700",
  //     count: 142,
  //     featured: true,
  //     description:
  //       "Learn to build websites and web applications with modern technologies",
  //     subcategories: [
  //       "HTML & CSS",
  //       "JavaScript",
  //       "React",
  //       "Node.js",
  //       "Full Stack",
  //     ],
  //   },
  //   {
  //     id: 2,
  //     title: "Data Science",
  //     icon: <Calculator className="h-6 w-6" />,
  //     color: "bg-purple-100 text-purple-700",
  //     count: 98,
  //     featured: true,
  //     description:
  //       "Analyze data, create visualizations, and build predictive models",
  //     subcategories: [
  //       "Python",
  //       "Machine Learning",
  //       "Data Analysis",
  //       "Statistics",
  //       "Big Data",
  //     ],
  //   },
  //   {
  //     id: 3,
  //     title: "Business",
  //     icon: <Briefcase className="h-6 w-6" />,
  //     color: "bg-amber-100 text-amber-700",
  //     count: 87,
  //     featured: true,
  //     description:
  //       "Develop business skills from leadership to marketing and finance",
  //     subcategories: [
  //       "Marketing",
  //       "Finance",
  //       "Entrepreneurship",
  //       "Management",
  //       "Strategy",
  //     ],
  //   },
  //   {
  //     id: 4,
  //     title: "Design",
  //     icon: <Palette className="h-6 w-6" />,
  //     color: "bg-emerald-100 text-emerald-700",
  //     count: 76,
  //     featured: true,
  //     description:
  //       "Master graphic design, UX/UI, and other creative disciplines",
  //     subcategories: [
  //       "UX/UI Design",
  //       "Graphic Design",
  //       "Web Design",
  //       "3D & Animation",
  //       "Illustration",
  //     ],
  //   },
  //   {
  //     id: 5,
  //     title: "Photography",
  //     icon: <Camera className="h-6 w-6" />,
  //     color: "bg-rose-100 text-rose-700",
  //     count: 54,
  //     featured: false,
  //     description:
  //       "Learn photography techniques, editing, and visual storytelling",
  //     subcategories: [
  //       "Digital Photography",
  //       "Portrait",
  //       "Landscape",
  //       "Commercial",
  //       "Editing",
  //     ],
  //   },
  //   {
  //     id: 6,
  //     title: "Music",
  //     icon: <Music className="h-6 w-6" />,
  //     color: "bg-indigo-100 text-indigo-700",
  //     count: 42,
  //     featured: false,
  //     description: "Explore music theory, production, and instrument lessons",
  //     subcategories: [
  //       "Music Theory",
  //       "Production",
  //       "Instruments",
  //       "Vocals",
  //       "Composition",
  //     ],
  //   },
  //   {
  //     id: 7,
  //     title: "Health & Fitness",
  //     icon: <Heart className="h-6 w-6" />,
  //     color: "bg-red-100 text-red-700",
  //     count: 68,
  //     featured: false,
  //     description:
  //       "Improve your health with fitness, nutrition, and wellness courses",
  //     subcategories: [
  //       "Fitness",
  //       "Nutrition",
  //       "Mental Health",
  //       "Yoga",
  //       "Personal Training",
  //     ],
  //   },
  //   {
  //     id: 8,
  //     title: "Language Learning",
  //     icon: <Globe className="h-6 w-6" />,
  //     color: "bg-sky-100 text-sky-700",
  //     count: 93,
  //     featured: false,
  //     description: "Learn new languages and improve your communication skills",
  //     subcategories: ["English", "Spanish", "Chinese", "French", "Japanese"],
  //   },
  //   {
  //     id: 9,
  //     title: "Science",
  //     icon: <Microscope className="h-6 w-6" />,
  //     color: "bg-teal-100 text-teal-700",
  //     count: 47,
  //     featured: false,
  //     description:
  //       "Explore scientific concepts from physics to biology and chemistry",
  //     subcategories: [
  //       "Physics",
  //       "Biology",
  //       "Chemistry",
  //       "Astronomy",
  //       "Environmental Science",
  //     ],
  //   },
  //   {
  //     id: 10,
  //     title: "Mathematics",
  //     icon: <Calculator className="h-6 w-6" />,
  //     color: "bg-cyan-100 text-cyan-700",
  //     count: 38,
  //     featured: false,
  //     description:
  //       "Master mathematical concepts from algebra to advanced calculus",
  //     subcategories: [
  //       "Algebra",
  //       "Calculus",
  //       "Statistics",
  //       "Geometry",
  //       "Discrete Math",
  //     ],
  //   },
  //   {
  //     id: 11,
  //     title: "Personal Development",
  //     icon: <Lightbulb className="h-6 w-6" />,
  //     color: "bg-yellow-100 text-yellow-700",
  //     count: 112,
  //     featured: false,
  //     description: "Improve your productivity, leadership, and personal skills",
  //     subcategories: [
  //       "Leadership",
  //       "Productivity",
  //       "Communication",
  //       "Public Speaking",
  //       "Career Development",
  //     ],
  //   },
  //   {
  //     id: 12,
  //     title: "Environmental Studies",
  //     icon: <Leaf className="h-6 w-6" />,
  //     color: "bg-green-100 text-green-700",
  //     count: 29,
  //     featured: false,
  //     description:
  //       "Learn about sustainability, conservation, and environmental science",
  //     subcategories: [
  //       "Sustainability",
  //       "Conservation",
  //       "Climate Change",
  //       "Ecology",
  //       "Green Energy",
  //     ],
  //   },
  //   {
  //     id: 13,
  //     title: "Marketing",
  //     icon: <Briefcase className="h-6 w-6" />,
  //     color: "bg-orange-100 text-orange-700",
  //     count: 74,
  //     featured: false,
  //     description: "Master digital marketing, SEO, social media, and more",
  //     subcategories: [
  //       "Digital Marketing",
  //       "SEO",
  //       "Social Media",
  //       "Content Marketing",
  //       "Email Marketing",
  //     ],
  //   },
  //   {
  //     id: 14,
  //     title: "Computer Science",
  //     icon: <Code className="h-6 w-6" />,
  //     color: "bg-blue-100 text-blue-700",
  //     count: 86,
  //     featured: false,
  //     description: "Explore algorithms, data structures, and computer theory",
  //     subcategories: [
  //       "Algorithms",
  //       "Data Structures",
  //       "Operating Systems",
  //       "Computer Architecture",
  //       "Artificial Intelligence",
  //     ],
  //   },
  //   {
  //     id: 15,
  //     title: "Art & Creativity",
  //     icon: <Palette className="h-6 w-6" />,
  //     color: "bg-fuchsia-100 text-fuchsia-700",
  //     count: 63,
  //     featured: false,
  //     description: "Develop your artistic skills across various mediums",
  //     subcategories: [
  //       "Drawing",
  //       "Painting",
  //       "Sculpture",
  //       "Digital Art",
  //       "Mixed Media",
  //     ],
  //   },
  //   {
  //     id: 16,
  //     title: "Education & Teaching",
  //     icon: <GraduationCap className="h-6 w-6" />,
  //     color: "bg-blue-100 text-blue-700",
  //     count: 51,
  //     featured: false,
  //     description:
  //       "Learn teaching methods, educational theory, and classroom management",
  //     subcategories: [
  //       "K-12",
  //       "Higher Education",
  //       "Online Teaching",
  //       "Special Education",
  //       "Educational Technology",
  //     ],
  //   },
  // ];

  // Filter options
  const filterOptions = [
    { id: "featured", label: "Featured Categories" },
    { id: "free", label: "Free Courses Available" },
    { id: "certificate", label: "Certificate Included" },
    { id: "beginner", label: "Beginner Friendly" },
    { id: "trending", label: "Trending Now" },
  ];

  // Toggle filter selection
  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  // Filter categories based on search and filters
  const filteredCategories = allCategories
    .filter((category) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          category.title.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query) ||
          category.subcategories.some((sub: any) =>
            sub.toLowerCase().includes(query),
          )
        );
      }
      return true;
    })
    .filter((category) => {
      // Other filters
      if (selectedFilters.includes("featured") && !category.isFeatured) {
        return false;
      }
      return true;
    });

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortOption === "popular") {
      return b.count - a.count;
    } else if (sortOption === "az") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "za") {
      return b.title.localeCompare(a.title);
    } else if (sortOption === "courses") {
      return b.count - a.count;
    }
    return 0;
  });

  // Featured categories
  const featuredCategories = allCategories.filter(
    (category) => category.isFeatured,
  );

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
                <BreadcrumbLink href="/categories" className="font-medium">
                  Categories
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Course Categories
              </h1>
              <p className="text-muted-foreground">
                Browse all {allCategories.length} categories and find the
                perfect course for you
              </p>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-blue-200 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
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
                placeholder="Search categories..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className={`md:hidden ${
                  showFilters ? "bg-blue-50 text-blue-600" : ""
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
              </Button>
              <div className="hidden md:flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
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
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="az">A-Z</SelectItem>
                  <SelectItem value="za">Z-A</SelectItem>
                  <SelectItem value="courses">Most Courses</SelectItem>
                </SelectContent>
              </Select>
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
              <h3 className="font-medium mb-3">Filter Categories</h3>
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
                    <h3 className="font-semibold">Filter Categories</h3>
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

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Course Level</h3>
                      {[
                        "Beginner",
                        "Intermediate",
                        "Advanced",
                        "All Levels",
                      ].map((level) => (
                        <div
                          key={level}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox id={`level-${level}`} />
                          <Label htmlFor={`level-${level}`}>{level}</Label>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

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

            {/* Categories Grid */}
            <div className="lg:col-span-3">
              {/* Featured Categories Section */}
              {!searchQuery && selectedFilters.length === 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-6">
                    Featured Categories
                  </h2>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                  >
                    {featuredCategories.map((category) => {
                      const { Icon, bg } = getIcon(category.icon);
                      return (
                        <motion.div key={category.id} variants={fadeIn}>
                          <Link href={`/categories/${category.slug}`}>
                            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden">
                              <div className={`h-2 w-full ${bg}`} />
                              <CardContent className="p-6">
                                <div
                                  className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${category.color}`}
                                >
                                  <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                  {category.name}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                  {category.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    {category.courseCount} courses
                                  </span>
                                  <div className="text-blue-600 text-sm font-medium flex items-center">
                                    Explore
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              )}

              {/* All Categories */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {searchQuery
                      ? `Search Results (${sortedCategories.length})`
                      : selectedFilters.length > 0
                        ? `Filtered Categories (${sortedCategories.length})`
                        : "All Categories"}
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

                {sortedCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                      <Search className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No categories found
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
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                      >
                        {sortedCategories.splice(0, 9).map((category) => {
                          const { Icon, bg } = getIcon(category.icon);
                          return (
                            <motion.div key={category.id} variants={fadeIn}>
                              <Link href={`/categories/${category.slug}`}>
                                <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden">
                                  <div className={`h-2 w-full ${bg}`} />
                                  <CardContent className="p-6">
                                    <div
                                      className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${category.color}`}
                                    >
                                      <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="text-xl font-semibold">
                                        {category.name}
                                      </h3>
                                      {category.isFeatured && (
                                        <Badge
                                          variant="outline"
                                          className="bg-blue-50 text-blue-600"
                                        >
                                          Featured
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                      {category.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">
                                        {category.courseCount} courses
                                      </span>
                                      <div className="text-blue-600 text-sm font-medium flex items-center">
                                        Explore
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="list" className="mt-6">
                      <motion.div
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                      >
                        {sortedCategories.map((category) => {
                          const { Icon, bg } = getIcon(category.icon);
                          return (
                            <motion.div key={category.id} variants={fadeIn}>
                              <Link href={`/categories/${category.slug}`}>
                                <Card className="transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden">
                                  <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                      <div
                                        className={`w-full md:w-1 h-2 md:h-auto ${bg}`}
                                      />
                                      <div className="p-6 flex-1">
                                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                          <div
                                            className={`rounded-full w-12 h-12 flex items-center justify-center ${category.color}`}
                                          >
                                            <Icon className="h-6 w-6" />
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                              <h3 className="text-xl font-semibold">
                                                {category.name}
                                              </h3>
                                              <div className="flex items-center gap-2">
                                                {category.isFeatured && (
                                                  <Badge
                                                    variant="outline"
                                                    className="bg-blue-50 text-blue-600"
                                                  >
                                                    Featured
                                                  </Badge>
                                                )}
                                                <span className="text-sm font-medium">
                                                  {category.courseCount} courses
                                                </span>
                                              </div>
                                            </div>
                                            <p className="text-muted-foreground mt-1">
                                              {category.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                              {/* {category.subcategories.map(
                                                (sub: string, idx: number) => (
                                                  <Badge
                                                    key={idx}
                                                    variant="outline"
                                                    className="bg-muted/50"
                                                  >
                                                    {sub}
                                                  </Badge>
                                                )
                                              )} */}
                                            </div>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 hidden md:flex"
                                          >
                                            Explore
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subcategories */}
      <section className="py-12 bg-blue-50/50 border-t">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Popular Subcategories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allCategories.slice(0, 12).map((category, index) => (
              <Link href="#" key={index}>
                <div className="border rounded-md p-3 bg-white hover:border-blue-200 hover:bg-blue-50 transition-colors text-center">
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 border-t">
        <div className="container">
          <div className="max-w-[600px] mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Stay Updated with New Courses
            </h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter and be the first to know when we add
              new categories and courses.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => {
                e.preventDefault();

                toast.success("Subscribed!");
              }}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
                required
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
