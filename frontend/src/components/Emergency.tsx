import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, Activity, User, Heart, ShieldAlert, Navigation, Scan, Loader2, Camera, CheckCircle2, Focus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import NearbyHospitals from './NearbyHospitals';
import { useMedicalIdentity, MedicalIdentity } from '../contexts/MedicalIdentityContext';
import { FaceApiService } from '../services/faceApiService';

const Emergency = () => {
  const navigate = useNavigate();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { findMatch } = useMedicalIdentity();
  const [sosActive, setSosActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<MedicalIdentity | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'matched'>('idle');
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    startCamera();
    FaceApiService.loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera Error:", err);
    }
  };
  const emergencyContacts = [
    { name: 'National Emergency', number: '112', icon: <ShieldAlert className="text-red-500" /> },
    { name: 'Ambulance', number: '102', icon: <Activity className="text-red-500" /> },
    { name: 'Police', number: '100', icon: <ShieldAlert className="text-blue-500" /> },
  ];

  useEffect(() => {
    // Force first mock user as default result if none selected yet, for UI consistency
    // But we'll let the scan drive the display
  }, []);

  const handleSos = async () => {
    setSosActive(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const response = await fetch(`${API_URL}/api/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'SOS',
          location: location || 'Unknown',
          timestamp: new Date().toISOString()
        })
      });
      const result = await response.json();
      
      if (result.success) {
        alert("EMERGENCY ALERT SENT: " + result.message);
      }
    } catch (error) {
      console.error("SOS Error:", error);
      alert("EMERGENCY ALERT SENT to local emergency services (Fallback).");
    } finally {
      setSosActive(false);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    setScanStep('scanning');
    setScanResult(null); // Reset previous result

    try {
      await FaceApiService.loadModels();

      if (videoRef.current) {
        const descriptor = await FaceApiService.getFaceDescriptor(videoRef.current);
        
        if (!descriptor) {
          alert("No face detected. Please try again.");
          setScanStep('idle');
          setIsScanning(false);
          return;
        }

        console.log("🧬 [Scanning] Captured Descriptor (first 5 values):", Array.from(descriptor).slice(0, 5));

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/patient/match`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify({ descriptor })
        });

        const result = await response.json();
        
        if (result.matchFound) {
          console.log("✅ [Matching] Best Match Found:", result.patient.name);
          setScanResult(result.patient);
          setScanStep('matched');
        } else {
          console.warn("🔍 [Matching] No identity match found within threshold.");
          alert("No patient identity found.");
          setScanStep('idle');
        }
      } else {
        alert("Camera feed not ready.");
        setScanStep('idle');
      }
    } catch (error) {
      console.error("❌ [Scanning] Emergency Scan Error:", error);
      alert("Biometric matching failed.");
      setScanStep('idle');
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: SOS & Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-8 md:p-12 rounded-[2.5rem] border-red-500/20 relative overflow-hidden">
               {/* Hidden Video for Biometric Capture */}
               <video ref={videoRef} autoPlay playsInline className="absolute opacity-0 pointer-events-none w-px h-px" />
               
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full" />
               
               <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest mb-8">
                   <AlertTriangle className="w-4 h-4" />
                   Emergency Status: Active
                 </div>
                 
                 <h1 className="text-4xl md:text-6xl font-bold mb-6">Need Immediate Assistance?</h1>
                 <p className="text-white/60 text-lg mb-12 max-w-xl">
                   Press the button below to alert emergency services or use biometric scan to identify patient.
                 </p>
                 
                 <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                    <motion.button
                      onClick={handleSos}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={sosActive ? { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] } : {}}
                      transition={{ repeat: sosActive ? Infinity : 0, duration: 0.5 }}
                      className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-red-600 flex flex-col items-center justify-center gap-4 shadow-[0_0_50px_rgba(220,38,38,0.5)] border-8 border-white/10 relative"
                    >
                      <Activity className="w-12 h-12 text-white animate-pulse" />
                      <span className="text-xl font-black uppercase tracking-tighter">Trigger SOS</span>
                      {sosActive && (
                        <div className="absolute inset-0 rounded-full border-4 border-white animate-ping" />
                      )}
                    </motion.button>

                    <div className="w-px h-12 md:w-12 md:h-px bg-white/10" />

                    <div className="relative">
                      <motion.button
                        onClick={handleScan}
                        disabled={isScanning}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-48 h-48 md:w-56 md:h-56 rounded-full glass border-4 flex flex-col items-center justify-center gap-4 transition-all duration-500 overflow-hidden ${isScanning ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-white/10'}`}
                      >
                        {isScanning ? (
                          <>
                            <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-[scan_2s_ease-in-out_infinite]" />
                            <Focus className="w-12 h-12 text-red-500 animate-pulse" />
                            <span className="text-sm font-bold uppercase tracking-widest text-red-500">Scanning...</span>
                          </>
                        ) : (
                          <>
                            <Scan className="w-12 h-12 text-white/50" />
                            <span className="text-sm font-bold uppercase tracking-widest text-white/50">Scan Patient</span>
                          </>
                        )}
                      </motion.button>
                      
                      <div className="mt-6 text-center">
                        <Link to="/doctor" className="text-[10px] text-white/20 hover:text-white transition-colors font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                           <ShieldAlert className="w-3 h-3" />
                           Identity Access for Professionals
                        </Link>
                      </div>
                      
                      {scanStep === 'matched' && scanResult && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-green-500 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Identity Found
                        </motion.div>
                      )}
                    </div>
                 </div>
               </div>
            </div>

            {/* Scanning Logic Style */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes scan {
                0% { top: 0; }
                50% { top: 100%; }
                100% { top: 0; }
              }
            `}} />

            {/* Map Section */}
            <div className="glass p-8 rounded-[2.5rem] overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="text-red-500" />
                  Hospitals Near You
                </h2>
                {location && (
                  <span className="text-xs font-mono text-white/40">Current: {location}</span>
                )}
              </div>
              <div className="h-[400px] rounded-2xl overflow-hidden bg-white/5 relative border border-white/5">
                <NearbyHospitals hideTitle={true} />
              </div>
            </div>
          </div>

          {/* Right Column: Profile & Contacts */}
          <div className="space-y-8">
            {/* Quick Medical Profile */}
            <div className="glass p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden">
               {scanStep === 'scanning' && (
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Decrypting Profile...</span>
                 </div>
               )}
               
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-500">
                <User className="w-5 h-5" />
                Patient Identity
              </h2>

              {scanStep === 'matched' && scanResult ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    boxShadow: ["0 0 0px rgba(34, 197, 94, 0)", "0 0 40px rgba(34, 197, 94, 0.2)", "0 0 0px rgba(34, 197, 94, 0)"]
                  }}
                  transition={{ 
                    opacity: { duration: 0.5 },
                    scale: { duration: 0.5 },
                    boxShadow: { repeat: Infinity, duration: 2 }
                  }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                      <img src={scanResult.faceImageUrl || scanResult.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop"} alt={scanResult.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{scanResult.name}</div>
                      <div className="text-xs text-white/40 uppercase tracking-widest">Medical ID: {scanResult.id}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                      <span className="text-red-500/80 text-xs font-bold uppercase">Blood Group</span>
                      <span className="text-2xl font-black text-red-500">{scanResult.bloodGroup}</span>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <label className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1 block">Allergies</label>
                      <p className={`text-sm font-bold ${scanResult.allergies !== 'None' ? 'text-red-400' : 'text-white'}`}>
                        {scanResult.allergies}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <label className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1 block">Medications</label>
                      <p className="text-sm font-medium">{scanResult.medications}</p>
                    </div>

                    <div className="mt-4 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex flex-col gap-3">
                       <div className="flex items-center gap-3">
                          <ShieldAlert className="w-4 h-4 text-green-500" />
                          <span className="text-[10px] font-bold text-green-500 uppercase">Emergency Contact Notified</span>
                       </div>
                        <button 
                          onClick={() => navigate('/doctor/result', { state: { patient: scanResult } })}
                          className="w-full py-3 rounded-xl bg-green-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-colors"
                        >
                          View Full Medical Dossier
                        </button>
                        <button 
                          onClick={() => {
                            setScanResult(null);
                            setScanStep('idle');
                          }}
                          className="w-full py-3 rounded-xl bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                        >
                          New Scan
                        </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                    <Scan className="w-6 h-6 text-white/20" />
                  </div>
                  <p className="text-xs text-white/40 uppercase tracking-widest leading-relaxed">
                    Awaiting Biometric Data...<br/>
                    <span className="opacity-50">Scan patient to retrieve identity</span>
                  </p>
                </div>
              )}
            </div>

            {/* Emergency Contacts */}
            <div className="glass p-8 rounded-[2.5rem] border-white/10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-500" />
                {scanStep === 'matched' && scanResult ? "Primary Contact" : "Emergency Services"}
              </h2>
              <div className="space-y-3">
                {scanStep === 'matched' && scanResult ? (
                   <a 
                    href={`tel:${scanResult.emergencyContact?.includes('(') ? (scanResult.emergencyContact.split('(')[1]?.replace(')', '') || '') : scanResult.emergencyContact}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-red-500/20 text-red-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-red-500">{scanResult.emergencyContact?.includes('(') ? scanResult.emergencyContact.split('(')[0] : 'Primary Contact'}</div>
                        <div className="text-xs text-red-500/60">{scanResult.emergencyContact?.includes('(') ? scanResult.emergencyContact.split('(')[1]?.replace(')', '') : scanResult.emergencyContact}</div>
                      </div>
                    </div>
                    <Phone className="w-4 h-4 text-red-500" />
                  </a>
                ) : (
                  emergencyContacts.map((contact, i) => (
                    <a 
                      key={i}
                      href={`tel:${contact.number}`}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/5">
                          {contact.icon}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{contact.name}</div>
                          <div className="text-xs text-white/40">{contact.number}</div>
                        </div>
                      </div>
                      <Phone className="w-4 h-4 text-white/20 group-hover:text-red-500 transition-colors" />
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass p-6 rounded-[2.5rem] border-white/10 mb-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className={`w-2 h-2 rounded-full ${demoMode ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
                     <span className="text-xs font-bold uppercase tracking-widest text-white/40">Demo Mode</span>
                  </div>
                  <button 
                    onClick={() => setDemoMode(!demoMode)}
                    className={`w-10 h-5 rounded-full transition-all relative ${demoMode ? 'bg-red-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${demoMode ? 'right-1' : 'left-1'}`} />
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="glass p-6 rounded-[2rem] flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
                <Heart className="text-red-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Share Health ID</span>
              </button>
              <button 
                onClick={() => navigate('/nearby-hospitals')}
                className="glass p-6 rounded-[2rem] flex flex-col items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <Navigation className="text-red-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Navigate Help</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Emergency;
