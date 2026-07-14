"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  FileText,
  Shield,
  Cookie,
  HelpCircle,
  Printer,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CookiePolicyPage() {
  const [activeTab, setActiveTab] = useState("what");

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Last updated date
  const lastUpdated = "January 15, 2024";

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
                <BreadcrumbLink href="/cookies" className="font-medium">
                  Cookie Policy
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Cookie Policy
            </h1>
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
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Terms of Service</span>
                      </Link>
                      <Link
                        href="/privacy"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Privacy Policy</span>
                      </Link>
                      <Link
                        href="/cookies"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 text-blue-600"
                      >
                        <Cookie className="h-4 w-4" />
                        <span>Cookie Policy</span>
                      </Link>
                      <Link
                        href="/accessibility"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50"
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span>Accessibility</span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Cookie Preferences</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You can manage your cookie preferences at any time.
                    </p>
                    <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                      Manage Cookies
                      <Cookie className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Download Policy</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                      >
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                      >
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
                  <Tabs
                    defaultValue="what"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="mb-8"
                  >
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="what">What Are Cookies</TabsTrigger>
                      <TabsTrigger value="types">Types of Cookies</TabsTrigger>
                      <TabsTrigger value="manage">Managing Cookies</TabsTrigger>
                      <TabsTrigger value="changes">Changes</TabsTrigger>
                    </TabsList>

                    <div className="prose max-w-none">
                      <TabsContent value="what">
                        <h2>What Are Cookies</h2>
                        <p>
                          This Cookie Policy explains how EduPortal ("we", "us",
                          or "our") uses cookies and similar technologies to
                          recognize you when you visit our website at{" "}
                          <Link href="/">https://eduportal.com</Link>{" "}
                          ("Website"). It explains what these technologies are
                          and why we use them, as well as your rights to control
                          our use of them.
                        </p>

                        <h3>What Are Cookies?</h3>
                        <p>
                          Cookies are small data files that are placed on your
                          computer or mobile device when you visit a website.
                          Cookies are widely used by website owners in order to
                          make their websites work, or to work more efficiently,
                          as well as to provide reporting information.
                        </p>
                        <p>
                          Cookies set by the website owner (in this case,
                          EduPortal) are called "first-party cookies". Cookies
                          set by parties other than the website owner are called
                          "third-party cookies". Third-party cookies enable
                          third-party features or functionality to be provided
                          on or through the website (e.g., advertising,
                          interactive content, and analytics). The parties that
                          set these third-party cookies can recognize your
                          computer both when it visits the website in question
                          and also when it visits certain other websites.
                        </p>

                        <h3>Why Do We Use Cookies?</h3>
                        <p>
                          We use first-party and third-party cookies for several
                          reasons. Some cookies are required for technical
                          reasons in order for our Website to operate, and we
                          refer to these as "essential" or "strictly necessary"
                          cookies. Other cookies also enable us to track and
                          target the interests of our users to enhance the
                          experience on our Website. Third parties serve cookies
                          through our Website for advertising, analytics, and
                          other purposes. This is described in more detail
                          below.
                        </p>

                        <h3>How Long Do Cookies Last?</h3>
                        <p>
                          The length of time a cookie will remain on your
                          computer or mobile device depends on whether it is a
                          "persistent" or "session" cookie. Session cookies will
                          remain on your device until you stop browsing.
                          Persistent cookies remain on your computer or mobile
                          device until they expire or are deleted.
                        </p>
                      </TabsContent>

                      <TabsContent value="types">
                        <h2>Types of Cookies We Use</h2>
                        <p>
                          The specific types of first and third-party cookies
                          served through our Website and the purposes they
                          perform are described below:
                        </p>

                        <h3>Essential Cookies</h3>
                        <p>
                          These cookies are strictly necessary to provide you
                          with services available through our Website and to use
                          some of its features, such as access to secure areas.
                          Because these cookies are strictly necessary to
                          deliver the Website, you cannot refuse them without
                          impacting how our Website functions.
                        </p>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Provider</TableHead>
                              <TableHead>Purpose</TableHead>
                              <TableHead>Expiry</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>JSESSIONID</TableCell>
                              <TableCell>EduPortal</TableCell>
                              <TableCell>
                                Preserves user session state across page
                                requests
                              </TableCell>
                              <TableCell>Session</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>XSRF-TOKEN</TableCell>
                              <TableCell>EduPortal</TableCell>
                              <TableCell>
                                Helps prevent Cross-Site Request Forgery attacks
                              </TableCell>
                              <TableCell>Session</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>auth_token</TableCell>
                              <TableCell>EduPortal</TableCell>
                              <TableCell>
                                Authenticates logged-in users
                              </TableCell>
                              <TableCell>30 days</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>

                        <h3>Performance and Functionality Cookies</h3>
                        <p>
                          These cookies are used to enhance the performance and
                          functionality of our Website but are non-essential to
                          their use. However, without these cookies, certain
                          functionality may become unavailable.
                        </p>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Provider</TableHead>
                              <TableHead>Purpose</TableHead>
                              <TableHead>Expiry</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>language</TableCell>
                              <TableCell>EduPortal</TableCell>
                              <TableCell>
                                Remembers user language preference
                              </TableCell>
                              <TableCell>1 year</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>ui_theme</TableCell>
                              <TableCell>EduPortal</TableCell>
                              <TableCell>
                                Remembers user interface theme preference
                              </TableCell>
                              <TableCell>1 year</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>recently_viewed</TableCell>
                              <TableCell>EduPortal</TableCell>
                              <TableCell>
                                Tracks recently viewed courses
                              </TableCell>
                              <TableCell>30 days</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>

                        <h3>Analytics and Customization Cookies</h3>
                        <p>
                          These cookies collect information that is used either
                          in aggregate form to help us understand how our
                          Website is being used or how effective our marketing
                          campaigns are, or to help us customize our Website for
                          you.
                        </p>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Provider</TableHead>
                              <TableHead>Purpose</TableHead>
                              <TableHead>Expiry</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>_ga</TableCell>
                              <TableCell>Google</TableCell>
                              <TableCell>
                                Registers a unique ID used to generate
                                statistical data
                              </TableCell>
                              <TableCell>2 years</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>_gid</TableCell>
                              <TableCell>Google</TableCell>
                              <TableCell>
                                Registers a unique ID used to generate
                                statistical data
                              </TableCell>
                              <TableCell>24 hours</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>_gat</TableCell>
                              <TableCell>Google</TableCell>
                              <TableCell>
                                Used to throttle request rate
                              </TableCell>
                              <TableCell>1 minute</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>

                        <h3>Advertising Cookies</h3>
                        <p>
                          These cookies are used to make advertising messages
                          more relevant to you. They perform functions like
                          preventing the same ad from continuously reappearing,
                          ensuring that ads are properly displayed for
                          advertisers, and in some cases selecting
                          advertisements that are based on your interests.
                        </p>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Provider</TableHead>
                              <TableHead>Purpose</TableHead>
                              <TableHead>Expiry</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>_fbp</TableCell>
                              <TableCell>Facebook</TableCell>
                              <TableCell>
                                Used by Facebook to deliver advertisements
                              </TableCell>
                              <TableCell>3 months</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>IDE</TableCell>
                              <TableCell>Google</TableCell>
                              <TableCell>
                                Used by Google DoubleClick to register user
                                actions
                              </TableCell>
                              <TableCell>1 year</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>ads/ga-audiences</TableCell>
                              <TableCell>Google</TableCell>
                              <TableCell>
                                Used by Google AdWords for remarketing
                              </TableCell>
                              <TableCell>Session</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TabsContent>

                      <TabsContent value="manage">
                        <h2>How Can You Control Cookies?</h2>
                        <p>
                          You have the right to decide whether to accept or
                          reject cookies. You can exercise your cookie
                          preferences by clicking on the "Manage Cookies" button
                          at the bottom of our website.
                        </p>

                        <h3>Browser Controls</h3>
                        <p>
                          You can set or amend your web browser controls to
                          accept or refuse cookies. If you choose to reject
                          cookies, you may still use our website though your
                          access to some functionality and areas of our website
                          may be restricted. As the means by which you can
                          refuse cookies through your web browser controls vary
                          from browser-to-browser, you should visit your
                          browser's help menu for more information.
                        </p>

                        <h3>Disabling Most Interest Based Advertising</h3>
                        <p>
                          Most advertising networks offer you a way to opt out
                          of Interest Based Advertising. If you would like to
                          find out more information, please visit{" "}
                          <a
                            href="http://www.aboutads.info/choices/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            http://www.aboutads.info/choices/
                          </a>{" "}
                          or{" "}
                          <a
                            href="http://www.youronlinechoices.com"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            http://www.youronlinechoices.com
                          </a>
                          .
                        </p>

                        <h3>Do Not Track</h3>
                        <p>
                          Some Internet browsers - like Internet Explorer,
                          Firefox, and Safari - include the ability to transmit
                          "Do Not Track" or "DNT" signals. Since uniform
                          standards for "DNT" signals have not been adopted, our
                          Website does not currently process or respond to "DNT"
                          signals.
                        </p>

                        <h3>Cookies That Have Been Set in the Past</h3>
                        <p>
                          If you have disabled one or more cookies, we may still
                          use information collected from cookies prior to your
                          disabled preference being set, however, we will stop
                          using the disabled cookie to collect any further
                          information.
                        </p>

                        <h3>Third-Party Opt-Out Options</h3>
                        <p>
                          For more information on how our third-party providers
                          use cookies and how to opt-out, please visit their
                          respective privacy policies:
                        </p>
                        <ul>
                          <li>
                            Google Analytics:{" "}
                            <a
                              href="https://policies.google.com/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              https://policies.google.com/privacy
                            </a>
                          </li>
                          <li>
                            Facebook:{" "}
                            <a
                              href="https://www.facebook.com/policy.php"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              https://www.facebook.com/policy.php
                            </a>
                          </li>
                          <li>
                            HotJar:{" "}
                            <a
                              href="https://www.hotjar.com/legal/policies/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              https://www.hotjar.com/legal/policies/privacy
                            </a>
                          </li>
                        </ul>
                      </TabsContent>

                      <TabsContent value="changes">
                        <h2>Changes to This Cookie Policy</h2>
                        <p>
                          We may update this Cookie Policy from time to time in
                          order to reflect, for example, changes to the cookies
                          we use or for other operational, legal, or regulatory
                          reasons. Please therefore re-visit this Cookie Policy
                          regularly to stay informed about our use of cookies
                          and related technologies.
                        </p>
                        <p>
                          The date at the top of this Cookie Policy indicates
                          when it was last updated.
                        </p>

                        <h3>Change Log</h3>
                        <p>
                          Below is a summary of significant changes to our
                          Cookie Policy:
                        </p>
                        <ul>
                          <li>
                            <strong>January 15, 2024:</strong> Updated list of
                            cookies used and their purposes.
                          </li>
                          <li>
                            <strong>October 10, 2023:</strong> Added information
                            about third-party opt-out options.
                          </li>
                          <li>
                            <strong>June 5, 2023:</strong> Updated information
                            about browser controls.
                          </li>
                          <li>
                            <strong>March 20, 2023:</strong> Initial publication
                            of Cookie Policy.
                          </li>
                        </ul>

                        <h3>Contact Us</h3>
                        <p>
                          If you have any questions about our use of cookies or
                          other technologies, please contact us:
                        </p>
                        <ul>
                          <li>By email: privacy@eduportal.com</li>
                          <li>By phone: +919672670732</li>
                          <li>By mail: Jaipur, India</li>
                        </ul>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="mt-8 flex justify-between items-center">
                <Link href="/privacy">
                  <Button
                    variant="outline"
                    className="gap-2 border-blue-200 hover:bg-blue-50"
                  >
                    Privacy Policy
                  </Button>
                </Link>
                <Link href="/accessibility">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    Accessibility
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
