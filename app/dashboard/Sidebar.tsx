"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/component/dashboard/sidebar";
import { LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { Dhome } from "@/component/dashboard/Dhome";
import { Setting } from "@/component/dashboard/setting";

export function SidebarComponent() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<"dashboard" | "settings">("dashboard");
  
  const button = [
    {
      label: "新規作成",
      href: "#",
      component: "dashboard" as const,
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "カスタマイズ",
      href: "#",
      component: "settings" as const,
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const displayName = user?.username || user?.fullName || "User";

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {button.map((link, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveComponent(link.component)}
                >
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 py-2">
              <UserButton />
              <motion.p
                animate={{
                  opacity: open ? 1 : 0,
                  width: open ? "auto" : 0,
                }}
                initial={{
                  opacity: 0,
                  width: 0,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
                className="text-neutral-700 dark:text-neutral-200 text-sm overflow-hidden whitespace-nowrap cursor-default"
              >
                {displayName}
              </motion.p>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard activeComponent={activeComponent} />
    </div>
  );
}

export const Logo = () => {
  return (
    <h1 className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 cursor-default">
      <Image
        src="/げーむらんくIcon.svg"
        alt="げーむらんく Icon"
        width={24}
        height={20}
        className="dark:invert"
      />
      <motion.span
        animate={{
          display: "inline-block",
          opacity: 1,
        }}
        initial={{
          display: "none",
          opacity: 0,
        }}
        className="font-medium text-black dark:text-white whitespace-pre inline-block !m-0 !py-0 !pr-0 pl-3"
      >
        げーむらんく
      </motion.span>
    </h1>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src="/げーむらんくIcon.svg"
        alt="げーむらんく"
        width={24}
        height={20}
        className="dark:invert"
      />
    </Link>
  );
};

const Dashboard = ({ activeComponent }: { activeComponent: "dashboard" | "settings" }) => {
  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dhome />;
      case "settings":
        return <Setting />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        {renderComponent()}
      </div>
    </div>
  );
};
