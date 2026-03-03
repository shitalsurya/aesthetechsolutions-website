import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-12 md:p-20 text-center relative overflow-hidden glow"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-teal-light/5 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-lg md:text-xl text-muted-foreground italic max-w-2xl mx-auto mb-8 leading-relaxed">
            "Great digital products aren't just built — they're thoughtfully crafted from idea to experience."
          </p>
          <Button variant="hero" size="lg" asChild>
            <a href="#contact">
              Start Your Project <ArrowRight size={18} />
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
