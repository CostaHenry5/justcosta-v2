"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="bg-white dark:bg-slate-950 pt-32 pb-20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="uppercase tracking-[0.3em] text-blue-600 font-bold mb-4">
              ABOUT ME
            </p>

            <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
              Costa Henry
            </h1>

            <div className="space-y-2 text-xl text-slate-600 dark:text-slate-300 mb-8">
              <p>Healthcare Professional</p>
              <p>Health Informatics</p>
              <p>Data Analyst</p>
              <p>Digital Solutions Developer</p>
            </div>

            <p className="text-lg leading-9 text-slate-600 dark:text-slate-300 mb-10">
              Passionate about combining clinical expertise with technology to
              improve healthcare through digital innovation, software
              development and data-driven solutions.
            </p>

            <div className="flex gap-5">
              <a
                href="#contact"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Contact Me
              </a>

              <a
                href="#projects"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition"
              >
                View Projects
              </a>
            </div>
          </motion.div>

          {/* PHOTO GOES HERE */}

          <div className="flex justify-center">
            <img
  src="/costa.jpg"
  alt="Costa Henry"
  className="w-[420px] h-[520px] rounded-3xl object-cover border-8 border-white dark:border-slate-900 shadow-2xl"
/>
          </div>

        </div>
      </div>
    </section>
  );
}