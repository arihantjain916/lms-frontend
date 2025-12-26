"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import instance from "@/helper/axios";
import { Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const encodedSlug = encodeURIComponent(slug);
        const res = await instance.get(`/blog/${encodedSlug}`);
        setBlog(res.data ?? null);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="container py-24 text-center text-muted-foreground text-lg">
        Loading blog...
      </div>
    );
  }

  /* ---------------- NOT FOUND ---------------- */
  if (!blog) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-bold mb-2">Blog not found</h2>
        <p className="text-muted-foreground">
          The requested blog does not exist or was removed.
        </p>
      </div>
    );
  }

  return (
    <article className="bg-background">
      {/* ---------------- HERO ---------------- */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white border-b">
        <div className="container max-w-4xl py-14">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            {blog.category}
          </Badge>

          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-5">
            {blog.title}
          </h1>

          <p className="text-muted-foreground text-lg mb-8">
            {blog.description}
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{blog.createdAt}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{blog.read_time}</span>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{blog.tag}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- IMAGE ---------------- */}
      <section className="container max-w-4xl -mt-10 relative z-10">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={blog.imageUrl || "/placeholder.svg"}
            alt={blog.title}
            width={1200}
            height={600}
            className="w-full h-[420px] object-cover"
            priority
          />
        </div>
      </section>

      {/* ---------------- CONTENT ---------------- */}
      <section className="container max-w-4xl py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-bold">
          <p>{blog.content}</p>
        </div>

        {/* ---------------- AUTHOR ---------------- */}
        <Card className="mt-14 border-none shadow-md">
          <CardContent className="flex items-center gap-5 p-6">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg font-semibold">
                {blog.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold text-base">
                {blog.user?.name || "Unknown Author"}
              </p>
              <p className="text-sm text-muted-foreground">
                Instructor • {blog.user?.username}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </article>
  );
}
