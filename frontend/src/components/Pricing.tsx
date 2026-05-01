import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShinyButton } from "@/components/ui/shiny-button";
import { useLanguage } from "@/contexts/LanguageContext";

const plans = [
  {
    name: "Free Plan",
    price: 0,
    features: ["Basic health record storage", "Single user profile", "Manual medication tracking", "Standard data encryption"],
  },
  {
    name: "Pro Plan",
    price: 19,
    popular: true,
    features: ["Instant medical record access", "Automated medicine reminders", "QR code health sharing", "Priority emergency alerts", "Sync across all devices", "Detailed health reports"],
  },
  {
    name: "Premium Plan",
    price: 39,
    features: ["Advanced AI health assistant", "Symptom analysis & history", "Direct hospital data sharing", "24/7 priority support", "Comprehensive health reports", "Personalized health coaching"],
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const { t } = useLanguage();

  const plans = [
    {
      name: t('price_free_plan'),
      price: 0,
      features: ["Basic health record storage", "Single user profile", "Manual medication tracking", "Standard data encryption"],
    },
    {
      name: t('price_pro_plan'),
      price: 19,
      popular: true,
      features: ["Instant medical record access", "Automated medicine reminders", "QR code health sharing", "Priority emergency alerts", "Sync across all devices", "Detailed health reports"],
    },
    {
      name: t('price_premium_plan'),
      price: 39,
      features: ["Advanced AI health assistant", "Symptom analysis & history", "Direct hospital data sharing", "24/7 priority support", "Comprehensive health reports", "Personalized health coaching"],
    },
  ];

  return (
    <section className="py-20 md:py-32 px-6" id="pricing">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 mb-6 uppercase tracking-wider">
            ● {t('price_label')}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8 md:mb-12">{t('price_title')}</h2>
          
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-white/40'}`}>{t('price_monthly')}</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 md:w-14 h-7 md:h-8 glass rounded-full p-1 transition-all relative"
            >
              <motion.div 
                animate={{ x: isAnnual ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 24) : 0 }}
                className="w-5 md:w-6 h-5 md:h-6 bg-white rounded-full shadow-lg"
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-white' : 'text-white/40'}`}>{t('price_annual')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] transition-all duration-300 hover:scale-[1.02] hover:border-white/20 ${plan.popular ? 'border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)]' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-white/10 text-[11px] font-bold uppercase tracking-widest">
                  {t('price_popular')}
                </div>
              )}
              <div className="text-2xl font-bold mb-8">{plan.name}</div>
              <div className="flex items-baseline gap-2 mb-12">
                <span className="text-5xl font-bold">${isAnnual ? Math.round(plan.price * 0.8) : plan.price}</span>
                <span className="text-white/40 font-medium">/mo</span>
              </div>
              <ul className="space-y-6 mb-12">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-4 text-[14px] text-white/60">
                    <Check className="w-4 h-4 text-white/40" />
                    {f}
                  </li>
                ))}
              </ul>
              <ShinyButton 
                onClick={() => navigate("/role-selection")} 
                className="w-full rounded-full"
              >
                {t('nav_get_started')}
              </ShinyButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
