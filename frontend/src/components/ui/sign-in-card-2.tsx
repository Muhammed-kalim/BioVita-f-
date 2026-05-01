'use client'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useToast } from "@/lib/toast-context";
import { useLanguage } from "@/contexts/LanguageContext";
import { Logo } from "@/components/ui/Logo";
import { DottedSurface } from "@/components/ui/dotted-surface";

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export function SignInCardV2() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // For 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]); 
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      toast({
        title: t('login_success_title'),
        message: `${t('login_success_msg')}, ${user.displayName || user.email}!`,
        variant: "success",
      });
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      let errorMessage = "An error occurred during login.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      toast({
        title: t('login_success_title'),
        message: `${t('login_success_msg')}, ${user.displayName}!`,
        variant: "success",
      });
      navigate("/dashboard");
    } catch (err: any) {
      console.error("❌ [Google Sign-In] Error Code:", err.code);
      console.error("❌ [Google Sign-In] Error Message:", err.message);
      
      let errorMessage = err.message || "An error occurred during Google Sign-In.";
      if (err.code === 'auth/operation-not-allowed') {
        errorMessage = "Google Sign-In is not enabled for this project. Please contact support.";
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = "Sign-in popup was blocked. Please allow popups for this site.";
      }
      
      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center py-20 px-6">
      <div className="absolute inset-0 bg-black z-0" />
      <DottedSurface className="z-10 text-white" />
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-50"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative group">
            {/* Card glow effect */}
            <motion.div 
              className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
              animate={{
                boxShadow: [
                  "0 0 10px 2px rgba(239,68,68,0.05)",
                  "0 0 15px 5px rgba(239,68,68,0.1)",
                  "0 0 10px 2px rgba(239,68,68,0.05)"
                ],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut", 
                repeatType: "mirror" 
              }}
            />

              {/* Traveling light beam effect */}
              <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-[2px] w-[50%] bg-gradient-to-r from-transparent via-red-400/50 to-transparent opacity-70"
                  animate={{ left: ["-50%", "100%"] }}
                  transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                />
              </div>

              {/* Glass card background */}
              <div className="relative bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-2xl p-8 border border-white/[0.05] shadow-2xl overflow-hidden">
                {/* Logo and header */}
                <div className="text-center space-y-1 mb-8">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="mx-auto w-12 h-12 flex items-center justify-center mb-4"
                  >
                    <Logo iconOnly size="lg" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                  >
                    {t('login_welcome_default')}
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/40 text-sm"
                  >
                    {t('login_subtitle')}
                  </motion.p>
                </div>

                {/* Login form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    {/* Email input */}
                    <div className="relative group/input">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "email" ? 'text-red-400' : 'text-white/20'
                      }`} />
                      
                      <Input
                        type="email"
                        placeholder={t('login_email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/[0.02] border-white/5 focus:border-red-500/30 text-white placeholder:text-white/20 h-11 transition-all duration-300 pl-11 pr-4 focus:bg-white/[0.04] rounded-xl"
                      />
                    </div>

                    {/* Password input */}
                    <div className="relative group/input">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "password" ? 'text-red-400' : 'text-white/20'
                      }`} />
                      
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t('login_password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/[0.02] border-white/5 focus:border-red-500/30 text-white placeholder:text-white/20 h-11 transition-all duration-300 pl-11 pr-11 focus:bg-white/[0.04] rounded-xl"
                      />
                      
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember me & Forgot password */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="appearance-none h-4 w-4 rounded border border-white/10 bg-white/5 checked:bg-red-600 checked:border-red-600 focus:outline-none transition-all duration-200 cursor-pointer"
                      />
                      <label htmlFor="remember-me" className="text-xs text-white/40 cursor-pointer hover:text-white/60">
                        {t('login_remember')}
                      </label>
                    </div>
                    
                    <Link to="/forgot-password" size-sm className="text-xs text-white/40 hover:text-red-400 transition-colors">
                      {t('login_forgot')}
                    </Link>
                  </div>

                  {error && (
                    <div className="p-3 text-xs text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Sign in button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || isGoogleLoading}
                    className="w-full relative group/button mt-6"
                  >
                    <div className="relative overflow-hidden bg-white text-black font-bold h-11 rounded-xl transition-all duration-300 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"
                          />
                        ) : (
                          <motion.span
                            key="button-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2"
                          >
                            {isLoading ? t('login_signing_in') : t('login_btn')}
                            <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>

                  {/* Divider */}
                  <div className="relative mt-8 mb-6 flex items-center">
                    <div className="flex-grow border-t border-white/[0.05]"></div>
                    <span className="mx-4 text-[10px] uppercase tracking-widest font-bold text-white/20">or</span>
                    <div className="flex-grow border-t border-white/[0.05]"></div>
                  </div>

                  {/* Google Sign In */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || isGoogleLoading}
                    className="w-full bg-white/5 hover:bg-white/10 text-white font-medium h-11 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    {isGoogleLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    <span className="text-white/70 text-sm">
                      {isGoogleLoading ? t('login_signing_in') : t('login_google')}
                    </span>
                  </button>

                  <p className="text-center text-xs text-white/40 mt-8">
                    {t('login_no_account')}{' '}
                    <Link 
                      to="/signup" 
                      className="text-white hover:text-red-400 font-bold transition-colors"
                    >
                      {t('login_signup')}
                    </Link>
                  </p>
                </form>
              </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
