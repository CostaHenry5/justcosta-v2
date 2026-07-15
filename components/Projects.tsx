"use client";

import { motion } from "framer-motion";
import { ExternalLink, FolderGit2 } from "lucide-react";

const projects = [
  {
    title: "JustCosta Portfolio",
    description:
      "A modern portfolio website built with Next.js, TypeScript and Tailwind CSS showcasing my clinical experience, healthcare technology and software development journey.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Healthcare Analytics Dashboard",
    description:
      "A healthcare dashboard designed to visualize patient and clinical data using modern analytics tools.",
    technologies: ["Python", "SQL", "Power BI"],
  },
  {
    title: "Hospital Management System",
    description:
      "A web application concept for managing patient records, appointments and hospital workflows.",
    technologies: ["React", "Node.js", "PostgreSQL"],
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
          <p className="uppercase tracking-[0.3em] text-blue-600 font-semibold mb-4">
            Projects
          </p>

          <h2 className="text-5xl font-bold text-slate-900 dark:text-white">
            Featured Projects
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
              className="rounded-3xl bg-slate-50 dark:bg-slate-900 shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <FolderGit2
                size={42}
                className="text-blue-600 mb-6"
              />

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {project.title}
              </h3>

              <p className="text-slate-600 dark:text-slate-300 leading-7 mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-600 text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-6">
                <a
                  href="https://github.com/CostaHenry5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <FolderGit2 size={18} />
                  GitHub
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={18} />
                  Coming Soon
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}