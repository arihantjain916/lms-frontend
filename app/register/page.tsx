"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Github,
  ChromeIcon as Google,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import instance from "@/helper/axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    username: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    username?: string;
    agreeToTerms?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }));
    if (errors.agreeToTerms) {
      setErrors((prev) => ({ ...prev, agreeToTerms: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      username?: string;
      password?: string;
      agreeToTerms?: string;
    } = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase, and numbers";
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    try {
      const res: any = await instance.post("/auth/register", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      if (!res?.status) {
        return toast.error(res?.message || "Login successful");
      }

      toast.success("User registered successfully. Please login.");

      router.push("/");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, label: "" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return {
      strength,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "",
    };
  };

  const passwordStrength = getPasswordStrength();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
          <motion.div
            className="w-full max-w-md"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="mb-8 text-center">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-2xl font-bold">EduPortal</span>
              </Link>
              <h1 className="text-3xl font-bold mb-2">Create an account</h1>
              <p className="text-muted-foreground">
                Join our learning community today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    className={`pl-10 ${
                      errors.fullName
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="name@example.com"
                    className={`pl-10 ${
                      errors.username
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email"
                    className={`pl-10 ${
                      errors.email
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
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
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 ${
                      errors.password
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                )}

                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-full flex-1 rounded-full ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength: {passwordStrength.label || "Very Weak"}
                    </p>
                    <ul className="text-xs space-y-1 mt-2">
                      <li
                        className={`flex items-center gap-1 ${
                          formData.password.length >= 8
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formData.password.length >= 8 ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        At least 8 characters
                      </li>
                      <li
                        className={`flex items-center gap-1 ${
                          /[A-Z]/.test(formData.password)
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {/[A-Z]/.test(formData.password) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        At least one uppercase letter
                      </li>
                      <li
                        className={`flex items-center gap-1 ${
                          /[a-z]/.test(formData.password)
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {/[a-z]/.test(formData.password) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        At least one lowercase letter
                      </li>
                      <li
                        className={`flex items-center gap-1 ${
                          /\d/.test(formData.password)
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {/\d/.test(formData.password) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        At least one number
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={handleCheckboxChange}
                    disabled={isLoading}
                    className={
                      errors.agreeToTerms
                        ? "border-red-500 data-[state=checked]:bg-red-500"
                        : ""
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.agreeToTerms}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Google className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right side - Image/Illustration */}
        <div className="hidden md:block md:w-1/2 bg-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-800/20"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-md text-center"
            >
              <h2 className="text-3xl font-bold mb-4">
                Start Your Learning Journey Today
              </h2>
              <p className="text-blue-100 mb-6">
                Join our community of learners and gain access to world-class
                courses taught by industry experts. Advance your career with
                in-demand skills.
              </p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-white/60" />
                ))}
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-6 left-6 text-white/80 text-sm">
            © {new Date().getFullYear()} EduPortal. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
