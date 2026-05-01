import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, HeartPulse, Activity, AlertCircle, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PatientData {
  id: string;
  name: string;
  bloodGroup: string;
  allergies: string;
  emergencyContact: string;
  faceImageUrl?: string;
  chronicConditions?: string;
  medications?: string;
  pastSurgeries?: string;
  age?: string;
  gender?: string;
}

export default function EmergencyView() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        console.log(`🔍 [Emergency] Extracting ID from URL: ${id}`);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/patient/${id}`);
        
        if (!response.ok) {
          throw new Error('Patient not found or invalid ID');
        }
        
        const data = await response.json();
        console.log(`✅ [Emergency] API Response Success for ${data.name}`);
        setPatient(data);
      } catch (err: any) {
        console.error("❌ [Emergency] Fetch Error:", err);
        setError(err.message || 'Failed to retrieve patient information');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatient();
    } else {
      console.warn("⚠️ [Emergency] No ID provided in URL");
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors group mb-6"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-600 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Emergency Medical Profile</h1>
            </div>
            <p className="text-white/40 text-sm">
              Official BioVita digital emergency record. Information is intended for first responders and medical professionals.
            </p>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-white/50">
              <Loader2 className="w-10 h-10 animate-spin text-red-500 mb-4" />
              <p>Retrieving secure medical records...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Profile Not Found</h3>
              <p className="text-white/60 mb-6">{error}</p>
              <Link to="/" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors">
                Return Home
              </Link>
            </div>
          )}

          {patient && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Critical Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass p-6 rounded-3xl border-red-500/30 bg-red-500/5 relative overflow-hidden flex gap-6 items-start">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <HeartPulse className="w-24 h-24 text-red-500" />
                  </div>
                  
                  {patient.faceImageUrl && (
                    <div className="relative z-10 w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 shrink-0">
                      <img 
                        src={patient.faceImageUrl} 
                        alt={patient.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if supabase image fails to load
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop';
                        }}
                      />
                    </div>
                  )}

                  <div className="relative z-10">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Patient Name</p>
                    <h2 className="text-2xl font-black mb-6">{patient.name}</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Blood Group</p>
                        <p className="text-xl font-bold text-red-400">{patient.bloodGroup || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Critical Allergies</p>
                        <p className="text-lg font-medium text-white">{patient.allergies || 'No known allergies'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass p-6 rounded-3xl border-white/5 flex flex-col justify-between">
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      Emergency Contact
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-2">{patient.emergencyContact}</h3>
                    <p className="text-white/40 text-sm">Primary Contact Number</p>
                  </div>
                  
                  <a 
                    href={`tel:${patient.emergencyContact}`}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>
              </div>

              {/* Secondary Info */}
              <div className="glass p-6 rounded-3xl border-white/5 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Medical History
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Chronic Conditions</p>
                    <p className="text-sm">{patient.chronicConditions || 'None reported'}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Current Medications</p>
                    <p className="text-sm">{patient.medications || 'None reported'}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Past Surgeries</p>
                    <p className="text-sm">{patient.pastSurgeries || 'None reported'}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Age / Gender</p>
                    <p className="text-sm">{patient.age ? `${patient.age} yrs` : 'Unknown'} • {patient.gender || 'Unknown'}</p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
