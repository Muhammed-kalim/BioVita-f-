import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShinyButton } from "@/components/ui/shiny-button";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/Logo";
import { Globe, ChevronDown, User, LogOut, LayoutDashboard, Menu, X, Activity, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user, userData, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const dashboardPath = userData?.role === 'doctor' ? '/doctor' : '/patient';

  const navLinks = [
    { label: 'Home', to: "/" },
    { label: 'Features', to: "/#features" },
    { label: 'Emergency', to: "/emergency", icon: <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> },
    { label: 'Patient Portal', to: "/patient/auth" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-center transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-black/90 backdrop-blur-md border-b border-white/5" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] w-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 z-50 group">
          <Logo size="sm" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium text-white/70 hover:text-white transition-all relative overflow-hidden"
            >
              {item.icon}
              {item.label}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-red-500 rounded-full transition-all group-hover:w-full group-hover:shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 z-50">
          {/* Language Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full glass border-white/10 text-[12px] font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{languages.find(l => l.code === language)?.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute top-full right-0 mt-2 w-24 glass border-white/10 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-[12px] font-bold transition-colors hover:bg-white/10 ${
                      language === lang.code ? 'text-white bg-white/5' : 'text-white/50'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full glass border-white/10 text-[12px] font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="hidden md:inline">{user.displayName || user.email}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 glass border-white/10 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <Link
                    to={dashboardPath}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-[12px] font-bold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-[12px] font-bold text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <motion.button
                onClick={() => navigate("/portal")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-2.5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 hover:bg-red-500 transition-all"
              >
                Register Now
              </motion.button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-20 bg-black z-40 lg:hidden px-6 py-8 overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center justify-between px-6 py-5 rounded-3xl text-xl font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              
              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between px-6 mb-4">
                  <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Language</span>
                  <div className="flex gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          language === lang.code ? 'bg-white text-black' : 'bg-white/5 text-white/40'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {!user && (
                   <div className="flex flex-col gap-4 px-6">
                      <motion.button
                        onClick={() => {
                          navigate("/portal");
                          setIsMobileMenuOpen(false);
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full h-16 rounded-3xl bg-red-600 text-white text-lg font-bold flex items-center justify-center gap-3 shadow-xl shadow-red-500/20"
                      >
                        Register Now
                      </motion.button>
                   </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
