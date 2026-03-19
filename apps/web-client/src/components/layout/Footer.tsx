import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

/* Social icon SVGs (replacing deprecated lucide brand icons) */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.1" fill="currentColor" strokeWidth="3" />
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

const FOOTER_SECTIONS = [
  {
    title: 'Shop',
    links: [
      { label: 'Freshwater Fish', href: '/products?waterType=FRESHWATER' },
      { label: 'Saltwater Fish', href: '/products?waterType=SALTWATER' },
      { label: 'Mini Fish', href: '/products?size=S' },
      { label: 'All Products', href: '/products' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Care Guides', href: '/products' },
      { label: 'Return Policy', href: '#' },
      { label: 'Shipping Info', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'AI Advisor', href: '/ai-chat' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
  },
];

const SOCIAL_LINKS = [
  { name: 'Facebook', icon: FacebookIcon, href: '#' },
  { name: 'Instagram', icon: InstagramIcon, href: '#' },
  { name: 'YouTube', icon: YoutubeIcon, href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#CCE0ED] bg-[#F2F8FC] dark:border-[#0D2C45] dark:bg-[#000F1E]">
      {/* Decorative top gradient bar */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0094C4]/60 to-transparent dark:via-[#00CCEE]/50" />

      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #0094C4 0%, transparent 50%), radial-gradient(circle at 80% 20%, #33B6D8 0%, transparent 40%)',
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-4 py-14 md:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="mb-5 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0094C4] to-[#0077A3] shadow-md dark:from-[#00CCEE] dark:to-[#0094C4]">
                <svg className="h-5 w-5 text-white" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M42.17 20.17L27.83 5.83c1.31 1.31.57 4.36-1.63 7.94a38.3 38.3 0 0 1-5.55 6.89 38.3 38.3 0 0 1-6.89 5.55c-3.58 2.2-6.63 2.93-7.94 1.63L20.17 42.17c1.31 1.31 4.36.57 7.94-1.63a38.3 38.3 0 0 0 6.89-5.55 38.3 38.3 0 0 0 5.55-6.89c2.2-3.58 2.93-6.63 1.63-7.94z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#0A1825] dark:text-[#D6EAFF]">
                Aqua<span className="text-[#0094C4] dark:text-[#00CCEE]">Luxe</span>
              </span>
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-relaxed text-[#547698] dark:text-[#6496B8]">
              Premium ornamental fish, delivered nationwide. Wide variety of species with guaranteed
              quality and live arrival.
            </p>

            {/* Contact info */}
            <div className="mb-6 flex flex-col gap-2.5">
              {[
                { icon: MapPin, text: 'Ho Chi Minh City, Vietnam' },
                { icon: Mail, text: 'hello@aqualuxe.vn' },
                { icon: Phone, text: '+84 28 1234 5678' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <item.icon
                    size={13}
                    className="shrink-0 text-[#0094C4] dark:text-[#00CCEE]"
                  />
                  <span className="text-xs text-[#547698] dark:text-[#6496B8]">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-2.5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="group flex h-9 w-9 items-center justify-center rounded-xl border border-[#CCE0ED] bg-white text-[#547698] shadow-sm transition-all duration-200 hover:border-[#0094C4] hover:bg-[#0094C4] hover:text-white hover:shadow-md dark:border-[#0D2C45] dark:bg-[#041628] dark:text-[#6496B8] dark:hover:border-[#00CCEE] dark:hover:bg-[#00CCEE] dark:hover:text-[#000F1E]"
                  aria-label={s.name}
                >
                  <s.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#0094C4] dark:text-[#00CCEE]">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-[#547698] transition-colors duration-150 hover:text-[#0094C4] dark:text-[#6496B8] dark:hover:text-[#00CCEE]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#CCE0ED] pt-6 text-xs text-[#547698] dark:border-[#0D2C45] dark:text-[#6496B8] sm:flex-row">
          <span>© {new Date().getFullYear()} AquaLuxe. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-[#0094C4] dark:hover:text-[#00CCEE]">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-[#0094C4] dark:hover:text-[#00CCEE]">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-[#0094C4] dark:hover:text-[#00CCEE]">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
