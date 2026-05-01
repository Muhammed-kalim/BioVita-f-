import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Lock, Shield, ChevronRight, ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { auth } from '../lib/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';

const DoctorAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ [Doctor Auth] Professional Login Successful");
        navigate('/doctor');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("✅ [Doctor Auth] Professional Registered");
        navigate('/doctor');
      }
    } catch (err: any) {
      console.error("❌ [Doctor Auth] Error:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      console.log("✅ [Doctor Auth] Google Institutional Login Successful");
      navigate('/doctor');
    } catch (err: any) {
      console.error("❌ [Doctor Auth] Google Error Code:", err.code);
      console.error("❌ [Doctor Auth] Google Error Message:", err.message);
      
      let userMessage = "Institutional Google Sign-In failed.";
      if (err.code === 'auth/operation-not-allowed') {
        userMessage = "Google Sign-In is not enabled in your Firebase project. Please enable it in the Firebase Console.";
      } else if (err.code === 'auth/popup-blocked') {
        userMessage = "The Sign-In popup was blocked by your browser. Please allow popups for this site.";
      }
      
      alert(userMessage + "\n\nDetail: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 pt-24">
        <div className="max-w-md w-full">
          <Link to="/portal" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Portals</span>
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 rounded-[3rem] border-red-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500">
              <Stethoscope size={80} />
            </div>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black tracking-tighter mb-2 text-red-500 uppercase">
                {isLogin ? 'Professional Login' : 'Medical Onboarding'}
              </h2>
              <p className="text-white/40 text-sm">BioVita Professional Identity Verification.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/40" />
                  <input 
                    type="email" 
                    placeholder="Medical Email Address" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-red-500/30 transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/40" />
                  <input 
                    type="password" 
                    placeholder="Security Credential" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-red-500/30 transition-all placeholder:text-white/20"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-red-500/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Access Portal' : 'Register Credentials')}
                {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black px-2 text-white/40">Or continue with</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-red-500/10 hover:border-red-500/30 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Institutional Google Account
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                {isLogin ? "Institutional Access Request" : "Back to Security Login"}
              </button>
            </div>
          </motion.div>

          <div className="mt-8 glass p-6 rounded-2xl border-white/5 text-center">
             <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
               Access restricted to certified medical bodies. Unauthorized login attempts are logged and reported to national health authorities.
             </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorAuth;
