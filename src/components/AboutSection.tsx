import { motion } from "framer-motion";
import { Zap, Eye, Cpu } from "lucide-react";

const pillars = [
  { icon: Eye, title: "Aesthetic Vision", desc: "Every pixel is intentional. We design with beauty and function in mind." },
  { icon: Zap, title: "Innovation First", desc: "Leveraging cutting-edge technologies to build future-ready products." },
  { icon: Cpu, title: "Engineering Excellence", desc: "Clean, scalable code architectures that grow with your business." },
];

const AboutSection = () => (
  <section id="about" className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center mb-16"
      >
        <p className="text-primary font-display font-semibold text-sm tracking-widest uppercase mb-4">Who We Are</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
          Where <span className="gradient-text">Creativity</span> Meets Technology
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          AestheTech Solutions is a digital technology company obsessed with crafting beautiful, functional digital products. We merge aesthetics-driven design thinking with robust engineering to deliver experiences that delight users and drive business growth.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="glass-card p-8 text-center group hover:border-primary/30 transition-colors"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5 group-hover:bg-primary/20 transition-colors">
              <pillar.icon className="text-primary" size={24} />
            </div>
            <h3 className="font-display font-semibold text-lg mb-3">{pillar.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
