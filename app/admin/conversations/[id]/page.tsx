"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ChevronLeft, Send, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-authenticated";
import { useNotifications } from "@/hooks/use-notifications";
import {
  deleteAdminConversation,
  deleteAdminMessage,
  getAdminConversation,
  getAdminConversationMessages,
  markConversationRead,
  sendConversationMessage,
  updateConversationStatus,
  type Conversation,
  type ConversationMessage,
} from "@/lib/conversation-api";
import {
  ErrorState,
  LoadingState,
  PageHeading,
} from "../../_components/admin-ui";

function canParticipate(conversation: Conversation, userId?: string) {
  if (!userId) return false;

  return (
    conversation.type === "SUPPORT" ||
    conversation.initiatorId === userId ||
    conversation.recipientId === userId
  );
}

export default function AdminConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { latestMessage } = useNotifications();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [detail, messagePage] = await Promise.all([
        getAdminConversation(id),
        getAdminConversationMessages(id, 1, 100),
      ]);
      setConversation(detail);
      setMessages([...messagePage.data].reverse());
      if (canParticipate(detail, user?.id))
        void markConversationRead(id).catch(() => undefined);
    } catch (requestError: any) {
      setError(requestError?.message || "Unable to load conversation");
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    if (latestMessage?.conversationId !== id) return;
    setMessages((current) =>
      current.some((item) => item.id === latestMessage.id)
        ? current
        : [...current, latestMessage],
    );
    if (conversation && canParticipate(conversation, user?.id)) {
      void markConversationRead(id).catch(() => undefined);
    }
  }, [conversation, id, latestMessage, user?.id]);

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    try {
      const created = await sendConversationMessage(id, content.trim());
      setMessages((current) => [...current, created]);
      setContent("");
      setConversation((current) =>
        current ? { ...current, status: "OPEN" } : current,
      );
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to reply");
    } finally {
      setSending(false);
    }
  }

  async function removeMessage(message: ConversationMessage) {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteAdminMessage(message.id);
      setMessages((current) =>
        current.filter((item) => item.id !== message.id),
      );
      toast.success("Message deleted");
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to delete message");
    }
  }

  async function removeConversation() {
    if (
      !conversation ||
      !window.confirm("Delete this conversation and all messages?")
    )
      return;
    try {
      await deleteAdminConversation(conversation.id);
      toast.success("Conversation deleted");
      router.replace("/admin/conversations");
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to delete conversation");
    }
  }

  async function toggleStatus() {
    if (!conversation) return;
    try {
      setConversation(
        await updateConversationStatus(
          conversation.id,
          conversation.status === "OPEN" ? "CLOSED" : "OPEN",
        ),
      );
    } catch (requestError: any) {
      toast.error(requestError?.message || "Unable to update status");
    }
  }

  return (
    <>
      <Button asChild variant="ghost" className="mb-3">
        <Link href="/admin/conversations">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Customer care
        </Link>
      </Button>
      <PageHeading
        title={conversation?.subject || "Conversation"}
        description={
          conversation
            ? `${conversation.type} · ${conversation.initiatorName}${conversation.courseTitle ? ` · ${conversation.courseTitle}` : ""}`
            : "Review messages and take action."
        }
        action={
          conversation && (
            <div className="flex gap-2">
              {canParticipate(conversation, user?.id) && (
                <Button variant="outline" onClick={() => void toggleStatus()}>
                  {conversation.status === "OPEN" ? "Close" : "Reopen"}
                </Button>
              )}
              <Button
                variant="outline"
                className="text-red-600"
                onClick={() => void removeConversation()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )
        }
      />
      {loading ? (
        <LoadingState />
      ) : error || !conversation ? (
        <ErrorState message={error || "Conversation not found"} retry={load} />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="max-h-[560px] space-y-4 overflow-y-auto bg-slate-50 p-5">
            {messages.map((message) => {
              const mine = message.senderId === user?.id;
              return (
                <div
                  key={message.id}
                  className={`group flex items-start gap-2 ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 ${mine ? "bg-blue-600 text-white" : "border bg-white"}`}
                  >
                    <p className="text-xs font-semibold">
                      {message.senderName}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">
                      {message.content}
                    </p>
                    <p
                      className={`mt-1 text-[10px] ${mine ? "text-blue-100" : "text-slate-400"}`}
                    >
                      {format(new Date(message.createdAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100"
                    onClick={() => void removeMessage(message)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
          {canParticipate(conversation, user?.id) ? (
            <form onSubmit={send} className="flex items-end gap-3 border-t p-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                maxLength={5000}
                rows={2}
                placeholder={
                  conversation.type === "SUPPORT"
                    ? "Reply to this support request"
                    : "Write a reply"
                }
              />
              <Button disabled={sending || !content.trim()}>
                <Send className="mr-2 h-4 w-4" />
                {sending ? "Sending…" : "Reply"}
              </Button>
            </form>
          ) : (
            <p className="border-t p-4 text-sm text-slate-500">
              You are viewing this private direct thread as a moderator. Only
              its participants can reply or change its status.
            </p>
          )}
        </div>
      )}
    </>
  );
}
