"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  Database,
  Laptop,
  BrainCircuit,
} from "lucide-react";

const skills = [
  {
    title: "Healthcare",
    icon: HeartPulse,
    items: [
      
      "Patient Treatment",
      "Clinical Decision Making",
      "Critical Care",
      "Emergency Medicine",
      "Infection Prevention & Control",
    ],
  },
  {
    title: "Health Informatics",
    icon: Database,
    items: [
      "Electronic Medical Records",
      "Health Information Systems",
      "Clinical Documentation",
      "Healthcare Data Management",
      "Digital Health",
      "Data Quality",
    ],
  },
  {
    title: "Technology",
    icon: Laptop,
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "JavaScript",
      "Git & GitHub",
    ],
  },
  {
    title: "Data Analytics & AI",
    icon: BrainCircuit,
    items: [
      "Python",
      "SQL",
      "Power BI",
      "Data Analysis",
      "Machine Learning",
      "Artificial Intelligence",
    ],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300"
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
            Skills
          </p>

          <h2 className="text-5xl font-bold text-slate-900 dark:text-white">
            Professional Expertise
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skills.map((skill, index) => {
            const Icon = skill.icon;

            return (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
                className="rounded-3xl bg-slate-50 dark:bg-slate-900 shadow-lg p-8 hover:shadow-2xl transition-all duration-300"
              >
                <Icon
                  className="text-blue-600 mb-6"
                  size={40}
                />

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  {skill.title}
                </h3>

                <ul className="space-y-3">
                  {skill.items.map((item) => (
                    <li
                      key={item}
                      className="text-slate-600 dark:text-slate-300"
                    >
                      ✓ {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}