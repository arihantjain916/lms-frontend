import * as Icons from "lucide-react";
import React, { ForwardRefExoticComponent, memo } from "react";

const iconMap = {
  Code: { Icon: Icons.Code, bg: "bg-blue-100 text-blue-600" },
  Smartphone: { Icon: Icons.Smartphone, bg: "bg-purple-100 text-purple-600" },
  BarChart3: { Icon: Icons.BarChart3, bg: "bg-green-100 text-green-600" },
  Brain: { Icon: Icons.Brain, bg: "bg-pink-100 text-pink-600" },
  Cloud: { Icon: Icons.Cloud, bg: "bg-sky-100 text-sky-600" },
  Shield: { Icon: Icons.Shield, bg: "bg-red-100 text-red-600" },
  Server: { Icon: Icons.Server, bg: "bg-gray-100 text-gray-600" },
  Database: { Icon: Icons.Database, bg: "bg-indigo-100 text-indigo-600" },
  Palette: { Icon: Icons.Palette, bg: "bg-orange-100 text-orange-600" },
  Briefcase: { Icon: Icons.Briefcase, bg: "bg-teal-100 text-teal-600" },
  DollarSign: { Icon: Icons.DollarSign, bg: "bg-emerald-100 text-emerald-600" },
  TrendingUp: { Icon: Icons.TrendingUp, bg: "bg-lime-100 text-lime-600" },
  Globe: { Icon: Icons.Globe, bg: "bg-cyan-100 text-cyan-600" },
  BookOpen: { Icon: Icons.BookOpen, bg: "bg-amber-100 text-amber-600" },
  Heart: { Icon: Icons.Heart, bg: "bg-rose-100 text-rose-600" },
  Music: { Icon: Icons.Music, bg: "bg-fuchsia-100 text-fuchsia-600" },
  Camera: { Icon: Icons.Camera, bg: "bg-yellow-100 text-yellow-600" },
  GraduationCap: {
    Icon: Icons.GraduationCap,
    bg: "bg-violet-100 text-violet-600",
  },
  // fallback
  Default: { Icon: Icons.Folder, bg: "bg-gray-100 text-gray-500" },
} as const;

export function getIcon(iconName: string): {
  Icon: ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & {
      ref?: React.Ref<SVGSVGElement>;
    }
  >;
  bg: string;
} {
  return iconMap[iconName as keyof typeof iconMap] || iconMap.Default;
}
