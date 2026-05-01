import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Features from "./components/Features";
import Product from "./components/Product";
import Footer from "./components/Footer";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ToasterDemo from "./components/ui/toast-demo";
import Dashboard from "./components/Dashboard";
import ContactPage from "./components/ContactPage";
import AIAssistant from "./components/AIAssistant";
import NearbyHospitals from "./components/NearbyHospitals";
import Emergency from "./components/Emergency";
import EmergencyView from "./components/EmergencyView";
import Register from "./components/Register";
import PatientDashboard from "./components/PatientDashboard";
import PatientRecords from "./components/PatientRecords";
import PatientVitals from "./components/PatientVitals";
import DoctorDashboard from "./components/DoctorDashboard";
import DoctorScan from "./components/DoctorScan";
import DoctorResult from "./components/DoctorResult";
import PortalSelection from "./components/PortalSelection";
import PatientAuth from "./components/PatientAuth";
import DoctorAuth from "./components/DoctorAuth";
import GlobalAIAssistant from "./components/GlobalAIAssistant";
import { MedicalIdentityProvider } from "./contexts/MedicalIdentityContext";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-bg-top text-white">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/patient" />;
  }

  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-bg-top text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default function App() {
  const location = useLocation();
  const { loading } = useAuth();

  // Scroll to top or hash on route change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-bg-top text-white">Loading...</div>;
  }

  return (
    <MedicalIdentityProvider>
      <div className="relative min-h-screen bg-brand-bg-top overflow-x-hidden selection:bg-white selection:text-black">
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path="/toast-demo" element={<ToasterDemo />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/emergency/:id" element={<EmergencyView />} />
        <Route path="/portal" element={<PortalSelection />} />
        <Route path="/register" element={<PortalSelection />} />
        
        {/* Patient Portal */}
        <Route path="/patient/auth" element={<PatientAuth />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/patient/register" element={<Register />} />
        <Route path="/patient/records" element={<PatientRecords />} />
        <Route path="/patient/vitals" element={<PatientVitals />} />

        {/* Doctor Portal */}
        <Route path="/doctor/auth" element={<DoctorAuth />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/scan" element={<DoctorScan />} />
        <Route path="/doctor/result" element={<DoctorResult />} />

        <Route path="/nearby-hospitals" element={
          <>
            <Navbar />
            <main className="pt-20">
              <NearbyHospitals />
            </main>
            <Footer />
          </>
        } />
        <Route path="/" element={
          <>
            <Navbar />
            
            <main>
              <div id="hero"><Hero /></div>
              <div id="about"><About /></div>
              <div id="features"><Features /></div>
              <div id="product"><Product /></div>
            </main>

            <Footer />
          </>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <GlobalAIAssistant />
      </div>
    </MedicalIdentityProvider>
  );
}
