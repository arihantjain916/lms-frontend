"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ChevronLeft, Lock, RefreshCw, Send } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRequireAuth } from "@/hooks/use-authenticated";
import { useNotifications } from "@/hooks/use-notifications";
import {
  getConversation,
  getConversationMessages,
  sendConversationMessage,
  updateConversationStatus,
  type Conversation,
  type ConversationMessage,
} from "@/lib/conversation-api";

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useRequireAuth();
  const { latestMessage } = useNotifications();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const [detail, messagePage] = await Promise.all([
        getConversation(id),
        getConversationMessages(id, 0, 100),
      ]);
      setConversation(detail);
      setMessages([...messagePage.data].reverse());
    } catch (requestError: any) {
      setError(requestError?.message || "Unable to load conversation");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!authLoading) void load();
  }, [authLoading, load]);

  useEffect(() => {
    if (latestMessage?.conversationId !== id) return;
    setMessages((current) =>
      current.some((message) => message.id === latestMessage.id)
        ? current
        : [...current, latestMessage],
    );
  }, [id, latestMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    try {
      const created = await sendConversationMessage(id, content.trim());
      setMessages((current) => [...current, created]);
      setContent("");
      if (conversation?.status === "CLOSED") {
        setConversation({ ...conversation, status: "OPEN" });
      }
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to send message");
    } finally {
      setSending(false);
    }
  }

  async function toggleStatus() {
    if (!conversation) return;
    try {
      const updated = await updateConversationStatus(
        conversation.id,
        conversation.status === "OPEN" ? "CLOSED" : "OPEN",
      );
      setConversation(updated);
      toast.success(
        updated.status === "OPEN"
          ? "Conversation reopened"
          : "Conversation closed",
      );
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to update conversation");
    }
  }

  if (authLoading) return null;

  return (
    <main className="min-h-[75vh] bg-slate-50 py-6 sm:py-10">
      <div className="container max-w-4xl">
        <Button asChild variant="ghost" className="mb-3">
          <Link href="/messages">
            <ChevronLeft className="mr-1 h-4 w-4" /> Messages
          </Link>
        </Button>
        {loading ? (
          <Card className="grid min-h-[520px] place-items-center text-sm text-muted-foreground">
            Loading conversation…
          </Card>
        ) : error || !conversation ? (
          <Card className="grid min-h-[420px] place-items-center p-8 text-center">
            <div>
              <p className="text-red-600">
                {error || "Conversation not found"}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => void load()}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Try again
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{conversation.subject}</h1>
                  <Badge variant="outline">{conversation.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {conversation.type === "SUPPORT"
                    ? "Customer care"
                    : conversation.courseTitle ||
                      conversation.recipientName ||
                      conversation.initiatorName}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void toggleStatus()}
              >
                <Lock className="mr-2 h-4 w-4" />
                {conversation.status === "OPEN" ? "Close" : "Reopen"}
              </Button>
            </div>

            <div className="h-[480px] space-y-4 overflow-y-auto bg-slate-50/70 p-4 sm:p-6">
              {messages.map((message) => {
                const mine = message.senderId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${mine ? "justify-end" : "justify-start"}`}
                  >
                    {!mine && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.senderAvatar || undefined} />
                        <AvatarFallback>
                          {message.senderName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 ${mine ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md border bg-white"}`}
                    >
                      {!mine && (
                        <p className="mb-1 text-xs font-semibold">
                          {message.senderName}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">
                        {message.content}
                      </p>
                      <p
                        className={`mt-1 text-[10px] ${mine ? "text-blue-100" : "text-muted-foreground"}`}
                      >
                        {format(new Date(message.createdAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                );
              })}
              {!messages.length && (
                <p className="text-center text-sm text-muted-foreground">
                  No messages yet.
                </p>
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={send} className="flex items-end gap-3 border-t p-4">
              <Textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                required
                maxLength={5000}
                rows={2}
                placeholder="Write a reply"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <Button
                size="icon"
                className="h-11 w-11 shrink-0"
                disabled={sending || !content.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </Card>
        )}
      </div>
    </main>
  );
}
