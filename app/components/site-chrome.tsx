"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/header";
import Footer from "@/app/components/footer";
import AuthenticatedChatbot from "@/app/components/authenticated-chatbot";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return children;

  return (
    <>
      <Header />
      {children}
      <AuthenticatedChatbot />
      <Footer />
    </>
  );
}
