"use client";

import { motion } from "framer-motion";

const stats = [
  { number: "4+", label: "Years clinical experience" },
  { number: "6+", label: "Hospital departments" },
  { number: "15+", label: "Digital projects" },
  { number: "2", label: "Languages · English & Kiswahili" },
];

export default function Stats() {
  return (
    <section className="bg-band py-16 sm:py-20" aria-label="Highlights">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`px-4 text-center lg:px-8 ${
                index > 0 ? "lg:border-l lg:border-white/10" : ""
              }`}
            >
              <p className="text-5xl font-extrabold tracking-tight text-gold sm:text-6xl">
                {stat.number}
              </p>
              <p className="mt-3 text-sm font-medium text-band-muted sm:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
