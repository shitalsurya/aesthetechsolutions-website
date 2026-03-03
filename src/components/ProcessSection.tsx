import { motion } from "framer-motion";
import { Search, PenTool, Code, Rocket, TrendingUp } from "lucide-react";

const steps = [
  { icon: Search, title: "Discover", desc: "Research & strategy" },
  { icon: PenTool, title: "Design", desc: "UI/UX & prototyping" },
  { icon: Code, title: "Develop", desc: "Clean, scalable code" },
  { icon: Rocket, title: "Launch", desc: "Deploy & optimize" },
  { icon: TrendingUp, title: "Grow", desc: "Iterate & scale" },
];

const ProcessSection = () => (
  <section id="process" className="section-padding bg-secondary/30">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center mb-16"
      >
        <p className="text-primary font-display font-semibold text-sm tracking-widest uppercase mb-4">Our Process</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold">
          How We <span className="gradient-text">Work</span>
        </h2>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="flex items-center"
          >
            <div className="glass-card p-6 text-center min-w-[140px] hover:border-primary/30 transition-colors">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                <step.icon className="text-primary" size={20} />
              </div>
              <h3 className="font-display font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden md:block w-8 h-px bg-border mx-2" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessSection;
