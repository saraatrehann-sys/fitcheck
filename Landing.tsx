import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { User } from 'firebase/auth';
import { signInWithGoogle } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

interface LandingProps {
  user: User | null;
}

export default function Landing({ user }: LandingProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 pt-16 pb-20"
    >
      {/* Hero Section */}
      <section className="mb-12">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-block px-3 py-1 bg-ucla-blue/10 text-ucla-blue rounded-full text-[10px] font-bold tracking-widest uppercase mb-6"
        >
          Exclusive UCLA Beta
        </motion.div>
        <motion.h1 
          className="text-5xl font-serif italic leading-[1.1] mb-6 tracking-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          See what UCLA is wearing today.
        </motion.h1>
        <motion.p 
          className="text-base text-campus-text/60 mb-10 leading-relaxed font-medium"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Post your fit once a day to unlock the feed and discover real campus style from Bruins around you.
        </motion.p>

        <div className="flex flex-col gap-4">
          {!user ? (
            <button 
              onClick={signInWithGoogle}
              className="w-full bg-campus-text text-campus-bg py-5 rounded-2xl font-bold flex items-center justify-between px-8 group active:scale-95 transition-all shadow-xl"
              id="cta-join-beta"
            >
              <span className="text-lg">Join UCLA Beta</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/submit')}
              className="w-full bg-ucla-blue text-campus-bg py-5 rounded-2xl font-bold flex items-center justify-between px-8 shadow-lg active:scale-95 transition-all"
              id="cta-submit-fit"
            >
              <span className="text-lg">Post Today's Fit</span>
              <span className="text-2xl font-serif">+</span>
            </button>
          )}
          <button 
            onClick={() => navigate('/feed')}
            className="w-full bg-campus-bg text-campus-text border border-campus-text/10 py-5 rounded-2xl font-bold active:scale-95 transition-all shadow-sm"
            id="cta-sample-feed"
          >
            View Sample Feed
          </button>
        </div>
      </section>
    </motion.div>
  );
}
