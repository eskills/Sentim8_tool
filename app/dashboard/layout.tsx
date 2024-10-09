"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BarChart2,
  MessageSquare,
  Upload,
  Settings,
  Menu,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: MessageSquare, label: 'Feedback', href: '/dashboard/feedback' },
  { icon: Upload, label: 'Import', href: '/feedback-import' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background">
      {/* Left Panel */}
      <aside className={cn(
        "bg-card text-card-foreground",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        "flex flex-col"
      )}>
        <div className="p-4 flex justify-between items-center">
          <h2 className={cn("font-bold text-lg", collapsed && "hidden")}>Sentim8</h2>
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 p-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <span className={cn(
                    "flex items-center space-x-2 p-2 rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href && "bg-primary text-primary-foreground",
                    collapsed && "justify-center"
                  )}>
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span>{item.label}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}