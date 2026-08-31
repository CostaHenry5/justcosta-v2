"use client";

import { motion } from "framer-motion";
import { BarChart3, BrainCircuit, Building2, ExternalLink, Globe, Smartphone } from "lucide-react";

const projects = [
  {
    title: "iPhones Mwenge",
    status: "Featured Store",
    icon: Smartphone,
    color: "bg-cyan-600 text-white shadow-lg shadow-cyan-200",
    description: "iPhones Mwenge is a Premium Mobile and Gadgets Shop located in Mwenge ITV in Dar es Salaam where high end and only latest gadgets from top brands across the globe like Apple ,Samsung google Pixel,Guess,Polo Santa Barbara ,Pitaka,aulumu,Anker,powerology greenlion,Beats,JBL Sony .within the store you can get Phones,Speakers ,Phone Cases,USB cables ,Adapters,Earbuds,Headphones and many more gadgets",
    tech: ["Apple", "Samsung", "Google Pixel", "Premium Accessories", "Audio", "Mwenge"],
    link: "https://www.instagram.com/iphonesmwenge/",
  },
  {
    title: "AI Clinical Assistant",
    status: "Live",
    icon: BrainCircuit,
    color: "bg-cyan-500",
    description: "A patient-facing health visit helper that organises symptoms and questions, then provides cautious general guidance grounded in Tanzania treatment guidelines. It is not a diagnosis, prescription, or emergency service.",
    tech: ["Patient Support", "Tanzania STG-NEMLIT", "AI", "Health Informatics"],
    link: "/clinical-assistant",
  },
  {
    title: "JustCosta Portfolio",
    status: "Live",
    icon: Globe,
    color: "bg-green-500",
    description: "A modern portfolio built with Next.js, React, TypeScript and Tailwind CSS showcasing healthcare, health informatics, software development and data analytics work.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
    link: "https://www.justcosta.org/",
  },
  {
    title: "Healthcare Analytics Dashboard",
    status: "In Development",
    icon: BarChart3,
    color: "bg-yellow-500",
    description: "Interactive healthcare dashboards designed for clinical reporting, data visualisation and decision support.",
    tech: ["Power BI", "Python", "SQL", "Healthcare Analytics"],
    link: "#",
  },
  {
    title: "Hospital Management System",
    status: "In Development",
    icon: Building2,
    color: "bg-purple-500",
    description: "A concept for streamlining patient records, workflows and reporting in healthcare facilities.",
    tech: ["Health Informatics", "Records", "Workflows", "Reporting"],
    link: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="bg-white py-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Projects</p>
          <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Ideas built for people and impact.</h2>
          <p className="mt-4 text-slate-700">Explore selected work across technology, healthcare and business.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const Icon = project.icon;
            const isAvailable = project.link !== "#";
            return (
              <motion.article key={project.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className={"flex h-12 w-12 items-center justify-center rounded-xl " + project.color}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{project.status}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold">{project.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-700">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{item}</span>)}
                </div>
                {isAvailable ? (
                  <a href={project.link} target={project.link.startsWith("http") ? "_blank" : undefined} rel={project.link.startsWith("http") ? "noreferrer" : undefined} className="mt-6 inline-flex items-center gap-2 font-semibold text-cyan-700 hover:text-cyan-900">
                    View project <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="mt-6 text-sm font-medium text-slate-500">Coming soon</span>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
