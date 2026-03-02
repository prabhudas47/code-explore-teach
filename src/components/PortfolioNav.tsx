import { useState, useEffect } from 'react';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export const PortfolioNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border py-4' : 'py-6'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#hero" className="text-sm font-semibold tracking-wider text-foreground uppercase">
          DPK
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-widest uppercase"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-foreground transition-transform duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-foreground transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-foreground transition-transform duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border mt-2 px-6 py-6 flex flex-col gap-5 animate-fade-in">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-widest uppercase"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
