"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import instance from "@/helper/axios";
import { Calendar, Clock, Tag, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type User = {
  name?: string;
};

type Comment = {
  id: string | number;
  comment?: string;
  createdAt?: string;
  user?: User;
};

export default function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [comment, setComment] = useState("");

  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await instance.get(`/blog/${slug}`);
        setBlog(res.data);
      } catch (error) {
        console.error("Failed to fetch blog", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  /* ================= FETCH COMMENTS ================= */

   const fetchComments = async (id:string) => {
      try {
        const res = await instance.get(`/blog/${id}/comments`);

        const safeComments: Comment[] = (res.data || [])
          .filter(Boolean) // 🔥 removes undefined/null
          .map((c: any) => ({
            id: c.id,
            message: c.message,
            createdAt: c.createdAt,
            user: c.user || { name: "Anonymous" },
          }));

        setComments(safeComments);
      } catch (error) {
        console.error("Failed to fetch comments", error);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };
  useEffect(() => {
    if (!blog?.id) return;

    

    fetchComments(blog?.id);
  }, [blog?.id]);

  /* ================= ADD COMMENT ================= */
  const handleCommentSubmit = async () => {
    if (!comment.trim() || !blog?.id) return;

    try {
      const res = await instance.post("/blog/comment", {
        blogId: blog.id,
        comment: comment,
      });

      fetchComments(blog?.id);
      setComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
      alert("Unable to post comment");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="container py-32 text-center text-muted-foreground">
        Loading blog...
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!blog) {
    return (
      <div className="container py-32 text-center">
        <h2 className="text-3xl font-bold">Blog not found</h2>
      </div>
    );
  }

  return (
    <article className="bg-background">
      {/* ================= HERO ================= */}
      <section className="border-b">
        <div className="container max-w-4xl py-16">
          <Badge className="mb-4 bg-blue-600 text-white">
            {blog.category}
          </Badge>

          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

          <p className="text-muted-foreground mb-6">
            {blog.description}
          </p>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(blog.createdAt).toDateString()}
            </span>

            <span className="flex items-center gap-2">
              <Clock size={16} />
              {blog.read_time}
            </span>

            <span className="flex items-center gap-2">
              <Tag size={16} />
              {blog.tag}
            </span>
          </div>
        </div>
      </section>

      {/* ================= IMAGE ================= */}
      <section className="container max-w-4xl -mt-12">
        <Image
          src={blog.imageUrl || "/placeholder.svg"}
          alt={blog.title}
          width={1200}
          height={600}
          className="rounded-xl shadow-lg"
          priority
        />
      </section>

      {/* ================= CONTENT ================= */}
      <section className="container max-w-4xl py-16">
      <div
  className="prose max-w-none"
  dangerouslySetInnerHTML={{ __html: blog.content }}
/>


        {/* ================= AUTHOR ================= */}
        <Card className="mt-12">
          <CardContent className="flex gap-4 p-6">
            <Avatar>
              <AvatarFallback>
                {blog.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold">
                {blog.user?.name || "Unknown Author"}
              </p>
              <p className="text-sm text-muted-foreground">
                {blog.user?.username}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ================= COMMENTS ================= */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">
            Comments ({comments.length})
          </h3>

          {/* Add Comment */}
          <div className="flex gap-4 mb-8">
            <Avatar>
              <AvatarFallback>G</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <Textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <Button
                onClick={handleCommentSubmit}
                disabled={!comment.trim()}
                className="mt-3 flex gap-2"
              >
                <Send size={16} />
                Post Comment
              </Button>
            </div>
          </div>

          {commentsLoading && (
            <p className="text-muted-foreground">
              Loading comments...
            </p>
          )}

          {!commentsLoading && comments.length === 0 && (
            <p className="text-muted-foreground">
              No comments yet.
            </p>
          )}

          <div className="space-y-5">
            {comments.map((c) => (
              <div
                key={c.id}
                className="flex gap-4 border p-4 rounded-lg"
              >
                <Avatar>
                  <AvatarFallback>
                    {c.user?.name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold">
                    {c.user?.name ?? "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.createdAt
                      ? new Date(c.createdAt).toDateString()
                      : ""}
                  </p>
                  <p className="mt-1">
                    {c.comment ?? ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
