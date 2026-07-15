"use client";

import { motion } from "framer-motion";
import { HeartPulse, Laptop, Database, BrainCircuit } from "lucide-react";

const skillCategories = [
  {
    title: "Healthcare",
    icon: HeartPulse,
    skills: [
      "Patient Assessment",
      "Diagnosis",
      "Treatment Plan",
      "Management",
    ],
  },
  {
    title: "Health Informatics",
    icon: Database,
    skills: [
      "Electronic Medical Records (EMR)",
      "Clinical Documentation",
      "Health Information Systems",
      "Healthcare Data Management",
      "Digital Health",
      "Clinical Informatics",
    ],
  },
  {
    title: "Software Development",
    icon: Laptop,
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Git & GitHub",
    ],
  },
  {
    title: "Data & AI",
    icon: BrainCircuit,
    skills: [
      "Python",
      "SQL",
      "Power BI",
      "Data Analytics",
      "Artificial Intelligence",
      "Machine Learning",
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
          <p className="uppercase tracking-[0.35em] text-blue-600 font-bold mb-4">
            Skills
          </p>

          <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white">
            Professional Skills
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">

          {skillCategories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
                className="rounded-3xl bg-slate-50 dark:bg-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 p-8"
              >
                <div className="flex items-center gap-4 mb-6">

                  <div className="rounded-2xl bg-blue-100 dark:bg-slate-800 p-3">
                    <Icon
                      size={28}
                      className="text-blue-600"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {category.title}
                  </h3>

                </div>

                <div className="flex flex-wrap gap-3">

                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-blue-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}