import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Camera, Tag, Lock, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    title: "Post your fit once a day",
    description: "Snap a quick photo of what you're wearing to Royce or Powell. Taken in the moment, no uploads allowed.",
    icon: <Camera size={40} className="text-ucla-blue" />,
    color: "bg-ucla-blue/10"
  },
  {
    title: "Tag your brands",
    description: "Help others find where you got those Sambas or that vintage UCLA tote. Tag up to 5 items.",
    icon: <Tag size={40} className="text-ucla-gold" />,
    color: "bg-ucla-gold/20"
  },
  {
    title: "Unlock the campus feed",
    description: "Instantly see what everyone else is rocking today. Browse trends, save inspo, and see who's on campus.",
    icon: <Lock size={40} className="text-campus-text" />,
    color: "bg-campus-text/10"
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-campus-bg flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center"
          >
            <div className={`w-24 h-24 rounded-full ${slides[currentSlide].color} flex items-center justify-center mb-10 shadow-inner`}>
              {slides[currentSlide].icon}
            </div>
            
            <h2 className="text-4xl font-serif italic mb-6 tracking-tight text-campus-text">
              {slides[currentSlide].title}
            </h2>
            
            <p className="text-lg text-campus-text/60 leading-relaxed font-medium max-w-[280px]">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-campus-text' : 'w-2 bg-campus-text/10'}`} 
            />
          ))}
        </div>
      </div>

      <div className="p-8 pb-12">
        <button
          onClick={nextSlide}
          className="w-full bg-campus-text text-campus-bg py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all text-lg"
        >
          {currentSlide === slides.length - 1 ? 'Start Fitting In' : 'Next Step'}
          {currentSlide === slides.length - 1 ? <ArrowRight size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}
