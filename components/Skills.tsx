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
      className="bg-canvas py-24 transition-colors duration-300"
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
            Skills
          </p>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Professional Skills
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">

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
                className="group rounded-3xl border border-line bg-surface p-7 transition-all duration-300 hover:border-gold hover:shadow-xl hover:shadow-gold/10 sm:p-8"
              >
                <div className="flex items-center gap-4 mb-6">

                  <div className="rounded-2xl bg-gold-soft p-3 transition group-hover:bg-gold">
                    <Icon
                      size={28}
                      className="text-gold-text transition group-hover:text-on-gold"
                    />
                  </div>

                  <h3 className="text-2xl font-extrabold text-ink">
                    {category.title}
                  </h3>

                </div>

                <div className="flex flex-wrap gap-3">

                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-surface-2 px-4 py-2 text-sm font-medium text-ink-soft"
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