"use client";

import { motion } from "framer-motion";
import { Building2, Calendar } from "lucide-react";

const experiences = [
  {
    hospital: "Muhimbili National Hospital",
    period: "Clinical Experience",
    description:
      "Completed extensive clinical rotations across multiple departments, developing strong patient assessment, treatment planning and multidisciplinary collaboration skills in Tanzania's national referral hospital.",
  },
  {
    hospital: "Mwananyamala Regional Referral Hospital",
    period: "Clinical Experience",
    description:
      "Provided patient-centered care in various clinical settings while strengthening practical experience in patient treatment, emergency response, clinical documentation and teamwork.",
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="uppercase tracking-[0.3em] text-blue-600 font-semibold mb-4">
            Experience
          </p>

          <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-16">
            Clinical Experience
          </h2>
        </motion.div>

        <div className="space-y-8">

          {experiences.map((item, index) => (
            <motion.div
              key={item.hospital}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
              className="rounded-3xl bg-white dark:bg-slate-800 shadow-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="text-blue-600" size={28} />

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {item.hospital}
                </h3>
              </div>

              <div className="flex items-center gap-2 mb-6 text-blue-600 font-medium">
                <Calendar size={18} />
                {item.period}
              </div>

              <p className="leading-8 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}