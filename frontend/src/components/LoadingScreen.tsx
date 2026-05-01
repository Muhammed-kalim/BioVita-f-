import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronRight, Activity } from "lucide-react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[100] bg-[#000000] flex flex-col items-center justify-center overflow-hidden text-white"
        >
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full" />
          
          <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center">
            {/* Logo Icon */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <div className="w-14 h-14 bg-white/[0.03] backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                <Activity className="w-7 h-7 text-indigo-400" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              BioVita
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base md:text-lg text-white/30 font-medium tracking-wide mb-20 max-w-md leading-relaxed"
            >
              Smart health management for a <br /> secure, decentralized future.
            </motion.p>

            {/* Loading Spinner & Status */}
            <div className="relative flex flex-col items-center mb-20">
              <AnimatePresence mode="wait">
                {!isLoaded ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-14 h-14 relative mb-10">
                      <svg className="w-full h-full rotate-[-90deg]">
                        <circle
                          cx="28"
                          cy="28"
                          r="26"
                          fill="none"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeOpacity="0.05"
                        />
                        <motion.circle
                          cx="28"
                          cy="28"
                          r="26"
                          fill="none"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeDasharray="163.36"
                          initial={{ strokeDashoffset: 163.36 }}
                          animate={{ strokeDashoffset: 163.36 - (163.36 * progress) / 100 }}
                          transition={{ duration: 0.2 }}
                        />
                      </svg>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.5em] text-white/20">
                      <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                      Synchronizing Health Lattice
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="button"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEnter}
                    className="group relative px-14 py-5 bg-white/[0.02] backdrop-blur-md rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-3 text-base font-bold tracking-tight text-white/90">
                      Enter App
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Info */}
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center font-mono text-[9px] uppercase tracking-[0.3em] text-white/15">
            <div className="flex items-center gap-4">
              <span>System Status: <span className="text-indigo-400/80">Operational</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <span>V2.5.0-Stable</span>
              <span>© 2026 BioVita Protocol</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
