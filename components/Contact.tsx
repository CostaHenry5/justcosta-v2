"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";

const contacts = [
  {
    title: "Email",
    value: "hello@justcosta.org",
    href: "mailto:hello@justcosta.org",
    icon: Mail,
  },
  {
    title: "Phone",
    value: "+255 769 944 733",
    href: "tel:+255769944733",
    icon: Phone,
  },
  {
    title: "Location",
    value: "Dar es Salaam, Tanzania",
    href: "#",
    icon: MapPin,
  },
  {
    title: "GitHub",
    value: "github.com/CostaHenry5",
    href: "https://github.com/CostaHenry5",
    icon: ExternalLink,
  },
  {
    title: "LinkedIn",
    value: "Coming Soon",
    href: "#",
    icon: ExternalLink,
  },
  {
    title: "Portfolio",
    value: "justcosta.org",
    href: "https://justcosta.org",
    icon: ExternalLink,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="uppercase tracking-[0.3em] text-blue-600 font-semibold mb-4">
            Contact
          </p>

          <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Let's Work Together
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-8">
            Feel free to reach out if you'd like to discuss healthcare,
            health informatics, software development, data analytics,
            or future collaborations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contacts.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.a
                key={item.title}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="rounded-3xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8"
              >
                <Icon
                  size={40}
                  className="text-blue-600 mb-6"
                />

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {item.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 break-all">
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