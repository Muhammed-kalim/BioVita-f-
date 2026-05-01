import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Wind, Thermometer, ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useMedicalIdentity } from '../contexts/MedicalIdentityContext';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const PatientVitals = () => {
  const { activeUser } = useMedicalIdentity();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock real-time data
    const interval = setInterval(() => {
      setData(prev => {
        const newVal = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          hr: 70 + Math.floor(Math.random() * 10),
          o2: 98 + Math.floor(Math.random() * 2),
        };
        const next = [...prev, newVal];
        return next.slice(-10); // Keep last 10 points
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!activeUser) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <Link to="/patient" className="text-xs text-white/40 hover:text-white transition-colors">Patient Dashboard</Link>
                 <span className="text-white/20 text-xs">/</span>
                 <span className="text-xs text-red-500 font-bold">Real-time Vitals</span>
              </div>
              <h1 className="text-4xl font-bold">Biometric Stream</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass p-8 rounded-[2.5rem] border-white/5 h-[400px]">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                     <Heart className="w-5 h-5 text-red-500" />
                     Heart Rate Activity
                   </h3>
                   <span className="text-[10px] uppercase font-black tracking-widest text-red-500 animate-pulse">● Live Stream</span>
                </div>
                <div className="w-full h-64 min-h-[250px]">
                   <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <LineChart data={data}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                         <XAxis dataKey="time" hide />
                         <YAxis domain={[60, 100]} hide />
                         <Tooltip 
                           contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }}
                           itemStyle={{ color: '#ef4444' }}
                         />
                         <Line 
                           type="monotone" 
                           dataKey="hr" 
                           stroke="#ef4444" 
                           strokeWidth={3} 
                           dot={{ fill: '#ef4444' }} 
                           animationDuration={300}
                         />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-8 glass p-8 rounded-[2.5rem] border-white/5">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold">Health Insights</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
                       <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                          <Activity className="w-5 h-5" />
                       </div>
                       <div>
                          <h4 className="font-bold mb-1">Resting Heart Rate Stable</h4>
                          <p className="text-sm text-white/40 italic">Your cardiovascular output has remained consistent over the last 24 hours.</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-8 rounded-[2.5rem] border-white/5">
                 <h3 className="text-lg font-bold mb-6">Current Readings</h3>
                 <div className="space-y-4">
                    {[
                      { icon: <Heart className="text-red-500" />, label: 'HR', value: `${data[data.length-1]?.hr || activeUser.vitals?.heartRate} BPM` },
                      { icon: <Wind className="text-blue-500" />, label: 'O2', value: `${data[data.length-1]?.o2 || activeUser.vitals?.oxygenLevel}%` },
                      { icon: <Thermometer className="text-orange-500" />, label: 'TEMP', value: `${activeUser.vitals?.temperature?.toFixed(1)}°C` },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                         <div className="flex items-center gap-3">
                            {item.icon}
                            <span className="text-xs font-black uppercase tracking-widest text-white/40">{item.label}</span>
                         </div>
                         <span className="font-bold">{item.value}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-red-500/5 to-transparent">
                 <h3 className="text-lg font-bold mb-4">Emergency Protocol</h3>
                 <p className="text-xs text-white/40 leading-relaxed mb-6">
                    If your heart rate exceeds 140 BPM while at rest, BioVita will automatically prompt you to check-in or notify your emergency contacts.
                 </p>
                 <button className="w-full py-4 rounded-2xl bg-white/5 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    Adjust Thresholds
                    <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PatientVitals;
