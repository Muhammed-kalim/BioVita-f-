import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Droplets, AlertCircle, Phone, Stethoscope, Camera, CheckCircle2, ChevronLeft, Loader2, AlertTriangle, QrCode, FileText, Upload, X, FileIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { FaceApiService } from '../services/faceApiService';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebase';
import Navbar from './Navbar';
import Footer from './Footer';
import { useMedicalIdentity } from '../contexts/MedicalIdentityContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const Register = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { registerIdentity } = useMedicalIdentity();
  
  useEffect(() => {
    startCamera();
    FaceApiService.loadModels();
    
    // Supabase Connection Test
    const testConnection = async () => {
      console.log("🔍 [Supabase] Testing connection...");
      try {
        const { data, error } = await supabase.storage.from('images').list();
        if (error) {
          console.error("❌ [Supabase] Connection test failed:", error.message);
        } else {
          console.log("✅ [Supabase] Connection successful. Bucket 'images' is reachable. Found files:", data.length);
        }
      } catch (err) {
        console.error("💥 [Supabase] Connection test exception:", err);
      }
    };
    testConnection();

    // Cleanup: Stop camera stream when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const isStartingRef = useRef(false);

  const startCamera = async (retryCount = 0) => {
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    setCameraError(null);

    try {
      // Stop any existing stream before starting a new one
      if (videoRef.current && videoRef.current.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
        videoRef.current.srcObject = null;
      }

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
        // Wait for video to actually start playing
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
          ? "Camera timeout. Please close other apps using the camera and refresh." 
          : "Camera access denied. Please check your browser permissions.";
        setCameraError(msg);
      }
      return;
    }
    isStartingRef.current = false;
  };
  const captureFrame = (): Promise<File | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current) return resolve(null);
      
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);

      // Draw the current video frame to the canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob then to file
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        console.log("📸 [Frontend] Captured frame from video stream:", file.name);
        resolve(file);
      }, 'image/jpeg', 0.95);
    });
  };
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    allergies: '',
    chronicConditions: '',
    medications: '',
    pastSurgeries: '',
    recentIssues: '',
    emergencyContact: '',
    age: '',
    gender: '',
    doctorHospital: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [reportFiles, setReportFiles] = useState<File[]>([]);
  const [faceImagePreview, setFaceImagePreview] = useState<string | null>(null);
  const [reportPreviews, setReportPreviews] = useState<Array<{ name: string; type: string; url: string }>>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isScanning, setIsScanning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [matchedPatient, setMatchedPatient] = useState<any | null>(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setFaceImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, faceImage: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (!formData.allergies) newErrors.allergies = "Allergy information is required";
    if (!formData.emergencyContact) newErrors.emergencyContact = "Emergency contact is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      alert(`Validation Error: ${firstError}`);
      return;
    }

    let finalFile = file;
    if (!finalFile) {
      console.log("📸 [Supabase] No manual image. Capturing from webcam...");
      finalFile = await captureFrame();
    }

    if (finalFile) {
      setIsScanning(true);
      try {
        console.log("🧬 [Register] Loading face-api models...");
        await FaceApiService.loadModels();
        
        // Load image for face-api
        const img = new Image();
        img.src = URL.createObjectURL(finalFile);
        await new Promise(resolve => img.onload = resolve);
        
        console.log("🧬 [Register] Computing descriptor...");
        const descriptor = await FaceApiService.getFaceDescriptor(img);
        
        if (!descriptor) {
          alert("No face detected in the photo. Please try again.");
          setIsScanning(false);
          return;
        }

        console.log("🧬 [Register] Descriptor success:", descriptor.length, "points");

        // 1. Upload to Supabase Storage
        const fileName = `${Date.now()}-${finalFile.name || 'webcam.jpg'}`;
        console.log("📤 [Supabase] Uploading image:", fileName);
        
        let finalImageUrl = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop"; // fallback
        
        try {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(fileName, finalFile);

          if (uploadError) {
             console.warn("⚠️ [Supabase] Upload failed, proceeding without image URL:", uploadError.message);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('images')
              .getPublicUrl(fileName);
            finalImageUrl = publicUrl;
            console.log("✅ [Supabase] Image URL:", publicUrl);
          }
        } catch (err) {
           console.warn("⚠️ [Supabase] Upload exception:", err);
        }

        console.log("✅ [Finalizing] Image URL:", finalImageUrl);

        // 2. Save to Backend
        const patientData = {
          ...formData,
          faceImageUrl: finalImageUrl,
          faceDescriptor: Array.from(descriptor),
          createdAt: new Date().toISOString()
        };

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/patient/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patientData)
        });

        const result = await response.json();
        if (result.success) {
          console.log("✅ [Register] Success! ID:", result.patientId);
          
          // Link patientId to the current user's profile in Firestore
          const user = auth.currentUser;
          if (user) {
            try {
              const { db } = await import('../lib/firebase');
              const { doc, setDoc } = await import('firebase/firestore');
              // Use setDoc with merge: true to create the document if it doesn't exist
              await setDoc(doc(db, "users", user.uid), {
                patientId: result.patientId,
                updatedAt: new Date().toISOString()
              }, { merge: true });
              console.log("🔗 [Register] Linked patientId to user profile");
            } catch (fsErr: any) {
              console.error("⚠️ [Register] Firestore Link failed (likely permissions):", fsErr.message);
              // We don't want to fail the whole registration just because the profile link failed
              // The patient is already saved in the main 'patients' collection
            }
          }

          setRegisteredId(result.patientId);
          registerIdentity({
            ...formData,
            id: result.patientId,
            faceImageUrl: finalImageUrl,
            reports: reportPreviews.map(r => ({ name: r.name, type: r.type, content: '' }))
          });
          setIsSubmitted(true);
        } else {
          alert("Registration failed: " + result.message);
        }
      } catch (err: any) {
        console.error("❌ [Register] Flow failed:", err);
        alert(`Registration failed: ${err.message}`);
      } finally {
        setIsScanning(false);
      }
    } else {
      alert("Please capture or upload a face image first.");
    }
  };

  const handleReportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsScanning(true);
    const newFiles: File[] = [];
    const newPreviews: Array<{ name: string; type: string; url: string }> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) continue;
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) continue;
      newFiles.push(file);
      newPreviews.push({ name: file.name, type: file.type, url: URL.createObjectURL(file) });
    }
    setReportFiles(prev => [...prev, ...newFiles]);
    setReportPreviews(prev => [...prev, ...newPreviews]);
    setTimeout(() => setIsScanning(false), 800);
  };

  const removeReport = (index: number) => {
    setReportFiles(prev => prev.filter((_, i) => i !== index));
    setReportPreviews(prev => prev.filter((_, i) => i !== index));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-12 rounded-[3rem] text-center max-w-md w-full border-green-500/20"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Medical Identity Created</h2>
            
            {/* QR Code Section */}
            <div className="mb-8 p-6 bg-white rounded-3xl inline-block shadow-[0_0_50px_rgba(34,197,94,0.3)]">
              {(() => {
                const qrUrl = `${window.location.origin}/emergency/${registeredId}`;
                console.log("🔗 [Register] QR Encoding URL:", qrUrl);
                return null;
              })()}
              <QRCodeCanvas 
                value={registeredId ? `${window.location.origin}/emergency/${registeredId}` : 'https://biovita.app'} 
                size={180}
                level="H"
                includeMargin={true}
              />
              <div className="mt-4 text-black text-[10px] font-black uppercase tracking-tighter">
                Patient ID: {registeredId}
              </div>
            </div>

            <p className="text-white/60 mb-8">Your biometric data and medical history have been securely encrypted and stored.</p>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left mb-8">
               <div className="flex items-center gap-3 text-green-500 mb-2">
                 <QrCode className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Emergency QR Ready</span>
               </div>
               <p className="text-[10px] text-white/40 leading-relaxed">
                 You can now access your dashboard. Your unique QR allows doctors to identify you instantly even without a biometric scan.
               </p>
            </div>
            <p className="text-xs text-white/40 animate-pulse">Entering Your Patient Dashboard...</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 text-center md:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 mb-6 uppercase tracking-wider">
              ● Onboarding
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Create Your Medical ID</h1>
            <p className="text-white/60 text-lg">Secure your health information with biometric identification. Access it instantly in emergencies.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* SECTION 1: CRITICAL */}
            <div className="glass p-8 rounded-[2.5rem] space-y-6 border-red-500/20 bg-red-500/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-500">1. Critical Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name" className="text-xs uppercase font-bold tracking-widest text-white/40">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input id="name" required placeholder="Enter your full name" name="name" className="pl-12 bg-white/5 border-white/10 h-12 rounded-xl" value={formData.name} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood" className="text-xs uppercase font-bold tracking-widest text-white/40">Blood Group</Label>
                  <select id="blood" required name="bloodGroup" className="w-full px-4 bg-white/5 border border-white/10 h-12 rounded-xl text-white" value={formData.bloodGroup} onChange={handleChange}>
                    <option value="" disabled className="bg-black text-white/40">Select Group</option>
                    {bloodGroups.map(bg => <option key={bg} value={bg} className="bg-black text-white">{bg}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies" className="text-xs uppercase font-bold tracking-widest text-white/40">Fatal Allergies</Label>
                  <Input id="allergies" required placeholder="e.g. Penicillin, Peanuts" name="allergies" className="bg-white/5 border-white/10 h-12 rounded-xl" value={formData.allergies} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* SECTION 2: IMPORTANT */}
            <div className="glass p-8 rounded-[2.5rem] space-y-6 border-orange-500/20 bg-orange-500/[0.01]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">2. Important History</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meds" className="text-xs uppercase font-bold tracking-widest text-white/40">Current Medications</Label>
                  <Input id="meds" placeholder="e.g. Metformin 500mg" name="medications" className="bg-white/5 border-white/10 h-12 rounded-xl" value={formData.medications} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="surgeries" className="text-xs uppercase font-bold tracking-widest text-white/40">Past Surgeries</Label>
                    <Input id="surgeries" placeholder="None" name="pastSurgeries" className="bg-white/5 border-white/10 h-12 rounded-xl" value={formData.pastSurgeries} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recent" className="text-xs uppercase font-bold tracking-widest text-white/40">Recent Issues</Label>
                    <Input id="recent" placeholder="None" name="recentIssues" className="bg-white/5 border-white/10 h-12 rounded-xl" value={formData.recentIssues} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: HELPFUL */}
            <div className="glass p-8 rounded-[2.5rem] space-y-6 border-yellow-500/20 bg-yellow-500/[0.01]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-yellow-500">3. Helpful Context</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-xs uppercase font-bold tracking-widest text-white/40">Emergency Phone</Label>
                  <Input id="contact" required placeholder="+1 555-0199" name="emergencyContact" className="bg-white/5 border-white/10 h-12 rounded-xl" value={formData.emergencyContact} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-xs uppercase font-bold tracking-widest text-white/40">Age</Label>
                    <Input id="age" type="number" placeholder="25" name="age" className="bg-white/5 border-white/10 h-12 rounded-xl" value={formData.age} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-xs uppercase font-bold tracking-widest text-white/40">Gender</Label>
                    <select id="gender" name="gender" className="w-full px-4 bg-white/5 border border-white/10 h-12 rounded-xl text-white" value={formData.gender} onChange={handleChange}>
                      {genders.map(g => <option key={g} value={g} className="bg-black text-white">{g}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: REPORTS */}
            <div className="glass p-8 rounded-[2.5rem] space-y-6 border-blue-500/20 bg-blue-500/[0.01]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">4. Previous Medical Reports</h3>
              </div>
              <div className="space-y-4">
                <label className="group relative border-2 border-dashed border-white/5 hover:border-blue-500/30 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.02]">
                  <Upload className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="text-sm font-bold text-white/60">Upload Lab Results (Optional)</p>
                  <input type="file" multiple accept=".pdf,image/*" onChange={handleReportUpload} className="hidden" />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reportPreviews.map((report, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-xs font-bold text-white/80 truncate">{report.name}</span>
                      <button type="button" onClick={() => removeReport(idx)} className="text-red-500/40 hover:text-red-500"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 5: BIOMETRICS */}
            <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-red-600/[0.01]">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-500">5. Biometric Identity Enrollment</h3>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 rounded-full glass border-2 border-red-500/20 overflow-hidden mb-6 group">
                  {faceImagePreview ? (
                    <img src={faceImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-60 scale-x-[-1]" />
                  )}
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50 rounded-[3rem]">
                      <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
                      <p className="text-white font-bold uppercase tracking-[0.2em] text-sm animate-pulse">Establishing Secure Identity...</p>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {!faceImagePreview && !videoRef.current?.srcObject && <Camera className="w-8 h-8 text-white/10" />}
                    {cameraError && !faceImagePreview && (
                      <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center pointer-events-auto">
                        <p className="text-[10px] text-red-500 font-bold uppercase leading-tight mb-2">{cameraError}</p>
                        <button 
                          type="button" 
                          onClick={() => startCamera()}
                          className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                          Retry Camera
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4 mb-6">
                  <label className="px-6 py-2 rounded-full border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer">
                    Upload Identity Photo
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {faceImagePreview && (
                    <button type="button" onClick={() => { setFile(null); setFaceImagePreview(null); }} className="text-[10px] text-white/20 hover:text-white underline uppercase tracking-widest">Reset Photo</button>
                  )}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xs font-bold text-white/60">Position your face within the circle</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest max-w-[300px] leading-relaxed mx-auto">
                    AI will capture your biometric markers. No photos are stored; only an encrypted 128-point descriptor.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={isScanning}
              className={`w-full h-16 rounded-3xl font-bold text-lg shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all active:scale-[0.98] ${isScanning ? 'bg-red-900/50 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:scale-[1.02]'}`}
            >
              {isScanning ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Securing Biometric Identity...
                </div>
              ) : (
                "Verify & Complete Setup"
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
