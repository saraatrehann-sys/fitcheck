import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, X, Check, Camera, Info, RefreshCw, AlertCircle } from 'lucide-react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db, signInWithGoogle } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { moderateImage, ModerationResult } from '../services/moderationService';

interface SubmitFitProps {
  user: User | null;
}

export default function SubmitFit({ user }: SubmitFitProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModerating, setIsModerating] = useState(false);
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    uclaEmail: '',
    displayAs: 'Anonymous Bruin',
    occasion: 'Class',
    location: 'Bruin Walk',
    brands: [] as string[],
    photoUrl: '', 
    consentFit: false,
    consentRules: false
  });

  const [currentBrand, setCurrentBrand] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const occasions = ['Class', 'Study fit', 'Going out', 'Game day', 'Gym', 'Internship', 'Other'];
  const locations = ['UCLA', 'Westwood', 'Bruin Walk', 'Powell', 'The Hill', 'Royce Quad'];
  const displayOptions = ['Full name', 'First name only', 'Anonymous Bruin'];

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setCameraActive(true);
    setModerationResult(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1440 } },
        audio: false 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Please allow camera access to take a fit pic.");
      setCameraActive(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Resize for MVP to stay under Firestore 1MB document limit (accounting for base64 overhead)
    const targetWidth = 600;
    const targetHeight = targetWidth * (video.videoHeight / video.videoWidth);
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw the current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    
    // Stop camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    
    setFormData(prev => ({ ...prev, photoUrl: dataUrl }));
    
    // Moderate the image
    setIsModerating(true);
    try {
      const result = await moderateImage(dataUrl);
      setModerationResult(result);
    } catch (error) {
      console.error("Moderation failed:", error);
    } finally {
      setIsModerating(false);
    }
  };

  const resetPhoto = () => {
    setFormData(prev => ({ ...prev, photoUrl: '' }));
    setModerationResult(null);
    startCamera();
  };

  const addBrand = () => {
    if (currentBrand && formData.brands.length < 5) {
      setFormData({ ...formData, brands: [...formData.brands, currentBrand] });
      setCurrentBrand('');
    }
  };

  const removeBrand = (index: number) => {
    setFormData({ ...formData, brands: formData.brands.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.photoUrl) {
      alert('Please take an outfit photo.');
      return;
    }
    
    if (moderationResult?.decision === 'reject') {
      alert('Your photo was rejected as it does not appear to be an outfit. Please retake.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'submissions'), {
        userId: user.uid,
        displayAs: formData.displayAs,
        occasion: formData.occasion,
        location: formData.location,
        brands: formData.brands,
        photoUrl: formData.photoUrl,
        createdAt: serverTimestamp(),
        upvotes: 0,
        reactions: {}
      });
      localStorage.setItem('has_submitted_today', 'true');
      setSuccess(true);
      setTimeout(() => navigate('/feed'), 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'submissions');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 bg-ucla-gold text-campus-text rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} />
          </div>
          <h2 className="text-3xl font-serif italic mb-2">Your fit was posted.</h2>
          <p className="text-campus-text/60 mb-8 font-medium italic">You've unlocked today's UCLA feed.</p>
          <div className="animate-pulse text-sm font-bold text-ucla-blue">Redirecting to feed...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-6 pt-16 pb-12"
    >
      <header className="mb-10">
        <h1 className="text-4xl font-serif italic mb-2 tracking-tight">Post today's fit</h1>
        <p className="text-campus-text/40 text-[10px] uppercase font-bold tracking-widest leading-relaxed">Post your outfit to unlock the Bruin feed.</p>
      </header>

      {!user ? (
        <div className="bg-ucla-gold/10 p-10 rounded-[32px] border border-campus-text/5 shadow-sm text-center">
          <div className="w-20 h-20 bg-campus-bg rounded-full flex items-center justify-center mx-auto mb-6 text-campus-text/10">
            <Camera size={32} />
          </div>
          <h3 className="text-2xl font-serif italic mb-4">Sign in with Google</h3>
          <p className="text-sm text-campus-text/60 mb-8 max-w-[200px] mx-auto leading-relaxed font-medium">Unlock the UCLA fashion community with your Bruin account.</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-campus-text text-campus-bg py-5 rounded-2xl font-bold shadow-xl active:scale-95 transition-all"
          >
            Join with Google
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-10 pb-12">
          {/* Live Camera Interface */}
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-campus-text/40 font-bold mb-4 ml-2 block">Take today's fit pic</label>
            
            <div className="aspect-[3/4] rounded-[32px] overflow-hidden relative bg-black shadow-2xl group border-[8px] border-campus-bg ring-1 ring-campus-text/5">
              {!formData.photoUrl && !cameraActive && (
                <div 
                  onClick={startCamera}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-campus-text/10 transition-colors bg-campus-bg"
                >
                  <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-campus-text/20 group-hover:text-campus-text transition-colors">
                    <Camera size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm">Open Camera</p>
                    <p className="text-[10px] text-campus-text/40 mt-1 uppercase tracking-widest">Taken in the moment</p>
                  </div>
                </div>
              )}

              {cameraActive && (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={capturePhoto}
                      className="w-20 h-20 bg-white rounded-full border-8 border-white/30 shadow-2xl active:scale-90 transition-all flex items-center justify-center"
                    >
                      <div className="w-14 h-14 bg-white rounded-full border-2 border-black/10" />
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                        if (stream) stream.getTracks().forEach(track => track.stop());
                        setStream(null);
                        setCameraActive(false);
                    }}
                    className="absolute top-6 right-6 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                  >
                    <X size={20} />
                  </button>
                </>
              )}

              {formData.photoUrl && (
                <>
                  <img src={formData.photoUrl} className="w-full h-full object-cover" alt="Your fit" />
                  
                  {isModerating && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 text-center">
                      <RefreshCw size={32} className="animate-spin mb-4 opacity-50" />
                      <p className="font-serif italic text-xl mb-2">Analyzing outfit...</p>
                      <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Verifying for campus feed</p>
                    </div>
                  )}

                  {moderationResult && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  )}

                  <button 
                    type="button"
                    onClick={resetPhoto}
                    className="absolute top-6 right-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/20"
                  >
                    Retake
                  </button>
                </>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Moderation Feedback */}
            {moderationResult && (
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`p-4 rounded-2xl border flex items-start gap-4 ${
                  moderationResult.decision === 'accept' ? 'bg-green-50 border-green-100 text-green-800' :
                  moderationResult.decision === 'maybe' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                  'bg-red-50 border-red-100 text-red-800'
                }`}
              >
                {moderationResult.decision === 'accept' ? (
                  <Check size={20} className="shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-xs font-bold leading-tight mb-1">
                    {moderationResult.decision === 'accept' ? 'Outfit verified' : 
                     moderationResult.decision === 'maybe' ? 'Please retake photo' : 
                     'Not an outfit'}
                  </p>
                  <p className="text-[10px] font-medium opacity-80 leading-relaxed">
                    {moderationResult.reason}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-8">
            <div className="p-6 bg-ucla-gold/10 border border-campus-text/5 rounded-[24px]">
              <label className="text-[10px] uppercase tracking-widest text-campus-text/40 font-bold mb-4 block">Display as</label>
              <div className="grid grid-cols-1 gap-2">
                {displayOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({...formData, displayAs: opt as any})}
                    className={`text-left p-4 rounded-xl border transition-all text-sm font-bold ${formData.displayAs === opt ? 'border-ucla-blue bg-ucla-blue/5 text-ucla-blue' : 'border-transparent bg-campus-bg text-campus-text/40'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 bg-ucla-gold/10 border border-campus-text/5 rounded-[24px]">
                <label className="text-[10px] uppercase tracking-widest text-campus-text/40 font-bold mb-4 block">Occasion & Location</label>
                <div className="space-y-4">
                  <select 
                    value={formData.occasion}
                    onChange={e => setFormData({...formData, occasion: e.target.value})}
                    className="w-full bg-campus-bg border-none p-5 rounded-2xl focus:ring-1 focus:ring-ucla-blue outline-none text-sm font-bold text-campus-text"
                  >
                    {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <select 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-campus-bg border-none p-5 rounded-2xl focus:ring-1 focus:ring-ucla-blue outline-none text-sm font-bold text-campus-text"
                  >
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 bg-ucla-gold/10 border border-campus-text/5 rounded-[24px]">
              <label className="text-[10px] uppercase tracking-widest text-campus-text/40 font-bold mb-4 block">Brands (Up to 5)</label>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  className="flex-1 bg-campus-bg border-none p-5 rounded-2xl focus:ring-1 focus:ring-ucla-blue outline-none text-sm font-bold text-campus-text"
                  placeholder="e.g. Doc Martens"
                  value={currentBrand}
                  onChange={e => setCurrentBrand(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addBrand())}
                />
                <button 
                  type="button"
                  onClick={addBrand}
                  className="bg-campus-text text-campus-bg px-8 rounded-2xl font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.brands.map((brand, i) => (
                  <span key={i} className="bg-campus-bg px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-campus-text/5 text-campus-text">
                    {brand}
                    <button type="button" onClick={() => removeBrand(i)} className="text-campus-text/30 hover:text-campus-text"><X size={12} /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <label className="flex gap-4 cursor-pointer group">
              <input 
                type="checkbox" 
                required 
                className="mt-1 w-5 h-5 rounded border-black/10 accent-ucla-blue"
                checked={formData.consentFit}
                onChange={e => setFormData({...formData, consentFit: e.target.checked})}
              />
              <span className="text-[11px] text-campus-text/60 font-medium leading-relaxed group-hover:text-campus-text transition-colors">I confirm this is my outfit and I consent to it being shown in the UCLA beta feed.</span>
            </label>
            <label className="flex gap-4 cursor-pointer group">
              <input 
                type="checkbox" 
                required 
                className="mt-1 w-5 h-5 rounded border-black/10 accent-ucla-blue"
                checked={formData.consentRules}
                onChange={e => setFormData({...formData, consentRules: e.target.checked})}
              />
              <span className="text-[11px] text-campus-text/60 font-medium leading-relaxed group-hover:text-campus-text transition-colors">My post follows the community guidelines.</span>
            </label>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || isModerating || !formData.photoUrl || (moderationResult?.decision !== 'accept') || !formData.consentFit || !formData.consentRules}
            className="w-full bg-campus-text text-campus-bg py-6 rounded-[24px] font-bold shadow-2xl active:scale-95 transition-all disabled:opacity-20 uppercase tracking-[0.2em] text-xs"
          >
            {isSubmitting ? 'Uploading...' : 'Post my fit'}
          </button>
          
          {(moderationResult?.decision === 'maybe' || moderationResult?.decision === 'reject') && (
            <p className="text-center text-[10px] font-bold text-red-500 uppercase tracking-widest">
              Please retake your photo to continue
            </p>
          )}
        </form>
      )}
    </motion.div>
  );
}

