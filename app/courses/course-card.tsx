import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Course } from "@/lib/course-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function price(value?: number | null) {
  if (!value) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/courses/${course.id}`}
        className="relative block h-44 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100"
      >
        <Image
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {course.isFeatured && (
          <Badge className="absolute left-4 top-4 bg-blue-600">Featured</Badge>
        )}
      </Link>
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge variant="outline">
            {course.category?.name || course.level || "Course"}
          </Badge>
          <span className="flex items-center gap-1 text-sm font-medium">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {Number(course.avgRating ?? 0).toFixed(1)}
          </span>
        </div>
        <Link href={`/courses/${course.id}`}>
          <h3 className="line-clamp-2 text-lg font-semibold group-hover:text-blue-700">
            {course.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {course.description ||
            "Build practical skills with this EduPortal course."}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          By {course.user?.name || "EduPortal instructor"}
        </p>
        <div className="mt-auto flex items-center justify-between border-t pt-4">
          <span className="text-lg font-bold text-blue-700">
            {price(course.price)}
          </span>
          <Button asChild size="sm">
            <Link href={`/courses/${course.id}`}>View course</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
