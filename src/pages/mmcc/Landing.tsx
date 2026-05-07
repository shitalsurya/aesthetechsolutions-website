import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Sparkles, Map, Target, Trophy, Zap, Shield, Users, ChevronRight, Check, Star, ArrowRight, BookOpen, Brain, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MMCCNav from "./MMCCNav";

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const features = [
  { icon: Brain, title: "AI-Powered Assessment", desc: "Smart quizzes that map your strengths to careers." },
  { icon: Map, title: "Personalized Roadmaps", desc: "Step-by-step guidance from where you are to where you want to be." },
  { icon: Target, title: "Stream Selection", desc: "Choose the right stream after Class 10/12 with confidence." },
  { icon: Rocket, title: "Engineering Domains", desc: "Compare CSE, ECE, Mechanical, Civil, AI/ML and more." },
  { icon: BookOpen, title: "Curated Resources", desc: "Hand-picked courses, books, and tools for every path." },
  { icon: Trophy, title: "Interview Challenges", desc: "Timed mock interviews with leaderboard and certificates." },
];

const recommendations = [
  { title: "After 10th", items: ["Stream selection (Science/Commerce/Arts)", "Aptitude-based subject mix", "Future scope of each stream"] },
  { title: "After 12th", items: ["Engineering vs. non-engineering", "Top entrance exams roadmap", "College & branch ranking insights"] },
  { title: "Working Professionals", items: ["Career switch guidance", "Upskilling paths (AI/Cloud/Product)", "Interview prep & mock tests"] },
];

const testimonials = [
  { name: "Aarav S.", role: "Class 12 Student", quote: "MindMap helped me pick CSE confidently. The roadmap is gold!", rating: 5 },
  { name: "Priya R.", role: "Software Engineer", quote: "I switched from QA to AI/ML in 6 months following their roadmap.", rating: 5 },
  { name: "Rahul K.", role: "Parent", quote: "Finally a platform that explains options without the noise.", rating: 5 },
];

const plans = [
  { name: "Free", price: 0, features: ["Basic career assessment", "1 roadmap", "Community support"], cta: "Get Started", highlight: false },
  { name: "Pro", price: 499, features: ["Unlimited assessments", "Unlimited roadmaps", "Interview challenges", "Email support"], cta: "Go Pro", highlight: true, plan: "pro" },
  { name: "Premium", price: 1499, features: ["Everything in Pro", "1:1 mentor sessions", "Certificate of completion", "Priority support"], cta: "Go Premium", highlight: false, plan: "premium" },
];

const faqs = [
  { q: "Is MindMap Career Compass free to start?", a: "Yes! You can take the basic assessment and explore one roadmap completely free." },
  { q: "How are roadmaps personalized?", a: "We combine your assessment results, interests, and goals to recommend a tailored learning path." },
  { q: "Do I get a certificate?", a: "Premium subscribers receive completion certificates for interview challenges and career tracks." },
  { q: "Can I cancel anytime?", a: "Absolutely. Subscriptions can be cancelled from your dashboard at any time." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <MMCCNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div {...fade} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
            <Sparkles className="w-4 h-4" /> AI-powered career guidance for students & professionals
          </motion.div>
          <motion.h1 {...fade} transition={{ duration: 0.6, delay: 0.1 }} className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-primary via-teal to-primary bg-clip-text text-transparent">MindMap</span>
            <br />Career Compass
          </motion.h1>
          <motion.p {...fade} transition={{ duration: 0.6, delay: 0.2 }} className="text-xl md:text-2xl text-muted-foreground mb-8 font-display">
            Navigate Your Future with Clarity
          </motion.p>
          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="hero" size="lg"><Link to="/MindMapCareerCompass/auth?mode=signup">Start Free Assessment <ArrowRight className="w-4 h-4" /></Link></Button>
            <Button asChild variant="heroOutline" size="lg"><a href="#features">Explore Features</a></Button>
          </motion.div>
          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.4 }} className="mt-12 grid grid-cols-3 max-w-2xl mx-auto gap-4 text-center">
            {[{ n: "50K+", l: "Students Guided" }, { n: "200+", l: "Career Paths" }, { n: "98%", l: "Satisfaction" }].map((s) => (
              <div key={s.l} className="p-4 rounded-2xl backdrop-blur-xl bg-card/50 border border-border/50">
                <div className="text-2xl font-bold text-primary">{s.n}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Career Guidance Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fade} className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="font-display text-4xl font-bold mb-4">Career Guidance Built for Every Stage</h2>
            <p className="text-muted-foreground">Whether you're picking a stream, choosing engineering branch, or planning a career switch — we've got you.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {recommendations.map((r, i) => (
              <motion.div key={r.title} {...fade} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card className="p-6 h-full backdrop-blur-xl bg-card/50 border-border/50 hover:border-primary/50 transition-all hover:-translate-y-1">
                  <h3 className="font-display text-xl font-bold mb-4">{r.title}</h3>
                  <ul className="space-y-3">
                    {r.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div {...fade} className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold mb-4">Your Career Roadmap</h2>
            <p className="text-muted-foreground">A clear, milestone-based journey from discovery to mastery.</p>
          </motion.div>
          <div className="space-y-6">
            {[
              { step: "01", title: "Discover", desc: "Take a 10-minute assessment to understand your strengths." },
              { step: "02", title: "Decide", desc: "Get matched to streams, careers, and engineering domains." },
              { step: "03", title: "Develop", desc: "Follow a personalized roadmap with curated resources." },
              { step: "04", title: "Deliver", desc: "Practice mock interviews & build a winning portfolio." },
            ].map((s, i) => (
              <motion.div key={s.step} {...fade} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card className="p-6 flex gap-6 items-start backdrop-blur-xl bg-card/60">
                  <div className="text-4xl font-display font-bold text-primary/40">{s.step}</div>
                  <div>
                    <h3 className="font-display text-xl font-bold">{s.title}</h3>
                    <p className="text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Prep */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fade} className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Interview Preparation That Works</h2>
            <p className="text-muted-foreground">Real questions. Timed challenges. Real growth.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 backdrop-blur-xl bg-gradient-to-br from-primary/10 to-teal/10 border-primary/30">
              <Trophy className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold mb-2">Intervu Challenge</h3>
              <p className="text-muted-foreground mb-6">Take a timed HR + Aptitude + Logic round and get instant AI feedback.</p>
              <Button asChild variant="hero"><Link to="/intervu">Start Challenge <ChevronRight className="w-4 h-4" /></Link></Button>
            </Card>
            <Card className="p-8 backdrop-blur-xl bg-card/60">
              <Zap className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold mb-2">Skill Drills</h3>
              <p className="text-muted-foreground mb-6">Daily MCQs across coding, reasoning, and communication. Track progress over time.</p>
              <Button asChild variant="heroOutline"><Link to="/MindMapCareerCompass/auth?mode=signup">Try Free</Link></Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gradient-to-b from-transparent via-secondary/30 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div {...fade} className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="font-display text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground">From assessment to interview-ready, all in one premium platform.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fade} transition={{ duration: 0.5, delay: i * 0.05 }}>
                <Card className="p-6 h-full backdrop-blur-xl bg-card/50 border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fade} className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Loved by Students & Professionals</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fade} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card className="p-6 h-full backdrop-blur-xl bg-card/60">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-sm mb-4 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white font-bold">{t.name[0]}</div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fade} className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">Start free. Upgrade when you're ready to accelerate.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p, i) => (
              <motion.div key={p.name} {...fade} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card className={`p-8 h-full backdrop-blur-xl ${p.highlight ? "bg-gradient-to-br from-primary/15 to-teal/15 border-primary scale-105 shadow-2xl shadow-primary/20" : "bg-card/60"}`}>
                  {p.highlight && <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Most Popular</div>}
                  <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                  <div className="my-4">
                    <span className="text-4xl font-bold">₹{p.price}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant={p.highlight ? "hero" : "outline"} className="w-full">
                    <Link to={p.price === 0 ? "/MindMapCareerCompass/auth?mode=signup" : `/MindMapCareerCompass/checkout?plan=${p.plan}&amount=${p.price}`}>{p.cta}</Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div {...fade} className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`} className="border border-border/50 rounded-xl px-5 backdrop-blur-xl bg-card/40">
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fade}>
            <Card className="p-12 text-center backdrop-blur-xl bg-gradient-to-br from-primary/20 via-teal/10 to-primary/20 border-primary/40 max-w-4xl mx-auto">
              <Compass className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-display text-4xl font-bold mb-3">Ready to find your path?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Join thousands of students and professionals navigating their future with MindMap Career Compass.</p>
              <Button asChild variant="hero" size="lg"><Link to="/MindMapCareerCompass/auth?mode=signup">Start Free <ArrowRight className="w-4 h-4" /></Link></Button>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border/50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} AesthTech Solutions · MindMap Career Compass</div>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-foreground">Main Site</Link>
            <a href="mailto:support@aesthetechsolutions.co.in" className="hover:text-foreground">support@aesthetechsolutions.co.in</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
