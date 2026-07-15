"use client";

import { motion } from "framer-motion";

const stats = [
  {
    number: "4+",
    label: "Years Clinical Experience",
  },
  {
    number: "6+",
    label: "Hospital Departments",
  },
  {
    number: "15+",
    label: "Digital Projects",
  },
  {
    number: "100%",
    label: "Commitment",
  },
];

export default function Stats() {
  return (
    <section className="bg-blue-600 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-5xl font-bold text-white">
                {stat.number}
              </h2>

              <p className="mt-4 text-blue-100 text-lg">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}