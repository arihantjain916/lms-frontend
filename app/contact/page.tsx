"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  User,
  Send,
  AlertCircle,
  Clock,
  HelpCircle,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import instance from "@/helper/axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-authenticated";
import { loginHref } from "@/lib/auth-navigation";
import { startSupportConversation } from "@/lib/conversation-api";

export default function ContactPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [liveChatMessage, setLiveChatMessage] = useState("");
  const [liveChatSubmitting, setLiveChatSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    department: "",
    phone: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }));
    if (errors.department) {
      setErrors((prev) => ({ ...prev, department: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    if (!formData.department) {
      newErrors.department = "Please select a department";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    try {
      const res: any = await instance.post("/contact/save", formData);

      if (!res?.status) {
        return toast.error(res?.message || "Something went wrong");
      }

      toast.success("Message sent successfully");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        department: "",
        phone: "",
      });
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startLiveChat = () => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push(loginHref("/messages/new"));
      return;
    }
    setLiveChatOpen(true);
  };

  const submitLiveChat = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!liveChatMessage.trim()) return;
    setLiveChatSubmitting(true);
    try {
      const conversation = await startSupportConversation({
        subject: "Live chat support",
        content: liveChatMessage.trim(),
      });
      setLiveChatOpen(false);
      setLiveChatMessage("");
      toast.success("Live chat started");
      router.push(`/messages/${conversation.id}`);
    } catch (error: any) {
      toast.error(error?.message || "Unable to start live chat");
    } finally {
      setLiveChatSubmitting(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-background pt-24 pb-16">
        <div className="container relative">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Badge
              className="mb-4 mx-auto bg-blue-100 text-blue-700 hover:bg-blue-200"
              variant="secondary"
            >
              Contact Us
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Get in <span className="text-blue-600">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Our team
              is here to help and respond as quickly as possible.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Contact Information */}
      <section className="py-12">
        <div className="container">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-blue-100 p-4 mb-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                  <p className="text-muted-foreground mb-4">
                    Our friendly team is here to help.
                  </p>
                  <Link
                    href="mailto:connect@arihantjain.cv"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    connect@arihantjain.cv
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-blue-100 p-4 mb-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground mb-4">
                    Our office is open Monday to Friday, 9am to 5pm.
                  </p>
                  <address className="not-italic text-blue-600">
                    123 Main Street
                    <br />
                    Jaipur, RJ 302039
                    <br />
                    India
                  </address>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-blue-100 p-4 mb-4">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                  <p className="text-muted-foreground mb-4">
                    Mon-Fri from 8am to 5pm.
                  </p>
                  <Link
                    href="tel:+1-555-123-4567"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    +919672670732
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you as soon as
                possible. We value your feedback and are committed to providing
                excellent support.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className={`pl-10 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="phone"
                      placeholder="+91 9999999999"
                      className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium">
                    Department
                  </label>
                  <Select
                    value={formData.department}
                    onValueChange={handleSelectChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      className={
                        errors.department
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">General Inquiry</SelectItem>
                      <SelectItem value="1">Technical Support</SelectItem>
                      <SelectItem value="2">Sales</SelectItem>
                      <SelectItem value="3">Billing</SelectItem>
                      {/* <SelectItem value="partnerships">Partnerships</SelectItem> */}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.department}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    className={
                      errors.subject
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please provide as much detail as possible..."
                    className={`min-h-32 ${errors.message ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && <Send className="h-4 w-4" />}
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      question: "How quickly will I receive a response?",
                      answer:
                        "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line for immediate assistance.",
                      icon: <Clock className="h-5 w-5 text-blue-600" />,
                    },
                    {
                      question: "Can I get a refund for a course?",
                      answer:
                        "Yes, we offer a 30-day money-back guarantee for most courses. Please visit our refund policy page for more details or contact our billing department.",
                      icon: <HelpCircle className="h-5 w-5 text-blue-600" />,
                    },
                    {
                      question: "How do I report a technical issue?",
                      answer:
                        "For technical issues, please select 'Technical Support' in the department dropdown when submitting your message. Include details like your device, browser, and steps to reproduce the issue.",
                      icon: <AlertCircle className="h-5 w-5 text-blue-600" />,
                    },
                  ].map((faq, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">{faq.icon}</div>
                      <div>
                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  {[
                    {
                      icon: <Twitter className="h-5 w-5" />,
                      label: "Twitter",
                      href: "#",
                    },
                    {
                      icon: <Facebook className="h-5 w-5" />,
                      label: "Facebook",
                      href: "#",
                    },
                    {
                      icon: <Instagram className="h-5 w-5" />,
                      label: "Instagram",
                      href: "#",
                    },
                    {
                      icon: <Linkedin className="h-5 w-5" />,
                      label: "LinkedIn",
                      href: "#",
                    },
                    {
                      icon: <Youtube className="h-5 w-5" />,
                      label: "YouTube",
                      href: "#",
                    },
                  ].map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-muted border transition-colors hover:bg-blue-100 hover:text-blue-600"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-2 mt-1">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Live Chat Support</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Need immediate assistance? Our live chat support is
                      available Monday to Friday, 9am to 5pm IST.
                    </p>
                    <Button
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                      onClick={startLiveChat}
                      disabled={authLoading}
                    >
                      {authLoading ? "Checking access…" : "Start Live Chat"}
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monday - Friday:
                    </span>
                    <span>9:00 AM - 5:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday:</span>
                    <span>10:00 AM - 2:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Dialog open={liveChatOpen} onOpenChange={setLiveChatOpen}>
        <DialogContent>
          <form onSubmit={submitLiveChat}>
            <DialogHeader>
              <DialogTitle>Start live chat</DialogTitle>
              <DialogDescription>
                Send your first message to customer care. Replies will appear
                instantly in the live conversation.
              </DialogDescription>
            </DialogHeader>
            <div className="py-5">
              <label
                htmlFor="live-chat-message"
                className="text-sm font-medium"
              >
                How can we help?
              </label>
              <Textarea
                id="live-chat-message"
                value={liveChatMessage}
                onChange={(event) => setLiveChatMessage(event.target.value)}
                required
                maxLength={5000}
                rows={6}
                className="mt-2"
                placeholder="Describe what you need help with"
                autoFocus
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {liveChatMessage.length}/5000
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLiveChatOpen(false)}
                disabled={liveChatSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={liveChatSubmitting || !liveChatMessage.trim()}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {liveChatSubmitting ? "Starting…" : "Start chat"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Map Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Location</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visit our headquarters in the heart of San Francisco.
            </p>
          </div>

          <div className="aspect-video w-full rounded-lg overflow-hidden border shadow-md">
            {/* This would be replaced with an actual map component in production */}
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">
                Interactive Map Would Be Displayed Here
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-blue-100 mb-8">
              Join thousands of students already learning on our platform. Get
              started today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-blue-600 hover:bg-blue-50"
              >
                Browse Courses
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white text-white hover:bg-blue-500"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
