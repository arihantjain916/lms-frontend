import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "./header";
import Footer from "./components/footer";
import { Toaster } from "react-hot-toast";
import Chatbot from "./chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EduPortal - Learn Without Limits",
  description:
    "Discover thousands of courses taught by expert instructors to help you achieve your goals.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <Header />
          {children}
          <Chatbot/>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
