import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Focus, Loader2, Camera, CheckCircle2, ChevronLeft, ShieldAlert, QrCode, Droplets, User } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useMedicalIdentity, MedicalIdentity } from '../contexts/MedicalIdentityContext';
import { FaceApiService } from '../services/faceApiService';

const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

const DoctorScan = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const [scanMode, setScanMode] = useState<'biometric' | 'qr'>('biometric');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'matched'>('idle');
  const { setActiveUser } = useMedicalIdentity();
  const [matchedPatient, setMatchedPatient] = useState<MedicalIdentity | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [registeredId, setRegisteredId] = useState<string | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const isStartingRef = useRef(false);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async (retryCount = 0) => {
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    setCameraError(null);

    try {
      stopCamera(); // Ensure clean state

      console.log(`🎥 [Camera] Initializing (Attempt ${retryCount + 1})...`);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          if (!videoRef.current) return resolve(null);
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            resolve(null);
          };
        });
      }
    } catch (err: any) {
      console.error("❌ [Camera] Access failed:", err);
      isStartingRef.current = false;

      if (err.name === 'AbortError' && retryCount < 2) {
        console.warn(`⚠️ [Camera] Timeout. Retrying in 2s...`);
        setTimeout(() => startCamera(retryCount + 1), 2000);
      } else {
        const msg = err.name === 'AbortError' 
          ? "Camera timeout. Another app might be using it." 
          : "Camera access denied. Please check permissions.";
        setCameraError(msg);
      }
      return;
    }
    isStartingRef.current = false;
  };

  useEffect(() => {
    FaceApiService.loadModels();
    if (scanStep === 'scanning' || scanStep === 'idle') {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [scanStep]);

  const handleStartScan = async () => {
    if (scanMode === 'qr') {
      handleQRScan();
      return;
    }
    
    setIsScanning(true);
    setScanStep('scanning');
    setMatchedPatient(null); // Clear previous result
    
    try {
      await FaceApiService.loadModels();
      
      // Artificial delay for UI effect
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (videoRef.current && videoRef.current.srcObject) {
        // Ensure video is ready
        if (videoRef.current.readyState < 2) {
          await new Promise(resolve => {
            if (videoRef.current) videoRef.current.oncanplay = resolve;
            else resolve(null);
          });
        }

        // Poll for face
        let descriptor = null;
        const startTime = Date.now();
        // Increased timeout from 5s to 15s to allow models to load and user to align face
        while (Date.now() - startTime < 15000) {
          descriptor = await FaceApiService.getFaceDescriptor(videoRef.current);
          if (descriptor) break;
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (!descriptor) {
          alert("No face detected after 15 seconds. Please ensure clear lighting and try again.");
          setScanStep('idle');
          setIsScanning(false);
          return;
        }

        console.log("🧬 [Scanning] Captured Descriptor:", Array.from(descriptor).slice(0, 5));

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/patient/match`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify({ descriptor })
        });

        const resultData = await response.json();

        if (resultData.matchFound) {
          console.log("✅ [Matching] Success:", resultData.patient.name);
          setMatchedPatient(resultData.patient);
          setActiveUser(resultData.patient); // Sync with global context
          setScanStep('matched');
        } else {
          console.warn("🔍 [Matching] No result within threshold.");
          alert("No matching patient found in the database.");
          setScanStep('idle');
        }
      }
    } catch (error) {
      console.error("❌ [Scanning] Doctor Scan Error:", error);
      alert("Biometric scanning failed.");
      setScanStep('idle');
    } finally {
      setIsScanning(false);
    }
  };

  const handleQRScan = async () => {
    setIsScanning(true);
    setScanStep('scanning');
    
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      qrScannerRef.current = html5QrCode;
      
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          console.log("📟 [QR] Decoded Text:\n", decodedText);
          await html5QrCode.stop();
          
          // Extract ID if it's the new URL format, vCard, or fallback to raw text
          let patientId = null;
          
          if (decodedText.includes("/emergency/")) {
            console.log("🔍 [QR] Detected URL format");
            const idMatch = decodedText.match(/\/emergency\/([a-zA-Z0-9_-]+)/);
            if (idMatch) {
              patientId = idMatch[1];
              console.log("✅ [QR] Successfully extracted patientId from URL:", patientId);
            }
          } else if (decodedText.includes("BEGIN:VCARD")) {
            console.log("🔍 [QR] Detected vCard format");
            const idMatch = decodedText.match(/BioVita ID:\s*([a-zA-Z0-9_-]+)/);
            if (idMatch) {
              patientId = idMatch[1];
              console.log("✅ [QR] Successfully extracted patientId from vCard:", patientId);
            } else {
              console.warn("⚠️ [QR] vCard detected but no BioVita ID found in NOTE field.");
            }
          } else {
            console.log("🔍 [QR] Detected raw string format");
            patientId = decodedText.trim();
          }

          if (!patientId) {
             alert("Invalid QR Code: Could not extract patient ID.");
             setScanStep('idle');
             setIsScanning(false);
             return;
          }

          // Fetch specific patient by ID
          console.log(`🌐 [QR] Fetching patient profile for ID: ${patientId}`);
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const response = await fetch(`${API_URL}/api/patient/${patientId}`);
          
          if (response.ok) {
             const match = await response.json();
             console.log("✅ [QR Match] Found:", match.name);
             setMatchedPatient(match);
             setActiveUser(match);
             setScanStep('matched');
          } else {
             alert("QR Code does not match any registered BioVita Patient.");
             setScanStep('idle');
          }
          setIsScanning(false);
        },
        (errorMessage) => {
          // ignore failures
        }
      );
    } catch (err) {
      console.error("QR Error:", err);
      setIsScanning(false);
      setScanStep('idle');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanStep('scanning');
    setMatchedPatient(null);

    try {
      console.log("📸 [Manual Scan] Image selected:", file.name);
      await FaceApiService.loadModels();
      
      // Load image into HTMLImageElement for face-api
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise(resolve => img.onload = resolve);

      const descriptor = await FaceApiService.getFaceDescriptor(img);
      
      if (!descriptor) {
        alert("No face detected in the uploaded photo.");
        setScanStep('idle');
        return;
      }

      console.log("🧬 [Manual Scan] Descriptor captured");
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/patient/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptor })
      });

      const resultData = await response.json();

      if (resultData.matchFound) {
        setMatchedPatient(resultData.patient);
        setActiveUser(resultData.patient);
        setScanStep('matched');
      } else {
        alert("No matching patient found.");
        setScanStep('idle');
      }
    } catch (err) {
      console.error("Manual scan error:", err);
      alert("Failed to process uploaded image.");
      setScanStep('idle');
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanAnother = () => {
    setMatchedPatient(null);
    setScanStep('idle');
  };

  const handleViewResult = () => {
    if (matchedPatient) {
      // Small delay for effect
      setIsScanning(true);
      setTimeout(() => {
        navigate('/doctor/result', { state: { patient: matchedPatient } });
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <Link to="/doctor" className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
              </Link>
              <h1 className="text-4xl font-bold">Biometric Identification</h1>
              <p className="text-white/40 mt-1">Position camera to frame patient's face clearly.</p>
            </div>
            <div className="hidden md:flex items-center gap-3 glass px-4 py-2 rounded-full border-green-500/20">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Scanner Online</span>
            </div>
          </div>

          {/* Scan Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex">
              <button 
                onClick={() => setScanMode('biometric')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${scanMode === 'biometric' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-white/40 hover:text-white'}`}
              >
                <Focus className="w-4 h-4" />
                Biometric Scan
              </button>
              <button 
                onClick={() => setScanMode('qr')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${scanMode === 'qr' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-white/40 hover:text-white'}`}
              >
                <QrCode className="w-4 h-4" />
                QR Code
              </button>
            </div>
          </div>

          <div className="relative aspect-square md:aspect-video max-w-2xl mx-auto rounded-[3rem] overflow-hidden border border-white/10 glass">
            {/* Main Scan Area */}
            <div className="absolute inset-0 z-0">
              {scanMode === 'biometric' ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={`w-full h-full object-cover grayscale opacity-50 transition-all duration-700 ${isScanning ? 'scale-110 blur-sm' : 'scale-100'}`}
                  />
                  {cameraError && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-8 text-center z-50">
                      <div className="space-y-4">
                        <Camera className="w-12 h-12 text-red-500 mx-auto opacity-50" />
                        <p className="text-red-500 font-bold uppercase tracking-widest text-sm">{cameraError}</p>
                        <div className="flex flex-col gap-3">
                          <button onClick={() => startCamera()} className="px-6 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Retry Camera</button>
                          <label className="px-6 py-2 rounded-full border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer">
                            Upload Photo for Scan
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div id="qr-reader" className="w-full h-full grayscale opacity-50"></div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {scanStep === 'idle' && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 flex flex-col items-center gap-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
                    <Scan className="w-24 h-24 text-white/10" />
                  </div>
                  <button 
                    onClick={handleStartScan}
                    className="px-12 py-5 rounded-3xl bg-red-600 text-white font-bold text-xl shadow-[0_0_50px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                  >
                    <Camera className="w-6 h-6" />
                    Initialize Scan
                  </button>
                </motion.div>
              )}

              {scanStep === 'scanning' && (
                <motion.div 
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 flex flex-col items-center gap-8 w-full"
                >
                  <div className="relative w-64 h-64">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500 rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500 rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500 rounded-br-2xl" />
                    
                    {/* Scanning Line */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_20px_#ef4444] z-20"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Focus className="w-16 h-16 text-red-500/30 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                       <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                       <span className="text-xl font-bold tracking-tighter uppercase">Analyzing Facial Markers...</span>
                    </div>
                    <span className="text-xs text-white/30 uppercase tracking-[0.3em]">Querying Sec-Bio Database</span>
                  </div>
                </motion.div>
              )}

              {scanStep === 'matched' && (
                <motion.div 
                  key="matched"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative z-10 w-full max-w-2xl"
                >
                  <div className="text-center mb-10">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 tracking-tighter">IDENTITY CONFIRMED</h2>
                    <p className="text-white/40 text-sm uppercase tracking-widest font-medium">BioVita Universal Registry Match</p>
                  </div>

                  {matchedPatient && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass p-8 rounded-[3rem] border-red-500/30 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-red-500/[0.05] to-transparent"
                    >
                      <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl">
                        <img 
                          src={matchedPatient.faceImageUrl || matchedPatient.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop"} 
                          alt="Match" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Live Identity Verified</span>
                        </div>
                        <h4 className="text-3xl font-bold text-white mb-1">{matchedPatient.name}</h4>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-bold">{matchedPatient.bloodGroup}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/40">
                            <User className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-widest">{matchedPatient.age}Y • {matchedPatient.gender}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button 
                          onClick={handleViewResult} 
                          className="px-8 py-4 bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-red-500/20"
                        >
                          Access Profile
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                          onClick={handleScanAnother} 
                          className="px-8 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all border border-white/10"
                        >
                          Scan Another
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Guidance */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass p-8 rounded-[2.5rem] border-white/5 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                   <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                   <h4 className="font-bold mb-1">Authorization Active</h4>
                   <p className="text-xs text-white/40 leading-relaxed">Your medical credentials are currently active. All scan results are decryption-verified.</p>
                </div>
             </div>
             <div className="glass p-8 rounded-[2.5rem] border-white/5 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                   <Scan className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                   <h4 className="font-bold mb-1">Scanning Advice</h4>
                   <p className="text-xs text-white/40 leading-relaxed">Ensure direct lighting and clear visibility of the patient's face for maximum accuracy.</p>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0% }
          100% { top: 100% }
        }
      `}} />
    </div>
  );
};

export default DoctorScan;
