import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, LayoutGrid, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Landing from './pages/Landing';
import SubmitFit from './pages/SubmitFit';
import Feed from './pages/Feed';
import Feedback from './pages/Feedback';
import Onboarding from './components/Onboarding';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/submit', icon: PlusSquare, label: 'Post' },
    { path: '/feed', icon: LayoutGrid, label: 'Feed' },
    { path: '/feedback', icon: MessageSquare, label: 'Feedback' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-full md:max-w-md bg-campus-bg/80 backdrop-blur-xl border border-campus-text/5 rounded-full px-6 py-3 shadow-2xl z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-campus-text scale-110' : 'text-campus-text/30 hover:text-campus-text/50'}`}
              id={`nav-link-${item.label.toLowerCase()}`}
            >
              <div className={`p-2 rounded-full transition-colors ${isActive ? 'bg-campus-text text-campus-bg' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
    return localStorage.getItem('onboarding_done') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_done', 'true');
    setOnboardingCompleted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-campus-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-campus-text"></div>
      </div>
    );
  }

  const showOnboarding = user && !onboardingCompleted;

  return (
    <Router>
      <div className="min-h-screen bg-campus-bg font-sans pb-24 md:max-w-md md:mx-auto md:shadow-2xl md:bg-white overflow-x-hidden relative">
        <AnimatePresence mode="wait">
          {showOnboarding ? (
            <Onboarding onComplete={handleOnboardingComplete} />
          ) : (
            <Routes>
              <Route path="/" element={<Landing user={user} />} />
              <Route path="/submit" element={<SubmitFit user={user} />} />
              <Route path="/feed" element={<Feed user={user} />} />
              <Route path="/feedback" element={<Feedback user={user} />} />
            </Routes>
          )}
        </AnimatePresence>
        {!showOnboarding && <Navbar />}
      </div>
    </Router>
  );
}
