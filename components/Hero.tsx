"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-canvas">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-6"
      >
        <h1 className="text-6xl font-bold text-ink">
          Costa Henry
        </h1>

        <p className="mt-6 text-xl text-muted">
          Medical Personnel • Health Informatics • Data Analyst • Digital Solutions Developer
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="bg-gold text-on-gold font-bold px-6 py-3 rounded-full hover:bg-gold-hover transition">
            Contact Me
          </button>

          <button className="border-2 border-ink text-ink font-bold px-6 py-3 rounded-full hover:bg-ink hover:text-canvas transition">
            View Projects
          </button>
        </div>
      </motion.div>
    </section>
  );
}