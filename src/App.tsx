import { useState } from 'react';
import { Home as HomeIcon, Compass, Map as MapIcon, Calendar, Info, Settings, Heart, ChevronLeft } from 'lucide-react';
import Home from './pages/Home';
import Explore from './pages/Explore';
import MapPage from './pages/MapPage';
import Plan from './pages/Plan';
import InfoPage from './pages/InfoPage';
import Detail from './pages/Detail';
import SettingsPage from './pages/SettingsPage';
import Background from './components/Background';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [favorites, setFavorites] = useLocalStorage<string[]>('sm_favorites', []);
  const [itinerary, setItinerary] = useLocalStorage<any>('sm_itinerary', { days: [] });
  const [packing, setPacking] = useLocalStorage<Record<string, boolean>>('sm_packing', {});
  const [notes, setNotes] = useLocalStorage<string>('sm_notes', '');
  const [tripStart, setTripStart] = useLocalStorage<string | null>('sm_trip_start', null);
  const [geminiKey, setGeminiKey] = useLocalStorage<string>('sm_gemini_key', '');
  const [bgMode, setBgMode] = useLocalStorage<string>('sm_bg_mode', 'dynamic');

  const toggleFav = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(x => x !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const navigate = (page: string, id: string | null = null) => {
    setCurrentPage(page);
    setCurrentId(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const renderPage = () => {
    if (currentPage === 'detail' && currentId) {
      return <Detail id={currentId} navigate={navigate} toggleFav={toggleFav} isFav={favorites.includes(currentId)} itinerary={itinerary} setItinerary={setItinerary} />;
    }
    switch (currentPage) {
      case 'home': return <Home navigate={navigate} favorites={favorites} toggleFav={toggleFav} />;
      case 'explore': return <Explore navigate={navigate} favorites={favorites} toggleFav={toggleFav} geminiKey={geminiKey} />;
      case 'map': return <MapPage navigate={navigate} />;
      case 'plan': return <Plan navigate={navigate} favorites={favorites} toggleFav={toggleFav} itinerary={itinerary} setItinerary={setItinerary} packing={packing} setPacking={setPacking} notes={notes} setNotes={setNotes} tripStart={tripStart} setTripStart={setTripStart} geminiKey={geminiKey} />;
      case 'info': return <InfoPage />;
      case 'settings': return <SettingsPage geminiKey={geminiKey} setGeminiKey={setGeminiKey} navigate={navigate} bgMode={bgMode} setBgMode={setBgMode} />;
      default: return <Home navigate={navigate} favorites={favorites} toggleFav={toggleFav} />;
    }
  };

  return (
    <div className="min-h-screen pb-20 text-neutral-900 dark:text-neutral-50 font-sans selection:bg-accent/20 transition-colors">
      <Background dynamic={bgMode === 'dynamic'} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-neutral-950/60 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(currentPage === 'detail') && (
            <button onClick={() => navigate('explore')} className="p-2 -ml-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition">
              <ChevronLeft size={24} />
            </button>
          )}
          {(currentPage === 'settings') && (
            <button onClick={() => navigate('home')} className="p-2 -ml-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition">
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="font-semibold text-lg">São Miguel</h1>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-accent/20 text-accent rounded-full border border-accent/20 uppercase tracking-wide">Azory</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
          <button onClick={() => navigate('plan')} className="p-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition">
            <Heart size={20} />
          </button>
          <button onClick={() => navigate('settings')} className={`p-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition ${currentPage === 'settings' ? 'text-accent' : ''}`}>
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 w-full">
        {renderPage()}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-around z-50 px-2 pb-[env(safe-area-inset-bottom)]">
        <NavBtn id="home" label="Domů" icon={HomeIcon} current={currentPage} onClick={() => navigate('home')} />
        <NavBtn id="explore" label="Průzkum" icon={Compass} current={currentPage} onClick={() => navigate('explore')} />
        <NavBtn id="map" label="Mapa" icon={MapIcon} current={currentPage} onClick={() => navigate('map')} />
        <NavBtn id="plan" label="Plán" icon={Calendar} current={currentPage} onClick={() => navigate('plan')} />
        <NavBtn id="info" label="Info" icon={Info} current={currentPage} onClick={() => navigate('info')} />
      </nav>
    </div>
  );
}

function NavBtn({ id, label, icon: Icon, current, onClick }: any) {
  const active = current === id || (current === 'detail' && id === 'explore');
  return (
    <button onClick={onClick} className={`relative flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${active ? 'text-accent' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
      {active && <div className="absolute top-0 w-8 h-1 bg-accent rounded-b-md" />}
    </button>
  );
}
