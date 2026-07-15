"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  MonitorSmartphone,
  Code2,
  BarChart3,
  BrainCircuit,
} from "lucide-react";

const services = [
  {
    title: "Healthcare Consulting",
    icon: HeartPulse,
    description:
      "Supporting healthcare organizations through clinical workflow improvement, patient care optimization and quality healthcare initiatives.",
  },
  {
    title: "Health Informatics",
    icon: MonitorSmartphone,
    description:
      "Implementation of Electronic Medical Records, Health Information Systems, clinical documentation and digital health solutions.",
  },
  {
    title: "Software Development",
    icon: Code2,
    description:
      "Designing responsive websites, modern web applications and professional portfolio solutions using current technologies.",
  },
  {
    title: "Data Analytics",
    icon: BarChart3,
    description:
      "Transforming healthcare and business data into meaningful insights through dashboards, reporting and visualization.",
  },
  {
    title: "Digital Health Solutions",
    icon: BrainCircuit,
    description:
      "Exploring Artificial Intelligence, digital transformation and innovative technologies to improve healthcare delivery.",
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
          <p className="uppercase tracking-[0.35em] text-blue-600 font-bold mb-4">
            Services
          </p>

          <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white">
            What I Do
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="rounded-3xl bg-white dark:bg-slate-950 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-slate-800 flex items-center justify-center mb-6">

                  <Icon
                    size={32}
                    className="text-blue-600"
                  />

                </div>

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