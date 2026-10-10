"use client";

import { Building2, Sun, Moon, Settings } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <Link
        href="/"
        className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white"
      >
        <Building2 className="h-5 w-5 text-blue-600" />
        <span>Agency</span>
      </Link>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        <Link
          href="/settings"
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
