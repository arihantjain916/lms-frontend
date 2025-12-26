"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, ArrowRight, FileText, Shield, Cookie, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState("terms")

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  // Last updated date
  const lastUpdated = "January 15, 2024"

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-blue-50 py-8 md:py-12 border-b">
        <div className="container">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/terms" className="font-medium">
                  Terms of Service
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Legal Documents</h3>
                    <div className="space-y-2">
                      <Link
                        href="/terms"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 text-blue-600"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Terms of Service</span>
                      </Link>
                      <Link href="/privacy" className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50">
                        <Shield className="h-4 w-4" />
                        <span>Privacy Policy</span>
                      </Link>
                      <Link href="/cookies" className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50">
                        <Cookie className="h-4 w-4" />
                        <span>Cookie Policy</span>
                      </Link>
                      <Link href="/accessibility" className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50">
                        <HelpCircle className="h-4 w-4" />
                        <span>Accessibility</span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Need Help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you have any questions about our terms or policies, please contact our support team.
                    </p>
                    <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                      Contact Support
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <Tabs defaultValue="terms" value={activeTab} onValueChange={setActiveTab} className="mb-8">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="terms">Terms</TabsTrigger>
                      <TabsTrigger value="definitions">Definitions</TabsTrigger>
                      <TabsTrigger value="changes">Changes</TabsTrigger>
                    </TabsList>
                  

                  <div className="prose max-w-none">
                    <TabsContent value="terms">
                      <h2>1. Terms</h2>
                      <p>
                        By accessing the website at <Link href="/">https://eduportal.com</Link>, you are agreeing to be
                        bound by these terms of service, all applicable laws and regulations, and agree that you are
                        responsible for compliance with any applicable local laws. If you do not agree with any of these
                        terms, you are prohibited from using or accessing this site. The materials contained in this
                        website are protected by applicable copyright and trademark law.
                      </p>

                      <h3>2. Use License</h3>
                      <p>
                        Permission is granted to temporarily download one copy of the materials (information or
                        software) on EduPortal's website for personal, non-commercial transitory viewing only. This is
                        the grant of a license, not a transfer of title, and under this license you may not:
                      </p>
                      <ul>
                        <li>modify or copy the materials;</li>
                        <li>
                          use the materials for any commercial purpose, or for any public display (commercial or
                          non-commercial);
                        </li>
                        <li>attempt to decompile or reverse engineer any software contained on EduPortal's website;</li>
                        <li>remove any copyright or other proprietary notations from the materials; or</li>
                        <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                      </ul>
                      <p>
                        This license shall automatically terminate if you violate any of these restrictions and may be
                        terminated by EduPortal at any time. Upon terminating your viewing of these materials or upon
                        the termination of this license, you must destroy any downloaded materials in your possession
                        whether in electronic or printed format.
                      </p>

                      <h3>3. Disclaimer</h3>
                      <p>
                        The materials on EduPortal's website are provided on an 'as is' basis. EduPortal makes no
                        warranties, expressed or implied, and hereby disclaims and negates all other warranties
                        including, without limitation, implied warranties or conditions of merchantability, fitness for
                        a particular purpose, or non-infringement of intellectual property or other violation of rights.
                      </p>
                      <p>
                        Further, EduPortal does not warrant or make any representations concerning the accuracy, likely
                        results, or reliability of the use of the materials on its website or otherwise relating to such
                        materials or on any sites linked to this site.
                      </p>

                      <h3>4. Limitations</h3>
                      <p>
                        In no event shall EduPortal or its suppliers be liable for any damages (including, without
                        limitation, damages for loss of data or profit, or due to business interruption) arising out of
                        the use or inability to use the materials on EduPortal's website, even if EduPortal or a
                        EduPortal authorized representative has been notified orally or in writing of the possibility of
                        such damage. Because some jurisdictions do not allow limitations on implied warranties, or
                        limitations of liability for consequential or incidental damages, these limitations may not
                        apply to you.
                      </p>

                      <h3>5. Accuracy of Materials</h3>
                      <p>
                        The materials appearing on EduPortal's website could include technical, typographical, or
                        photographic errors. EduPortal does not warrant that any of the materials on its website are
                        accurate, complete or current. EduPortal may make changes to the materials contained on its
                        website at any time without notice. However EduPortal does not make any commitment to update the
                        materials.
                      </p>

                      <h3>6. Links</h3>
                      <p>
                        EduPortal has not reviewed all of the sites linked to its website and is not responsible for the
                        contents of any such linked site. The inclusion of any link does not imply endorsement by
                        EduPortal of the site. Use of any such linked website is at the user's own risk.
                      </p>

                      <h3>7. Course Content and Certification</h3>
                      <p>
                        EduPortal provides educational content and certification upon completion of certain courses. The
                        certification provided is not equivalent to accredited degrees or professional certifications
                        unless explicitly stated. EduPortal does not guarantee employment or career advancement as a
                        result of completing courses or obtaining certifications through our platform.
                      </p>
                      <p>
                        Course content is provided for educational purposes only and should not be considered
                        professional advice. Users should consult with appropriate professionals for specific advice
                        relevant to their particular situations.
                      </p>

                      <h3>8. User Accounts</h3>
                      <p>
                        When you create an account with us, you must provide information that is accurate, complete, and
                        current at all times. Failure to do so constitutes a breach of the Terms, which may result in
                        immediate termination of your account on our Service.
                      </p>
                      <p>
                        You are responsible for safeguarding the password that you use to access the Service and for any
                        activities or actions under your password, whether your password is with our Service or a
                        third-party service.
                      </p>
                      <p>
                        You agree not to disclose your password to any third party. You must notify us immediately upon
                        becoming aware of any breach of security or unauthorized use of your account.
                      </p>
                    </TabsContent>

                    <TabsContent value="definitions">
                      <h2>Definitions</h2>
                      <p>
                        The following terminology applies to these Terms of Service, Privacy Statement, and any or all
                        Agreements:
                      </p>

                      <h3>1. Parties</h3>
                      <p>
                        "Client", "You" and "Your" refers to you, the person accessing this website and accepting the
                        Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to
                        EduPortal. "Party", "Parties", or "Us", refers to both the Client and ourselves, or either the
                        Client or ourselves.
                      </p>

                      <h3>2. Services</h3>
                      <p>
                        "Services" refers to the educational content, courses, programs, certifications, and related
                        materials provided through the EduPortal platform.
                      </p>

                      <h3>3. Content</h3>
                      <p>
                        "Content" refers to all materials available on the EduPortal platform, including but not limited
                        to course materials, videos, text, images, graphics, user interfaces, visual interfaces, and
                        computer code.
                      </p>

                      <h3>4. User</h3>
                      <p>
                        "User" refers to any individual who accesses or uses the EduPortal platform, whether registered
                        or unregistered.
                      </p>

                      <h3>5. Student</h3>
                      <p>
                        "Student" refers to a registered user who enrolls in courses or programs offered through the
                        EduPortal platform.
                      </p>

                      <h3>6. Instructor</h3>
                      <p>
                        "Instructor" refers to an individual or entity that creates, provides, or facilitates
                        educational content on the EduPortal platform.
                      </p>

                      <h3>7. Subscription</h3>
                      <p>
                        "Subscription" refers to a recurring payment arrangement that provides access to specific
                        content or services on the EduPortal platform for a defined period.
                      </p>

                      <h3>8. Course</h3>
                      <p>
                        "Course" refers to a structured educational offering available on the EduPortal platform, which
                        may include videos, quizzes, assignments, and other learning materials.
                      </p>

                      <h3>9. Program</h3>
                      <p>
                        "Program" refers to a collection of courses or a comprehensive educational offering designed to
                        provide in-depth knowledge or skills in a specific area.
                      </p>

                      <h3>10. Certificate</h3>
                      <p>
                        "Certificate" refers to a digital or physical document issued by EduPortal upon successful
                        completion of a course or program, indicating that the student has met the requirements for
                        completion.
                      </p>
                    </TabsContent>

                    <TabsContent value="changes">
                      <h2>Changes to Terms</h2>
                      <p>
                        EduPortal reserves the right, at its sole discretion, to modify or replace these Terms at any
                        time. If a revision is material we will try to provide at least 30 days notice prior to any new
                        terms taking effect. What constitutes a material change will be determined at our sole
                        discretion.
                      </p>
                      <p>
                        By continuing to access or use our Service after those revisions become effective, you agree to
                        be bound by the revised terms. If you do not agree to the new terms, please stop using the
                        Service.
                      </p>

                      <h3>Notification of Changes</h3>
                      <p>We may notify you of changes to these Terms by:</p>
                      <ul>
                        <li>Sending an email to the email address associated with your account</li>
                        <li>Posting a notice on our website</li>
                        <li>Displaying a notification when you log in to your account</li>
                      </ul>
                      <p>
                        It is your responsibility to review these Terms periodically for changes. Your continued use of
                        the Service following the posting of any changes to these Terms constitutes acceptance of those
                        changes.
                      </p>

                      <h3>Previous Versions</h3>
                      <p>
                        Previous versions of our Terms of Service are archived and available upon request. To request
                        access to a previous version, please contact our support team.
                      </p>

                      <h3>Change Log</h3>
                      <p>Below is a summary of significant changes to our Terms of Service:</p>
                      <ul>
                        <li>
                          <strong>January 15, 2024:</strong> Updated terms related to course content and certification.
                        </li>
                        <li>
                          <strong>October 10, 2023:</strong> Added definitions section for clarity.
                        </li>
                        <li>
                          <strong>June 5, 2023:</strong> Updated user account responsibilities and security
                          requirements.
                        </li>
                        <li>
                          <strong>March 20, 2023:</strong> Initial publication of Terms of Service.
                        </li>
                      </ul>

                      <h3>Contact Us</h3>
                      <p>If you have any questions about these Terms, please contact us:</p>
                      <ul>
                        <li>By email: legal@eduportal.com</li>
                        <li>By phone: +919672670732</li>
                        <li>By mail: Jaipur, India</li>
                      </ul>
                    </TabsContent>
                  </div>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="mt-8 flex justify-between items-center">
                <Button variant="outline" className="gap-2 border-blue-200 hover:bg-blue-50">
                  Print Terms
                  <FileText className="h-4 w-4" />
                </Button>
                <Link href="/privacy">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    Privacy Policy
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
