"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Loader2, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getWebinars,
  registerForWebinar,
  type Webinar,
} from "@/lib/catalog-api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-authenticated";
import { useRouter } from "next/navigation";
import { loginHref } from "@/lib/auth-navigation";

export default function WebinarsPage() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [items, setItems] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    setPage(1);
  }, [query, status]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const timer = window.setTimeout(
      () =>
        getWebinars({ status, q: query || undefined, page, limit: 12 })
          .then((result) => {
            if (active) {
              setItems(result.data);
              setPages(Math.max(result.totalPages, 1));
            }
          })
          .catch((e) => {
            if (active) {
              setItems([]);
              setError(e?.message || "Unable to load webinars");
            }
          })
          .finally(() => {
            if (active) setLoading(false);
          }),
      250,
    );
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [page, query, status]);
  async function register(item: Webinar) {
    if (!isAuthenticated) {
      router.push(loginHref(`/webinars/${item.slug}`));
      return;
    }
    try {
      await registerForWebinar(item.id);
      toast({
        title: "Registration successful",
        description: `You are registered for “${item.title}”.`,
      });
    } catch (e: any) {
      toast({
        title: "Registration failed",
        description: e?.message || "Please sign in and try again.",
        variant: "destructive",
      });
    }
  }
  return (
    <main className="min-h-screen">
      <section className="border-b bg-blue-50 py-12">
        <div className="container flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-bold">Educational Webinars</h1>
            <p className="mt-2 text-muted-foreground">
              Join live sessions and watch recordings from experienced
              instructors.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link
                href={
                  isAuthenticated ? "/webinars/my" : loginHref("/webinars/my")
                }
              >
                My registrations
              </Link>
            </Button>
            <Button asChild>
              <Link href="/webinars/host">Apply to host</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="sticky top-16 z-30 border-b bg-background/95 py-5 backdrop-blur">
        <div className="container flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search webinars"
              className="pl-9"
            />
          </div>
          <Tabs value={status} onValueChange={setStatus}>
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>
      <section className="container py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border p-12 text-center text-muted-foreground">
            No webinars found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const date = new Date(item.scheduledAt);
              return (
                <Card key={item.id} className="overflow-hidden">
                  <Link
                    href={`/webinars/${item.slug}`}
                    className="relative block h-48 bg-muted"
                  >
                    <Image
                      src={item.thumbnailUrl || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  <CardContent className="p-5">
                    <div className="flex gap-2">
                      <Badge>{item.status}</Badge>
                      {item.categoryName && (
                        <Badge variant="outline">{item.categoryName}</Badge>
                      )}
                    </div>
                    <Link href={`/webinars/${item.slug}`}>
                      <h2 className="mt-3 line-clamp-2 text-xl font-bold hover:text-blue-700">
                        {item.title}
                      </h2>
                    </Link>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <p className="flex gap-2">
                        <Calendar className="h-4 w-4" />
                        {date.toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })}
                      </p>
                      <p className="flex gap-2">
                        <Clock className="h-4 w-4" />
                        {date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {item.durationMinutes} minutes
                      </p>
                      <p className="flex gap-2">
                        <Users className="h-4 w-4" />
                        {item.registrationCount} registered
                      </p>
                    </div>
                    {item.status === "upcoming" ? (
                      <Button
                        className="mt-5 w-full"
                        onClick={() => register(item)}
                      >
                        Register now
                      </Button>
                    ) : (
                      <Button asChild className="mt-5 w-full">
                        <Link href={`/webinars/${item.slug}`}>
                          {item.recordingAvailable
                            ? "Watch recording"
                            : "View details"}
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        {!loading && !error && pages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {pages}
            </span>
            <Button
              variant="outline"
              disabled={page >= pages}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
