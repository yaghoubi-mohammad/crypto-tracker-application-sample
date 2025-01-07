"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { MoonStar, Sun } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle
  const { theme, toggleTheme } = useTheme(); // Access theme and toggleTheme from context

  // Ensure the theme is applied consistently on the client side
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <nav
      className={`${
        theme === "light" ? "bg-white text-gray-900" : "bg-gray-900 text-white"
      } shadow-lg transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              Coin Flip
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                theme === "light" ? "hover:bg-gray-200" : "hover:bg-gray-700"
              } transition-colors duration-300`}
            >
              Home
            </Link>
            <Link
              href="/rates"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                theme === "light" ? "hover:bg-gray-200" : "hover:bg-gray-700"
              } transition-colors duration-300`}
            >
              Rates
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-octa-dark-50/10 dark:hover:bg-octa-light-50/10 transition-all"
            >
              {theme === "light" ? <MoonStar size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-octa-dark-50/10 dark:hover:bg-octa-light-50/10 transition-all"
            >
              {theme === "light" ? <MoonStar size={20} /> : <Sun size={20} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none transition-colors duration-300"
              aria-label="Toggle Menu"
              aria-expanded={isOpen}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                theme === "light" ? "hover:bg-gray-200" : "hover:bg-gray-700"
              } transition-colors duration-300`}
            >
              Home
            </Link>
            <Link
              href="/rates"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                theme === "light" ? "hover:bg-gray-200" : "hover:bg-gray-700"
              } transition-colors duration-300`}
            >
              Rates
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
