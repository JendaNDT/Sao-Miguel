import { SM_DATA } from '../data';
import { Heart, Plus, MapPin, ExternalLink, AlertTriangle, Lightbulb, Waves, Clock, CloudRain, Sun, Cloud, Wind, Thermometer } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';

export default function Detail({ id, navigate, toggleFav, isFav, itinerary, setItinerary }: any) {
  const isTrail = id.startsWith('trail-');
  
  if (isTrail) {
    const t = SM_DATA.TRAILS.find(x => x.id === id.replace('trail-', ''));
    if (!t) return <div className="p-8 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl my-4 text-neutral-500">Trasa nenalezena.</div>;
    return <TrailDetailView t={t} toggleFav={toggleFav} isFav={isFav} id={id} itinerary={itinerary} setItinerary={setItinerary} />;
  }

  const p = SM_DATA.PLACES.find(x => x.id === id);
  if (!p) return <div className="p-8 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl my-4 text-neutral-500">Místo nenalezeno.</div>;

  const cat = (SM_DATA.CATEGORIES as any)[p.category];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Hero */}
      <div className="p-6 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
          {cat.emoji}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{p.name}</h1>
        <p className="text-neutral-500 mt-2">{p.short}</p>
        
        <div className="flex flex-wrap gap-2 mt-4 content-start">
          <Badge>{cat.emoji} {cat.label}</Badge>
          {(p as any).free && <Badge color="success">Zdarma</Badge>}
          {(p as any).price && !(p as any).free && <Badge color="warn">{(p as any).price}</Badge>}
          {(p as any).difficulty && <Badge>{(p as any).difficulty}</Badge>}
          {(p as any).bestTime && <Badge color="info">{(p as any).bestTime}</Badge>}
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <ActionButton onClick={() => toggleFav(id)} icon={<Heart size={18} fill={isFav ? "currentColor" : "none"} />} label={isFav ? 'Uloženo' : 'Uložit'} />
          <ActionButton onClick={() => {
            const newItin = { ...itinerary };
            if (newItin.days.length === 0) newItin.days.push({ items: [] });
            newItin.days[0].items.push({ id });
            setItinerary(newItin);
            alert('Přidáno do 1. dne plánu');
          }} icon={<Plus size={18}/>} label="Do plánu" />
          <ActionLink href={`https://www.openstreetmap.org/?mlat=${p.coords[0]}&mlon=${p.coords[1]}#map=14/${p.coords[0]}/${p.coords[1]}`} icon={<MapPin size={18}/>} label="Mapa" />
        </div>
      </div>

      {/* YR.NO WEATHER WIDGET */}
      <YrWeatherWidget lat={p.coords[0]} lon={p.coords[1]} name={p.name} />

      {/* Description */}
      <div className="p-5 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl">
        <p className="text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200">{(p as any).description || p.short}</p>
      </div>

      {/* Info Block */}
      {((p as any).temperature || (p as any).openHours || (p as any).website) && (
        <div className="divide-y divide-neutral-200/50 dark:divide-neutral-800/50 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl px-5">
          {InfoRow('Teplota vody', (p as any).temperature)}
          {InfoRow('Otevírací doba', (p as any).openHours)}
          {(p as any).website && (
            <div className="flex items-start justify-between py-4 gap-4">
              <span className="text-[13px] text-neutral-500">Web</span>
              <a href={(p as any).website} target="_blank" rel="noopener noreferrer" className="text-[14px] font-medium text-accent flex items-center gap-1">odkaz <ExternalLink size={14}/></a>
            </div>
          )}
        </div>
      )}

      {/* TIDE OPTIMIZER FOR PONTA DA FERRARIA */}
      {id === 'ponta-da-ferraria' && <ThermalOptimizer />}

      {/* Tips */}
      {((p as any).tips && (p as any).tips.length > 0) && (
        <div>
          <h2 className="text-[13px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Tipy a důležité info</h2>
          <div className="flex flex-col gap-2">
            {(p as any).tips.map((t: string, i: number) => {
              const isWarn = t.includes('⚠️');
              const clean = t.replace(/^⚠️\s*/, '');
              return (
                <div key={i} className={`flex gap-3 p-4 rounded-xl border ${isWarn ? 'bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950/30 dark:border-orange-900 dark:text-orange-200' : 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-200'}`}>
                  <div className="flex-shrink-0 mt-0.5">{isWarn ? <AlertTriangle size={18} /> : <Lightbulb size={18} />}</div>
                  <div className="text-[13px] leading-relaxed">{clean}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function TrailDetailView({ t, toggleFav, isFav, id, itinerary, setItinerary }: any) {
  const [pace, setPace] = useState(1.2); 

  const diffClass = t.difficulty === 'Snadná' ? 'success' : t.difficulty === 'Střední' ? 'warn' : 'danger';
  
  // Calculate based on pace: pace * (timeHours / lengthKm) * lengthKm => pace * timeHours
  const calculatedTime = (t.lengthKm * pace * (t.timeHours / t.lengthKm)).toFixed(1);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-6 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
          🥾
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{t.name}</h1>
        <p className="text-neutral-500 mt-2">{t.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-4 content-start">
          <Badge>{t.code}</Badge>
          <Badge>{t.typeLabel}</Badge>
          <Badge color={diffClass}>{t.difficulty}</Badge>
          <Badge>{t.lengthKm} km</Badge>
          <Badge>{t.timeHours} h (Základ)</Badge>
        </div>

        {/* PACE CALCULATOR */}
        <div className="mt-6 p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="flex justify-between items-center mb-3">
             <span className="text-[13px] font-semibold text-neutral-600 dark:text-neutral-300">Tvoje tempo chůze</span>
             <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{calculatedTime} h</span>
          </div>
          <div className="flex gap-2">
            <button 
               onClick={() => setPace(1.5)}
               className={`flex-1 py-1.5 rounded-xl text-[13px] font-semibold transition ${pace === 1.5 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' : 'bg-white text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 border-neutral-200 dark:border-neutral-700'} border`}
            >
              Líné 🐢
            </button>
            <button 
               onClick={() => setPace(1.2)}
               className={`flex-1 py-1.5 rounded-xl text-[13px] font-semibold transition ${pace === 1.2 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' : 'bg-white text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 border-neutral-200 dark:border-neutral-700'} border`}
            >
              Střední 🚶
            </button>
            <button 
               onClick={() => setPace(1.0)}
               className={`flex-1 py-1.5 rounded-xl text-[13px] font-semibold transition ${pace === 1.0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' : 'bg-white text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 border-neutral-200 dark:border-neutral-700'} border`}
            >
              Intenz 🏃
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <ActionButton onClick={() => toggleFav(id)} icon={<Heart size={18} fill={isFav ? "currentColor" : "none"} />} label={isFav ? 'Uloženo' : 'Uložit'} />
          <ActionButton onClick={() => {
            const newItin = { ...itinerary };
            if (newItin.days.length === 0) newItin.days.push({ items: [] });
            newItin.days[0].items.push({ id });
            setItinerary(newItin);
            alert('Přidáno do 1. dne plánu');
          }} icon={<Plus size={18}/>} label="Do plánu" />
          <ActionLink href={`https://www.openstreetmap.org/?mlat=${t.start[0]}&mlon=${t.start[1]}#map=14/${t.start[0]}/${t.start[1]}`} icon={<MapPin size={18}/>} label="Start" />
          {t.link && <ActionLink href={t.link} icon={<ExternalLink size={18}/>} label="Web" />}
        </div>
      </div>

      {/* YR.NO WEATHER WIDGET */}
      <YrWeatherWidget lat={t.start[0]} lon={t.start[1]} name={t.name} />

      <div className="p-5 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl">
        <div className="font-semibold mb-2">Na trase uvidíte</div>
        <ul className="list-disc pl-5 text-[15px] space-y-1 text-neutral-700 dark:text-neutral-300">
          {t.highlights.map((h: string, i: number) => <li key={i}>{h}</li>)}
        </ul>
      </div>

      <div className="flex gap-3 p-4 rounded-xl border bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950/30 dark:border-orange-900 dark:text-orange-200">
        <div className="flex-shrink-0 mt-0.5"><AlertTriangle size={18} /></div>
        <div className="text-[13px] leading-relaxed">Vulkanické podloží je po dešti extrémně kluzké. Používejte trekovou obuv s hlubokým vzorkem.</div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-xl font-medium text-[13px] hover:bg-white/90 dark:hover:bg-neutral-800/80 active:scale-95 transition">
      {icon} {label}
    </button>
  );
}

function ActionLink({ icon, label, href }: any) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-xl font-medium text-[13px] hover:bg-white/90 dark:hover:bg-neutral-800/80 active:scale-95 transition">
      {icon} {label}
    </a>
  );
}

function InfoRow(label: string, value: string) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between py-4 gap-4">
      <span className="text-[13px] text-neutral-500">{label}</span>
      <span className="text-[14px] font-medium text-right">{value}</span>
    </div>
  );
}

function ThermalOptimizer() {
  const [offsetHours, setOffsetHours] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    // Keep internal time synced
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const TIDE_PERIOD = 12.42056 * 3600000; // 12h 25m in ms
  const epoch = new Date('2026-04-18T10:00:00Z').getTime(); // Anchored static high-tide reference for demo

  const targetTime = currentTime + (offsetHours * 3600000);
  const elapsed = targetTime - epoch;
  const phase = ((elapsed % TIDE_PERIOD) + TIDE_PERIOD) % TIDE_PERIOD / TIDE_PERIOD; 
  
  // cos(0) = 1 (High Tide), cos(PI) = -1 (Low Tide)
  const tideValue = Math.cos(phase * Math.PI * 2);

  let statusStr = '';
  let color = '';
  let temp = '';
  let desc = '';
  
  if (tideValue > 0.6) {
     statusStr = 'Plný příliv';
     color = 'text-blue-700 bg-blue-100 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800';
     temp = '🧊 ~22°C (Studená)';
     desc = 'Oceán kompletně zaplavil termální pramen. Voda je prakticky stejně studená jako okolní moře. Koupání nemá termální efekt.';
  } else if (tideValue < -0.6) {
     statusStr = 'Plný odliv';
     color = 'text-red-700 bg-red-100 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800';
     temp = '🔥 ~40°C+ (Extrémně horká)';
     desc = 'Moře ustoupilo a do zálivu teče jen vařící termální voda. Může to být nebezpečně horké a na dně obnažených kamenů to nepříjemně pálí!';
  } else if (tideValue > 0 && tideValue <= 0.6) {
     statusStr = 'Klesající/stoupající s převahou přílivu';
     color = 'text-cyan-700 bg-cyan-100 border-cyan-300 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-800';
     temp = '🏊 ~26-28°C (Vlažná)';
     desc = 'Oceánská voda stále dominuje, ale už začínáte cítit termální teplo. Ideální pro ty, komu stačí osvěžující koupel.';
  } else {
     statusStr = 'Blízko odlivu (Ideální Okno)';
     color = 'text-emerald-800 bg-emerald-100 border-emerald-400 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700 font-bold';
     temp = '♨️ ~32-36°C (Perfektní)';
     desc = 'Zlatá hodinka! Množství horkého pramene a studeného oceánu je v dokonalém poměru. Tohle je ten zázrak, za kterým se sem jezdí.';
  }

  // Calculate tide percentage for graphical bar (0% is Low Tide, 100% is High Tide)
  // tideValue goes from -1 (Low) to 1 (High)
  const tidePercent = ((tideValue + 1) / 2) * 100;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-200/50 dark:border-indigo-800/30 rounded-2xl p-5 shadow-sm animate-in zoom-in-95 duration-300 my-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400">
          <Waves size={18} />
        </div>
        <div>
          <h3 className="font-bold text-indigo-900 dark:text-indigo-300">Termální Guru (Tide & Temp)</h3>
          <p className="text-[11px] font-semibold text-indigo-600/80 dark:text-indigo-400/80 uppercase tracking-widest leading-none">Předpověď kvality pramene</p>
        </div>
      </div>
      
      <div className={`p-4 rounded-xl border ${color} transition-colors duration-300`}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-[15px] font-bold">{statusStr}</span>
          <span className="text-[14px] font-bold tracking-tight">{temp}</span>
        </div>
        <p className="text-[13px] opacity-90 leading-relaxed mb-4">{desc}</p>
        
        {/* Vizualizace hladiny */}
        <div className="relative h-4 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-black/10 dark:border-white/10">
           {/* Horká zóna vlevo */}
           <div className="absolute top-0 left-0 bottom-0 w-[20%] bg-red-400/30"></div>
           {/* Ideální zóna ve středu vlevo */}
           <div className="absolute top-0 left-[20%] bottom-0 w-[20%] bg-emerald-400/40"></div>
           {/* Studená zóna vpravo */}
           <div className="absolute top-0 left-[40%] bottom-0 w-[60%] bg-blue-400/30"></div>
           
           {/* Ukazatel aktuální hladiny */}
           <div 
             className="absolute top-0 bottom-0 w-1.5 bg-neutral-900 dark:bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out z-10"
             style={{ left: `calc(${tidePercent}% - 3px)` }}
           ></div>
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mt-1.5 opacity-60">
           <span>Odliv (Horké)</span>
           <span>Příliv (Studené)</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between items-center text-[13px] font-medium text-indigo-900 dark:text-indigo-300">
           <span className="flex items-center gap-1.5"><Clock size={14}/> Kdy plánuješ dorazit?</span>
           <span className="bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-md font-bold">
             {offsetHours === 0 ? 'Nyní' : `Za ${offsetHours} hod`}
             {' '}—{' '}
             {new Date(targetTime).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
           </span>
        </div>
        <input 
          type="range" 
          min="0" max="12" step="1" 
          value={offsetHours} 
          onChange={(e) => setOffsetHours(Number(e.target.value))}
          className="w-full accent-indigo-600 dark:accent-indigo-400"
        />
        <div className="flex justify-between text-[11px] text-indigo-600/70 dark:text-indigo-400/70 font-medium px-1">
          <span>Teď</span>
          <span>+6h</span>
          <span>+12h</span>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, color = 'default' }: { children: ReactNode, color?: string }) {
  const colors: any = {
    default: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    warn: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${colors[color]}`}>
      {children}
    </span>
  );
}

function YrWeatherWidget({ lat, lon, name }: { lat: number, lon: number, name: string }) {
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`);
        if (!res.ok) return;
        const data = await res.json();
        
        // MET Norway returns hourly data.
        // Let's pick 3 slots: Now, Tomorrow 12:00, and Day After 12:00
        const timeseries = data.properties.timeseries;
        if (!timeseries || timeseries.length === 0) return;

        const now = timeseries[0];
        
        // Find tomorrow noon
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        const tomData = timeseries.find((t: any) => new Date(t.time).getTime() >= tomorrow.getTime());

        // Find day after tomorrow noon
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);
        dayAfter.setHours(12, 0, 0, 0);
        const dayAftData = timeseries.find((t: any) => new Date(t.time).getTime() >= dayAfter.getTime());

        const getSummary = (t: any, label: string) => {
           if (!t) return null;
           const details = t.data.instant.details;
           const next1h = t.data.next_1_hours?.details;
           const symbol = t.data.next_1_hours?.summary?.symbol_code || t.data.next_6_hours?.summary?.symbol_code || '';
           
           return {
             label,
             temp: Math.round(details.air_temperature),
             cloud: details.cloud_area_fraction,
             precip: next1h?.precipitation_amount || 0,
             wind: Math.round(details.wind_speed),
             symbol
           };
        };

        const results = [
          getSummary(now, 'Nyní'),
          getSummary(tomData, 'Zítra'),
          getSummary(dayAftData, 'Pozítří')
        ].filter(Boolean);

        setForecasts(results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [lat, lon]);

  if (loading) return null;
  if (forecasts.length === 0) return null;

  return (
    <div className="bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl p-5 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 font-bold text-[13px] uppercase tracking-wide">
          <CloudRain size={16}/> Yr.no · Předpověď pro tuto lokaci
        </div>
        <div className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 px-2 py-0.5 rounded-full font-semibold">MET Norway</div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {forecasts.map((f, i) => {
          const isRaining = f.precip > 0.5 || f.symbol.includes('rain') || f.symbol.includes('shower');
          const isSunny = f.cloud < 30 && !isRaining;
          
          return (
            <div key={i} className="flex flex-col items-center p-3 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800 text-center">
               <span className="text-[11px] font-bold text-neutral-500 mb-2">{f.label}</span>
               
               <div className={`text-2xl mb-1 ${isRaining ? 'text-blue-500' : (isSunny ? 'text-amber-500' : 'text-neutral-400')}`}>
                 {isRaining ? <CloudRain strokeWidth={2} /> : (isSunny ? <Sun strokeWidth={2} /> : <Cloud strokeWidth={2} />)}
               </div>
               
               <div className="text-[15px] font-bold text-neutral-800 dark:text-neutral-200 mb-2">{f.temp}°C</div>
               
               <div className="flex flex-col gap-1 w-full text-[10px] text-neutral-500 font-medium">
                  <div className="flex justify-between items-center bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded">
                     <span className="flex items-center gap-1 text-blue-500/80"><CloudRain size={10}/></span>
                     <span>{f.precip > 0 ? `${f.precip}mm` : '0'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded">
                     <span className="flex items-center gap-1 text-neutral-400"><Wind size={10}/></span>
                     <span>{f.wind}m/s</span>
                  </div>
                  <div className="flex justify-between items-center bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded">
                     <span className="flex items-center gap-1 text-neutral-400"><Cloud size={10}/></span>
                     <span>{f.cloud}%</span>
                  </div>
               </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
