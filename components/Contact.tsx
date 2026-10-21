"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, AtSign, GitBranch, Globe, Mail, MessageCircle, Phone } from "lucide-react";

const contacts = [
  { icon: Phone, title: "Phone", value: "+255 769 944 733", href: "tel:+255769944733" },
  { icon: AtSign, title: "Instagram", value: "@iphonesmwenge", href: "https://www.instagram.com/iphonesmwenge/" },
  { icon: GitBranch, title: "GitHub", value: "@CostaHenry5", href: "https://github.com/CostaHenry5" },
  { icon: Globe, title: "Website", value: "justcosta.org", href: "https://justcosta.org" },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-canvas py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2rem] bg-band p-8 text-band-text sm:p-12"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold/30 blur-3xl"
            />
            <p className="eyebrow relative text-gold!">Contact</p>
            <h2 className="relative mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Let&apos;s build something useful together.
            </h2>
            <p className="relative mt-5 max-w-lg text-lg leading-8 text-band-muted">
              Healthcare, health informatics, software, data or a collaboration
              idea — I&apos;d be happy to hear from you.
            </p>
            <div className="relative mt-9 flex flex-wrap gap-4">
              <a
                href="mailto:hello@justcosta.org"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-bold text-on-gold transition hover:bg-gold-hover"
              >
                <Mail className="h-5 w-5" />
                hello@justcosta.org
              </a>
              <a
                href="https://wa.me/255769944733"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-bold text-band-text transition hover:border-gold hover:text-gold"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {contacts.map((item, index) => {
              const Icon = item.icon;
              const isExternal = item.href.startsWith("http");
              return (
                <motion.a
                  key={item.title}
                  href={item.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:border-gold hover:shadow-lg hover:shadow-gold/10"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-soft transition group-hover:bg-gold">
                    <Icon size={22} className="text-gold-text transition group-hover:text-on-gold" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-muted">{item.title}</span>
                    <span className="block truncate text-lg font-bold text-ink">{item.value}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-muted transition group-hover:text-gold-text" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
