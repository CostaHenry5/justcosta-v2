"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Check,
  Globe,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Project = {
  title: string;
  status: string;
  live?: boolean;
  icon: LucideIcon;
  description: string;
  tech?: string[];
  link: string;
  linkLabel?: string;
};

const featured = {
  title: "NipeDili",
  tagline: "Dili karibu nawe",
  status: "Live · Dar es Salaam pilot",
  description:
    "A trusted, mobile-first marketplace connecting people with gigs, part-time jobs and local services across Dar es Salaam.",
  features: [
    "Worker and employer profiles",
    "85+ local job and service roles",
    "Applications and hiring management",
    "Listing moderation",
    "Verification and completed-work ratings",
    "Safety reporting",
    "Protected WhatsApp contact after acceptance",
    "Prices in TZS or USD",
  ],
  link: "https://nipedilitz.com",
};

const projects: Project[] = [
  {
    title: "FastMED",
    status: "Live",
    live: true,
    icon: BrainCircuit,
    description:
      "Helps people understand their next safe step when they have a health concern. It organises symptoms, timing and questions into a clear visit summary, gives cautious guidance based on Tanzania treatment-guideline material, flags emergency warning signs, and connects patients to an available practitioner — in English and Kiswahili.",
    tech: ["Patient Support", "Tanzania STG-NEMLIT", "Practitioner Access", "Health Informatics"],
    link: "/clinical-assistant",
    linkLabel: "Try FastMED",
  },
  {
    title: "iPhones Mwenge",
    status: "Featured store",
    live: true,
    icon: Smartphone,
    description:
      "A premium phone and gadgets shop at Mwenge ITV, Dar es Salaam — the latest devices and accessories from Apple, Samsung, Google Pixel, Anker, Beats, JBL, Sony and more.",
    tech: ["Apple", "Samsung", "Google Pixel", "Accessories", "Audio"],
    link: "https://www.instagram.com/iphonesmwenge/",
    linkLabel: "Visit on Instagram",
  },
  {
    title: "JustCosta Portfolio",
    status: "Live",
    live: true,
    icon: Globe,
    description:
      "This site — built with Next.js, React, TypeScript and Tailwind CSS to showcase healthcare, health informatics, software and data work.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    link: "https://www.justcosta.org/",
  },
  {
    title: "Healthcare Analytics Dashboard",
    status: "In development",
    icon: BarChart3,
    description:
      "Interactive healthcare dashboards for clinical reporting, data visualisation and decision support.",
    tech: ["Power BI", "Python", "SQL", "Healthcare Analytics"],
    link: "#",
  },
  {
    title: "Hospital Management System",
    status: "In development",
    icon: Building2,
    description:
      "A concept for streamlining patient records, workflows and reporting in healthcare facilities.",
    tech: ["Health Informatics", "Records", "Workflows", "Reporting"],
    link: "#",
  },
];

function StatusPill({ status, live }: { status: string; live?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        live ? "bg-gold-soft text-gold-text" : "bg-surface-2 text-muted"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${live ? "bg-leaf" : "bg-muted/60"}`}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="bg-canvas py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 max-w-2xl"
        >
          <p className="eyebrow">Projects</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Ideas built for people and impact.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Selected work across healthcare, technology and business.
          </p>
        </motion.div>

        {/* Featured: NipeDili */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] bg-gold p-7 text-on-gold shadow-xl shadow-gold/20 sm:p-10 lg:p-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/25 blur-2xl"
          />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#171a18] text-[#f6bd12]">
                  <BriefcaseBusiness className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-[#171a18]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  Featured · {featured.status}
                </span>
              </div>
              <h3 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
                {featured.title}
              </h3>
              <p className="mt-1 text-lg font-semibold italic opacity-80">
                {featured.tagline}
              </p>
              <p className="mt-5 max-w-lg text-lg leading-8 text-[#3a3d39]">
                {featured.description}
              </p>
              <a
                href={featured.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#171a18] px-6 py-3.5 font-bold text-[#f8f7f2] transition hover:bg-[#2a2d2a]"
              >
                Visit nipedilitz.com
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            <ul className="grid gap-3 rounded-3xl bg-white/55 p-6 backdrop-blur-sm sm:grid-cols-2 sm:p-7">
              {featured.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[0.95rem] font-medium text-[#171a18]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#171a18]">
                    <Check aria-hidden="true" className="h-3 w-3 text-[#f6bd12]" strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.article>

        {/* Other projects */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const Icon = project.icon;
            const isAvailable = project.link !== "#";
            const isExternal = project.link.startsWith("http");
            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className={`group flex flex-col rounded-3xl border border-line bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl hover:shadow-gold/10 ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-soft text-gold-text transition group-hover:bg-gold group-hover:text-on-gold">
                    <Icon className="h-6 w-6" />
                  </span>
                  <StatusPill status={project.status} live={project.live} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-ink">{project.title}</h3>
                <p className="mt-3 flex-1 text-[0.95rem] leading-7 text-muted">{project.description}</p>
                {project.tech && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((item) => (
                      <span key={item} className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-ink-soft">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                {isAvailable ? (
                  <a
                    href={project.link}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="mt-6 inline-flex w-fit items-center gap-1.5 font-bold text-gold-text underline-offset-4 hover:underline"
                  >
                    {project.linkLabel ?? "View project"}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="mt-6 text-sm font-semibold text-muted">Coming soon</span>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
