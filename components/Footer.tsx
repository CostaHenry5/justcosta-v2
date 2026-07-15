"use client";

import { Heart, Mail, Phone, Globe, GitBranch } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">

        <div className="grid md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-blue-500 mb-4">
              JustCosta
            </h2>

            <p className="text-slate-400 leading-8">
              Healthcare Professional, Health Informatics Specialist,
              Software Developer and Data Analyst passionate about
              improving healthcare through technology and innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">

              <a href="#about" className="text-slate-400 hover:text-blue-500 transition">
                About
              </a>

              <a href="#experience" className="text-slate-400 hover:text-blue-500 transition">
                Experience
              </a>

              <a href="#skills" className="text-slate-400 hover:text-blue-500 transition">
                Skills
              </a>

              <a href="#services" className="text-slate-400 hover:text-blue-500 transition">
                Services
              </a>

              <a href="#projects" className="text-slate-400 hover:text-blue-500 transition">
                Projects
              </a>

              <a href="#contact" className="text-slate-400 hover:text-blue-500 transition">
                Contact
              </a>

            </div>
          </div>

          {/* Contact */}
          <div>

            <h3 className="text-xl font-semibold mb-5">
              Contact
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3 text-slate-400">
                <Mail size={18} className="text-blue-500" />
                <span>hello@justcosta.org</span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <Phone size={18} className="text-blue-500" />
                <span>+255 769 944 733</span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <Globe size={18} className="text-blue-500" />
                <span>justcosta.org</span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <GitBranch size={18} className="text-blue-500" />

                <a
                  href="https://github.com/CostaHenry5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  github.com/CostaHenry5
                </a>

              </div>

            </div>

          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} JustCosta. All rights reserved.
          </p>

          <p className="flex items-center gap-2 text-sm text-slate-500 mt-4 md:mt-0">
            Built with
            <Heart
              size={16}
              className="text-red-500 fill-red-500"
            />
            Next.js & Tailwind CSS
          </p>

        </div>

      </div>
    </footer>
  );
}