'use client'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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

export function SignUpCardV2() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
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
    if (!agreeTerms) {
       setError("You must agree to the Terms of Service.");
       return;
    }
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: fullName });
        
        // Create user document in Firestore
        try {
          await setDoc(doc(db, "users", auth.currentUser.uid), {
            fullName,
            email,
            role: "user",
            createdAt: new Date().toISOString()
          });
          console.log("✅ [Signup] User profile created in Firestore");
        } catch (fsError) {
          console.error("❌ [Signup] Error creating Firestore profile:", fsError);
          // Don't fail the whole signup if just Firestore profile creation fails
        }
      }

      toast({
        title: t('signup_success_title'),
        message: t('signup_success_msg'),
        variant: "success",
      });
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);
      let errorMessage = "An error occurred during signup.";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "Email is already in use.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password is too weak.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
                    {t('signup_title')}
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/40 text-sm"
                  >
                    {t('signup_subtitle')}
                  </motion.p>
                </div>

                {/* Signup form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    {/* Full Name input */}
                    <div className="relative group/input">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "fullName" ? 'text-red-400' : 'text-white/20'
                      }`} />
                      
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onFocus={() => setFocusedInput("fullName")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/[0.02] border-white/5 focus:border-red-500/30 text-white placeholder:text-white/20 h-11 transition-all duration-300 pl-11 pr-4 focus:bg-white/[0.04] rounded-xl"
                        required
                      />
                    </div>

                    {/* Email input */}
                    <div className="relative group/input">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "email" ? 'text-red-400' : 'text-white/20'
                      }`} />
                      
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/[0.02] border-white/5 focus:border-red-500/30 text-white placeholder:text-white/20 h-11 transition-all duration-300 pl-11 pr-4 focus:bg-white/[0.04] rounded-xl"
                        required
                      />
                    </div>

                    {/* Password input */}
                    <div className="relative group/input">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "password" ? 'text-red-400' : 'text-white/20'
                      }`} />
                      
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/[0.02] border-white/5 focus:border-red-500/30 text-white placeholder:text-white/20 h-11 transition-all duration-300 pl-11 pr-11 focus:bg-white/[0.04] rounded-xl"
                        required
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

                  {/* Agree to terms */}
                  <div className="flex items-start space-x-2 pt-1">
                    <input
                      id="agree-terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                      className="appearance-none h-4 w-4 rounded border border-white/10 bg-white/5 checked:bg-red-600 checked:border-red-600 focus:outline-none transition-all duration-200 cursor-pointer mt-0.5"
                    />
                    <label htmlFor="agree-terms" className="text-[10px] text-white/40 cursor-pointer hover:text-white/60 leading-tight">
                      I agree to the <Link to="/terms" className="text-white hover:text-red-400">Terms of Service</Link> and <Link to="/privacy" className="text-white hover:text-red-400">Privacy Policy</Link>
                    </label>
                  </div>

                  {error && (
                    <div className="p-3 text-xs text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Sign up button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative group/button mt-6"
                  >
                    <div className="relative overflow-hidden bg-white text-black font-bold h-11 rounded-xl transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
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
                            Sign Up
                            <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>

                  <p className="text-center text-xs text-white/40 mt-8">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-white hover:text-red-400 font-bold transition-colors"
                    >
                      Sign In
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
