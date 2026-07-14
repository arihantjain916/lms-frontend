"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowRight,
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

export default function PrivacyPage() {
  const [activeTab, setActiveTab] = useState("collection");

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
                <BreadcrumbLink href="/privacy" className="font-medium">
                  Privacy Policy
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Privacy Policy
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
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 text-blue-600"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Privacy Policy</span>
                      </Link>
                      <Link
                        href="/cookies"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50"
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
                    <h3 className="font-semibold mb-4">Need Help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you have any questions about our privacy practices,
                      please contact our privacy team.
                    </p>
                    <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                      Contact Privacy Team
                      <ArrowRight className="h-4 w-4" />
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
                    defaultValue="collection"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="mb-8"
                  >
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="collection">Collection</TabsTrigger>
                      <TabsTrigger value="use">Use</TabsTrigger>
                      <TabsTrigger value="sharing">Sharing</TabsTrigger>
                      <TabsTrigger value="rights">Your Rights</TabsTrigger>
                    </TabsList>

                    <div className="prose max-w-none">
                      <TabsContent value="collection">
                        <h2>Information Collection</h2>
                        <p>
                          At EduPortal, we take your privacy seriously. This
                          Privacy Policy explains how we collect, use, disclose,
                          and safeguard your information when you visit our
                          website or use our educational services. Please read
                          this privacy policy carefully. If you do not agree
                          with the terms of this privacy policy, please do not
                          access the site.
                        </p>

                        <h3>Personal Data We Collect</h3>
                        <p>
                          We collect personal information that you voluntarily
                          provide to us when you register on the website,
                          express an interest in obtaining information about us
                          or our products and services, participate in
                          activities on the website, or otherwise contact us.
                        </p>
                        <p>
                          The personal information that we collect depends on
                          the context of your interactions with us and the
                          website, the choices you make, and the products and
                          features you use. The personal information we collect
                          may include the following:
                        </p>
                        <ul>
                          <li>
                            <strong>Personal Identifiers:</strong> Name, email
                            address, postal address, phone number, and other
                            similar identifiers.
                          </li>
                          <li>
                            <strong>Account Information:</strong> Username,
                            password, account preferences, and profile
                            information.
                          </li>
                          <li>
                            <strong>Educational Information:</strong> Course
                            enrollments, progress, completion status,
                            certificates earned, and assessment results.
                          </li>
                          <li>
                            <strong>Payment Information:</strong> Credit card
                            details, billing address, and other financial
                            information necessary for processing payments.
                          </li>
                          <li>
                            <strong>Communications:</strong> Feedback,
                            questions, comments, and other information you
                            provide when contacting us or participating in
                            surveys.
                          </li>
                        </ul>

                        <h3>Automatically Collected Information</h3>
                        <p>
                          In addition to the information you voluntarily
                          provide, we may automatically collect certain
                          information about your device and how you interact
                          with our website. This information may include:
                        </p>
                        <ul>
                          <li>
                            <strong>Device Information:</strong> IP address,
                            browser type, operating system, device type, and
                            other technical information.
                          </li>
                          <li>
                            <strong>Usage Data:</strong> Pages visited, time
                            spent on pages, links clicked, and other actions
                            taken on our website.
                          </li>
                          <li>
                            <strong>Location Information:</strong> General
                            location information based on IP address.
                          </li>
                          <li>
                            <strong>Cookies and Similar Technologies:</strong>{" "}
                            Information collected through cookies, web beacons,
                            and similar technologies. For more information,
                            please see our{" "}
                            <Link href="/cookies">Cookie Policy</Link>.
                          </li>
                        </ul>

                        <h3>Information from Third Parties</h3>
                        <p>
                          We may receive information about you from third
                          parties, including:
                        </p>
                        <ul>
                          <li>
                            <strong>Social Media:</strong> If you choose to link
                            your social media accounts to our services, we may
                            receive information from those accounts.
                          </li>
                          <li>
                            <strong>Partners:</strong> Educational institutions,
                            employers, or other partners with whom we
                            collaborate may share information about you with
                            your consent.
                          </li>
                          <li>
                            <strong>Public Sources:</strong> Publicly available
                            information, such as social media profiles or
                            professional directories.
                          </li>
                        </ul>
                      </TabsContent>

                      <TabsContent value="use">
                        <h2>Use of Your Information</h2>
                        <p>
                          We use the information we collect for various purposes
                          related to providing, maintaining, and improving our
                          services. These purposes include:
                        </p>

                        <h3>Providing and Managing Services</h3>
                        <ul>
                          <li>Creating and managing your account</li>
                          <li>Delivering educational content and services</li>
                          <li>Processing payments and transactions</li>
                          <li>
                            Tracking your progress and issuing certificates
                          </li>
                          <li>
                            Providing customer support and responding to
                            inquiries
                          </li>
                          <li>
                            Facilitating communication between students and
                            instructors
                          </li>
                        </ul>

                        <h3>Improving and Personalizing Services</h3>
                        <ul>
                          <li>
                            Analyzing usage patterns to improve our website and
                            services
                          </li>
                          <li>
                            Personalizing your learning experience based on your
                            preferences and behavior
                          </li>
                          <li>
                            Developing new features, products, and services
                          </li>
                          <li>
                            Conducting research and analysis to enhance
                            educational outcomes
                          </li>
                          <li>
                            Testing and troubleshooting new products and
                            features
                          </li>
                        </ul>

                        <h3>Marketing and Communication</h3>
                        <ul>
                          <li>
                            Sending promotional communications about new
                            courses, special offers, and events
                          </li>
                          <li>
                            Providing updates about your courses or account
                          </li>
                          <li>Conducting surveys and collecting feedback</li>
                          <li>
                            Delivering targeted advertisements based on your
                            interests and preferences
                          </li>
                        </ul>

                        <h3>Legal and Security Purposes</h3>
                        <ul>
                          <li>
                            Complying with legal obligations and responding to
                            legal requests
                          </li>
                          <li>
                            Enforcing our terms of service and other policies
                          </li>
                          <li>
                            Protecting against, investigating, and preventing
                            potentially illegal activities
                          </li>
                          <li>
                            Ensuring the security and integrity of our platform
                          </li>
                          <li>Verifying identity and preventing fraud</li>
                        </ul>

                        <h3>Legal Basis for Processing</h3>
                        <p>
                          We process your personal information based on one or
                          more of the following legal bases:
                        </p>
                        <ul>
                          <li>
                            <strong>Consent:</strong> You have given us
                            permission to process your personal information for
                            specific purposes.
                          </li>
                          <li>
                            <strong>Contract:</strong> Processing is necessary
                            to fulfill our contractual obligations to you.
                          </li>
                          <li>
                            <strong>Legitimate Interests:</strong> Processing is
                            necessary for our legitimate interests, provided
                            those interests are not overridden by your rights
                            and freedoms.
                          </li>
                          <li>
                            <strong>Legal Obligation:</strong> Processing is
                            necessary to comply with applicable laws and
                            regulations.
                          </li>
                        </ul>
                      </TabsContent>

                      <TabsContent value="sharing">
                        <h2>Information Sharing and Disclosure</h2>
                        <p>
                          We may share your information with third parties in
                          certain circumstances. We do not sell your personal
                          information to third parties for monetary
                          consideration.
                        </p>

                        <h3>Categories of Third Parties</h3>
                        <p>
                          We may share your information with the following
                          categories of third parties:
                        </p>
                        <ul>
                          <li>
                            <strong>Service Providers:</strong> Companies that
                            provide services on our behalf, such as payment
                            processing, data analysis, email delivery, hosting
                            services, and customer service.
                          </li>
                          <li>
                            <strong>Educational Partners:</strong> Educational
                            institutions, instructors, and other partners with
                            whom we collaborate to provide educational services.
                          </li>
                          <li>
                            <strong>Business Partners:</strong> Companies with
                            whom we partner to offer joint promotions or
                            services.
                          </li>
                          <li>
                            <strong>Advertising Partners:</strong> Third parties
                            that help us deliver relevant advertisements and
                            marketing communications.
                          </li>
                          <li>
                            <strong>Analytics Providers:</strong> Companies that
                            help us analyze how our services are used.
                          </li>
                          <li>
                            <strong>Social Media Platforms:</strong> Social
                            media platforms when you interact with our content
                            on those platforms or use social media login
                            features.
                          </li>
                        </ul>

                        <h3>Circumstances for Sharing</h3>
                        <p>
                          We may share your information in the following
                          circumstances:
                        </p>
                        <ul>
                          <li>
                            <strong>With Your Consent:</strong> We may share
                            your information when you have given us permission
                            to do so.
                          </li>
                          <li>
                            <strong>For Legal Reasons:</strong> We may share
                            your information to comply with applicable laws and
                            regulations, to respond to a subpoena, search
                            warrant, or other lawful request, or to protect our
                            rights.
                          </li>
                          <li>
                            <strong>Business Transfers:</strong> In connection
                            with a merger, acquisition, reorganization, sale of
                            assets, or bankruptcy, your information may be
                            transferred as a business asset.
                          </li>
                          <li>
                            <strong>
                              Aggregated or De-identified Information:
                            </strong>{" "}
                            We may share aggregated or de-identified information
                            that cannot reasonably be used to identify you.
                          </li>
                        </ul>

                        <h3>International Data Transfers</h3>
                        <p>
                          Your information may be transferred to, and maintained
                          on, computers located outside of your state, province,
                          country, or other governmental jurisdiction where the
                          data protection laws may differ from those in your
                          jurisdiction.
                        </p>
                        <p>
                          If you are located outside the United States and
                          choose to provide information to us, please note that
                          we transfer the information, including personal
                          information, to the United States and process it
                          there. Your consent to this Privacy Policy followed by
                          your submission of such information represents your
                          agreement to that transfer.
                        </p>
                        <p>
                          We will take all steps reasonably necessary to ensure
                          that your data is treated securely and in accordance
                          with this Privacy Policy and no transfer of your
                          personal information will take place to an
                          organization or a country unless there are adequate
                          controls in place including the security of your data
                          and other personal information.
                        </p>
                      </TabsContent>

                      <TabsContent value="rights">
                        <h2>Your Privacy Rights</h2>
                        <p>
                          Depending on your location, you may have certain
                          rights regarding your personal information. These
                          rights may include:
                        </p>

                        <h3>Access and Portability</h3>
                        <p>
                          You have the right to request access to the personal
                          information we have collected about you. Upon request,
                          we will provide you with a copy of your personal
                          information in a structured, commonly used, and
                          machine-readable format.
                        </p>

                        <h3>Correction</h3>
                        <p>
                          You have the right to request that we correct
                          inaccurate or incomplete personal information about
                          you. You can update much of your personal information
                          directly through your account settings.
                        </p>

                        <h3>Deletion</h3>
                        <p>
                          You have the right to request that we delete your
                          personal information in certain circumstances. Please
                          note that we may need to retain certain information
                          for record-keeping purposes, to complete transactions,
                          or to comply with our legal obligations.
                        </p>

                        <h3>Restriction and Objection</h3>
                        <p>
                          You have the right to request that we restrict the
                          processing of your personal information in certain
                          circumstances. You also have the right to object to
                          the processing of your personal information in certain
                          circumstances.
                        </p>

                        <h3>Withdraw Consent</h3>
                        <p>
                          If we are processing your personal information based
                          on your consent, you have the right to withdraw that
                          consent at any time. This will not affect the
                          lawfulness of processing based on consent before its
                          withdrawal.
                        </p>

                        <h3>Do Not Track</h3>
                        <p>
                          We do not currently respond to "Do Not Track" signals
                          or similar mechanisms. However, you can configure your
                          browser to send "Do Not Track" signals to websites you
                          visit, and some browsers may be configured to send
                          these signals by default.
                        </p>

                        <h3>How to Exercise Your Rights</h3>
                        <p>
                          To exercise your rights, please contact us using the
                          contact information provided at the end of this
                          Privacy Policy. We may need to verify your identity
                          before responding to your request. We will respond to
                          your request within the timeframe required by
                          applicable law.
                        </p>
                        <p>
                          In some regions, you may have the right to file a
                          complaint with your local data protection authority if
                          you are concerned about how we process your personal
                          information.
                        </p>

                        <h3>California Privacy Rights</h3>
                        <p>
                          If you are a California resident, you have specific
                          rights under the California Consumer Privacy Act
                          (CCPA) and the California Privacy Rights Act (CPRA).
                          For more information about your California privacy
                          rights, please see our California Privacy Notice.
                        </p>

                        <h3>European Privacy Rights</h3>
                        <p>
                          If you are located in the European Economic Area
                          (EEA), United Kingdom, or Switzerland, you have rights
                          under the General Data Protection Regulation (GDPR)
                          and similar laws. For more information about your
                          European privacy rights, please see our European
                          Privacy Notice.
                        </p>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="mt-8 flex justify-between items-center">
                <Link href="/terms">
                  <Button
                    variant="outline"
                    className="gap-2 border-blue-200 hover:bg-blue-50"
                  >
                    Terms of Service
                  </Button>
                </Link>
                <Link href="/cookies">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    Cookie Policy
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
