import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Sparkles, ShieldCheck } from 'lucide-react';
import LogoIcon from '../LogoIcon';

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
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

/* Payment method SVG icons */
const VisaIcon = () => (
  <svg viewBox="0 0 48 32" width="42" height="28" aria-label="Visa" role="img">
    <rect width="48" height="32" rx="4" fill="#1A1F71" />
    <text x="24" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="0.5">
      VISA
    </text>
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 48 32" width="42" height="28" aria-label="Mastercard" role="img">
    <rect width="48" height="32" rx="4" fill="#252525" />
    <circle cx="18" cy="16" r="9" fill="#EB001B" />
    <circle cx="30" cy="16" r="9" fill="#F79E1B" />
    <path d="M24 9.27A9 9 0 0 1 27.73 16 9 9 0 0 1 24 22.73 9 9 0 0 1 20.27 16 9 9 0 0 1 24 9.27z" fill="#FF5F00" />
  </svg>
);

const PayPalIcon = () => (
  <svg viewBox="0 0 48 32" width="42" height="28" aria-label="PayPal" role="img">
    <rect width="48" height="32" rx="4" fill="#F3F6FF" />
    <text x="24" y="14" textAnchor="middle" fill="#003087" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif">
      Pay
    </text>
    <text x="24" y="24" textAnchor="middle" fill="#009cde" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif">
      Pal
    </text>
  </svg>
);

const FOOTER_SECTIONS = [
  {
    title: 'Shop',
    links: [
      { label: 'Freshwater Fish', href: '/products?waterType=FRESHWATER', highlight: false },
      { label: 'Saltwater Fish', href: '/products?waterType=SALTWATER', highlight: false },
      { label: 'Mini Fish', href: '/products?size=S', highlight: false },
      { label: 'All Products', href: '/products', highlight: false },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Care Guides', href: '/products', highlight: false },
      { label: 'Return Policy', href: '#', highlight: false },
      { label: 'Shipping Info', href: '#', highlight: false },
      { label: 'Contact Us', href: '#', highlight: false },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#', highlight: false },
      { label: 'AI Advisor', href: '/ai-chat', highlight: true },
      { label: 'Terms of Service', href: '#', highlight: false },
      { label: 'Privacy Policy', href: '#', highlight: false },
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
    <footer className="relative overflow-hidden border-t border-border bg-background">
      {/* Decorative top gradient bar */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

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
            <Link to="/" className="mb-5 flex items-center gap-2.5 cursor-pointer">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-md">
                <LogoIcon />
              </div>
              <span className="text-xl font-bold text-foreground">
                Aqua<span className="text-primary">Luxe</span>
              </span>
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
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
                  <item.icon size={13} className="shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-xs text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-2.5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.highlight ? (
                      <Link
                        to={link.href}
                        className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-primary transition-colors duration-150 hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {link.label}
                      </Link>
                    ) : (
                      <Link
                        to={link.href}
                        className="cursor-pointer text-sm text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment methods row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-8 sm:justify-start">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Accepted payments
          </span>
          <div className="flex items-center gap-2">
            <div className="overflow-hidden rounded-md shadow-card opacity-90 hover:opacity-100 transition-opacity">
              <VisaIcon />
            </div>
            <div className="overflow-hidden rounded-md shadow-card opacity-90 hover:opacity-100 transition-opacity">
              <MastercardIcon />
            </div>
            <div className="overflow-hidden rounded-md shadow-card opacity-90 hover:opacity-100 transition-opacity">
              <PayPalIcon />
            </div>
          </div>
          {/* Secure checkout badge */}
          <div className="ml-auto flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-card sm:ml-auto">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold text-foreground">Secure Checkout</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} AquaLuxe. All rights reserved.</span>
          <div className="flex items-center gap-4">
            {['Privacy', 'Terms', 'Cookies'].map((label) => (
              <a
                key={label}
                href="#"
                className="cursor-pointer transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
