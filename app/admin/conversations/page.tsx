"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { BellRing, Eye, MessagesSquare, Send, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNotifications } from "@/hooks/use-notifications";
import {
  broadcastNotification,
  deleteAdminConversation,
  getAdminConversations,
  type Conversation,
  type ConversationStatus,
  type ConversationType,
} from "@/lib/conversation-api";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  Pagination,
} from "../_components/admin-ui";

function ago(value?: string | null) {
  if (!value) return "No messages";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently"
    : formatDistanceToNow(date, { addSuffix: true });
}

export default function AdminConversationsPage() {
  const { latestMessage } = useNotifications();
  const [items, setItems] = useState<Conversation[]>([]);
  const [type, setType] = useState<ConversationType | "">("SUPPORT");
  const [status, setStatus] = useState<ConversationStatus | "">("OPEN");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [role, setRole] = useState<"" | "STUDENT" | "INSTRUCTOR" | "ADMIN">("");
  const [broadcasting, setBroadcasting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getAdminConversations({
        type: type || undefined,
        status: status || undefined,
        page,
        limit: 10,
      });
      setItems(result.data);
      setPages(Math.max(1, result.totalPages));
    } catch (requestError: any) {
      setError(requestError?.message || "Unable to load conversations");
    } finally {
      setLoading(false);
    }
  }, [page, status, type]);

  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    if (latestMessage?.id) void load();
  }, [latestMessage?.id, load]);

  async function remove(conversation: Conversation) {
    if (
      !window.confirm(`Delete “${conversation.subject}” and all its messages?`)
    )
      return;
    try {
      await deleteAdminConversation(conversation.id);
      toast.success("Conversation deleted");
      await load();
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to delete conversation");
    }
  }

  async function broadcast(event: FormEvent) {
    event.preventDefault();
    setBroadcasting(true);
    try {
      const recipients = await broadcastNotification({
        title: title.trim(),
        body: body.trim() || undefined,
        link: link.trim() || undefined,
        role: role || undefined,
      });
      toast.success(
        `Announcement sent to ${recipients} user${recipients === 1 ? "" : "s"}`,
      );
      setTitle("");
      setBody("");
      setLink("");
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to send announcement");
    } finally {
      setBroadcasting(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Customer care"
        description="Reply to support tickets, moderate conversations, and broadcast announcements."
      />

      <section className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold">Broadcast announcement</h2>
        </div>
        <form onSubmit={broadcast} className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="broadcast-title">Title</Label>
            <Input
              id="broadcast-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="broadcast-role">Audience</Label>
            <select
              id="broadcast-role"
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All active users</option>
              <option value="STUDENT">Students</option>
              <option value="INSTRUCTOR">Instructors</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="broadcast-body">Message</Label>
            <Textarea
              id="broadcast-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={2000}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="broadcast-link">Optional app link</Label>
            <Input
              id="broadcast-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/courses/123"
            />
          </div>
          <div className="flex items-end justify-end">
            <Button disabled={broadcasting || !title.trim()}>
              <Send className="mr-2 h-4 w-4" />
              {broadcasting ? "Sending…" : "Send announcement"}
            </Button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <MessagesSquare className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold">Conversations</h2>
          </div>
          <div className="flex flex-1 flex-wrap justify-end gap-2">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as typeof type);
                setPage(1);
              }}
              className="h-9 rounded-md border bg-white px-3 text-sm"
            >
              <option value="">All types</option>
              <option value="SUPPORT">Support</option>
              <option value="DIRECT">Direct</option>
            </select>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as typeof status);
                setPage(1);
              }}
              className="h-9 rounded-md border bg-white px-3 text-sm"
            >
              <option value="">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} retry={load} />
        ) : !items.length ? (
          <EmptyState
            title="Queue is clear"
            description="No conversations match these filters."
          />
        ) : (
          <div className="divide-y">
            {items.map((conversation) => (
              <div
                key={conversation.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">
                      {conversation.subject}
                    </p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                      {conversation.type}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${conversation.status === "OPEN" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {conversation.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {conversation.initiatorName}
                    {conversation.recipientName
                      ? ` → ${conversation.recipientName}`
                      : ""}
                    {conversation.courseTitle
                      ? ` · ${conversation.courseTitle}`
                      : ""}{" "}
                    · {ago(conversation.lastMessageAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/conversations/${conversation.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Open
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600"
                    onClick={() => void remove(conversation)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Pagination page={page} pages={pages} onChange={setPage} />
      </section>
    </>
  );
}
