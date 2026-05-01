import HeroFuturistic from "./ui/hero-futuristic";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <HeroFuturistic 
        title={t('hero_title')} 
        subtitle={t('hero_subtitle')} 
      />
    </section>
  );
}

