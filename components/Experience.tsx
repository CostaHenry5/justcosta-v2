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
      className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="uppercase tracking-[0.35em] text-blue-600 font-bold mb-4">
            Clinical Experience
          </p>

          <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white">
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
              className="rounded-3xl bg-white dark:bg-slate-950 shadow-xl p-8"
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">

                <div className="flex items-center gap-4">

                  <div className="bg-blue-100 dark:bg-slate-800 p-3 rounded-2xl">
                    <Building2 className="text-blue-600" size={28} />
                  </div>

                  <div>

                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                      {hospital.hospital}
                    </h3>

                    <p className="text-blue-600 font-semibold mt-1">
                      {hospital.title}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-2 mt-6 lg:mt-0 text-slate-600 dark:text-slate-300">

                  <Calendar size={18} />

                  <span className="font-semibold">
                    {hospital.period}
                  </span>

                </div>

              </div>

              <div className="space-y-8">

                {hospital.sections.map((section) => (

                  <div key={section.title}>

                    <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                      {section.title}
                    </h4>

                    <div className="flex flex-wrap gap-3">

                      {section.departments.map((department) => (

                        <span
                          key={department}
                          className="rounded-full bg-blue-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300"
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