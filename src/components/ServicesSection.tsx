import { motion } from "framer-motion";
import { Palette, Globe, Smartphone, Lightbulb, Rocket } from "lucide-react";

const services = [
  { icon: Palette, title: "UI/UX Design", desc: "Beautiful, intuitive interfaces that users love. Research-driven design with pixel-perfect execution." },
  { icon: Globe, title: "Web Development", desc: "High-performance web applications built with modern frameworks and clean architecture." },
  { icon: Smartphone, title: "Mobile App Development", desc: "Native and cross-platform mobile apps that deliver seamless experiences across devices." },
  { icon: Lightbulb, title: "Product Strategy", desc: "From ideation to roadmap — we help define your digital product vision and go-to-market approach." },
  { icon: Rocket, title: "Digital Transformation", desc: "Modernize legacy systems and processes with scalable, future-ready technology solutions." },
];

const ServicesSection = () => (
  <section id="services" className="section-padding bg-secondary/30">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center mb-16"
      >
        <p className="text-primary font-display font-semibold text-sm tracking-widest uppercase mb-4">What We Do</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
          Services That <span className="gradient-text">Drive Growth</span>
        </h2>
        <p className="text-muted-foreground">End-to-end digital solutions designed to transform your ideas into impactful products.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-8 group hover:border-primary/30 transition-all hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-5 group-hover:bg-primary/20 transition-colors">
              <service.icon className="text-primary" size={22} />
            </div>
            <h3 className="font-display font-semibold text-lg mb-3">{service.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
