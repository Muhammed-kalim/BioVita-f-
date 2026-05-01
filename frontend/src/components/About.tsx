import BlurTextAnimation from './ui/blur-text-animation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  const aboutText = t('about_desc');

  return (
    <section className="py-20 md:py-32 px-6" id="about">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 uppercase tracking-wider">
          ● {t('nav_about')}
        </div>
        
        <div className="w-full">
          <BlurTextAnimation 
            text={aboutText}
            fontSize="text-lg md:text-xl lg:text-2xl font-bold"
            className="!min-h-0 !bg-transparent !p-0 !justify-start !text-left"
            textColor="text-white"
          />
        </div>
      </div>
    </section>
  );
}
