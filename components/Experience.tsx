"use client";

import { motion } from "framer-motion";
import { Building2, Calendar } from "lucide-react";

const hospitals = [
  {
    hospital: "Muhimbili National Hospital",
    title: "Clinical Rotations & Professional Practice",
    period: "2022 – Present",
    sections: [
      {
        title: "Critical Care",
        departments: [
          "ICU",
          "EMD",
          "HDU",
        ],
      },
      {
        title: "Perioperative Care",
        departments: [
          "Operating Theatre",
          "Recovery Room (PACU)",
        ],
      },
      {
        title: "Medical & Surgical",
        departments: [
          "Medical Wards",
          "Surgical Wards",
          "Orthopedics & Trauma",
        ],
      },
      {
        title: "Women's & Children's Health",
        departments: [
          "Labor Ward",
          "Antenatal Ward",
          "Postnatal Ward",
          "Obstetrics & Gynecology",
          "Pediatrics",
          "NICU",
          "Reproductive & Child Health (RCH)",
        ],
      },
      {
        title: "Specialized Units",
        departments: [
          "Psychiatry",
          "Oncology",
          "Dialysis Unit",
          "Cardiology",
          "Respiratory Medicine",
          "Infectious Diseases",
          "Outpatient Department (OPD)",
        ],
      },
    ],
  },
  {
    hospital: "Mwananyamala Regional Referral Hospital",
    title: "Internship & Professional Practice",
    period: "2022 – 2023",
    sections: [
      {
        title: "Clinical Departments",
        departments: [
          "ICU",
          "EMD",
          "Medical Wards",
          "Surgical Wards",
          "Orthopedics",
          "Pediatrics",
          "NICU",
          "Labor Ward",
          "Operating Theatre",
          "Recovery Room",
          "Outpatient Department (OPD)",
        ],
      },
    ],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="bg-surface-2 py-24 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="eyebrow">
            Clinical Experience
          </p>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Hospital Experience
          </h2>
        </motion.div>

        <div className="space-y-10">

          {hospitals.map((hospital, index) => (
            <motion.div
              key={hospital.hospital}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
              className="rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-9"
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">

                <div className="flex items-center gap-4">

                  <div className="shrink-0 rounded-2xl bg-gold p-3">
                    <Building2 className="text-on-gold" size={26} />
                  </div>

                  <div>

                    <h3 className="text-2xl font-extrabold text-ink sm:text-3xl">
                      {hospital.hospital}
                    </h3>

                    <p className="mt-1 font-semibold text-gold-text">
                      {hospital.title}
                    </p>

                  </div>

                </div>

                <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-surface-2 px-4 py-2 text-ink-soft lg:mt-0">

                  <Calendar size={18} />

                  <span className="font-semibold">
                    {hospital.period}
                  </span>

                </div>

              </div>

              <div className="space-y-7 border-t border-line pt-7">

                {hospital.sections.map((section) => (

                  <div key={section.title}>

                    <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-muted">
                      {section.title}
                    </h4>

                    <div className="flex flex-wrap gap-3">

                      {section.departments.map((department) => (

                        <span
                          key={department}
                          className="rounded-full border border-line bg-canvas px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-gold hover:bg-gold-wash"
                        >
                          {department}
                        </span>

                      ))}

                    </div>

                  </div>

                ))}

              </div>

            </motion.div>

          ))}

        </div>

      </div>
    </section>
  );
}