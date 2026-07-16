"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Headphones, Send } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRequireAuth } from "@/hooks/use-authenticated";
import {
  startDirectConversation,
  startSupportConversation,
} from "@/lib/conversation-api";

function NewMessageForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { loading: authLoading } = useRequireAuth();
  const recipientId = params.get("recipientId") || "";
  const recipientName = params.get("recipientName") || "your instructor";
  const courseId = params.get("courseId");
  const courseTitle = params.get("courseTitle") || "";
  const direct = Boolean(recipientId && courseId);
  const [subject, setSubject] = useState(
    direct && courseTitle ? `Question about ${courseTitle}` : "",
  );
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    try {
      const conversation = direct
        ? await startDirectConversation({
            recipientId,
            courseId: Number(courseId),
            subject: subject.trim() || undefined,
            content: content.trim(),
          })
        : await startSupportConversation({
            subject: subject.trim() || undefined,
            content: content.trim(),
          });
      toast.success(
        direct ? "Message sent to instructor" : "Support request opened",
      );
      router.replace(`/messages/${conversation.id}`);
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to start conversation");
    } finally {
      setSending(false);
    }
  }

  if (authLoading) return null;

  return (
    <main className="min-h-[75vh] bg-slate-50 py-10">
      <div className="container max-w-2xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link
            href={direct && courseId ? `/courses/${courseId}` : "/messages"}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <div className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-blue-50 text-blue-700">
              {direct ? (
                <Send className="h-5 w-5" />
              ) : (
                <Headphones className="h-5 w-5" />
              )}
            </div>
            <CardTitle>
              {direct ? `Message ${recipientName}` : "Contact customer support"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {direct
                ? `This conversation is linked to ${courseTitle || "your enrolled course"}.`
                : "Tell us what you need help with. Your open support thread will be reused."}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  maxLength={200}
                  placeholder={
                    direct ? "What do you need help with?" : "How can we help?"
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  required
                  maxLength={5000}
                  rows={7}
                  placeholder="Write your message"
                />
                <p className="text-right text-xs text-muted-foreground">
                  {content.length}/5000
                </p>
              </div>
              <Button className="w-full" disabled={sending || !content.trim()}>
                <Send className="mr-2 h-4 w-4" />
                {sending ? "Sending…" : "Send message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function NewMessagePage() {
  return (
    <Suspense fallback={<main className="min-h-[75vh] bg-slate-50" />}>
      <NewMessageForm />
    </Suspense>
  );
}
