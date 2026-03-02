import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export const ContactSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! (Demo)');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      <div className="max-w-4xl mx-auto px-6" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Let's Build Something
            <br />
            Intelligent.
          </h2>
          <p className="text-sm text-muted-foreground">
            Open to collaborations, AI projects, and automation system development.
          </p>
        </div>

        {/* Contact links */}
        <div className={`flex flex-wrap justify-center gap-6 mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <a href="mailto:prabhudasu47@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-border pb-1 hover:border-foreground">
            prabhudasu47@gmail.com
          </a>
          <a href="tel:6281002028" className="text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-border pb-1 hover:border-foreground">
            6281002028
          </a>
          <a
            href="https://www.linkedin.com/in/dasu-prabhukumar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-foreground text-foreground text-xs tracking-wider uppercase hover:bg-foreground hover:text-background transition-all duration-300"
          >
            LinkedIn
          </a>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-5 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-transparent border-b border-border px-0 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-transparent border-b border-border px-0 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <textarea
            placeholder="Message"
            rows={4}
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-transparent border-b border-border px-0 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
          />
          <div className="pt-4">
            <button
              type="submit"
              className="px-10 py-3.5 bg-foreground text-background font-medium text-sm tracking-wider uppercase hover:scale-105 transition-transform duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
