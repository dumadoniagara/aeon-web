"use client"

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center font-bold text-xl text-blue-600">
            AEON
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/">Showcase</Link>
            <Link href="/">Docs</Link>
            <Link href="/">Blog</Link>
            <Link href="/">Analytics</Link>
            <Link href="/">Templates</Link>
            <Link href="/">Enterprise</Link>

            <div className="hidden md:block flex-1 mx-6">
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full border rounded px-3 py-1 focus:outline-none"
              />
            </div>

            <Link
              href="/login"
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Login
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <button onClick={() => setShowSearch(!showSearch)}>
              {showSearch ? null : <FiSearch size={22} />}
            </button>

            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 px-4 ${showSearch ? "max-h-16 py-2" : "max-h-0 py-0"
          }`}
      >
        <div className="flex flex-row gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border rounded px-3 py-1 focus:outline-none"
          />
          <button onClick={() => setShowSearch(false)}>
            <FiX size={24} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col gap-6 bg-white px-4 py-3 space-y-2 shadow">
          <Link href="/">Showcase</Link>
          <Link href="/">Docs</Link>
          <Link href="/">Blog</Link>
          <Link href="/">Analytics</Link>
          <Link href="/">Templates</Link>
          <Link href="/">Enterprise</Link>
          <Link
            href="/login"
            className="block bg-blue-600 text-white px-3 py-1 rounded text-center"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
