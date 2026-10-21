"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Stethoscope } from "lucide-react";

const roles = [
  "Registered Nurse",
  "Health Informatics",
  "Data Analyst",
  "Digital Solutions Developer",
];

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-canvas pb-20 pt-28 transition-colors duration-300 sm:pt-36 lg:pb-28"
    >
      {/* soft gold glow, echoing NipeDili */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-gold/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-40 h-[28rem] w-[28rem] rounded-full bg-leaf/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-soft shadow-sm">
              <MapPin className="h-4 w-4 text-gold-text" />
              Dar es Salaam, Tanzania
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Hi, I&apos;m Costa.
              <span className="mt-2 block">
                I build{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 dark:text-gold">healthcare</span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-1 z-0 h-4 rounded-sm bg-gold sm:h-5 dark:opacity-25"
                  />
                </span>{" "}
                technology.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-muted">
              A Registered Nurse who combines clinical experience with software
              and data, building practical digital tools that improve care and
              create opportunity in Tanzania.
            </p>

            <ul className="mt-7 flex flex-wrap gap-2.5">
              {roles.map((role) => (
                <li
                  key={role}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-soft"
                >
                  {role}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 font-bold text-on-gold shadow-lg shadow-gold/30 transition hover:bg-gold-hover"
              >
                View my work
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-7 py-4 font-bold text-ink transition hover:bg-ink hover:text-canvas"
              >
                Get in touch
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto w-full max-w-[400px]"
          >
            <div
              aria-hidden="true"
              className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] bg-gold sm:-right-5 sm:-top-5"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/costa.jpg"
              alt="Costa Henry"
              className="relative aspect-[4/5] w-full rounded-[2rem] border border-line object-cover shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-xl sm:-left-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-soft">
                <Stethoscope className="h-5 w-5 text-gold-text" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-bold text-ink">Clinician first</span>
                <span className="block text-xs font-medium text-muted">ICU · EMD · Theatre · Peds</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
