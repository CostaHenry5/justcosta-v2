"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Check,
  ExternalLink,
  Globe,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Project = {
  title: string;
  status: string;
  icon: LucideIcon;
  color: string;
  description: string;
  tech?: string[];
  features?: string[];
  link: string;
  linkLabel?: string;
};

const projects: Project[] = [
  {
    title: "NipeDili",
    status: "Active development — Dar es Salaam pilot",
    icon: BriefcaseBusiness,
    color: "bg-blue-600",
    description:
      "A trusted mobile-first marketplace connecting people with gigs, part-time jobs and local services across Dar es Salaam.",
    features: [
      "Worker and employer profiles",
      "85+ local job and service roles",
      "Job applications and hiring management",
      "Founder listing moderation",
      "Verification and completed-work ratings",
      "Safety reporting",
      "Protected WhatsApp contact after acceptance",
    ],
    link: "https://nipe-dili.constantinehenry39.chatgpt.site",
    linkLabel: "View Live Project",
  },
  {
    title: "iPhones Mwenge",
    status: "Featured Store",
    icon: Smartphone,
    color: "bg-cyan-600 text-white shadow-lg shadow-cyan-200",
    description: "iPhones Mwenge is a premium mobile and gadgets shop located at Mwenge ITV in Dar es Salaam. We specialise in the latest high-end devices and accessories from leading global brands, including Apple, Samsung, Google Pixel, Guess, Polo, Santa Barbara, Pitaka, Aulumu, Anker, Powerology, Green Lion, Beats, JBL and Sony. Discover phones, speakers, phone cases, USB cables, adapters, earbuds, headphones and many more gadgets—all in one place.",
    tech: ["Apple", "Samsung", "Google Pixel", "Premium Accessories", "Audio", "Mwenge"],
    link: "https://www.instagram.com/iphonesmwenge/",
  },
  {
    title: "FastMED",
    status: "Live",
    icon: BrainCircuit,
    color: "bg-cyan-500",
    description: "FastMed helps people understand their next safe step when they have a health concern.\n\nIt helps a patient organise symptoms, timing, questions, age, and location into a clear visit summary. It then provides simple, cautious health guidance based on available Tanzania treatment-guideline material, highlights emergency warning signs, and helps the patient contact an available healthcare practitioner.\n\nFastMed is designed to make healthcare information easier to understand in English and Kiswahili.",
    tech: ["Patient Support", "Tanzania STG-NEMLIT", "Practitioner Access", "Health Informatics"],
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
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className={`flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg ${
                  index === 0 ? "md:col-span-2 lg:col-span-3" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={"flex h-12 w-12 items-center justify-center rounded-xl " + project.color}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="max-w-56 rounded-full bg-slate-100 px-3 py-1 text-center text-xs font-medium text-slate-700">{project.status}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold">{project.title}</h3>
                <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-6 text-slate-700">{project.description}</p>
                {project.features && (
                  <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {project.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {project.tech && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{item}</span>)}
                  </div>
                )}
                {isAvailable ? (
                  <a
                    href={project.link}
                    target={project.link.startsWith("http") ? "_blank" : undefined}
                    rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`mt-6 inline-flex w-fit items-center gap-2 font-semibold transition-colors ${
                      project.linkLabel
                        ? "rounded-full bg-cyan-700 px-5 py-3 text-white shadow-lg shadow-cyan-700/20 hover:bg-cyan-800"
                        : "text-cyan-700 hover:text-cyan-900"
                    }`}
                  >
                    {project.linkLabel ?? "View project"} <ExternalLink className="h-4 w-4" />
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
