import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ShinyButton } from "@/components/ui/shiny-button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CTA() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative glass p-16 md:p-32 rounded-[4rem] overflow-hidden text-center group"
        >
          {/* Gradient Corner Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#FFD600]/20 via-[#FF8A00]/10 to-transparent blur-[120px] -z-10 group-hover:scale-110 transition-transform duration-1000" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-10 leading-tight">
              {t('cta_title')}
            </h2>
            <p className="text-lg text-white/50 mb-14 leading-relaxed">
              {t('cta_desc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <ShinyButton 
                onClick={() => navigate("/login")} 
                className="w-full sm:w-auto rounded-full"
              >
                {t('cta_button')}
              </ShinyButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
