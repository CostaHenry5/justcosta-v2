"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <h2 className="text-3xl font-bold text-blue-500 mb-4">
              JustCosta
            </h2>

            <p className="text-slate-400 leading-8">
              Healthcare Professional, Health Informatics Enthusiast,
              Software Developer and Data Analytics Learner passionate
              about improving healthcare through technology.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-slate-400">

              <li>
                <a href="#about" className="hover:text-blue-500 transition">
                  About
                </a>
              </li>

              <li>
                <a href="#experience" className="hover:text-blue-500 transition">
                  Experience
                </a>
              </li>

              <li>
                <a href="#skills" className="hover:text-blue-500 transition">
                  Skills
                </a>
              </li>

              <li>
                <a href="#services" className="hover:text-blue-500 transition">
                  Services
                </a>
              </li>

              <li>
                <a href="#projects" className="hover:text-blue-500 transition">
                  Projects
                </a>
              </li>

              <li>
                <a href="#contact" className="hover:text-blue-500 transition">
                  Contact
                </a>
              </li>

            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5">
              Contact
            </h3>

            <div className="space-y-3 text-slate-400">

              <p>hello@justcosta.org</p>

              <p>+255 769 944 733</p>

              <p>Dar es Salaam, Tanzania</p>

              <a
                href="https://github.com/CostaHenry5"
                target="_blank"
                className="block hover:text-blue-500 transition"
              >
                GitHub
              </a>

            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">

          <p className="text-slate-500 text-center">
            © {year} JustCosta. All rights reserved.
          </p>

          <p className="flex items-center gap-2 text-slate-500 mt-4 md:mt-0">

            Made with

            <Heart
              size={18}
              className="text-red-500 fill-red-500"
            />

            using Next.js

          </p>

        </div>

      </div>
    </footer>
  );
}