"use client";


import { motion } from "framer-motion";
import { Globe, BarChart3, Building2, BrainCircuit, Smartphone, ExternalLink } from "lucide-react";


const projects = [
  {
    title: "iPhones Mwenge",
    status: "Featured Store",
    icon: Smartphone,
    color: "bg-slate-900",
    description:
      "iPhones Mwenge is a premium mobile phone and gadgets shop located at Mwenge ITV in Dar es Salaam. We specialise in the latest high-end devices and accessories from leading global brands, including Apple, Samsung, Google Pixel, Guess, Polo, Santa Barbara, Pitaka, Aulumu, Anker, Powerology, Green Lion, Beats, JBL and Sony. Discover phones, speakers, phone cases, USB cables, adapters, earbuds, headphones and many more premium gadgets—all in one place.",
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
    description: "A modern portfolio built with Next.js, React, TypeScript and Tailwind CSS showcasing my healthcare, health informatics, software development and data analytics journey.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
    link: "https://justcosta-v2-19f3.vercel.app",
  },
  {
    title: "Healthcare Analytics Dashboard",
    status: "In Development",
    icon: BarChart3,
    color: "bg-yellow-500",
    description: "Interactive healthcare dashboards designed for clinical reporting, data visualization and healthcare decision support.",
    tech: ["Power BI", "Python", "SQL", "Healthcare Analytics"],
    link: "#",
  },
  {
    title: "Hospital Management System",
