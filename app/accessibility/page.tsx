"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, ArrowRight, FileText, Shield, Cookie, HelpCircle, Printer, Download } from "lucide-react"
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

export default function AccessibilityPage() {
  const [activeTab, setActiveTab] = useState("statement")

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
                <BreadcrumbLink href="/accessibility" className="font-medium">
                  Accessibility
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Accessibility Statement</h1>
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
                      <Link href="/terms" className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50">
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
                      <Link
                        href="/accessibility"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 text-blue-600"
                      >
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
                      If you encounter any accessibility issues, please contact our accessibility team.
                    </p>
                    <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                      Contact Accessibility Team
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Download Statement</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <Tabs defaultValue="statement" value={activeTab} onValueChange={setActiveTab} className="mb-8">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="statement">Statement</TabsTrigger>
                      <TabsTrigger value="conformance">Conformance</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                    </TabsList>
          

                  <div className="prose max-w-none">
                    <TabsContent value="statement">
                      <h2>Accessibility Statement</h2>
                      <p>
                        EduPortal is committed to ensuring digital accessibility for people with disabilities. We are
                        continually improving the user experience for everyone, and applying the relevant accessibility
                        standards.
                      </p>

                      <h3>Our Commitment</h3>
                      <p>
                        We believe that the web should be accessible to all, regardless of disability, location, or the
                        technology used. Our goal is to provide an accessible and inclusive experience for all users,
                        including those with disabilities such as:
                      </p>
                      <ul>
                        <li>Visual impairments</li>
                        <li>Hearing impairments</li>
                        <li>Mobility impairments</li>
                        <li>Cognitive disabilities</li>
                        <li>Learning disabilities</li>
                      </ul>
                      <p>
                        We strive to ensure that our website and learning platform conform to the Web Content
                        Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content
                        more accessible for people with disabilities.
                      </p>

                      <h3>Scope of Statement</h3>
                      <p>
                        This accessibility statement applies to the EduPortal website at{" "}
                        <Link href="/">https://eduportal.com</Link> and all its subdomains, including our learning
                        management system, course catalog, and student dashboard.
                      </p>

                      <h3>Feedback and Contact Information</h3>
                      <p>
                        We welcome your feedback on the accessibility of EduPortal. Please let us know if you encounter
                        accessibility barriers on our website:
                      </p>
                      <ul>
                        <li>Email: accessibility@eduportal.com</li>
                        <li>Phone: +919672670732</li>
                        <li>Postal address: Jaipur, India</li>
                      </ul>
                      <p>We try to respond to feedback within 2 business days.</p>
                    </TabsContent>

                    <TabsContent value="conformance">
                      <h2>Conformance Status</h2>
                      <p>
                        The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and
                        developers to improve accessibility for people with disabilities. It defines three levels of
                        conformance: Level A, Level AA, and Level AAA.
                      </p>
                      <p>
                        EduPortal is partially conformant with WCAG 2.1 level AA. Partially conformant means that some
                        parts of the content do not fully conform to the accessibility standard.
                      </p>

                      <h3>Compatibility with Browsers and Assistive Technology</h3>
                      <p>
                        The EduPortal website is designed to be compatible with the following assistive technologies:
                      </p>
                      <ul>
                        <li>Screen readers (including JAWS, NVDA, VoiceOver, and TalkBack)</li>
                        <li>Screen magnification software</li>
                        <li>Speech recognition software</li>
                        <li>Keyboard-only navigation</li>
                      </ul>
                      <p>The website is designed to be compatible with the following browsers:</p>
                      <ul>
                        <li>The latest versions of Chrome, Firefox, Safari, and Edge</li>
                        <li>Internet Explorer 11 and above</li>
                      </ul>

                      <h3>Technical Specifications</h3>
                      <p>
                        Accessibility of EduPortal relies on the following technologies to work with the particular
                        combination of web browser and any assistive technologies or plugins installed on your computer:
                      </p>
                      <ul>
                        <li>HTML</li>
                        <li>WAI-ARIA</li>
                        <li>CSS</li>
                        <li>JavaScript</li>
                      </ul>
                      <p>These technologies are relied upon for conformance with the accessibility standards used.</p>

                      <h3>Assessment Approach</h3>
                      <p>EduPortal assesses the accessibility of our website through the following approaches:</p>
                      <ul>
                        <li>Self-evaluation</li>
                        <li>External evaluation by accessibility experts</li>
                        <li>User testing with people with disabilities</li>
                        <li>Automated testing tools</li>
                      </ul>
                    </TabsContent>

                    <TabsContent value="features">
                      <h2>Accessibility Features</h2>
                      <p>
                        EduPortal includes the following accessibility features to help users with disabilities access
                        and use our content:
                      </p>

                      <h3>Navigation</h3>
                      <ul>
                        <li>Consistent navigation structure throughout the website</li>
                        <li>Skip to main content link at the beginning of each page</li>
                        <li>Breadcrumb navigation to help users understand their location</li>
                        <li>Descriptive page titles that clearly indicate the purpose of each page</li>
                        <li>Logical tab order for keyboard navigation</li>
                      </ul>

                      <h3>Design and Layout</h3>
                      <ul>
                        <li>Responsive design that adapts to different screen sizes and orientations</li>
                        <li>Sufficient color contrast between text and background</li>
                        <li>Text can be resized up to 200% without loss of content or functionality</li>
                        <li>No content that flashes more than three times per second</li>
                        <li>Clear visual focus indicators for keyboard navigation</li>
                      </ul>

                      <h3>Content</h3>
                      <ul>
                        <li>Alternative text for all meaningful images</li>
                        <li>Captions and transcripts for video content</li>
                        <li>Descriptive link text that makes sense out of context</li>
                        <li>Proper heading structure to organize content</li>
                        <li>ARIA landmarks to identify regions of the page</li>
                      </ul>

                      <h3>Forms</h3>
                      <ul>
                        <li>Form fields have associated labels</li>
                        <li>Error messages are clearly identified and provide suggestions for correction</li>
                        <li>Required fields are clearly indicated</li>
                        <li>Sufficient time to complete forms</li>
                        <li>No automatic form submission when selecting an option from a dropdown</li>
                      </ul>

                      <h3>Course Content</h3>
                      <ul>
                        <li>Video players with accessible controls</li>
                        <li>Interactive elements that can be operated with keyboard alone</li>
                        <li>Alternative formats for course materials when possible</li>
                        <li>Extended time options for timed assessments</li>
                        <li>Text-to-speech functionality for course content</li>
                      </ul>
                    </TabsContent>

                    <TabsContent value="contact">
                      <h2>Contact and Support</h2>
                      <p>
                        If you encounter any accessibility barriers on EduPortal, we want to hear about it. Your
                        feedback helps us improve the accessibility of our platform for everyone.
                      </p>

                      <h3>How to Report Accessibility Issues</h3>
                      <p>You can report accessibility issues in the following ways:</p>
                      <ul>
                        <li>Email: accessibility@eduportal.com</li>
                        <li>Phone: +919672670732</li>
                        <li>
                          Contact form: <Link href="/contact">Contact Us</Link>
                        </li>
                      </ul>
                      <p>When reporting an issue, please include:</p>
                      <ul>
                        <li>The URL of the page where you encountered the issue</li>
                        <li>A description of the issue</li>
                        <li>The device, browser, and assistive technology you were using</li>
                        <li>Screenshots or screen recordings if possible</li>
                      </ul>

                      <h3>Accessibility Support</h3>
                      <p>
                        Our accessibility team is available to provide support and assistance to users with
                        disabilities. We can help with:
                      </p>
                      <ul>
                        <li>Navigating the website</li>
                        <li>Accessing course content</li>
                        <li>Completing forms and assessments</li>
                        <li>Providing alternative formats of content</li>
                        <li>Accommodations for live webinars and events</li>
                      </ul>

                      <h3>Formal Complaints</h3>
                      <p>
                        We aim to respond to accessibility feedback within 2 business days, and to resolve issues within
                        10 business days when possible. If you are dissatisfied with our response to your feedback, you
                        may contact us to file a formal complaint.
                      </p>
                      <p>
                        You also have the right to file a complaint with the U.S. Department of Justice, Civil Rights
                        Division, Disability Rights Section, or the U.S. Department of Education, Office for Civil
                        Rights.
                      </p>

                      <h3>Continuous Improvement</h3>
                      <p>
                        We are committed to continuously improving the accessibility of our website and learning
                        platform. We regularly review our accessibility efforts and work to address known issues.
                      </p>
                      <p>
                        Thank you for your support and feedback as we work to make EduPortal accessible to all users.
                      </p>
                    </TabsContent>
                  </div>
                          </Tabs>
                </CardContent>
              </Card>

              <div className="mt-8 flex justify-between items-center">
                <Link href="/cookies">
                  <Button variant="outline" className="gap-2 border-blue-200 hover:bg-blue-50">
                    Cookie Policy
                  </Button>
                </Link>
                <Link href="/terms">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    Terms of Service
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
