"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Download, Loader2, Play, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  getWebinar,
  getWebinarRecording,
  getWebinarResources,
  registerForWebinar,
  type Webinar,
  type WebinarResource,
} from "@/lib/catalog-api";

export default function WebinarDetailPage() {
  const slug = String(useParams().slug);
  const { toast } = useToast();
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [resources, setResources] = useState<WebinarResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWebinar(slug)
      .then(setWebinar)
      .catch((e) =>
        toast({
          title: "Unable to load webinar",
          description: e?.message,
          variant: "destructive",
        }),
      )
      .finally(() => setLoading(false));
  }, [slug, toast]);
  async function register() {
    if (!webinar) return;
    try {
      await registerForWebinar(webinar.id);
      toast({ title: "Registration successful" });
    } catch (e: any) {
      toast({
        title: "Registration failed",
        description: e?.message,
        variant: "destructive",
      });
    }
  }
  async function recording() {
    if (!webinar) return;
    try {
      const url = await getWebinarRecording(webinar.id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      toast({
        title: "Recording unavailable",
        description: e?.message,
        variant: "destructive",
      });
    }
  }
  async function loadResources() {
    if (!webinar) return;
    try {
      setResources(await getWebinarResources(webinar.id));
    } catch (e: any) {
      toast({
        title: "Resources unavailable",
        description: e?.message,
        variant: "destructive",
      });
    }
  }

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (!webinar)
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Webinar not found</h1>
        <Button asChild variant="link">
          <Link href="/webinars">Back to webinars</Link>
        </Button>
      </div>
    );
  const scheduled = new Date(webinar.scheduledAt);
  return (
    <main>
      <section className="bg-blue-950 py-14 text-white">
        <div className="container grid items-center gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <Badge>{webinar.categoryName || "Webinar"}</Badge>
            <h1 className="mt-4 text-4xl font-bold">{webinar.title}</h1>
            <p className="mt-4 max-w-3xl text-blue-100">
              {webinar.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-blue-100">
              <span className="flex gap-2">
                <Calendar className="h-4 w-4" />
                {scheduled.toLocaleDateString(undefined, { dateStyle: "long" })}
              </span>
              <span className="flex gap-2">
                <Clock className="h-4 w-4" />
                {scheduled.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                · {webinar.durationMinutes} min
              </span>
              <span className="flex gap-2">
                <Users className="h-4 w-4" />
                {webinar.registrationCount} registered
              </span>
            </div>
            <p className="mt-5">
              Hosted by <strong>{webinar.host.name}</strong>
            </p>
          </div>
          <div className="relative h-64 overflow-hidden rounded-2xl">
            <Image
              src={webinar.thumbnailUrl || "/placeholder.svg"}
              alt={webinar.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
      <section className="container grid gap-8 py-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-2xl font-bold">About this webinar</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            {webinar.description}
          </p>
          {resources.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Resources</h2>
              <div className="mt-3 space-y-2">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center gap-3 rounded border p-3"
                  >
                    <Download className="h-4 w-4" />
                    {resource.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Card>
          <CardContent className="space-y-3 p-6">
            {webinar.status === "upcoming" ? (
              <Button className="w-full" onClick={register}>
                Register now
              </Button>
            ) : (
              webinar.recordingAvailable && (
                <Button className="w-full" onClick={recording}>
                  <Play className="mr-2 h-4 w-4" />
                  Watch recording
                </Button>
              )
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={loadResources}
            >
              <Download className="mr-2 h-4 w-4" />
              Load resources
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/webinars/my">My registrations</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
