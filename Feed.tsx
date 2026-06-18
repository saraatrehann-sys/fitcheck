import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Bookmark, AlertTriangle, Filter, Lock, ArrowUp } from 'lucide-react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface FeedProps {
  user: User | null;
}

const SAMPLE_FITS = [
  { id: '1', name: 'Anonymous Bruin', occasion: 'Going out', location: 'Westwood', brands: ['Glassons', 'Vintage Levi\'s'], img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=60', upvotes: 142 },
  { id: '2', name: 'Westwood Fit', occasion: 'Class', location: 'Bruin Walk', brands: ['White Fox', 'Diesel belt'], img: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&auto=format&fit=crop&q=60', upvotes: 228 },
  { id: '3', name: 'Anonymous Student', occasion: 'Class', location: 'Powell', brands: ['Ami Paris', 'Vintage Denim'], img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=60', upvotes: 189 },
  { id: '4', name: 'Anonymous Bruin', occasion: 'Game day', location: 'Royce Quad', brands: ['UCLA Merch', 'Nike'], img: 'https://images.unsplash.com/photo-1529139572162-7284483f4b00?w=800&auto=format&fit=crop&q=60', upvotes: 256 },
  { id: '5', name: 'UCLA Stylist', occasion: 'Class', location: 'Bruin Walk', brands: ['Aritzia', 'New Balance'], img: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&auto=format&fit=crop&q=60', upvotes: 74 },
  { id: '6', name: 'Bruin Bound', occasion: 'Gym', location: 'The Hill', brands: ['Gymshark', 'Cloud 5s'], img: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&auto=format&fit=crop&q=60', upvotes: 31 },
  { id: '7', name: 'Anonymous Bruin', occasion: 'Internship', location: 'Westwood', brands: ['Theory', 'Loafers'], img: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop&q=60', upvotes: 95 },
  { id: '8', name: 'Westwood Native', occasion: 'Going out', location: 'UCLA', brands: ['Meshki', 'Heels'], img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=60', upvotes: 112 },
  { id: '9', name: 'Powell Study', occasion: 'Study fit', location: 'Powell', brands: ['Gap Hoodie', 'Uggs'], img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=60', upvotes: 68 },
  { id: '10', name: 'Campus Legend', occasion: 'Class', location: 'Bruin Walk', brands: ['Stussy', 'Vans'], img: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&auto=format&fit=crop&q=60', upvotes: 204 },
  { id: '11', name: 'Anonymous Bruin', occasion: 'Game day', location: 'UCLA', brands: ['Blue Shirt', 'Denim'], img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=60', upvotes: 153 },
  { id: '12', name: 'Westwood Chic', occasion: 'Internship', location: 'UCLA', brands: ['Cos', 'Everlane'], img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=60', upvotes: 187 },
];

const REACTION_TYPES = ['Clean', 'Would wear', 'Love the shoes', 'Saved'];

export default function Feed({ user }: FeedProps) {
  const navigate = useNavigate();
  const [isLocked, setIsLocked] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Class', 'Study fit', 'Going out', 'Game day', 'Internship'];

  // Track state for fake interactions
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check if user submitted today using localStorage for MVP simulation
    const submittedToday = localStorage.getItem('has_submitted_today') === 'true';
    if (submittedToday) {
      setIsLocked(false);
    }
  }, []);

  const toggleUpvote = (id: string) => {
    setVoted(prev => ({ ...prev, [id]: !prev[id] }));
    setUpvotes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + (voted[id] ? -1 : 1)
    }));
  };

  const toggleSave = (id: string) => {
    setSaved(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFits = activeFilter === 'All' 
    ? SAMPLE_FITS 
    : SAMPLE_FITS.filter(f => f.occasion === activeFilter);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      <header className="px-6 pt-16 pb-6 bg-campus-bg sticky top-0 z-40">
        <div className="flex justify-between items-end mb-1">
          <h1 className="text-4xl font-serif italic tracking-tight">Today at UCLA</h1>
          <span className="text-[10px] text-campus-text/40 uppercase font-bold tracking-widest mb-1">May 14</span>
        </div>
        <p className="text-campus-text/40 text-[10px] uppercase font-bold tracking-widest">Real campus style • Beta v1.0</p>
        
        {!isLocked && (
          <div className="flex gap-2 overflow-x-auto pt-8 no-scrollbar pb-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${activeFilter === f ? 'bg-campus-text text-campus-bg shadow-xl' : 'bg-campus-bg text-campus-text/40 border border-campus-text/5'}`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </header>

      {isLocked ? (
        <div className="px-8 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-campus-bg rounded-full flex items-center justify-center mb-8 text-campus-text/10 border border-campus-text/5 shadow-inner">
            <Lock size={40} strokeWidth={1} />
          </div>
          <h2 className="text-3xl font-serif italic mb-4">Feed is locked</h2>
          <p className="text-sm text-campus-text/50 mb-10 max-w-[240px] mx-auto leading-relaxed font-medium">
            Post your outfit for today to unlock the UCLA campus feed.
          </p>
          <button
            onClick={() => navigate('/submit')}
            className="bg-ucla-blue text-campus-bg px-10 py-5 rounded-2xl font-bold shadow-xl active:scale-95 transition-all w-full max-w-[280px]"
          >
            Post today's fit
          </button>

          {/* Preview blur */}
          <div className="w-full mt-16 grid grid-cols-2 gap-4 opacity-5 pointer-events-none grayscale blur-md">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] bg-gray-400 rounded-[32px]" />
            ))}
          </div>
        </div>
      ) : (
        <div className="px-3 py-6">
          {/* Top Campus Trends Today */}
          <section className="px-3 mb-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-campus-text/30 mb-5">Campus Trends</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {[
                { name: 'Sambas', trend: '+12%' },
                { name: 'Totes', trend: '+8%' },
                { name: 'Baggy Denim', trend: '+15%' },
                { name: 'UCLA Vintage', trend: 'Stable' }
              ].map((trend, i) => (
                <div key={i} className="bg-ucla-gold/20 border border-campus-text/5 px-5 py-4 rounded-2xl flex-shrink-0 shadow-sm flex items-center gap-3">
                  <span className="text-ucla-blue font-serif italic text-lg leading-none">#{i+1}</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs">{trend.name}</span>
                    <span className="text-[9px] text-green-700 font-bold">{trend.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3 pb-12">
            {filteredFits.map((fit) => (
              <motion.div 
                key={fit.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-ucla-gold/10 rounded-[24px] overflow-hidden border border-campus-text/5 shadow-sm flex flex-col"
              >
                <div className="relative aspect-[3/4] bg-campus-bg">
                  <img src={fit.img} className="w-full h-full object-cover" alt="Outfit" loading="lazy" />
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    <span className="bg-campus-bg/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider text-campus-text">
                      {fit.location}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleUpvote(fit.id); }}
                      className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${voted[fit.id] ? 'bg-ucla-blue text-campus-bg' : 'bg-campus-bg/60 text-campus-text'}`}
                    >
                      <ArrowUp size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex justify-between items-start mb-1 gap-1">
                    <h4 className="font-bold text-[10px] truncate leading-tight flex-1">{fit.name}</h4>
                    <span className="text-[9px] font-bold text-campus-text/40 shrink-0">❤️ {fit.upvotes + (upvotes[fit.id] || 0)}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-1">
                    {fit.brands.slice(0, 1).map((brand, i) => (
                      <span key={i} className="text-[7px] font-bold text-campus-text/40 border border-campus-text/5 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                        {brand}
                      </span>
                    ))}
                    {fit.brands.length > 1 && <span className="text-[7px] text-campus-text/30 font-bold">+{fit.brands.length - 1}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
