import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Heart, Star, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

interface FeedbackProps {
  user: User | null;
}

export default function Feedback({ user }: FeedbackProps) {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    downloadLikelihood: 'Maybe' as 'Yes' | 'Maybe' | 'No',
    postingFrequency: 'Weekly',
    anonymousPreference: 'Yes',
    inviteFriend: 'Yes',
    comfortFactors: '',
    topFeature: 'Outfit inspo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        ...formData,
        userId: user?.uid || 'anonymous',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center bg-campus-bg">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Sparkles size={64} className="text-ucla-blue mx-auto mb-6" />
          <h2 className="text-3xl font-serif italic mb-4 tracking-tight text-center text-campus-text">Thank you!</h2>
          <p className="text-campus-text/50 font-medium leading-relaxed max-w-xs mx-auto">
            Your feedback helps decide whether we build the full app for the Bruin community.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="px-5 py-2 bg-ucla-blue/10 text-ucla-blue rounded-full text-[10px] font-bold uppercase tracking-widest">
              Feedback Received
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 pt-16 pb-12"
    >
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-serif italic mb-4 tracking-tight">Shape UCLA Fit Check</h1>
        <p className="text-campus-text/40 text-[10px] uppercase font-bold tracking-[0.2em] max-w-[240px] mx-auto leading-relaxed">Help us build the campus features you actually want.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12 pb-20">
        <div className="space-y-10">
          <div className="p-8 bg-ucla-gold/10 rounded-[32px] border border-campus-text/5 shadow-sm">
            <h3 className="font-bold text-sm mb-6 flex items-center gap-3 text-campus-text">
              <Star size={16} className="text-ucla-blue fill-ucla-blue" />
              Would you download this as an app?
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {['Yes', 'Maybe', 'No'].map(choice => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setFormData({...formData, downloadLikelihood: choice as any})}
                  className={`py-4 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${formData.downloadLikelihood === choice ? 'bg-campus-text text-campus-bg shadow-xl' : 'bg-campus-bg text-campus-text/30'}`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-ucla-gold/10 rounded-[32px] border border-campus-text/5 shadow-sm">
            <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-campus-text/40">Posting Frequency</h3>
            <div className="flex flex-wrap gap-2">
              {['Daily', 'Weekly', 'Rarely', 'Only browse'].map(choice => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setFormData({...formData, postingFrequency: choice})}
                  className={`px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.postingFrequency === choice ? 'bg-ucla-blue text-campus-bg shadow-md' : 'bg-campus-bg text-campus-text/40'}`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-8 bg-ucla-gold/10 rounded-[32px] border border-campus-text/5 shadow-sm">
              <h3 className="font-bold text-sm mb-6 leading-relaxed text-campus-text">Would anonymous posting make you more likely to post?</h3>
              <div className="flex gap-2">
                {['Yes', 'No'].map(choice => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setFormData({...formData, anonymousPreference: choice as any})}
                    className={`flex-1 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${formData.anonymousPreference === choice ? 'bg-campus-text text-campus-bg' : 'bg-campus-bg text-campus-text/40'}`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-ucla-gold/10 rounded-[32px] border border-campus-text/5 shadow-sm">
              <h3 className="font-bold text-sm mb-6 text-campus-text">Would you invite a friend?</h3>
              <div className="flex gap-2">
                {['Yes', 'No'].map(choice => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setFormData({...formData, inviteFriend: choice as any})}
                    className={`flex-1 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${formData.inviteFriend === choice ? 'bg-campus-text text-campus-bg' : 'bg-campus-bg text-campus-text/40'}`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-ucla-gold/10 rounded-[32px] border border-campus-text/5 shadow-sm">
            <h3 className="font-bold text-sm mb-6 text-campus-text">What would make you more comfortable posting?</h3>
            <textarea 
              className="w-full bg-campus-bg p-5 rounded-2xl text-sm min-h-[140px] focus:ring-1 focus:ring-ucla-blue outline-none border-none focus:bg-campus-bg/50 transition-all font-medium placeholder:text-campus-text/20 text-campus-text"
              placeholder="e.g. Friends-only feed, anonymous tags..."
              value={formData.comfortFactors}
              onChange={e => setFormData({...formData, comfortFactors: e.target.value})}
            />
          </div>

          <div className="p-8 bg-ucla-gold/10 rounded-[32px] border border-campus-text/5 shadow-sm">
            <h3 className="font-bold text-sm mb-6 flex items-center gap-3 text-campus-text">
              <Heart size={16} className="text-red-800 fill-red-800" />
              What feature matters most?
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Upvotes', 'Saves', 'Shopping links', 'Anonymous posting', 'Private friend groups', 'Trend recaps', 'Event feeds'].map(feat => (
                <button
                  key={feat}
                  type="button"
                  onClick={() => setFormData({...formData, topFeature: feat})}
                  className={`px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${formData.topFeature === feat ? 'bg-campus-text text-campus-bg shadow-xl' : 'bg-campus-bg text-campus-text/40 border border-transparent'}`}
                >
                  {feat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-ucla-blue text-campus-bg py-6 rounded-[24px] font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-20 uppercase tracking-[0.2em] text-xs"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-campus-bg" />
          ) : (
            <>
              Submit Feedback
              <Send size={16} />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
