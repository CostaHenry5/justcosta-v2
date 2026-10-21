import { GitBranch, Globe, Mail, Phone } from "lucide-react";

const links = [
  { name: "About", href: "/#about" },
  { name: "Projects", href: "/#projects" },
  { name: "Experience", href: "/#experience" },
  { name: "Skills", href: "/#skills" },
  { name: "Services", href: "/#services" },
  { name: "FastMed", href: "/clinical-assistant" },
  { name: "Contact", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="border-t-4 border-gold bg-band text-band-text">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-base font-black text-on-gold">
                C
              </span>
              <span className="text-2xl font-extrabold tracking-tight">
                Just<span className="text-gold">Costa</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm leading-7 text-band-muted">
              Registered Nurse, health informatics specialist, software
              developer and data analyst — improving healthcare and local
              opportunity through technology.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-extrabold uppercase tracking-wider text-gold">
              Explore
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-band-muted transition hover:text-gold">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-extrabold uppercase tracking-wider text-gold">
              Contact
            </h3>
            <ul className="space-y-3.5 text-band-muted">
              <li>
                <a href="mailto:hello@justcosta.org" className="flex items-center gap-3 transition hover:text-gold">
                  <Mail size={17} className="text-gold" /> hello@justcosta.org
                </a>
              </li>
              <li>
                <a href="tel:+255769944733" className="flex items-center gap-3 transition hover:text-gold">
                  <Phone size={17} className="text-gold" /> +255 769 944 733
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe size={17} className="text-gold" /> justcosta.org
              </li>
              <li>
                <a
                  href="https://github.com/CostaHenry5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition hover:text-gold"
                >
                  <GitBranch size={17} className="text-gold" /> github.com/CostaHenry5
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-sm text-band-muted md:flex-row">
          <p>© {new Date().getFullYear()} JustCosta. All rights reserved.</p>
          <p>Made in Dar es Salaam · Built with Next.js &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
