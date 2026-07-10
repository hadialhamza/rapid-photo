"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Image as ImageIcon, LayoutDashboard } from "lucide-react";

export function AdminSidebarNav() {
  const pathname = usePathname();

  const links = [
    { name: "Image Gallery", href: "/admin", icon: ImageIcon },
    {
      name: "System Overview",
      href: "/admin/overview",
      icon: LayoutDashboard,
    },
    { name: "Manage Users", href: "/admin/users", icon: Users },
  ];

  return (
    <nav className="flex flex-col gap-1.5 flex-1 -mx-6">
      {links.map((link) => {
        const Icon = link.icon;
        // Strict equality for active page checking
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-6 py-3 border-l-2 transition-all duration-300 ${
              isActive
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-transparent text-muted hover:text-foreground hover:bg-elevated/30"
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-colors duration-300 ${
                isActive ? "text-primary" : "text-muted"
              }`}
            />
            <span className="text-sm">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
