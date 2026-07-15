"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  BrainCircuit,
  Laptop,
  BarChart3,
} from "lucide-react";

const services = [
  {
    title: "Patient Treatment",
    description:
      "Providing patient-centered care through clinical assessment, treatment planning, monitoring and evidence-based healthcare practices.",
    icon: HeartPulse,
  },
  {
    title: "Health Informatics",
    description:
      "Supporting healthcare through digital health systems, clinical documentation and health information management.",
    icon: BrainCircuit,
  },
  {
    title: "Web Development",
    description:
      "Building responsive websites and modern web applications using React, Next.js, TypeScript and Tailwind CSS.",
    icon: Laptop,
  },
  {
    title: "Data Analytics",
    description:
      "Transforming healthcare and business data into meaningful insights using Python, SQL and visualization tools.",
    icon: BarChart3,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="uppercase tracking-[0.3em] text-blue-600 font-semibold mb-4">
            Services
          </p>

          <h2 className="text-5xl font-bold text-slate-900 dark:text-white">
            What I Do
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
                className="rounded-3xl bg-white dark:bg-slate-800 shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >
                <Icon
                  className="text-blue-600 mb-6"
                  size={42}
                />

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {service.title}
                </h3>

                <p className="leading-8 text-slate-600 dark:text-slate-300">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}