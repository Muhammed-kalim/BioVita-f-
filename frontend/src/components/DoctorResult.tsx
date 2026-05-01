import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Droplets, AlertCircle, Phone, Stethoscope, Shield, ChevronLeft, Download, Send, Activity, Heart, Thermometer, Wind, FileText } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { MedicalIdentity } from '../contexts/MedicalIdentityContext';

const DoctorResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient as MedicalIdentity | undefined;

  useEffect(() => {
    if (!patient) {
      navigate('/doctor');
    }
  }, [patient, navigate]);

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Top Actions */}
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Link to="/doctor" className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-500">Close Emergency Session</span>
              </Link>
              <h1 className="text-4xl font-bold flex items-center gap-4">
                {patient.name}
                <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-500 text-xs uppercase tracking-widest font-black border border-green-500/20">Verified Identity</span>
              </h1>
            </div>
            <div className="flex gap-4">
              <button className="glass px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-white/5 transition-all text-sm font-bold border-white/10">
                <Download className="w-4 h-4 text-red-500" />
                Export Profile
              </button>
              <button className="bg-red-600 px-6 py-3 rounded-2xl flex items-center gap-2 hover:scale-105 transition-all text-sm font-bold shadow-lg shadow-red-500/20">
                <Send className="w-4 h-4" />
                Transfer to ER
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Critical Data (Left) */}
            <div className="lg:col-span-2 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-[2.5rem] border-red-500/30 bg-red-500/[0.03] relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Droplets className="w-20 h-20 text-red-500" />
                     </div>
                     <span className="text-[10px] uppercase font-black tracking-[0.2em] text-red-500 mb-4 block">Critical Group</span>
                     <h3 className="text-6xl font-black text-red-500">{patient.bloodGroup}</h3>
                     <p className="text-white/40 text-sm mt-4 font-bold uppercase tracking-widest italic">Compatible Transfusion Required</p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-8 rounded-[2.5rem] border-orange-500/30 bg-orange-500/[0.03] space-y-4"
                  >
                     <span className="text-[10px] uppercase font-black tracking-[0.2em] text-orange-500 mb-2 block">Allergy Warnings</span>
                      <div className="flex flex-wrap gap-2">
                        {patient.allergies ? patient.allergies.split(',').map((allergy, i) => (
                           <div key={i} className="px-4 py-2 rounded-xl bg-orange-500/20 text-orange-500 text-xs font-black uppercase border border-orange-500/20">
                              {allergy.trim()}
                           </div>
                        )) : (
                          <div className="text-white/20 text-xs font-bold italic">No Known Allergies Reported</div>
                        )}
                      </div>
                     <p className="text-xs text-white/40 pt-2 leading-relaxed">System-verified allergy report. Avoid listed substances immediately.</p>
                  </motion.div>
               </div>

                <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                     <Stethoscope className="w-5 h-5 text-red-500" />
                     Comprehensive Medical Dossier
                  </h3>
                  <div className="space-y-8">
                     {/* 🔴 Section 1: Critical */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Critical Status</span>
                        </div>
                        <div className="p-6 rounded-2xl bg-red-500/[0.03] border border-red-500/10">
                           <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2 block">Chronic Conditions</label>
                           <div className="text-lg font-bold text-white/90">{patient.chronicConditions || 'None Reported'}</div>
                        </div>
                     </div>

                     {/* 🟠 Section 2: Important */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Clinical History</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                              <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2 block">Current Medications</label>
                              <div className="text-sm font-bold">{patient.medications || 'None'}</div>
                           </div>
                           <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                              <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2 block">Past Surgeries</label>
                              <div className="text-sm font-bold">{patient.pastSurgeries || 'None Reported'}</div>
                           </div>
                           <div className="p-6 rounded-2xl bg-white/5 border border-white/5 md:col-span-2">
                              <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2 block">Recent Medical Issues (12mo)</label>
                              <div className="text-sm font-bold">{patient.recentIssues || 'None Reported'}</div>
                           </div>
                        </div>
                     </div>

                     {/* 🟡 Section 3: Helpful */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Contextual Data</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
                              <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Age / Gender</span>
                              <span className="text-sm font-bold">{patient.age}Y / {patient.gender}</span>
                           </div>
                           <div className="p-4 rounded-2xl bg-white/2 border border-white/5 md:col-span-2">
                              <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Primary Care Facility</span>
                              <span className="text-sm font-bold">{patient.doctorHospital || 'Not Specified'}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Live Vital Stream simulation in report */}
               <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                     <Activity className="w-5 h-5 text-red-500" />
                     Bio-Sync Stream (Cached)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {[
                       { label: 'HR', value: `${patient.vitals?.heartRate} BPM`, icon: <Heart className="text-red-500" /> },
                       { label: 'O2', value: `${patient.vitals?.oxygenLevel}%`, icon: <Wind className="text-blue-500" /> },
                       { label: 'TEMP', value: `${patient.vitals?.temperature?.toFixed(1)}°C`, icon: <Thermometer className="text-orange-500" /> },
                       { label: 'BP', value: patient.vitals?.bloodPressure, icon: <Activity className="text-green-500" /> },
                     ].map((v, i) => (
                       <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                          <div className="flex justify-center mb-2">{v.icon}</div>
                          <div className="text-lg font-black">{v.value}</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-widest">{v.label}</div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Sidebar (Identity & Contact) */}
            <div className="space-y-8">
               <div className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col items-center">
                  <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-8 border-4 border-white/5 shadow-2xl">
                     <img src={patient.faceImageUrl || patient.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"} alt={patient.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full space-y-6">
                     <div>
                        <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-1 block">Patient ID</label>
                        <div className="font-mono text-sm">{patient.id}</div>
                     </div>
                     <div className="w-full h-px bg-white/5" />
                     <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                        <label className="text-red-500 text-[10px] uppercase font-black tracking-widest mb-3 block flex items-center gap-2">
                           <Phone className="w-3 h-3" />
                           Emergency Alert Status
                        </label>
                        <div className="text-sm font-bold mb-1">{patient.emergencyContact?.includes('(') ? patient.emergencyContact.split('(')[0] : 'Primary Contact'}</div>
                        <div className="text-xl font-black text-red-500">{patient.emergencyContact?.includes('(') ? patient.emergencyContact.split('(')[1]?.replace(')', '') : patient.emergencyContact}</div>
                        <div className="mt-4 flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-widest bg-green-500/10 p-2 rounded-lg">
                           <Shield className="w-3 h-3" />
                           Notification Sent Successfully
                        </div>
                     </div>
                  </div>
               </div>

               <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-blue-500/5 to-transparent">
                  <h3 className="text-lg font-bold mb-4">Verification Audit</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between text-xs">
                        <span className="text-white/40 uppercase tracking-widest">Match Score</span>
                        <span className="text-blue-500 font-bold">99.8%</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-white/40 uppercase tracking-widest">Method</span>
                        <span className="text-white/60">Bio-Neural Mapping</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-white/40 uppercase tracking-widest">Source</span>
                        <span className="text-white/60">BioVita Global</span>
                     </div>
                  </div>
               </div>

               {/* Patient Reports for Doctor */}
               {patient.reports && patient.reports.length > 0 && (
                 <div className="glass p-6 rounded-[2rem] border-white/5 space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Patient Medical Documents
                    </h5>
                    <div className="space-y-3">
                      {patient.reports.map((report, idx) => (
                        <a 
                          key={idx}
                          href={report.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 text-white">
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

export default DoctorResult;
