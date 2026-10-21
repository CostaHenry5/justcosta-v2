"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { name: "About", href: "/#about" },
  { name: "Projects", href: "/#projects" },
  { name: "Experience", href: "/#experience" },
  { name: "Skills", href: "/#skills" },
  { name: "Services", href: "/#services" },
  { name: "FastMed", href: "/clinical-assistant" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "border-b border-line bg-canvas/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="JustCosta home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-base font-black text-on-gold shadow-sm transition-transform group-hover:-rotate-6">
            C
          </span>
          <span className="text-xl font-extrabold tracking-tight text-ink">
            Just<span className="text-gold-text">Costa</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="rounded-full px-4 py-2 text-[0.95rem] font-semibold text-ink-soft transition-colors hover:bg-gold-soft hover:text-ink"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="ml-3 rounded-full bg-ink px-5 py-2.5 text-[0.95rem] font-bold text-canvas transition hover:bg-gold hover:text-on-gold"
          >
            Contact
          </Link>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl p-2 text-ink hover:bg-gold-soft"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-line bg-canvas px-5 pb-6 pt-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-3 py-3 text-lg font-semibold text-ink-soft hover:bg-gold-soft hover:text-ink"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-xl bg-gold px-3 py-3 text-center text-lg font-bold text-on-gold"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
