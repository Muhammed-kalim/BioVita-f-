import { Link } from "react-router-dom";
import { MessageSquare, Shield, Zap, Activity, Send, Heart, QrCode, MapPin, FileText, Scan } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CartesianGrid, Line, LineChart, ResponsiveContainer } from "recharts";

export default function Product() {
  const { t } = useLanguage();

  const healthCategories = [
    { icon: <FileText className="w-4 h-4" />, label: t('rec_medical_records') },
    { icon: <Activity className="w-4 h-4" />, label: t('dash_vitals') },
    { icon: <Zap className="w-4 h-4" />, label: t('nav_emergency') },
    { icon: <QrCode className="w-4 h-4" />, label: t('nav_qr_share') },
    { icon: <Heart className="w-4 h-4" />, label: t('dash_allergies') },
    { icon: <MapPin className="w-4 h-4" />, label: t('nav_nearby') },
  ];

  const healthCards = [
    { 
      date: t('dash_last_sync'), 
      label: "Blood Pressure: Normal", 
      color: "bg-emerald-400/20", 
      icon: <Activity className="text-emerald-400" />,
      data: [
        { v: 120 }, { v: 118 }, { v: 122 }, { v: 119 }, { v: 121 }
      ],
      chartColor: "#10b981"
    },
    { 
      date: t('dash_active_alerts'), 
      label: "All Records Synced", 
      color: "bg-blue-400/20", 
      icon: <Shield className="text-blue-400" />, 
      active: true,
      data: [
        { v: 10 }, { v: 40 }, { v: 30 }, { v: 70 }, { v: 100 }
      ],
      chartColor: "#60a5fa"
    },
  ];

  return (
    <section className="py-32 px-6 space-y-40">
      <div className="max-w-[1200px] mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 mb-6 uppercase tracking-wider">
          ● {t('feat_label')}
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-20">The BioVita Ecosystem</h2>

        {/* AI Health Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="glass p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group border-white/5">
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-6">
              <div className="flex justify-end">
                <div className="glass px-6 py-4 rounded-[2rem] rounded-tr-none text-[14px] max-w-[80%] border-white/10">
                  Initializing biometric scan... 🔍
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-red-500/10 px-6 py-4 rounded-[2rem] rounded-tl-none text-[14px] max-w-[80%] text-red-500 font-bold border border-red-500/20">
                  Identity matched: Patient has Severe Peatnut Allergy. Alerting nearby staff.
                </div>
              </div>
              <div className="pt-8 flex gap-3">
                <div className="flex-1 glass px-6 py-4 rounded-full text-[14px] text-white/30 flex items-center justify-between border-white/10">
                  Running diagnostic scan...
                  <Scan className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center mb-8 border-white/10">
              <Scan className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-4xl font-bold mb-6">Seamless Biometric Identification</h3>
            <p className="text-lg text-brand-text-secondary leading-relaxed mb-8">
              No more searching for wallets or IDs during a crisis. Our system identifies patients via secure facial biometrics in under 3 seconds, retrieving vital health data instantly.
            </p>
            <Link to="/emergency" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-red-500/20">
              Try Demo Scan
              <Send className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Health Record Vault */}
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center mb-8 border-white/10">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-4xl font-bold mb-6">Universal Medical ID</h3>
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              Your BioVita ID is a globally recognized medical profile. Whether you're at home or traveling, your blood group, conditions, and emergency contacts are always available when they matter most.
            </p>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            {healthCategories.map((cat, i) => (
              <div key={i} className="glass p-6 rounded-[2rem] flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <span className="text-[13px] font-medium text-white/60">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instant Health Data Access */}
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar">
            {healthCards.map((card, i) => (
              <div 
                key={i} 
                className={`flex-shrink-0 w-64 glass p-8 rounded-[3rem] transition-all duration-500 relative overflow-hidden border-white/5 ${card.active ? 'scale-110 border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.05)]' : 'opacity-40 scale-95'}`}
              >
                <div className="text-[12px] text-white/40 mb-8 uppercase tracking-widest">{card.date}</div>
                <div className={`w-20 h-20 rounded-full ${card.color} flex items-center justify-center mb-8 mx-auto`}>
                  {card.icon}
                </div>
                <div className="h-20 w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={card.data}>
                      <Line 
                        type="monotone" 
                        dataKey="v" 
                        stroke={card.chartColor} 
                        strokeWidth={2} 
                        dot={false}
                        className="animate-dash-line"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold mb-2">{card.label}</div>
                  <p className="text-[13px] text-white/40 text-red-500/60 font-medium">Verified by BioVita Scan</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center mb-8 border-white/10">
              <Activity className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-4xl font-bold mb-6">Real-time Emergency Sync</h3>
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              When a scan is completed, the system synchronizes vital information across the local medical station and the cloud, ensuring doctors have the most recent history available.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency SOS & QR Sharing */}
      <div className="max-w-[1200px] mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center mb-8 border-white/10">
              <Zap className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-4xl font-bold mb-6">Multi-Response Alerts</h3>
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              One BioVita scan triggers a chain of responses: Emergency services are notified, the nearest hospital prepares for your arrival, and your family gets an instant update with your location.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { label: "Trigger SOS Alert", icon: <Zap className="w-5 h-5 text-red-500" /> },
              { label: "Generate Emergency QR", icon: <QrCode className="w-5 h-5 text-red-500" /> },
              { label: "Find Nearest Help", icon: <MapPin className="w-5 h-5 text-red-500" /> }
            ].map((tool, i) => (
              <div key={i} className="glass p-8 rounded-[2rem] flex items-center justify-between hover:bg-red-500/5 transition-all cursor-pointer group relative overflow-hidden border-white/5 hover:border-red-500/20">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl glass border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <span className="text-xl font-bold opacity-80">{tool.label}</span>
                </div>
                <div className="w-10 h-10 glass border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Send className="w-4 h-4 text-red-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
