import React from 'react';
import { motion } from 'framer-motion';
import { User, Droplets, AlertCircle, Shield, Activity, FileText, Heart, Thermometer, Wind, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useMedicalIdentity } from '../contexts/MedicalIdentityContext';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { activeUser } = useMedicalIdentity();

  if (!activeUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 pt-28">
          <div className="glass p-12 rounded-[3rem] text-center max-w-md w-full border-red-500/20">
            <h2 className="text-2xl font-bold mb-4">No Identity Found</h2>
            <p className="text-white/60 mb-8">Please register your medical identity to access the patient portal.</p>
            <Link to="/patient/register" className="inline-block px-8 py-4 rounded-full bg-red-600 text-white font-bold hover:scale-105 transition-all">
              Register Now
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statCards = [
    { label: 'Heart Rate', value: `${activeUser.vitals?.heartRate} BPM`, icon: <Heart className="text-red-500" />, sub: 'Normal range: 60-100' },
    { label: 'Blood Pressure', value: activeUser.vitals?.bloodPressure, icon: <Activity className="text-red-500" />, sub: 'Stable' },
    { label: 'Oxygen level', value: `${activeUser.vitals?.oxygenLevel}%`, icon: <Wind className="text-red-500" />, sub: 'Excellent' },
    { label: 'Temperature', value: `${activeUser.vitals?.temperature?.toFixed(1)}°C`, icon: <Thermometer className="text-red-500" />, sub: 'Normal' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 mb-4 uppercase tracking-wider">
                ● Patient Portal
              </div>
              <h1 className="text-4xl font-bold">Welcome, {activeUser.name}</h1>
              <p className="text-white/40 mt-1">Medical ID: {activeUser.id}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="glass p-4 rounded-3xl border-white/5 flex items-center gap-6">
                <div className="p-2 bg-white rounded-xl">
                  <QRCodeCanvas 
                    value={`${window.location.origin}/emergency/${activeUser.id}`} 
                    size={100} 
                    level="L" 
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-green-500 mb-1">
                    <QrCode className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Digital Emergency Card</span>
                  </div>
                  <div className="text-white/40 text-[10px] font-medium uppercase tracking-tighter">Verified Identity</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/patient/records" className="glass px-6 py-4 rounded-2xl flex items-center gap-2 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
                  <FileText className="w-4 h-4 text-red-500" />
                  Records
                </Link>
                <Link to="/emergency" className="bg-red-600 px-6 py-4 rounded-2xl flex items-center gap-2 hover:scale-105 transition-all text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-500/20">
                  <Shield className="w-4 h-4" />
                  SOS
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Stats */}
            <div className="lg:col-span-2 space-y-8">
              {/* Vitals Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="glass p-6 rounded-[2rem] border-white/5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">{stat.label}</div>
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-[10px] text-white/20 mt-1">{stat.sub}</div>
                  </motion.div>
                ))}
              </div>

              {/* Profile Summary */}
              <div className="glass p-8 rounded-[2.5rem] border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-red-500" />
                  Life-Saving Medical Profile
                </h3>
                <div className="space-y-6">
                  {/* Critical Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-red-500/[0.03] border border-red-500/10">
                      <label className="text-red-500/60 text-[10px] uppercase font-black tracking-widest mb-1 block">Blood Group & Allergies</label>
                      <div className="flex items-center gap-3">
                        <div className="text-xl font-black text-red-500">{activeUser.bloodGroup}</div>
                        <div className="w-px h-4 bg-red-500/20" />
                        <div className="text-sm font-bold text-white/80">{activeUser.allergies}</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-red-500/[0.03] border border-red-500/10">
                      <label className="text-red-500/60 text-[10px] uppercase font-black tracking-widest mb-1 block">Chronic Conditions</label>
                      <div className="text-sm font-bold text-white/80">{activeUser.chronicConditions || 'None Reported'}</div>
                    </div>
                  </div>

                  {/* Important Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-orange-500/[0.03] border border-orange-500/10">
                      <label className="text-orange-500/60 text-[10px] uppercase font-black tracking-widest mb-1 block">Active Medications</label>
                      <div className="text-xs font-bold text-white/70">{activeUser.medications || 'None'}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-orange-500/[0.03] border border-orange-500/10">
                      <label className="text-orange-500/60 text-[10px] uppercase font-black tracking-widest mb-1 block">Past Surgeries</label>
                      <div className="text-xs font-bold text-white/70">{activeUser.pastSurgeries || 'None'}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-orange-500/[0.03] border border-orange-500/10">
                      <label className="text-orange-500/60 text-[10px] uppercase font-black tracking-widest mb-1 block">Recent Issues</label>
                      <div className="text-xs font-bold text-white/70">{activeUser.recentIssues || 'None'}</div>
                    </div>
                  </div>

                  {/* Helpful Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-yellow-500/[0.03] border border-yellow-500/10">
                      <label className="text-yellow-500/60 text-[10px] uppercase font-black tracking-widest mb-1 block">Emergency Contact</label>
                      <div className="text-xs font-bold text-white/70">{activeUser.emergencyContact}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-yellow-500/[0.03] border border-yellow-500/10">
                      <label className="text-yellow-500/60 text-[10px] uppercase font-black tracking-widest mb-1 block">Profile Context</label>
                      <div className="text-xs font-bold text-white/70">{activeUser.age}Y • {activeUser.gender}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-yellow-500/[0.03] border border-yellow-500/10">
                      <label className="text-yellow-500/60 text-[10px] uppercase font-black tracking-widest mb-1 block">PCP / Hospital</label>
                      <div className="text-xs font-bold text-white/70">{activeUser.doctorHospital || 'Not set'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar info */}
            <div className="space-y-8">
              <div className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col items-center">
                 <div className="w-32 h-32 rounded-3xl overflow-hidden mb-6 border-4 border-red-500/20">
                   <img src={activeUser.faceImageUrl || activeUser.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop"} alt="Profile" className="w-full h-full object-cover" />
                 </div>
                 <h4 className="text-lg font-bold mb-1">{activeUser.name}</h4>
                 <p className="text-xs text-white/40 mb-6">Verified Patient since {new Date(activeUser.createdAt).getFullYear()}</p>
                 <div className="w-full h-1 bg-white/5 rounded-full mb-6" />
                 <div className="w-full space-y-4">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-white/40 uppercase tracking-widest">Biometric Status</span>
                       <span className="text-green-500 font-bold">ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-white/40 uppercase tracking-widest">Privacy level</span>
                       <span className="text-blue-500 font-bold">MAXIMUM</span>
                    </div>
                 </div>
              </div>

              <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-[2rem] space-y-4">
                 <h5 className="text-sm font-bold text-red-500 flex items-center gap-2">
                   <Shield className="w-4 h-4" />
                   Security Tip
                 </h5>
                 <p className="text-xs text-white/60 leading-relaxed">
                   Your biometric scan is only available to certified medical professionals in certified emergency environments.
                 </p>
              </div>

              {/* Uploaded Reports Section */}
              {activeUser.reports && activeUser.reports.length > 0 && (
                <div className="glass p-6 rounded-[2rem] border-white/5 space-y-4">
                   <h5 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                     <FileText className="w-4 h-4 text-blue-500" />
                     Medical Documents
                   </h5>
                   <div className="space-y-3">
                     {activeUser.reports.map((report, idx) => (
                       <a 
                         key={idx}
                         href={report.content}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group"
                       >
                         <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                           <FileText className="w-4 h-4 text-blue-500" />
                         </div>
                         <div className="flex flex-col overflow-hidden">
                           <span className="text-[10px] font-bold text-white/80 truncate">{report.name}</span>
                           <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">
                             {report.type.split('/')[1].toUpperCase()}
                           </span>
                         </div>
                       </a>
                     ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PatientDashboard;
