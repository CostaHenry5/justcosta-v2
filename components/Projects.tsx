"use client";

import { motion } from "framer-motion";
import {
  Globe,
  BarChart3,
  Building2,
  BrainCircuit,
  ExternalLink,
} from "lucide-react";

const projects = [
  {
    title: "JustCosta Portfolio",
    status: "Live",
    icon: Globe,
    color: "bg-green-500",
    description:
      "A modern portfolio built with Next.js, React, TypeScript and Tailwind CSS showcasing my healthcare, health informatics, software development and data analytics journey.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Vercel",
    ],
    link: "https://justcosta-v2-19f3.vercel.app",
  },
  {
    title: "Healthcare Analytics Dashboard",
    status: "In Development",
    icon: BarChart3,
    color: "bg-yellow-500",
    description:
      "Interactive healthcare dashboards designed for clinical reporting, data visualization and healthcare decision support.",
    tech: [
      "Power BI",
      "Python",
      "SQL",
      "Healthcare Analytics",
    ],
    link: "#",
  },
  {
    title: "Hospital Management System",
    status: "In Development",
    icon: Building2,
    color: "bg-yellow-500",
    description:
      "A hospital information system for patient management, appointments, medical records and healthcare workflows.",
    tech: [
      "React",
      "Node.js",
      "PostgreSQL",
    ],
    link: "#",
  },
  {
    title: "AI Clinical Assistant",
    status: "Research",
    icon: BrainCircuit,
    color: "bg-blue-600",
    description:
      "Research into AI-powered clinical decision support, healthcare automation and digital health innovation.",
    tech: [
      "Python",
      "Artificial Intelligence",
      "Machine Learning",
    ],
    link: "#",
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
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
            Projects
          </p>

          <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white">
            Featured Projects
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">

          {projects.map((project, index) => {
            const Icon = project.icon;

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="rounded-3xl bg-slate-50 dark:bg-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8"
              >
                <div className="flex items-center justify-between mb-6">

                  <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-slate-800 flex items-center justify-center">

                    <Icon
                      size={30}
                      className="text-blue-600"
                    />

                  </div>

                  <span
                    className={`${project.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}
                  >
                    {project.status}
                  </span>

                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {project.title}
                </h3>

                <p className="leading-8 text-slate-600 dark:text-slate-300 mb-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">

                  {project.tech.map((item) => (
                    <span
                      key={item}
                      className="bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}

                </div>

                <a
                  href={project.link}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                >
                  <ExternalLink size={18} />
                  View Project
                </a>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}