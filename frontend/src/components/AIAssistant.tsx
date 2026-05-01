import { motion } from "motion/react";
import ChatInterface from "./ChatInterface";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Zap, HeartPulse } from "lucide-react";

export default function AIAssistant() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[12px] font-medium text-white/60 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              BioVita AI Assistant
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Your Personal Health Concierge
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Ask questions about symptoms, get guidance on wellness, or understand your health metrics with our advanced AI.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            <ChatInterface />
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="text-blue-400" />}
              title="Secure & Private"
              description="Your conversations are private and your data is encrypted with industry-standard protocols."
            />
            <FeatureCard 
              icon={<Zap className="text-amber-400" />}
              title="Instant Insights"
              description="Get immediate answers to your health queries based on the latest medical knowledge bases."
            />
            <FeatureCard 
              icon={<HeartPulse className="text-rose-400" />}
              title="Wellness Focused"
              description="Beyond symptoms, get advice on nutrition, exercise, and mental well-being."
            />
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all hover:bg-zinc-900 group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
