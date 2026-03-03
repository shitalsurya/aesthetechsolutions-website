import { motion } from "framer-motion";
import { Gem, TrendingUp, Puzzle, Server, Users } from "lucide-react";

const reasons = [
  { icon: Gem, title: "Aesthetic-First Design Thinking", desc: "Beauty isn't an afterthought — it's our foundation." },
  { icon: TrendingUp, title: "Innovation Driven Development", desc: "We stay ahead of the curve with cutting-edge tech stacks." },
  { icon: Puzzle, title: "End-to-End Solutions", desc: "From concept to launch, we handle every phase." },
  { icon: Server, title: "Scalable Architecture", desc: "Systems built to grow with your business seamlessly." },
  { icon: Users, title: "Client-Focused Approach", desc: "Your vision drives every decision we make." },
];

const WhyChooseUs = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center mb-16"
      >
        <p className="text-primary font-display font-semibold text-sm tracking-widest uppercase mb-4">Why Us</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold">
          Why Choose <span className="gradient-text">AestheTech</span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center group"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
              <r.icon className="text-primary" size={24} />
            </div>
            <h3 className="font-display font-semibold text-sm mb-2">{r.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
