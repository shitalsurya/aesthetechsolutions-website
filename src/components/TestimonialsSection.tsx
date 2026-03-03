import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "AestheTech transformed our vision into a product that our users absolutely love. Their design sensibility is unmatched.",
    name: "Sarah Chen",
    role: "CEO, FinFlow",
  },
  {
    quote: "Working with AestheTech felt like having a dedicated tech partner. They delivered beyond expectations, on time.",
    name: "Marcus Rivera",
    role: "Founder, HealthPulse",
  },
  {
    quote: "The attention to detail in both design and code quality sets AestheTech apart. Highly recommend for any digital project.",
    name: "Aisha Patel",
    role: "CTO, EduVerse",
  },
];

const TestimonialsSection = () => (
  <section className="section-padding bg-secondary/30">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center mb-16"
      >
        <p className="text-primary font-display font-semibold text-sm tracking-widest uppercase mb-4">Testimonials</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold">
          What Our <span className="gradient-text">Clients Say</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-card p-8"
          >
            <Quote className="text-primary/30 mb-4" size={28} />
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.quote}"</p>
            <div>
              <p className="font-display font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
