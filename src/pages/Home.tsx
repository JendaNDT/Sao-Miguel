import { useEffect, useState } from 'react';
import { SM_DATA } from '../data';
import { ListItem } from '../components/ListItem';

export default function Home({ navigate, favorites = [], toggleFav }: any) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=37.7412&longitude=-25.6756&current=temperature_2m,weather_code&timezone=Atlantic%2FAzores')
      .then(r => r.json())
      .then(setWeather)
      .catch(() => {});
  }, []);

  const tip = SM_DATA.DAILY_TIPS[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % SM_DATA.DAILY_TIPS.length];
  
  const highlights = ['boca-do-inferno', 'lagoa-do-fogo', 'terra-nostra', 'cha-gorreana']
    .map(id => SM_DATA.PLACES.find(p => p.id === id))
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-[#1b4332] text-white p-6 shadow-lg">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="text-[11px] font-bold uppercase tracking-widest text-white/80">Osobní průvodce</div>
        <h1 className="text-2xl font-bold mt-1 tracking-tight">Ostrov São Miguel</h1>
        <p className="text-sm text-white/80 mt-2 leading-relaxed max-w-[280px]">Zelený ostrov Azor — sopky, jezera, čajové plantáže a nekonečný oceán.</p>
      </div>

      {/* Weather */}
      <div className="flex items-center justify-between p-4 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{weather ? (weather.current.weather_code <= 3 ? '⛅' : '🌧') : '🌫'}</div>
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Ponta Delgada</div>
            <div className="text-2xl font-bold">{weather ? `${Math.round(weather.current.temperature_2m)}°C` : '—°C'}</div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-[13px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Rychlé akce</h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickTile emoji="♨️" title="Termály" sub="Lázně a prameny" onClick={() => navigate('explore')} />
          <QuickTile emoji="💧" title="Jezera" sub="Vulkanické kaldery" onClick={() => navigate('explore')} />
          <QuickTile emoji="🥾" title="Trasy" sub="Trek a přechody" onClick={() => navigate('explore')} />
          <QuickTile emoji="🍲" title="Gastro" sub="Cozido, čaj plantáže" onClick={() => navigate('explore')} />
        </div>
      </div>

      {/* Daily Tip */}
      <div>
        <h2 className="text-[13px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Tip dne</h2>
        <div className="flex gap-3 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm p-4 rounded-2xl">
          <div className="text-2xl flex-shrink-0">{tip.emoji}</div>
          <div className="text-[14px] leading-snug">{tip.text}</div>
        </div>
      </div>

      {/* Highlights */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-[13px] font-bold text-neutral-500 uppercase tracking-widest">To nejlepší z ostrova</h2>
          <button onClick={() => navigate('explore')} className="text-[13px] font-medium text-accent">Vše ukázat</button>
        </div>
        <div className="flex flex-col gap-2">
          {highlights.map((p: any) => (
            <ListItem 
              key={p.id} 
              data={p} 
              category={(SM_DATA.CATEGORIES as any)[p.category]} 
              onClick={() => navigate('detail', p.id)} 
              isFav={favorites.includes(p.id)}
              onToggleFav={() => toggleFav && toggleFav(p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickTile({ emoji, title, sub, onClick }: any) {
  return (
    <button onClick={onClick} className="flex flex-col gap-2 p-4 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl text-left hover:bg-white/80 dark:hover:bg-neutral-800/80 active:scale-[0.98] transition">
      <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-xl">{emoji}</div>
      <div>
        <div className="font-semibold text-[15px]">{title}</div>
        <div className="text-[12px] text-neutral-500 mt-0.5">{sub}</div>
      </div>
    </button>
  );
}
