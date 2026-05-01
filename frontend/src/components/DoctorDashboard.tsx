import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Users, Clock, Shield, Search, ChevronRight, Activity, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const DoctorDashboard = () => {
  const recentScans = [
    { name: 'John Doe', time: '10 mins ago', status: 'Identity Verified', blood: 'O+' },
    { name: 'Sarah Connor', time: '45 mins ago', status: 'Emergency Alert Sent', blood: 'A-' },
    { name: 'Unknown Patient', time: '2 hours ago', status: 'Manual Entry', blood: 'B+' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full glass border-red-500/20 text-[12px] font-medium text-red-500 mb-4 uppercase tracking-wider">
                ● Medical Professional Portal
              </div>
              <h1 className="text-4xl font-bold">Doctor Dashboard</h1>
              <p className="text-white/40 mt-1">St. Mary's General Hospital | Emergency Unit</p>
            </div>
            <Link to="/doctor/scan" className="px-8 py-4 rounded-3xl bg-red-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
              <Scan className="w-6 h-6" />
              Scan New Patient
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Stats */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Scans Today', value: '12', sub: '+4 since yesterday', icon: <Scan className="text-red-500" /> },
                  { label: 'Verified Identities', value: '98%', sub: 'High accuracy', icon: <Users className="text-blue-500" /> },
                  { label: 'Emergency Alerts', value: '3', sub: 'Active protocols', icon: <Activity className="text-green-500" /> },
                ].map((stat, i) => (
                  <div key={i} className="glass p-6 rounded-[2rem] border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-[10px] text-white/20 mt-1">{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="glass p-8 rounded-[2.5rem] border-white/5">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                     <Clock className="w-5 h-5 text-red-500" />
                     Recent Emergency Scans
                   </h3>
                   <button className="text-xs text-white/40 hover:text-white transition-colors">View History</button>
                </div>
                <div className="space-y-4">
                   {recentScans.map((scan, i) => (
                     <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-bold">
                              {scan.blood}
                           </div>
                           <div>
                              <div className="font-bold">{scan.name}</div>
                              <div className="text-[10px] text-white/30 uppercase tracking-widest">{scan.status}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-xs text-white/20">{scan.time}</span>
                           <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-red-500 transition-colors" />
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Sidebar Tools */}
            <div className="space-y-8">
               <div className="glass p-8 rounded-[2.5rem] border-white/5">
                  <h3 className="text-lg font-bold mb-6">Medical Database Search</h3>
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text" 
                      placeholder="Search by ID or Name" 
                      className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <div className="space-y-3">
                     {[
                       { label: 'Verify Lab Records', icon: <Activity className="w-4 h-4" /> },
                       { label: 'Access National Registry', icon: <Shield className="w-4 h-4" /> },
                     ].map((item, i) => (
                       <button key={i} className="w-full p-4 rounded-xl bg-white/2 border border-white/5 flex items-center gap-3 text-xs font-bold hover:bg-white/5 transition-all">
                          <span className="text-red-500">{item.icon}</span>
                          {item.label}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2.5rem] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Shield className="w-20 h-20 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Compliance Alert
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    All emergency scans are recorded and logged for audit purposes. Ensure you are using the system only in critical medical scenarios.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;
