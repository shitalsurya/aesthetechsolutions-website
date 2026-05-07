import { Link, useNavigate } from "react-router-dom";
import { Compass, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const MMCCNav = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/MindMapCareerCompass" className="flex items-center gap-2 font-display font-bold">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-teal flex items-center justify-center">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span>MindMap</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a>
          <Link to="/" className="text-muted-foreground hover:text-foreground">AesthTech</Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/MindMapCareerCompass/dashboard"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link></Button>
              <Button variant="outline" size="sm" onClick={() => { signOut(); navigate("/MindMapCareerCompass"); }}><LogOut className="w-4 h-4" /></Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/MindMapCareerCompass/auth">Sign In</Link></Button>
              <Button asChild variant="hero" size="sm"><Link to="/MindMapCareerCompass/auth?mode=signup">Get Started</Link></Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MMCCNav;
