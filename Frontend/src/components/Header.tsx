import { LogOut, User, X, Mail, Github, Linkedin, Twitter } from "lucide-react";
import newssureLogo from "@/assets/favicon.ico";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [developersSidebarOpen, setDevelopersSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const developers = [
    {
      name: 'Al Amin',
      role: 'Full Stack Developer',
      email: 'sh.alaminsheikh@gmail.com',
    },
    {
      name: 'Pragati Jain',
      role: 'AI/ML Engineer',
      email: 'pragatijain18@gmail.com'
    },
    {
      name: 'Harsh Awasthi',
      role: 'AI/ML and Backend Developer',
      email: 'harshawasthik@gmail.com',
    },
    // {
    //   name: 'Muhd. Adnan Mohsin',
    //   role: 'Lead Developer',
    //   email: 'adnanenigmatic@gmail.com',
    // },
  ];

  return (
    <>
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={newssureLogo} alt="NewsSure Logo" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-foreground">NewsSure</h1>
                <p className="text-xs text-muted-foreground">Verify News, Trust Facts</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => scrollToSection('verify')}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Verify News
                </button>
                <button 
                  onClick={() => scrollToSection('history')}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  History
                </button>
                <button 
                  onClick={() => setDevelopersSidebarOpen(true)}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Developers
                </button>
              </nav>
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem >
                      USERNAME
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => navigate("/auth")} size="sm">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Developers Sidebar */}
      {developersSidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setDevelopersSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-card shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Developers</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDevelopersSidebarOpen(false)}
                  className="rounded-lg"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Developers List */}
              <div className="space-y-6">
                {developers.map((dev, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {dev.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{dev.role}</p>

                    {/* Contact Links */}
                    <div className="space-y-2">
                      <a
                        href={`mailto:${dev.email}`}
                        className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="text-sm">{dev.email}</span>
                      </a>
                      {/* <a
                        href={`https://github.com/${dev.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                      >
                        <Github className="w-5 h-5" />
                        <span className="text-sm">@{dev.github}</span>
                      </a> */}
                      {/* <a
                        href={`https://linkedin.com/in/${dev.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                        <span className="text-sm">@{dev.linkedin}</span>
                      </a> */}
                      {/* <a
                        href={`https://twitter.com/${dev.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                        <span className="text-sm">@{dev.twitter}</span>
                      </a> */}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Info */}
              <div className="mt-8 p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground">
                  Feel free to reach out to any of our developers for support or inquiries about NewsSure.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};