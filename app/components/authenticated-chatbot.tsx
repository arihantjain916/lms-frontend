"use client"

import Chatbot from "@/app/chatbot"
import { useAuthenticated } from "@/hooks/use-authenticated"

export default function AuthenticatedChatbot() {
  const isAuthenticated = useAuthenticated()
  return isAuthenticated ? <Chatbot /> : null
}
