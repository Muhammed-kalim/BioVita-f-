import React from 'react';
import { motion } from 'framer-motion';
import { User, Stethoscope, ChevronRight, ShieldCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PortalSelection = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'patient',
      title: 'Patient Portal',
      description: 'Manage your medical identity, track vitals, and secure your history.',
      icon: <User className="w-8 h-8" />,
      color: 'bg-white/5',
      hoverColor: 'hover:border-blue-500/50',
      textColor: 'text-blue-500',
      path: '/patient/auth'
    },
    {
      id: 'doctor',
      title: 'Medical Professional',
      description: 'Access emergency records instantly and verify patient identities.',
      icon: <Stethoscope className="w-8 h-8" />,
      color: 'bg-red-500/5',
      hoverColor: 'hover:border-red-500/50',
      textColor: 'text-red-500',
      path: '/doctor/auth'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20">
        <div className="max-w-4xl w-full text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6"
          >
            Digital Health Ecosystem
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">SELECT YOUR PORTAL</h1>
          <p className="text-white/40 max-w-xl mx-auto text-lg">Choose your role to access the BioVita secure medical network.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {portals.map((portal, i) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(portal.path)}
              className={`group glass p-10 rounded-[3rem] border-white/5 ${portal.hoverColor} transition-all cursor-pointer relative overflow-hidden flex flex-col items-center text-center`}
            >
              <div className={`w-20 h-20 rounded-3xl ${portal.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <div className={portal.textColor}>{portal.icon}</div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{portal.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8">{portal.description}</p>
              
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                Enter Portal
                <ChevronRight className="w-4 h-4" />
              </div>

              {/* Decorative background element */}
              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                {portal.id === 'patient' ? <User size={160} /> : <Stethoscope size={160} />}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-8 opacity-40">
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              End-to-End Encryption
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <Activity className="w-4 h-4" />
              Real-time Sync
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortalSelection;
