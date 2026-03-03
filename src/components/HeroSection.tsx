import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Layers, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center section-padding pt-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-teal-light/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-border/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-border/10" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Design-Driven Development</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Crafting Digital{" "}
              <span className="gradient-text">Experiences</span>{" "}
              End-to-End
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
              Turning ideas into scalable digital products through design and technology. We build with aesthetics at the core.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" asChild>
                <a href="#contact">
                  Get Started <ArrowRight size={18} />
                </a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href="#services">View Services</a>
              </Button>
            </div>
          </motion.div>

          {/* Abstract visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-[400px] h-[400px]">
              {/* Floating cards */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 left-4 glass-card p-5 glow"
              >
                <Code2 className="text-primary mb-2" size={28} />
                <p className="text-sm font-display font-semibold">Clean Code</p>
                <p className="text-xs text-muted-foreground">Scalable architecture</p>
              </motion.div>

              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-24 right-0 glass-card p-5 glow"
              >
                <Layers className="text-primary mb-2" size={28} />
                <p className="text-sm font-display font-semibold">Pixel Perfect</p>
                <p className="text-xs text-muted-foreground">Design precision</p>
              </motion.div>

              <motion.div
                animate={{ y: [-6, 10, -6] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-16 left-12 glass-card p-5 glow"
              >
                <Sparkles className="text-primary mb-2" size={28} />
                <p className="text-sm font-display font-semibold">Innovation</p>
                <p className="text-xs text-muted-foreground">Future-ready solutions</p>
              </motion.div>

              {/* Center glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
