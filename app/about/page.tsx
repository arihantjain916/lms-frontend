"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Globe,
  Target,
  Heart,
  Lightbulb,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Star,
  Twitter,
  Linkedin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("mission")

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  // Team members data
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & CEO",
      bio: "Dr. Johnson founded EduPortal with a vision to make quality education accessible to everyone. With over 15 years of experience in education technology, she leads our strategic initiatives.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      bio: "Michael oversees all technical aspects of EduPortal. His expertise in AI and machine learning has helped create our adaptive learning platform that personalizes education for each student.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Content",
      bio: "Emily ensures that all courses on EduPortal meet our high standards for quality and effectiveness. She works closely with instructors to develop engaging and comprehensive learning materials.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      name: "David Wilson",
      role: "Chief Learning Officer",
      bio: "David brings his background in educational psychology to design learning experiences that maximize knowledge retention and skill development for students of all ages and backgrounds.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        twitter: "#",
        linkedin: "#",
      },
    },
  ]

  // Stats data
  const stats = [
    { label: "Students", value: "50,000+", icon: <Users className="h-6 w-6 text-blue-600" /> },
    { label: "Courses", value: "1,000+", icon: <BookOpen className="h-6 w-6 text-blue-600" /> },
    { label: "Instructors", value: "200+", icon: <GraduationCap className="h-6 w-6 text-blue-600" /> },
    { label: "Countries", value: "150+", icon: <Globe className="h-6 w-6 text-blue-600" /> },
  ]

  // Values data
  const values = [
    {
      title: "Accessibility",
      description: "We believe education should be accessible to everyone, regardless of location or background.",
      icon: <Globe className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Excellence",
      description: "We are committed to providing the highest quality educational content and experiences.",
      icon: <Award className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Innovation",
      description: "We continuously explore new technologies and methodologies to enhance the learning experience.",
      icon: <Lightbulb className="h-6 w-6" />,
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Community",
      description: "We foster a supportive community where learners can connect, collaborate, and grow together.",
      icon: <Users className="h-6 w-6" />,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Impact",
      description: "We measure our success by the positive impact we have on our students' lives and careers.",
      icon: <Target className="h-6 w-6" />,
      color: "bg-rose-100 text-rose-700",
    },
    {
      title: "Inclusivity",
      description: "We embrace diversity and create an inclusive environment where everyone feels welcome.",
      icon: <Heart className="h-6 w-6" />,
      color: "bg-indigo-100 text-indigo-700",
    },
  ]

  // FAQ data
  const faqs = [
    {
      question: "What makes EduPortal different from other online learning platforms?",
      answer:
        "EduPortal stands out through our adaptive learning technology that personalizes the educational experience for each student. We also focus on practical, job-ready skills with direct mentorship from industry experts. Our community-centered approach ensures students never learn alone.",
    },
    {
      question: "How are your courses developed?",
      answer:
        "Our courses are developed through a rigorous process involving industry experts, instructional designers, and educational psychologists. We focus on creating engaging, interactive content that balances theoretical knowledge with practical application. All courses undergo extensive testing and regular updates to ensure they remain current and effective.",
    },
    {
      question: "Do you offer certificates upon course completion?",
      answer:
        "Yes, we offer certificates for all completed courses. Our certificates are recognized by many employers and can be added directly to your LinkedIn profile. For certain professional courses, we also offer industry-recognized certifications through partnerships with leading organizations.",
    },
    {
      question: "Can I access courses on mobile devices?",
      answer:
        "EduPortal is fully responsive and optimized for mobile learning. Our dedicated mobile apps for iOS and Android provide an enhanced learning experience with offline access to course materials, allowing you to learn anytime, anywhere.",
    },
    {
      question: "What support is available if I have questions during a course?",
      answer:
        "We offer multiple layers of support: direct Q&A with instructors, community forums moderated by teaching assistants, peer discussion groups, and 24/7 technical support. Our goal is to ensure no question goes unanswered and that you have all the support you need to succeed.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-background pt-24 pb-16">
        <div className="container relative">
          <motion.div className="max-w-3xl mx-auto text-center" initial="hidden" animate="visible" variants={fadeIn}>
            <Badge className="mb-4 mx-auto bg-blue-100 text-blue-700 hover:bg-blue-200" variant="secondary">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transforming Lives Through <span className="text-blue-600">Education</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're on a mission to make quality education accessible to everyone, everywhere. Learn about our journey,
              our team, and the values that drive us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
                Join Our Community
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-blue-200 hover:bg-blue-50">
                View Courses
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="container">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div key={index} className="text-center" variants={fadeIn}>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-blue-50 p-4">{stat.icon}</div>
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Story Tabs */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <Tabs defaultValue="mission" value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mission">Our Mission</TabsTrigger>
                <TabsTrigger value="vision">Our Vision</TabsTrigger>
                <TabsTrigger value="story">Our Story</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="mission" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Our Mission"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground mb-6">
                    At EduPortal, our mission is to transform lives through accessible, high-quality education. We
                    believe that everyone, regardless of their background or circumstances, deserves access to learning
                    opportunities that can help them achieve their goals and reach their full potential.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Make quality education accessible to everyone",
                      "Empower learners with practical, job-ready skills",
                      "Foster a global community of lifelong learners",
                      "Continuously innovate to enhance the learning experience",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vision" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2 order-1 md:order-2">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Our Vision"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="md:w-1/2 order-2 md:order-1">
                  <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground mb-6">
                    We envision a world where quality education is a right, not a privilege. A world where geographical,
                    financial, and social barriers no longer limit one's access to learning opportunities. Our vision is
                    to create the most effective and engaging learning platform that empowers individuals to transform
                    their lives.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    By 2030, we aim to have empowered 100 million learners worldwide with the skills and knowledge they
                    need to succeed in an ever-changing global economy. We see a future where EduPortal graduates are
                    recognized for their exceptional skills and are sought after by employers around the world.
                  </p>
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    Learn More About Our Goals
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="story" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Our Story"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                  <p className="text-muted-foreground mb-6">
                    EduPortal began in 2015 when our founder, Dr. Sarah Johnson, recognized a significant gap in online
                    education. While many platforms offered courses, few focused on creating truly effective learning
                    experiences that led to measurable outcomes and real-world skills.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Starting with just 10 courses and a small team of passionate educators, we've grown to offer over
                    1,000 courses to more than 50,000 students worldwide. Our journey has been guided by a simple
                    principle: education should be transformative, accessible, and aligned with the needs of both
                    learners and the evolving job market.
                  </p>
                  <p className="text-muted-foreground">
                    Today, EduPortal is recognized as a leader in online education, known for our innovative approach to
                    learning, commitment to quality, and the success of our graduates. But we're just getting
                    started—our story continues to unfold as we expand our reach and impact.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do at EduPortal, from course development to student support.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${value.color}`}>
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind EduPortal who are dedicated to transforming education.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {teamMembers.map((member, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-blue-600 text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                    <div className="flex gap-2">
                      {member.social.twitter && (
                        <Link href={member.social.twitter} className="text-muted-foreground hover:text-blue-600">
                          <Twitter className="h-4 w-4" />
                        </Link>
                      )}
                      {member.social.linkedin && (
                        <Link href={member.social.linkedin} className="text-muted-foreground hover:text-blue-600">
                          <Linkedin className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Button variant="outline" className="gap-2 border-blue-200 hover:bg-blue-50">
              View Full Team
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What People Say About Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from our students, instructors, and partners about their experience with EduPortal.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                name: "Jessica Lee",
                role: "Web Development Student",
                image: "/placeholder.svg?height=80&width=80",
                content:
                  "EduPortal completely changed my career trajectory. I went from working in retail to landing a job as a frontend developer in just 6 months. The courses were comprehensive and the community support was invaluable.",
                rating: 5,
              },
              {
                name: "Robert Chen",
                role: "Data Science Instructor",
                image: "/placeholder.svg?height=80&width=80",
                content:
                  "As an instructor, I appreciate EduPortal's commitment to quality education. The platform provides all the tools I need to create engaging courses, and the team is always responsive to feedback and suggestions for improvement.",
                rating: 5,
              },
              {
                name: "Maria Rodriguez",
                role: "Corporate Partner",
                image: "/placeholder.svg?height=80&width=80",
                content:
                  "We've partnered with EduPortal to upskill our employees, and the results have been outstanding. The customized learning paths and detailed progress tracking have made it easy to measure ROI on our training investment.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating ? "fill-amber-500 text-amber-500" : "text-muted"
                            }`}
                          />
                        ))}
                    </div>
                    <p className="italic mb-6">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about EduPortal and our approach to online education.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
            <p className="text-blue-100 mb-8">
              Join thousands of students already learning on our platform. Get started today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="gap-2 bg-white text-blue-600 hover:bg-blue-50">
                Browse Courses
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-white text-white hover:bg-blue-500">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
