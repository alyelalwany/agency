"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Building, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RealEstateUnit } from "@/types";

export function Sidebar() {
  const pathname = usePathname();
  const [units, setUnits] = useState<RealEstateUnit[]>([]);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    fetch("/api/units")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setUnits(Array.isArray(data) ? data : []))
      .catch(() => setUnits([]));
  }, []);

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed left-2 top-16 z-40 rounded-md p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "flex h-full w-56 flex-shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900",
          "transition-transform duration-200 md:translate-x-0",
          collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0",
          "fixed md:relative z-30 top-14 bottom-0 md:top-0"
        )}
      >
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {units.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Units
              </h3>
              <ul className="space-y-1">
                {units.map((unit) => {
                  const isActive = pathname === `/units/${unit.id}`;
                  return (
                    <li key={unit.id}>
                      <Link
                        href={`/units/${unit.id}`}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        )}
                      >
                        <Building className="h-4 w-4" />
                        <span className="truncate">{unit.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
