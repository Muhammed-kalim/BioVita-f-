import { motion } from "motion/react";
import { Shield, User, Scan, Droplets, Phone } from "lucide-react";

const features = [
  {
    icon: <User className="w-6 h-6 text-red-500" />,
    title: "1. Register Identity",
    description: "Create a secure medical profile with your blood group, allergies, and medications. Your data is encrypted and private."
  },
  {
    icon: <Shield className="w-6 h-6 text-red-500" />,
    title: "2. Biometric Link",
    description: "Link your identity to your facial biometric data for secure and instant recognition by emergency medical teams."
  },
  {
    icon: <Scan className="w-6 h-6 text-red-500" />,
    title: "3. Scan in Emergency",
    description: "Authorized doctors can scan your face to identify you instantly, even if you are unconscious or unable to speak."
  },
  {
    icon: <Droplets className="w-6 h-6 text-red-500" />,
    title: "4. Life-Saving Data",
    description: "BioVita displays critical data like allergies and blood group immediately, preventing medical errors during crisis."
  },
  {
    icon: <Phone className="w-6 h-6 text-red-500" />,
    title: "5. Auto Contact Alert",
    description: "As soon as a scan is verified, your emergency contacts are notified with your status and current medical location."
  }
];

export default function Features() {
  return (
    <section className="py-20 md:py-32 px-6" id="features">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12 md:mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 mb-6 uppercase tracking-wider">
            ● Features
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]">
            Everything you need for better healthcare
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group glass p-10 rounded-[2.5rem] hover:-translate-y-[6px] hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-3xl font-bold mb-4">{f.title}</h3>
              <p className="text-brand-text-secondary leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
