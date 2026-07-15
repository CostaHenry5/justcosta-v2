"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-white dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-6"
      >
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white">
          Costa Henry
        </h1>

        <p className="mt-6 text-xl text-slate-600 dark:text-slate-300">
          Medical Personnel • Health Informatics • Data Analyst • Digital Solutions Developer
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            Contact Me
          </button>

          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-900 transition">
            View Projects
          </button>
        </div>
      </motion.div>
    </section>
  );
}