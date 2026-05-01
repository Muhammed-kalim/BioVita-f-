import * as React from "react";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  AlertTriangle, 
  QrCode, 
  Bot, 
  Activity, 
  AlertCircle, 
  MessageSquare, 
  Settings,
  Bell,
  Search,
  Plus,
  Upload,
  Share2,
  ChevronRight,
  Send,
  Phone,
  Shield,
  Clock,
  Heart,
  Thermometer,
  Droplets,
  User,
  Menu,
  X,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUploadCard, UploadingFile } from "@/components/ui/file-upload-card";
import { SearchBar } from "@/components/ui/search-bar";
import { useToast } from "@/lib/toast-context";
import { StackedList } from "@/components/ui/stacked-list";
import { useLanguage } from "@/contexts/LanguageContext";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { recordService, HealthRecord } from "@/services/recordService";
import { GoogleGenAI } from "@google/genai";
import { TextRoll } from "@/components/ui/animated-menu";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { Logo } from "@/components/ui/Logo";

// --- Types ---

type Section = 
  | "Dashboard" 
  | "Records" 
  | "Timeline"
  | "Allergies" 
  | "QR Share" 
  | "AI Assistant" 
  | "Vitals" 
  | "Nearby"
  | "Emergency" 
  | "Chat" 
  | "Settings";

interface NavItem {
  label: Section;
  icon: React.ElementType;
  key: string;
}

// --- Mock Data ---

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, key: 'nav_dashboard' },
  { label: "Records", icon: FileText, key: 'nav_records' },
  { label: "QR Share", icon: QrCode, key: 'nav_qr_share' },
  { label: "AI Assistant", icon: Bot, key: 'nav_ai_assistant' },
  { label: "Nearby", icon: Share2, key: 'nav_nearby' },
  { label: "Emergency", icon: AlertCircle, key: 'nav_emergency' },
  { label: "Chat", icon: MessageSquare, key: 'nav_chat' },
  { label: "Settings", icon: Settings, key: 'nav_settings' },
];

// --- Components ---

const Card = ({ children, className, glow = false, ...props }: { children: React.ReactNode, className?: string, glow?: boolean } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(
    "glass relative overflow-hidden rounded-2xl p-5 md:p-6 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10",
    glow && "shadow-[0_0_30px_rgba(99,102,241,0.1)]",
    className
  )} {...props}>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle, action }: { title: string, subtitle?: string, action?: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">{title}</h2>
      {subtitle && <p className="text-secondary mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// --- Section Views ---

import { healthService, Vital, Allergy } from "@/services/healthService";

const DashboardView = ({ setActiveSection }: { setActiveSection: (section: Section) => void }) => {
  const { t } = useLanguage();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubRecords = recordService.subscribeToUserRecords(user.uid, setRecords);
    const unsubVitals = healthService.subscribeToVitals(user.uid, setVitals);
    const unsubAllergies = healthService.subscribeToAllergies(user.uid, setAllergies);

    setIsLoading(false);

    return () => {
      unsubRecords();
      unsubVitals();
      unsubAllergies();
    };
  }, []);

  const latestVital = vitals[0];
  const highSeverityAllergies = allergies.filter(a => a.severity === "High");

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-secondary">{t('dash_loading')}...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">{t('dash_alerts')}</p>
            <p className="text-2xl font-bold text-white tracking-tight">{highSeverityAllergies.length} {t('dash_pending')}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <FileText className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">{t('dash_records')}</p>
            <p className="text-2xl font-bold text-white tracking-tight">{records.length} {t('dash_files')}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Clock className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">{t('dash_last_sync')}</p>
            <p className="text-2xl font-bold text-white tracking-tight">
              {records[0]?.createdAt ? "Just now" : "No data"}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/40">
            <Activity className="size-6" />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">{t('dash_health_score')}</p>
            <p className="text-2xl font-bold text-white tracking-tight">
              {latestVital ? "Stable" : "N/A"}
            </p>
          </div>
        </Card>
      </div>

    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2 tracking-tight">
          <Bell className="size-5 text-white/40" />
          {t('dash_health_alerts')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-red-500/20 bg-red-500/5 group hover:border-red-500/40">
            <div className="flex items-start justify-between mb-4">
              <div className="size-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                <AlertTriangle className="size-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400/60">{highSeverityAllergies.length} {t('dash_active_allergies')}</span>
            </div>
            <h4 className="font-bold text-white mb-3 tracking-tight">{t('dash_allergies')}</h4>
            <div className="space-y-2">
              {allergies.slice(0, 3).map((allergy, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-sm font-medium text-white">{allergy.name}</span>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                    allergy.severity === "High" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                  )}>
                    {allergy.severity}
                  </span>
                </div>
              ))}
              {allergies.length === 0 && (
                <p className="text-xs text-secondary py-2">No allergies reported.</p>
              )}
            </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 p-0 h-auto font-bold text-xs uppercase tracking-widest"
                onClick={() => setActiveSection("Allergies")}
              >
                {t('dash_manage_all')} <ChevronRight className="size-3 ml-1" />
              </Button>
          </Card>
          <Card className="border-white/10 glass group hover:border-white/20">
            <div className="flex items-start justify-between mb-4">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Activity className="size-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('dash_monitoring')}</span>
            </div>
            <h4 className="font-bold text-white mb-1 tracking-tight">
              {latestVital ? `${latestVital.heartRate} BPM` : t('dash_vitals_stable')}
            </h4>
            <p className="text-sm text-secondary">
              {latestVital ? `Last updated: ${new Date(latestVital.timestamp).toLocaleTimeString()}` : t('dash_vitals_desc')}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4 text-white hover:text-white/80 hover:bg-white/5 p-0 h-auto font-bold text-xs uppercase tracking-widest"
              onClick={() => setActiveSection("Vitals")}
            >
              {t('dash_check_vitals')} <ChevronRight className="size-3 ml-1" />
            </Button>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white/80 tracking-tight">{t('dash_recent_activity')}</h3>
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-white/5">
            {records.slice(0, 3).map((record) => (
              <div key={record.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn("size-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500")}>
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white tracking-tight">{t('dash_uploaded_report')}</p>
                    <p className="text-xs text-secondary">{record.fileName}</p>
                  </div>
                </div>
                <span className="text-xs text-white/20 font-medium">
                  {record.createdAt?.toDate ? record.createdAt.toDate().toLocaleDateString() : 'Just now'}
                </span>
              </div>
            ))}
            {records.length === 0 && (
              <div className="p-8 text-center text-secondary text-sm">
                No recent activity found.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  </div>
  );
};

const RecordsView = ({ setActiveSection }: { setActiveSection: (section: Section) => void }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(t('rec_all_records'));
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = recordService.subscribeToUserRecords(user.uid, (fetchedRecords) => {
      setRecords(fetchedRecords);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFilesSelected = (files: File[]) => {
    const user = auth.currentUser;
    if (!user) return;

    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadingFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach(async (fileObj) => {
      try {
        // In a real app, we would upload to Storage first.
        // For this demo, we'll use a placeholder URL.
        const fileUrl = `https://placeholder.com/${fileObj.file.name}`;
        
        // Determine type based on category or filename
        let type = "Lab Report";
        if (fileObj.file.name.toLowerCase().includes("scan") || fileObj.file.name.toLowerCase().includes("xray")) type = "Scan";
        if (fileObj.file.name.toLowerCase().includes("prescription")) type = "Prescription";

        await recordService.uploadRecord(user.uid, {
          fileName: fileObj.file.name,
          type: type,
          fileUrl: fileUrl
        });

        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id ? { ...f, progress: 100, status: "completed" } : f
          )
        );

        toast({
          title: t('rec_file_uploaded'),
          message: `${fileObj.file.name} ${t('rec_upload_success')}`,
          variant: "success",
        });
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id ? { ...f, status: "error", error: "Upload failed" } : f
          )
        );
        toast({
          title: "Upload Failed",
          message: `Could not upload ${fileObj.file.name}`,
          variant: "error",
        });
      }
    });
  };

  const handleFileRemove = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === t('rec_all_records') || record.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-start">
        <Button 
          variant="outline" 
          onClick={() => setActiveSection("Timeline")}
          className="rounded-xl px-6 whitespace-nowrap font-bold border-white/5 bg-white/5 hover:bg-white/10 gap-2"
        >
          <Clock className="size-4" /> {t('rec_view_timeline')}
        </Button>
      </div>
      <SectionHeader title={t('rec_medical_records')} subtitle={t('rec_medical_records_desc')} />
      
      <FileUploadCard 
        onFilesSelected={handleFilesSelected}
        onFileRemove={handleFileRemove}
        uploadingFiles={uploadingFiles}
        className="max-w-none"
      />

      <div className="space-y-6">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
          {[t('rec_all_records'), t('rec_prescriptions'), t('rec_lab_reports'), t('rec_scans'), t('rec_vaccinations')].map((cat) => (
            <Button 
              key={cat} 
              variant={activeCategory === cat ? "default" : "outline"} 
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-xl px-6 whitespace-nowrap font-bold",
                activeCategory === cat ? "bg-white text-black hover:bg-white/90" : "border-white/5 bg-white/5 hover:bg-white/10"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-secondary font-medium animate-pulse">
              {t('dash_loading')}...
            </div>
          ) : filteredRecords.length > 0 ? (
            filteredRecords.map((file) => (
              <Card key={file.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                    <FileText className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm tracking-tight">{file.fileName}</h4>
                    <p className="text-xs text-secondary">
                      {file.type} • {file.createdAt?.toDate ? file.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={file.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="size-10 rounded-lg flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Share2 className="size-4" />
                  </a>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-emerald-400/40 hover:text-emerald-400"
                    onClick={() => {
                      toast({
                        title: t('rec_processing'),
                        message: `${t('rec_extracting')} ${file.fileName}...`,
                        variant: "default",
                      });
                      setTimeout(() => {
                        toast({
                          title: t('rec_extracted'),
                          message: t('rec_processed_success'),
                          variant: "success",
                        });
                      }, 2000);
                    }}
                  >
                    <Activity className="size-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-secondary font-medium">
              {t('rec_no_records')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AllergiesView = () => {
  const { t } = useLanguage();
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = healthService.subscribeToAllergies(user.uid, (data) => {
      setAllergies(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader 
        title={t('all_title')} 
        subtitle={t('all_subtitle')}
        action={<Button className="bg-white text-black hover:bg-white/90 rounded-xl px-6 gap-2 font-bold"><Plus className="size-4" /> {t('all_add')}</Button>}
      />
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="py-12 text-center text-secondary font-medium animate-pulse">
            {t('dash_loading')}...
          </div>
        ) : allergies.length > 0 ? (
          allergies.map((allergy) => (
            <Card key={allergy.id} className={cn(
              "border-l-4",
              allergy.severity === "High" ? "border-red-500/20" : allergy.severity === "Medium" ? "border-orange-500/20" : "border-blue-500/20"
            )}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "size-12 rounded-2xl flex items-center justify-center",
                    allergy.severity === "High" ? "bg-red-500/10 text-red-400" : allergy.severity === "Medium" ? "bg-orange-500/10 text-orange-400" : "bg-blue-500/10 text-blue-400"
                  )}>
                    <AlertTriangle className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">{allergy.name}</h4>
                    <p className="text-sm text-secondary">{t('all_severity')}: <span className={cn(
                      "font-bold",
                      allergy.severity === "High" ? "text-red-400" : allergy.severity === "Medium" ? "text-orange-400" : "text-blue-400"
                    )}>{allergy.severity}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">{t('all_reaction')}</p>
                    <p className="text-sm text-white/60 font-medium">{allergy.reaction}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-12 text-center text-secondary font-medium">
            No allergies reported.
          </div>
        )}
      </div>
    </div>
  );
};

const QRShareView = ({ profile }: { profile: any }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <SectionHeader title="Emergency QR Share" subtitle="Grant temporary access to medical profiles in emergencies" />
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div className="flex flex-col items-center justify-center p-8 glass rounded-[3rem] border border-white/10">
        <div className="p-4 bg-white rounded-3xl mb-6">
          {profile?.patientId ? (
            <QRCodeCanvas value={`${window.location.origin}/emergency/${profile.patientId}`} size={256} level="H" />
          ) : (
            <div className="size-64 flex flex-col items-center justify-center text-black text-center p-6 bg-gray-100 rounded-2xl">
              <QrCode className="size-16 mb-4 opacity-20" />
              <p className="text-sm font-bold">Medical Identity Not Registered</p>
              <p className="text-[10px] opacity-60 mt-1">Please complete your onboarding to generate a QR code.</p>
            </div>
          )}
        </div>
        <p className="text-white font-bold text-xl mb-2">Scan to access profile</p>
        <p className="text-secondary text-sm font-medium">Valid for: {profile?.displayName || profile?.name || "User"}</p>
        <p className="text-[10px] text-white/20 mt-2 font-mono">
          {profile?.patientId ? `Patient ID: ${profile.patientId}` : `UID: ${profile?.uid || "..."}`}
        </p>
      </div>

      <div className="space-y-6">
        <Card className="glass border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Share Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Temporary Access</p>
                <p className="text-sm text-secondary">Link expires automatically</p>
              </div>
              <Checkbox id="temp-access" defaultChecked className="size-6 rounded-lg border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Access Duration</Label>
              <div className="grid grid-cols-3 gap-2">
                {["1 Hour", "24 Hours", "7 Days"].map((time) => (
                  <Button key={time} variant="outline" className={cn(
                    "rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold",
                    time === "24 Hours" && "border-white/40 bg-white/10 text-white"
                  )}>
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <Button className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-white/90 font-bold gap-2">
                <Share2 className="size-4" /> Share Link
              </Button>
              <Button variant="outline" className="flex-1 h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold">
                Download PNG
              </Button>
            </div>
          </div>
        </Card>

        {!profile?.patientId && (
          <Card className="border-red-500/20 bg-red-500/[0.02]">
             <div className="flex gap-4">
                <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                   <AlertCircle className="size-5" />
                </div>
                <div>
                   <h4 className="font-bold text-white mb-1 text-sm">Registration Required</h4>
                   <p className="text-[10px] text-secondary leading-relaxed mb-4">You need to register your medical identity to use emergency QR sharing features.</p>
                   <Link to="/patient/register" className="text-red-500 font-bold text-[10px] uppercase tracking-widest hover:underline">Complete Onboarding Now</Link>
                </div>
             </div>
          </Card>
        )}
        
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
          <Shield className="size-5 text-emerald-400" />
          <p className="text-xs text-white/40 font-medium">Your data is encrypted and only accessible via this secure token.</p>
        </div>
      </div>
    </div>
  </div>
);

const AIAssistantView = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your BioVita Assistant. I have analyzed your recent health data. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    console.log("Sending message:", text);
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: text,
        config: {
          systemInstruction: "You are BioVita Assistant, a helpful medical intelligence. Provide clear, concise health advice based on user queries. Always remind users to consult a doctor for serious concerns."
        }
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that request.";
      console.log("AI Response:", aiResponse);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader title="AI Health Assistant" subtitle="Your personal medical intelligence, available 24/7" />
      
      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-white/5 glass">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-4", msg.role === 'user' && "justify-end")}>
              {msg.role === 'assistant' && (
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Bot className="size-6 text-white" />
                </div>
              )}
              <div className={cn(
                "p-4 max-w-[80%] rounded-2xl border border-white/5",
                msg.role === 'assistant' ? "bg-white/5 rounded-tl-none text-white/80" : "bg-white text-black rounded-tr-none font-medium"
              )}>
                <p className="leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <User className="size-6 text-white" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Bot className="size-6 text-white" />
              </div>
              <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 border border-white/5">
                <p className="text-white/40 animate-pulse">Assistant is thinking...</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <div className="flex gap-4 mb-4 overflow-x-auto no-scrollbar">
            {["Check my symptoms", "Should I visit a doctor?", "Explain blood report", "Medication reminder"].map((prompt) => (
              <button 
                key={prompt} 
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white hover:bg-white/10 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="relative">
            <Input 
              className="h-14 bg-black/40 border-white/10 rounded-2xl pl-6 pr-14 text-white" 
              placeholder="Ask about symptoms, reports, or advice..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
            />
            <Button 
              size="icon" 
              onClick={() => handleSend()}
              className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-white text-black hover:bg-white/90"
            >
              <Send className="size-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const VitalsView = () => {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = healthService.subscribeToVitals(user.uid, (data) => {
      setVitals(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const latestVital = vitals[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader title="Real-time Vitals" subtitle="Continuous monitoring of your health metrics" />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse h-32 bg-white/5">
              <div className="size-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Heart className="size-6" />
              </div>
              <span className="text-xs font-bold text-emerald-400">Stable</span>
            </div>
            <p className="text-3xl font-bold text-white">{latestVital?.heartRate || "--"} <span className="text-sm font-medium text-white/40">BPM</span></p>
            <p className="text-xs text-white/40 mt-1">Heart Rate</p>
          </Card>
          <Card className="border-white/10 bg-white/5 glass">
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Thermometer className="size-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Normal</span>
            </div>
            <p className="text-3xl font-bold text-white">{latestVital?.temperature || "--"} <span className="text-sm font-medium text-secondary">°F</span></p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">Body Temperature</p>
          </Card>
          <Card className="border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Droplets className="size-6" />
              </div>
              <span className="text-xs font-bold text-blue-400">Normal</span>
            </div>
            <p className="text-3xl font-bold text-white">{latestVital?.oxygenLevel || "--"} <span className="text-sm font-medium text-white/40">%</span></p>
            <p className="text-xs text-white/40 mt-1">Oxygen Level (SpO2)</p>
          </Card>
        </div>
      )}

      <Card className="h-[400px] p-6 glass border-white/10">
        <h3 className="text-lg font-bold text-white mb-6">Heart Rate History</h3>
        {vitals.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[...vitals].reverse()}>
              <defs>
                <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="timestamp" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
              <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
                labelFormatter={(val) => new Date(val).toLocaleString()}
              />
              <Area type="monotone" dataKey="heartRate" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorBpm)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-secondary text-sm">
            No history available.
          </div>
        )}
      </Card>
    </div>
  );
};

const EmergencyView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <SectionHeader title="Emergency SOS" subtitle="Immediate actions for critical situations" />
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col items-center justify-center space-y-8 py-12">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="size-64 rounded-full bg-red-600 shadow-[0_0_80px_rgba(220,38,38,0.4)] flex items-center justify-center text-white relative group"
        >
          <div className="absolute inset-0 rounded-full border-8 border-white/20 animate-ping duration-[2000ms]" />
          <div className="flex flex-col items-center">
            <AlertCircle className="size-20 mb-2" />
            <span className="text-2xl font-black uppercase tracking-tighter">SOS</span>
          </div>
        </motion.button>
        <p className="text-white/60 font-medium text-center max-w-xs">Press and hold for 3 seconds to alert emergency services.</p>
      </div>

      <div className="space-y-6">
        <StackedList />

        <Card className="glass border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <QrCode className="size-8 text-white" />
            <h4 className="font-bold text-lg text-white">Instant QR Access</h4>
          </div>
          <p className="text-sm font-medium text-secondary mb-6">Display your medical profile QR code on lock screen for first responders.</p>
          <Button className="w-full bg-white text-black hover:bg-white/90 font-bold rounded-xl h-12">Enable Lock Screen Widget</Button>
        </Card>
      </div>
    </div>
  </div>
);

const ChatView = ({ doctors }: { doctors: any[] }) => (
  <div className="h-[calc(100vh-12rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
    <SectionHeader title="Medical Chat" subtitle="Direct communication with your healthcare providers" />
    
    <div className="flex-1 flex gap-6 overflow-hidden">
      <Card className="w-80 hidden lg:flex flex-col p-0 border-white/5">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
            <Input className="bg-white/5 border-white/5 pl-10 rounded-xl h-10 text-sm" placeholder="Search chats..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {doctors.map((doctor, i) => (
            <div key={doctor.uid} className={cn(
              "p-4 flex items-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors",
              i === 0 && "bg-white/5 border-r-2 border-white"
            )}>
              <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                {doctor.photoURL ? (
                  <img src={doctor.photoURL} alt={doctor.displayName} className="size-full rounded-xl object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="size-6 text-white/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-sm font-bold text-white truncate">{doctor.displayName}</h4>
                  <span className="text-[10px] text-white/20">Online</span>
                </div>
                <p className="text-xs text-white/40 truncate">{doctor.email}</p>
              </div>
            </div>
          ))}
          {doctors.length === 0 && (
            <div className="p-8 text-center text-secondary text-sm">
              No linked doctors found.
            </div>
          )}
        </div>
      </Card>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-white/5">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              {doctors[0]?.photoURL ? (
                <img src={doctors[0].photoURL} alt={doctors[0].displayName} className="size-full rounded-xl object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="size-6" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{doctors[0]?.displayName || "Select a Doctor"}</h4>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="text-white/20 hover:text-white"><Phone className="size-4" /></Button>
            <Button size="icon" variant="ghost" className="text-white/20 hover:text-white"><Settings className="size-4" /></Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          <div className="flex gap-4">
            <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <User className="size-5 text-white/40" />
            </div>
            <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[70%] border border-white/5">
              <p className="text-sm text-white/80 leading-relaxed">Hello, I've reviewed your latest records. Everything looks stable.</p>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <div className="bg-white text-black rounded-2xl rounded-tr-none p-4 max-w-[70%]">
              <p className="text-sm font-medium leading-relaxed">Thank you doctor. I'll keep monitoring my vitals.</p>
            </div>
          </div>
        </div>

          <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <div className="relative">
            <Input className="h-14 bg-black/40 border-white/10 rounded-2xl pl-6 pr-14 text-white" placeholder="Type a message..." />
            <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-white text-black hover:bg-white/90">
              <Send className="size-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const SettingsView = ({ profile }: { profile: any }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || "",
    email: profile?.email || "",
    phoneNumber: profile?.phoneNumber || "",
    location: profile?.location || "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
      });
      toast({ title: "Success", message: "Profile updated successfully!", variant: "success" });
    } catch (error: any) {
      toast({ title: "Error", message: error.message || "Failed to update profile", variant: "error" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader title="Settings" subtitle="Manage your account preferences and security" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-white mb-6">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Full Name</Label>
              <Input 
                className="bg-white/5 border-white/5 rounded-xl h-12" 
                value={formData.displayName} 
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Email Address</Label>
              <Input className="bg-white/5 border-white/5 rounded-xl h-12" value={formData.email} disabled />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Phone Number</Label>
              <Input 
                className="bg-white/5 border-white/5 rounded-xl h-12" 
                value={formData.phoneNumber} 
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Location</Label>
              <Input 
                className="bg-white/5 border-white/5 rounded-xl h-12" 
                value={formData.location} 
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSave} className="mt-8 bg-white text-black hover:bg-white/90 rounded-xl px-8 font-bold">Save Changes</Button>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-6">Security</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Two-Factor Authentication</p>
                <p className="text-sm text-secondary">Add an extra layer of security to your account</p>
              </div>
              <Checkbox className="size-6 rounded-lg border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
            </div>
            <div className="pt-4">
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 rounded-xl">Change Password</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-6">Notifications</h3>
          <div className="space-y-4">
            {[
              { label: "Health Alerts", desc: "Critical vitals and allergy alerts" },
              { label: "Reminders", desc: "Medication and appointment reminders" },
              { label: "New Records", desc: "When a new report is uploaded" },
              { label: "AI Insights", desc: "Weekly health summary reports" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-[10px] text-white/40">{item.desc}</p>
                </div>
                <Checkbox defaultChecked className="size-5 rounded-md border-white/10 data-[state=checked]:bg-white data-[state=checked]:text-black" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-red-500/5 border-red-500/20">
          <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
          <p className="text-sm text-white/40 mb-6">Irreversibly delete your account and all health data.</p>
          <Button variant="outline" className="w-full border-red-500/20 hover:bg-red-500/10 text-red-400 font-bold rounded-xl">Delete Account</Button>
        </Card>
      </div>
    </div>
  </div>
  );
};

const TimelineView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <SectionHeader title="Health Timeline" subtitle="A chronological view of your health journey" />
    
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
      {[
        { date: "Mar 24, 2024", title: "Blood Test Uploaded", desc: "You uploaded a new comprehensive blood report.", icon: FileText, color: "bg-blue-500" },
        { date: "Mar 20, 2024", title: "Mild Fever Detected", desc: "Your temperature rose to 100.2°F. Monitored for 6 hours.", icon: Activity, color: "bg-orange-500" },
        { date: "Mar 15, 2024", title: "Doctor Consultation", desc: "Routine checkup with Dr. Michael Chen.", icon: Users, color: "bg-emerald-500" },
        { date: "Mar 10, 2024", title: "New Allergy Logged", desc: "Peanut allergy confirmed after skin prick test.", icon: AlertTriangle, color: "bg-red-500" },
      ].map((item, i) => (
        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            <item.icon className="size-5" />
          </div>
          <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <time className="text-xs font-bold uppercase tracking-widest text-white/20">{item.date}</time>
              <span className={cn("size-2 rounded-full", item.color)} />
            </div>
            <h4 className="text-lg font-bold text-white mb-1 tracking-tight">{item.title}</h4>
            <p className="text-sm text-secondary leading-relaxed">{item.desc}</p>
          </Card>
        </div>
      ))}
    </div>
  </div>
);

const NearbyView = () => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findNearby = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`User location: ${latitude}, ${longitude}`);
        
        // In a real app, we would call an API like Google Places here
        // For now, we simulate a delay and return localized-looking mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setFacilities([
          { name: "St. Jude Medical Center", distance: "0.8 miles", address: "123 Health St, San Francisco", rating: 4.8, type: "Hospital" },
          { name: "City Care Clinic", distance: "1.2 miles", address: "456 Care Ave, San Francisco", rating: 4.5, type: "Clinic" },
          { name: "Wellness Pharmacy", distance: "0.5 miles", address: "789 Med Rd, San Francisco", rating: 4.9, type: "Pharmacy" },
          { name: "General Hospital", distance: "2.1 miles", address: "101 Main Blvd, San Francisco", rating: 4.2, type: "Hospital" },
        ]);
        setLoading(false);
      },
      (err) => {
        setError("Unable to retrieve your location. Please check permissions.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader 
        title="Nearby Medical Facilities" 
        subtitle="Quickly find hospitals, clinics, and pharmacies near you"
        action={<Button onClick={findNearby} disabled={loading} className="bg-white text-black hover:bg-white/90 rounded-xl px-6 gap-2 font-bold">
          {loading ? "Searching..." : "Find Nearby"}
        </Button>}
      />

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
          {error}
        </div>
      )}

      {facilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((f, i) => (
            <Card key={i} className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                  <Share2 className="size-6" />
                </div>
                <span className="text-xs font-bold text-emerald-400">{f.rating} â˜…</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-1 tracking-tight">{f.name}</h4>
              <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-4">{f.type}</p>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-secondary flex items-center gap-2"><Clock className="size-4" /> {f.distance}</p>
                <p className="text-sm text-secondary flex items-center gap-2"><FileText className="size-4" /> {f.address}</p>
              </div>
              <Button variant="outline" className="w-full border-white/5 bg-white/5 hover:bg-white/10 rounded-xl font-bold">Get Directions</Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-20 flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10 bg-white/[0.01]">
          <div className="size-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-6">
            <Share2 className="size-10" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Facilities Found</h3>
          <p className="text-secondary max-w-xs mb-8">Click the button above to search for medical facilities in your current area.</p>
          <Button onClick={findNearby} className="bg-white text-black hover:bg-white/90 rounded-xl px-10 font-bold h-12">Search Now</Button>
        </Card>
      )}
    </div>
  );
};

// --- Main Dashboard Component ---

export default function Dashboard() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<Section>("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
      } catch (err: any) {
        console.warn("⚠️ [Dashboard] Failed to fetch user profile (likely permissions):", err.message);
        // Set a basic profile to avoid undefined errors
        setUserProfile({ uid: user.uid, displayName: user.displayName });
      }
    };
    fetchProfile();

    setActiveSection("Dashboard");
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard": return <DashboardView setActiveSection={setActiveSection} />;
      case "Records": return <RecordsView setActiveSection={setActiveSection} />;
      case "Timeline": return <TimelineView />;
      case "Allergies": return <AllergiesView />;
      case "QR Share": return <QRShareView profile={userProfile} />;
      case "AI Assistant": return <AIAssistantView />;
      case "Vitals": return <VitalsView />;
      case "Nearby": return <NearbyView />;
      case "Emergency": return <EmergencyView />;
      case "Chat": return <ChatView doctors={[]} />;
      case "Settings": return <SettingsView profile={userProfile} />;
      default: return <DashboardView setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-white/5 bg-black/40 backdrop-blur-2xl p-6">
        <Link to="/" className="mb-10 px-2 outline-none">
          <Logo size="lg" />
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon as any;
            return (
              <button
                key={item.label}
                onClick={() => setActiveSection(item.label)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
                  activeSection === item.label 
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                    : "text-secondary hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn(
                  "size-5 transition-transform group-hover:scale-110",
                  activeSection === item.label ? "text-black" : "text-secondary"
                )} />
                <TextRoll className="font-bold text-sm tracking-wide">{t(item.key)}</TextRoll>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
          <Link 
            to="/" 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-secondary hover:text-white hover:bg-white/5 transition-all group"
          >
            <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
            <TextRoll className="font-bold text-sm tracking-wide">{t('dash_back_home')}</TextRoll>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-secondary hover:text-red-400 hover:bg-red-500/5 transition-all group">
            <LogOut className="size-5 group-hover:translate-x-1 transition-transform" />
            <TextRoll className="font-bold text-sm tracking-wide">{t('dash_logout')}</TextRoll>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/5 z-50 px-4 flex items-center justify-between">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon as any;
          return (
            <button
              key={item.label}
              onClick={() => setActiveSection(item.label)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                activeSection === item.label ? "text-white" : "text-secondary"
              )}
            >
              <Icon className="size-6" />
              <TextRoll className="text-[10px] font-bold uppercase tracking-tighter">{t(item.key).split(' ')[0]}</TextRoll>
            </button>
          );
        })}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="flex flex-col items-center gap-1 text-secondary"
        >
          <Menu className="size-6" />
          <TextRoll className="text-[10px] font-bold uppercase tracking-tighter">{t('dash_more')}</TextRoll>
        </button>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-black border-l border-white/5 z-[70] p-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <Logo size="md" />
                <Button size="icon" variant="ghost" onClick={() => setIsSidebarOpen(false)}>
                  <X className="size-6" />
                </Button>
              </div>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon as any;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setActiveSection(item.label);
                        setIsSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                        activeSection === item.label 
                          ? "bg-white text-black" 
                          : "text-secondary hover:text-white hover:bg-white/5"
                      )}
                    >
                      <Icon className="size-5" />
                      <TextRoll className="font-bold text-sm tracking-wide">{t(item.key)}</TextRoll>
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto no-scrollbar relative">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-bottom border-white/5 px-6 md:px-10 py-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Welcome back, {userProfile?.displayName || 'User'}
            </h1>
            <p className="text-xs text-secondary font-medium">
              Your health is looking stable today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <SearchBar placeholder="Search data..." />
            </div>
            <NotificationDropdown />
            <div className="size-10 rounded-xl bg-white/10 p-[1px] cursor-pointer" onClick={() => setActiveSection("Settings")}>
              <div className="size-full rounded-[11px] bg-black flex items-center justify-center overflow-hidden">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="Profile" className="size-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="size-5 text-white" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Section Content */}
        <div className="px-6 md:px-10 py-8 pb-32 lg:pb-10 max-w-7xl mx-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
