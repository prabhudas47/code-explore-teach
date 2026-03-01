import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export const ContactSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Future: send form
    alert('Message sent! (Demo)');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6" ref={ref}>
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Let's Build Something <span className="text-gradient">Intelligent</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-10">Ready to collaborate? Reach out.</p>

          <div className="flex flex-wrap justify-center gap-4 mb-14">
            <a href="mailto:prabhudasu47@gmail.com" className="glass-card rounded-lg px-5 py-3 text-sm text-muted-foreground hover:text-primary transition-colors">
              prabhudasu47@gmail.com
            </a>
            <a href="tel:6281002028" className="glass-card rounded-lg px-5 py-3 text-sm text-muted-foreground hover:text-primary transition-colors">
              6281002028
            </a>
            <a
              href="https://www.linkedin.com/in/dasu-prabhukumar"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-lg px-5 py-3 text-sm text-primary hover:shadow-[0_0_20px_hsl(185_90%_55%/0.2)] transition-all"
            >
              LinkedIn →
            </a>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`glass-card rounded-xl p-6 sm:p-8 space-y-5 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_hsl(185_90%_55%/0.1)] transition-all"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_hsl(185_90%_55%/0.1)] transition-all"
            />
          </div>
          <textarea
            placeholder="Message"
            rows={4}
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_hsl(185_90%_55%/0.1)] transition-all resize-none"
          />
          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:shadow-[0_0_30px_hsl(185_90%_55%/0.4)] transition-all duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};
