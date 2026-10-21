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
      className="bg-surface-2 py-24 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="eyebrow">
            Services
          </p>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            What I Do
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

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
                className={`group rounded-3xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl hover:shadow-gold/10 sm:p-8 ${index === 0 ? "md:col-span-2" : ""}`}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-soft transition group-hover:bg-gold">

                  <Icon
                    size={28}
                    className="text-gold-text transition group-hover:text-on-gold"
                  />

                </div>

                <h3 className="mb-3 text-xl font-extrabold text-ink sm:text-2xl">
                  {service.title}
                </h3>

                <p className="leading-7 text-muted">
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