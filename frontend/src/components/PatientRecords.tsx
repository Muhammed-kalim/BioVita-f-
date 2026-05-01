import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Search, ExternalLink, Activity } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useMedicalIdentity } from '../contexts/MedicalIdentityContext';
import { Link } from 'react-router-dom';

const PatientRecords = () => {
  const { activeUser } = useMedicalIdentity();

  if (!activeUser) return null;

  const userReports = (activeUser.reports || []).map((r, i) => ({
    id: `UP-${100 + i}`,
    type: r.name,
    date: new Date(activeUser.createdAt).toISOString().split('T')[0],
    provider: activeUser.doctorHospital || 'User Upload',
    status: 'Final',
    url: r.content
  }));

  const records = [
    { id: 'REC-001', type: 'Initial Registration', date: new Date(activeUser.createdAt).toISOString().split('T')[0], provider: 'BioVita System', status: 'Verified' },
    ...userReports
  ];

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
                 <span className="text-xs text-red-500 font-bold">Medical Records</span>
              </div>
              <h1 className="text-4xl font-bold">Medical Records</h1>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-red-500/50 w-64"
                />
              </div>
              <button className="glass px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-white/5 transition-all text-sm font-bold">
                <Download className="w-4 h-4 text-red-500" />
                Export All
              </button>
            </div>
          </div>

          <div className="glass overflow-hidden rounded-[2.5rem] border-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-6 text-xs uppercase font-black tracking-widest text-white/40">Record ID</th>
                  <th className="p-6 text-xs uppercase font-black tracking-widest text-white/40">Type</th>
                  <th className="p-6 text-xs uppercase font-black tracking-widest text-white/40">Date</th>
                  <th className="p-6 text-xs uppercase font-black tracking-widest text-white/40">Provider</th>
                  <th className="p-6 text-xs uppercase font-black tracking-widest text-white/40">Status</th>
                  <th className="p-6 text-xs uppercase font-black tracking-widest text-white/40">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={record.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-6 font-mono text-[10px] text-white/60">{record.id}</td>
                    <td className="p-6 text-sm font-bold">{record.type}</td>
                    <td className="p-6 text-sm text-white/40">{record.date}</td>
                    <td className="p-6 text-sm text-white/60">{record.provider}</td>
                    <td className="p-6">
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">
                        {record.status}
                      </span>
                    </td>
                    <td className="p-6">
                      {(record as any).url ? (
                        <a href={(record as any).url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 group-hover:bg-red-500/20 group-hover:text-red-500 transition-all inline-block">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <button className="p-2 rounded-xl bg-white/5 group-hover:bg-red-500/20 group-hover:text-red-500 transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass p-8 rounded-[2.5rem] border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  Chronic Conditions
                </h3>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 text-sm italic">
                  No chronic conditions reported.
                </div>
             </div>
             <div className="glass p-8 rounded-[2.5rem] border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  Immunization History
                </h3>
                <div className="space-y-4">
                   {[
                     { name: 'COVID-19 Booster', date: '2023-11-20' },
                     { name: 'Influenza', date: '2023-10-05' },
                   ].map((imm, i) => (
                     <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/2 border border-white/5">
                        <span className="text-sm font-bold">{imm.name}</span>
                        <span className="text-xs text-white/40">{imm.date}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PatientRecords;
