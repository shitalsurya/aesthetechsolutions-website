const Footer = () => (
  <footer className="border-t border-border py-10 px-4">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <a href="#" className="font-display text-lg font-bold">
        <span className="gradient-text">Aesthe</span>Tech
      </a>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} AestheTech Solutions. All rights reserved.
      </p>
      <div className="flex gap-6">
        {["Twitter", "LinkedIn", "GitHub"].map((s) => (
          <a key={s} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{s}</a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
