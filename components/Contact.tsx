"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Globe, GitBranch } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@justcosta.org",
    href: "mailto:hello@justcosta.org",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+255 769 944 733",
    href: "tel:+255769944733",
  },
  {
    icon: Globe,
    title: "Website",
    value: "justcosta.org",
    href: "https://justcosta.org",
  },
  {
    icon: GitBranch,
    title: "GitHub",
    value: "github.com/CostaHenry5",
    href: "https://github.com/CostaHenry5",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="uppercase tracking-[0.35em] text-blue-600 font-bold mb-4">
            Contact
          </p>

          <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            Let's Connect
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Whether you're interested in healthcare, health informatics,
            software development, data analytics, or collaboration,
            I'd be happy to connect.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {contacts.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.a
                key={item.title}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="rounded-3xl bg-white dark:bg-slate-950 p-8 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-slate-800">
                  <Icon size={30} className="text-blue-600" />
                </div>

                <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="break-all text-slate-600 dark:text-slate-300">
                  {item.value}
                </p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}