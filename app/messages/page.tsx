"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Headphones, MessageCircle, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks/use-authenticated";
import { useNotifications } from "@/hooks/use-notifications";
import { getConversations, type Conversation } from "@/lib/conversation-api";

function relativeTime(value?: string | null) {
  if (!value) return "No messages yet";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently"
    : formatDistanceToNow(date, { addSuffix: true });
}

export default function MessagesPage() {
  const { loading: authLoading } = useRequireAuth();
  const { latestMessage, connectionState } = useNotifications();
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getConversations(0, 50);
      setItems(result.data);
    } catch (requestError: any) {
      setError(requestError?.message || "Unable to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) void load();
  }, [authLoading, load]);

  useEffect(() => {
    if (latestMessage?.id) void load();
  }, [latestMessage?.id, load]);

  if (authLoading) return null;

  return (
    <main className="min-h-[75vh] bg-slate-50 py-10">
      <div className="container max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span
                className={`h-2 w-2 rounded-full ${connectionState === "connected" ? "bg-emerald-500" : "bg-amber-500"}`}
              />
              {connectionState === "connected"
                ? "Live updates on"
                : "Reconnecting"}
            </div>
            <h1 className="mt-2 text-3xl font-bold">Messages</h1>
            <p className="mt-1 text-muted-foreground">
              Course conversations and customer support in one place.
            </p>
          </div>
          <Button asChild>
            <Link href="/messages/new">
              <Plus className="mr-2 h-4 w-4" />
              Contact support
            </Link>
          </Button>
        </div>

        <Card className="mt-7 overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-sm text-muted-foreground">
                Loading conversations…
              </div>
            ) : error ? (
              <div className="p-10 text-center">
                <p className="text-sm text-red-600">{error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => void load()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Try again
                </Button>
              </div>
            ) : items.length ? (
              <div className="divide-y">
                {items.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href={`/messages/${conversation.id}`}
                    className="flex items-start gap-4 p-5 transition hover:bg-slate-50"
                  >
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700">
                      {conversation.type === "SUPPORT" ? (
                        <Headphones className="h-5 w-5" />
                      ) : (
                        <MessageCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="truncate font-semibold">
                            {conversation.subject}
                          </p>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {conversation.type === "SUPPORT"
                              ? "Customer care"
                              : conversation.recipientName ||
                                conversation.initiatorName}
                            {conversation.courseTitle
                              ? ` · ${conversation.courseTitle}`
                              : ""}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {relativeTime(
                            conversation.lastMessageAt ||
                              conversation.createdAt,
                          )}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Badge variant="outline">{conversation.status}</Badge>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-blue-600">
                            {conversation.unreadCount} unread
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-14 text-center">
                <MessageCircle className="mx-auto h-10 w-10 text-slate-300" />
                <h2 className="mt-4 font-semibold">No conversations yet</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Contact support, or message an instructor from an enrolled
                  course.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
