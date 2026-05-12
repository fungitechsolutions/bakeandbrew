"use client";

import * as React from "react";
import Image from "next/image";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { QuestionIcon, StudentIcon } from "@phosphor-icons/react";
import { Book, Package, Settings, TrendingUp, User } from "lucide-react";
import { siteInfo } from "@/utils/site-info";

const data = {
  teams: [
    {
      name: "Brew & Bake Academy",
      logo: (
        <Image
          src={siteInfo.assets.watermarkNoBG}
          alt="Brew & Bake"
          width={24}
          height={24}
        />
      ),
      plan: "Admin Panel",
    },
  ],
  navMain: [
    {
      title: "Analytics",
      url: "/analytics",
      icon: <TrendingUp />,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings />,
    },
    {
      title: "Users",
      url: "/users",
      icon: <User />,
    },
    {
      title: "Courses",
      url: "/courses",
      icon: <Book />,
    },
    {
      title: "Inquiries",
      url: "/inquiries",
      icon: <QuestionIcon />,
    },
    {
      title: "Students",
      url: "#",
      icon: <StudentIcon />,
      items: [
        { title: "List", url: "/students" },
        { title: "Outstanding", url: "/students/outstanding" },
        { title: "Sales Revenue", url: "/students/sales" },
      ],
    },
    {
      title: "Inventory",
      url: "#",
      icon: <Package />,
      items: [
        { title: "Products", url: "/inventory/products" },
        { title: "Stock In", url: "/inventory/stock-in" },
        { title: "Stock Out", url: "/inventory/stock-out" },
        { title: "Wastage", url: "/inventory/wastage" },
        { title: "Summary", url: "/inventory/summary" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
