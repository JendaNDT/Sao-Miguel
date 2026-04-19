import { useState, useMemo } from 'react';
import { SM_DATA } from '../data';
import { ListItem } from '../components/ListItem';
import { Trash2, Plus, X, Check, Sparkles, AlertTriangle, CloudSun, ArrowUp, ArrowDown, Map as MapIcon, Clock, Flame } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Plan({ navigate, favorites, itinerary, setItinerary, packing, setPacking, notes, setNotes, tripStart, setTripStart, geminiKey }: any) {
  const [tab, setTab] = useState('favorites');

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <button onClick={() => setTab('favorites')} className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${tab === 'favorites' ? 'bg-accent border-accent text-white shadow-sm' : 'bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md border-neutral-200/50 dark:border-neutral-800/50 hover:bg-white/90'}`}>❤️ Oblíbené</button>
        <button onClick={() => setTab('itinerary')} className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${tab === 'itinerary' ? 'bg-accent border-accent text-white shadow-sm' : 'bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md border-neutral-200/50 dark:border-neutral-800/50 hover:bg-white/90'}`}>📅 Itinerář</button>
        <button onClick={() => setTab('packing')} className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${tab === 'packing' ? 'bg-accent border-accent text-white shadow-sm' : 'bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md border-neutral-200/50 dark:border-neutral-800/50 hover:bg-white/90'}`}>🎒 Balení</button>
        <button onClick={() => setTab('notes')} className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${tab === 'notes' ? 'bg-accent border-accent text-white shadow-sm' : 'bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md border-neutral-200/50 dark:border-neutral-800/50 hover:bg-white/90'}`}>📝 Poznámky</button>
      </div>

      <div className="mt-2">
        {tab === 'favorites' && <FavoritesTab favorites={favorites} navigate={navigate} />}
        {tab === 'itinerary' && <ItineraryTab itinerary={itinerary} setItinerary={setItinerary} tripStart={tripStart} setTripStart={setTripStart} favorites={favorites} geminiKey={geminiKey} navigate={navigate} />}
        {tab === 'packing' && <PackingTab packing={packing} setPacking={setPacking} tripStart={tripStart} geminiKey={geminiKey} navigate={navigate} />}
        {tab === 'notes' && <NotesTab notes={notes} setNotes={setNotes} />}
      </div>
    </div>
  );
}

function FavoritesTab({ favorites, navigate }: any) {
  const places = favorites.filter((id: string) => !id.startsWith('trail-')).map((id: string) => SM_DATA.PLACES.find(p => p.id === id)).filter(Boolean);
  const trails = favorites.filter((id: string) => id.startsWith('trail-')).map((id: string) => SM_DATA.TRAILS.find(t => t.id === id.replace('trail-', ''))).filter(Boolean);

  if (places.length === 0 && trails.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-500">
        <div className="text-4xl mb-4">❤️</div>
        <div className="font-semibold text-neutral-900 dark:text-neutral-100">Žádné oblíbené zatím nemáš</div>
        <div className="text-sm mt-1">Klikni na srdce u libovolné lokace a uloží se sem.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {places.length > 0 && (
        <div>
          <h2 className="text-[13px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Lokace · {places.length}</h2>
          <div className="flex flex-col gap-2">
            {places.map((p: any) => <ListItem key={p.id} data={p} category={(SM_DATA.CATEGORIES as any)[p.category]} onClick={() => navigate('detail', p.id)} />)}
          </div>
        </div>
      )}
      {trails.length > 0 && (
        <div>
          <h2 className="text-[13px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Trasy · {trails.length}</h2>
          <div className="flex flex-col gap-2">
            {trails.map((t: any) => <ListItem key={`trail-${t.id}`} data={t} isTrail onClick={() => navigate('detail', 'trail-' + t.id)} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function ItineraryTab({ itinerary, setItinerary, tripStart, setTripStart, favorites, geminiKey, navigate }: any) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDays, setAiDays] = useState('4');
  const [aiPace, setAiPace] = useState('Střední (rozumný balanc)');
  const [showAiConfig, setShowAiConfig] = useState(false);
  const [weatherWarnings, setWeatherWarnings] = useState<Record<number, { loading: boolean, msg: string | null }>>({});
  const [addingForDay, setAddingForDay] = useState<number | null>(null);
  const [quickSearch, setQuickSearch] = useState('');

  const days = itinerary?.days || [];

  const quickSearchResults = useMemo(() => {
    if (!quickSearch.trim()) return [];
    const q = quickSearch.toLowerCase();
    
    const pResults = SM_DATA.PLACES.filter((p: any) => p.name.toLowerCase().includes(q) || p.short.toLowerCase().includes(q)).slice(0, 5).map((p: any) => ({
      id: p.id,
      name: p.name,
      emoji: (SM_DATA.CATEGORIES as any)[p.category]?.emoji || '📍',
      subtitle: (SM_DATA.CATEGORIES as any)[p.category]?.label || ''
    }));

    const tResults = SM_DATA.TRAILS.filter((t: any) => t.name.toLowerCase().includes(q) || t.code?.toLowerCase().includes(q)).slice(0, 3).map((t: any) => ({
      id: 'trail-' + t.id,
      name: t.name,
      emoji: '🥾',
      subtitle: `${t.lengthKm} km · ${t.difficulty}`
    }));

    return [...pResults, ...tResults].slice(0, 6);
  }, [quickSearch]);

  const evaluateDayWeather = async (idx: number, day: any, dateStr: string) => {
    if (!geminiKey) {
       alert("Pro tuto funkci potřebuješ uložit API klíč v Nastavení.");
       navigate('settings');
       return;
    }
    
    setWeatherWarnings((prev: any) => ({ ...prev, [idx]: { loading: true, msg: null } }));

    try {
      const placesWithCoords = day.items.map((it: any) => {
         let obj;
         let lat, lon;
         let name = it.id;
         let category = 'neznámá';
         
         if (it.id.startsWith('trail-')) {
           obj = SM_DATA.TRAILS.find((t: any) => t.id === it.id.replace('trail-', ''));
           if (obj) { lat = obj.start[0]; lon = obj.start[1]; name = obj.name; category = 'trek'; }
         } else if (it.id.startsWith('AI-')) {
           return { id: it.id, name: it.id.replace('AI-', ''), category: 'AI doporučení' };
         } else {
           obj = SM_DATA.PLACES.find((p: any) => p.id === it.id);
           if (obj) { lat = obj.coords[0]; lon = obj.coords[1]; name = obj.name; category = obj.category; }
         }
         return { id: it.id, name, lat, lon, category };
      }).filter((p: any) => p);

      let weatherText = '';
      const validLocs = placesWithCoords.filter((p: any) => p.lat && p.lon).slice(0, 3);
      
      if (validLocs.length > 0) {
        const weatherPromises = validLocs.map(async (p: any) => {
           try {
              // Voláme originální norské API Yr.no (MET Norway)
              // Používáme compact endpoint pro bleskovou odezvu
              const res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${p.lat.toFixed(4)}&lon=${p.lon.toFixed(4)}`);
              if (!res.ok) return null;
              
              const data = await res.json();
              
              if (data?.properties?.timeseries?.length > 0) {
                 const current = data.properties.timeseries[0].data;
                 return {
                    temp: current.instant.details.air_temperature,
                    cloud: current.instant.details.cloud_area_fraction,
                    precip: current.next_1_hours?.details?.precipitation_amount || 0,
                    wind: current.instant.details.wind_speed,
                 };
              }
              return null;
           } catch {
              return null;
           }
        });

        const weatherResults = await Promise.all(weatherPromises);
        
        weatherText = validLocs.map((p: any, i: number) => {
           const w = weatherResults[i];
           if (w) {
               return `${p.name}: teplota ${w.temp}°C, vítr ${w.wind}m/s, oblačnost ${w.cloud}%, srážky (1h výhled) ${w.precip}mm.`;
           }
           return '';
        }).filter(Boolean).join('\n');
      }

      const ai = new GoogleGenAI({ apiKey: geminiKey });

      const prompt = `
Jsi "Weather-Aware Záchranář" na ostrově São Miguel. Místní počasí se mění 4x denně a často platí: „Na Fogo je mlha, ale ve Furnas svítí slunce.“
Uživatel plánuje na tento den tyto zastávky:
${placesWithCoords.map((p: any) => `- ${p.name} (${p.category})`).join('\n')}

Aktuální přesná přesná meteo předpověď (vytaženo z Yr.no / MET Norway) pro tyto souřadnice je momentálně:
${weatherText || 'Nedostupná / Pouze města bez GPS lokace.'}

Zhodnoť tento plán vzhledem k počasí. Zvláště pokud se jde na vyhlídku (viewpoint) nebo trek (jezera Fogo / Sete Cidades) a je zde oblačnost blížící se 100 %, upozorni uživatele, že zřejmě nic neuvidí (tzv. "mlíko").
Pokud prší nebo je mizerné počasí úměrné zadaným lokacím, navrhni alternativy, které se k deštivému počasí hodí (např. termály Terra Nostra či Poça da Dona Beija, čajové plantáže Gorreana, centrum Ponta Delgady). Pokud je naopak počasí perfektní (oblačnost nízko, žádné srážky), plán pochval a ubezpeč ho, že uvidí skvělé výhledy.
Mluv česky, stručně, přátelsky, aktivně a povzbudivě, jako SMS od lokálního parťáka. Použij emojis a max. 2 odstavce.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      setWeatherWarnings((prev: any) => ({ ...prev, [idx]: { loading: false, msg: response.text } }));
    } catch (e: any) {
      console.error(e);
      setWeatherWarnings((prev: any) => ({ ...prev, [idx]: { loading: false, msg: 'Chyba při stahování počasí / AI. Zkus to znovu.' } }));
    }
  };

  const addDay = () => setItinerary({ ...itinerary, days: [...days, { items: [] }] });
  const clearDays = () => { if (confirm('Vymazat itinerář?')) setItinerary({ days: [] }); };

  const generateAIPlan = async () => {
    if (!geminiKey) {
      alert("Pro tuto funkci potřebuješ uložit API klíč v Nastavení.");
      navigate('settings');
      return;
    }
    if (favorites.length < 2) {
      alert("Přidej si prosím do oblíbených alespoň 2-3 místa, ať má AI z čeho vařit.");
      setShowAiConfig(false);
      return;
    }

    setIsGenerating(true);
    setShowAiConfig(false);

    try {
      const placesData = favorites.map((fid: string) => {
        if (fid.startsWith('trail-')) {
          const t = SM_DATA.TRAILS.find(x => x.id === fid.replace('trail-', ''));
          return t ? `Trek: ${t.name} (id: ${fid}), délka: ${t.lengthKm}km, čas: ${t.timeHours}h, start GPS: ${t.start.join(',')}, náročnost: ${t.difficulty}` : '';
        } else {
          const p = SM_DATA.PLACES.find(x => x.id === fid);
          return p ? `Místo: ${p.name} (id: ${fid}), GPS: ${p.coords.join(',')}, kategorie: ${p.category}` : '';
        }
      }).join('\n');

      const prompt = `
Jsi lokální průvodce na ostrově São Miguel (Azory). 
Cílem je pro uživatele rozplánovat itinerář z JEHO VLASTNÍCH oblíbených míst, s ohledem na geografickou vzdálenost.

Zadaný počet dní: ${aiDays}
Zadané tempo: ${aiPace}
Uživatelova oblíbená místa (K POVINNÉMU ZAŘAZENÍ):
${placesData}

Pravidla plánování:
1. Seskupuj místa geograficky, ať se nepřejíždí přes celý ostrov v jeden den. (ostrov se obecně dělí na Sete Cidades(západ), Fogo+Ponta Delgada(střed), Furnas+Nordeste(východ)).
2. Nedávej dva těžké/dlouhé treky do jednoho dne.
3. Pokud počet dnů převažuje počet uložených míst a po rozdělení to vypadá prázdně, doplň do těch dnů jiná skvělá doporučení z tvé znalosti ostrova, aby se den zaplnil. Snaž se ale spíše využít ty co mu nabízím jako ID, u "dopočítaných" AI míst stačí vrátit jejich srozumitelný text do ID (ty systém nezobrazí jako proklik, ale jen jako text - id musí být prostý text názvu s prefixem "AI-").

Odpověz POUZE ve formatu dané JSON schémy.
`;

      const ai = new GoogleGenAI({ apiKey: geminiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              days: {
                type: Type.ARRAY,
                description: "Pole jednotlivých dnů itineráře",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    themeTitle: { type: Type.STRING, description: "Název/téma dne, např. 'Sopečná krása západu'" },
                    items: {
                      type: Type.ARRAY,
                      description: "Zastávky během dne",
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING, description: "ID místa (z dodaného seznamu), nebo text začínající na 'AI-' pro místa, která jsi doporučil navíc ty." }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      const data = JSON.parse(response.text.trim());
      if (data && data.days) {
        setItinerary({ days: data.days });
      } else {
        alert("Pardon, nepodařilo se itinerář vygenerovat v dobrém formátu.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Chyba při generování: " + (e.message || "neznámá chyba"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* AI Generate Prompt Box */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={60} />
        </div>
        {!showAiConfig ? (
           <div>
             <h3 className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 mt-1">
               <Sparkles size={18} /> Magický AI Plánovač
             </h3>
             <p className="text-[13px] text-emerald-800 dark:text-emerald-400 mt-1 mb-4 leading-relaxed max-w-[90%]">
               Sestaví ti dokonalý na míru ušitý plán podle tvých {favorites.length} oblíbených míst tak, aby dával geografický smysl.
             </p>
             <button 
                onClick={() => {
                  if (!geminiKey) {
                    navigate('settings');
                  } else {
                    setShowAiConfig(!showAiConfig);
                  }
                }} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium w-full active:scale-95 transition shadow-sm"
              >
               Vytvořit itinerář
             </button>
           </div>
        ) : (
          <div className="flex flex-col gap-3 relative z-10 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-300">Nastavení plánu</h3>
              <button onClick={() => setShowAiConfig(false)} className="text-emerald-700 dark:text-emerald-400 p-1"><X size={16}/></button>
            </div>
            
            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-emerald-800 dark:text-emerald-400">Počet dní</label>
              <input type="number" min="1" max="14" value={aiDays} onChange={e => setAiDays(e.target.value)} className="w-full bg-white dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-lg p-2 text-sm outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-emerald-800 dark:text-emerald-400">Tempo dovolené</label>
              <select value={aiPace} onChange={e => setAiPace(e.target.value)} className="w-full bg-white dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-lg p-2 text-sm outline-none">
                <option>Zkuste vymyslet cokoliv</option>
                <option>Střední (rozumný balanc)</option>
                <option>Relaxační (málo přejezdů)</option>
                <option>Intenzivní (vidět všechno)</option>
              </select>
            </div>

            <button 
               onClick={generateAIPlan} 
               disabled={isGenerating}
               className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium w-full active:scale-95 transition shadow-sm disabled:opacity-75 disabled:scale-100 flex justify-center items-center gap-2"
             >
               {isGenerating ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/> : <Sparkles size={16}/>}
               {isGenerating ? 'Nechávám plánovat...' : 'Vygenerovat plán'}
            </button>
          </div>
        )}
      </div>

      {(days.length > 0 || !isGenerating) && (
        <div className="p-4 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl flex justify-between items-center mt-2">
          <div>
            <div className="font-semibold">Začátek cesty</div>
            <div className="text-xs text-neutral-500 mt-1">Dny se samy pojmenují</div>
          </div>
          <input type="date" value={tripStart || ''} onChange={(e) => setTripStart(e.target.value)} className="bg-neutral-100 dark:bg-neutral-800 px-3 py-2 rounded-lg text-sm border-none outline-none" />
        </div>
      )}

      <div className="flex gap-2 mb-2">
        <button onClick={addDay} className="flex-1 py-2 bg-accent text-white rounded-xl text-[13px] font-medium flex justify-center items-center gap-2 active:scale-95 transition"><Plus size={16}/> Přidat den</button>
        {days.length > 0 && <button onClick={clearDays} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-[13px] font-medium active:scale-95 transition"><Trash2 size={16}/></button>}
      </div>

      {!isGenerating && days.length === 0 ? (
        <div className="py-12 text-center text-neutral-500">
          <div className="text-4xl mb-4">📅</div>
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">Zatím žádný plán</div>
          <div className="text-sm mt-1">Začni přidáním dne.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {days.map((d: any, idx: number) => {
            const dateStr = tripStart ? new Date(new Date(tripStart).getTime() + idx * 86400000).toLocaleDateString() : `Den ${idx + 1}`;
            
            // Calculate burnout meter
            let estHours = 0;
            if (d.items && d.items.length > 0) {
               d.items.forEach((it: any) => {
                 if (it.id.startsWith('trail-')) {
                   const t = SM_DATA.TRAILS.find(x => x.id === it.id.replace('trail-', ''));
                   if (t) estHours += t.timeHours;
                 } else if (it.id.startsWith('AI-')) {
                   estHours += 1;
                 } else {
                   estHours += 0.75; // 45 min for generic places
                 }
               });
               // Add estimated driving buffer between locations
               estHours += (d.items.length - 1) * 0.5; 
            }
            const hoursRounded = Math.round(estHours * 10) / 10;
            let burnoutColor = 'bg-emerald-500';
            let burnoutBg = 'bg-emerald-100 dark:bg-emerald-950/50';
            let burnoutText = 'text-emerald-700 dark:text-emerald-400';
            let burnoutLabel = 'Pohodový den';
            let burnoutWidth = Math.min((estHours / 10) * 100, 100);

            if (estHours > 8.5) {
               burnoutColor = 'bg-red-500';
               burnoutBg = 'bg-red-100 dark:bg-red-950/50';
               burnoutText = 'text-red-700 dark:text-red-400';
               burnoutLabel = 'Riziko vyhoření (Burnout)';
            } else if (estHours > 5.5) {
               burnoutColor = 'bg-amber-500';
               burnoutBg = 'bg-amber-100 dark:bg-amber-950/50';
               burnoutText = 'text-amber-700 dark:text-amber-400';
               burnoutLabel = 'Plný den (Akorát)';
            }

            return (
              <div key={idx} className="bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3 w-full">
                    <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm mt-0.5 shrink-0">{idx + 1}</div>
                    <div className="flex-1 pr-2">
                      <div className="font-semibold text-sm">{dateStr}</div>
                      {d.themeTitle && <div className="text-[12px] font-medium text-accent mt-0.5 leading-snug">{d.themeTitle}</div>}
                      <div className="text-xs text-neutral-500 mt-0.5">{d.items?.length || 0} zastávek</div>

                      {/* BURNOUT METER */}
                      {(d.items && d.items.length > 0) && (
                        <div className="mt-3 mb-1 pr-2">
                          <div className="flex justify-between items-end mb-1.5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${burnoutText}`}>
                              {estHours > 8.5 ? <Flame size={12}/> : <Clock size={12}/>}
                              {burnoutLabel}
                            </span>
                            <span className="text-[11px] text-neutral-500 font-medium whitespace-nowrap">~{hoursRounded} h celkem</span>
                          </div>
                          <div className={`h-1.5 w-full rounded-full overflow-hidden ${burnoutBg}`}>
                            <div className={`h-full ${burnoutColor} transition-all duration-500 ease-out`} style={{ width: `${burnoutWidth}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {d.items && d.items.length > 0 && (
                       <button onClick={() => evaluateDayWeather(idx, d, dateStr)} className="text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 p-2 lg:px-2 lg:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition" title="Zhodnotit počasí a plán">
                         <CloudSun size={16} className="lg:w-3.5 lg:h-3.5" />
                         <span className="hidden lg:inline">Záchranář</span>
                       </button>
                    )}
                    <button onClick={() => setItinerary({...itinerary, days: itinerary.days.filter((_: any, i: number) => i !== idx)})} className="text-neutral-400 hover:text-red-500 p-1"><Trash2 size={18}/></button>
                  </div>
                </div>
                {(!d.items || d.items.length === 0) ? (
                  <div className="text-xs text-neutral-400 italic">Zatím prázdný den...</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {d.items.map((it: any, i: number) => {
                      const isAi = it.id.startsWith('AI-');
                      let displayName = it.id;
                      if (isAi) {
                        displayName = it.id.replace('AI-', '🤖 ');
                      } else if (it.id.startsWith('trail-')) {
                        const t = SM_DATA.TRAILS.find(x => x.id === it.id.replace('trail-', ''));
                        displayName = t ? `🥾 ${t.name}` : it.id;
                      } else {
                        const p = SM_DATA.PLACES.find(x => x.id === it.id);
                        const cat = p ? (SM_DATA.CATEGORIES as any)[p.category] : null;
                        displayName = p ? `${cat ? cat.emoji : ''} ${p.name}` : it.id;
                      }
                      
                      return (
                        <div key={i} className="flex justify-between items-center p-3 border border-neutral-100 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 group">
                          <button 
                            onClick={() => !isAi && navigate('detail', it.id)}
                            disabled={isAi}
                            className={`text-[13px] font-medium truncate pr-4 text-left flex-1 ${isAi ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-800 dark:text-neutral-200 hover:text-accent transition'}`}
                          >
                            {displayName}
                          </button>
                          
                          <div className="flex items-center gap-1 text-neutral-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                if (i > 0) {
                                  const newDays = [...days];
                                  const temp = newDays[idx].items[i];
                                  newDays[idx].items[i] = newDays[idx].items[i-1];
                                  newDays[idx].items[i-1] = temp;
                                  setItinerary({ ...itinerary, days: newDays });
                                } else if (idx > 0) {
                                  // move to end of previous day
                                  const newDays = [...days];
                                  const item = newDays[idx].items.splice(i, 1)[0];
                                  newDays[idx-1].items.push(item);
                                  setItinerary({ ...itinerary, days: newDays });
                                }
                              }} 
                              className="p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
                              title={i === 0 && idx > 0 ? "Přesunout na předchozí den" : "Posunout nahoru"}
                            >
                              <ArrowUp size={16}/>
                            </button>
                            <button 
                              onClick={() => {
                                if (i < d.items.length - 1) {
                                  const newDays = [...days];
                                  const temp = newDays[idx].items[i];
                                  newDays[idx].items[i] = newDays[idx].items[i+1];
                                  newDays[idx].items[i+1] = temp;
                                  setItinerary({ ...itinerary, days: newDays });
                                } else if (idx < days.length - 1) {
                                  // move to start of next day
                                  const newDays = [...days];
                                  const item = newDays[idx].items.splice(i, 1)[0];
                                  newDays[idx+1].items.unshift(item);
                                  setItinerary({ ...itinerary, days: newDays });
                                }
                              }} 
                              className="p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
                              title={i === d.items.length - 1 && idx < days.length - 1 ? "Přesunout na další den" : "Posunout dolů"}
                            >
                              <ArrowDown size={16}/>
                            </button>
                            <button 
                              onClick={() => {
                                const newDays = [...days];
                                newDays[idx].items.splice(i, 1);
                                setItinerary({ ...itinerary, days: newDays });
                              }} 
                              className="p-1 hover:text-red-500 transition ml-1"
                              title="Odstranit z plánu"
                            >
                              <X size={16}/>
                            </button>
                          </div>
                        </div>
                      )
                    })}

                    {/* Google Maps Export Route Button */}
                    {(() => {
                      const points = d.items.map((it: any) => {
                        if (it.id.startsWith('AI-')) return null;
                        if (it.id.startsWith('trail-')) {
                           const t = SM_DATA.TRAILS.find(x => x.id === it.id.replace('trail-', ''));
                           return t ? `${t.start[0]},${t.start[1]}` : null;
                        }
                        const p = SM_DATA.PLACES.find(x => x.id === it.id);
                        return p ? `${p.coords[0]},${p.coords[1]}` : null;
                      }).filter(Boolean);

                      if (points.length < 2) return null;

                      // Format for Maps: google.com/maps/dir/lat1,lng1/lat2,lng2/...
                      const mapsUrl = `https://www.google.com/maps/dir/${points.join('/')}`;
                      return (
                        <a 
                          href={mapsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center justify-center gap-2 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-medium transition active:scale-95"
                          title="Otevřít trasu poskládanou ze zastávek v Google Maps"
                        >
                          <MapIcon size={16} /> Spustit trasu v Google Maps
                        </a>
                      );
                    })()}

                  </div>
                )}

                {/* QUICK ADD INLINE */}
                {addingForDay === idx ? (
                  <div className="mt-3 bg-neutral-50 dark:bg-neutral-950/50 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 animate-in fade-in zoom-in-95">
                     <div className="flex gap-2">
                         <input 
                           autoFocus 
                           placeholder="Hledat místo nebo trasu..." 
                           value={quickSearch} 
                           onChange={e => setQuickSearch(e.target.value)} 
                           className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-accent shadow-sm"
                         />
                         <button onClick={() => setAddingForDay(null)} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition"><X size={18}/></button>
                     </div>
                     {quickSearchResults.length > 0 && (
                        <div className="mt-2 flex flex-col gap-1">
                           {quickSearchResults.map(res => (
                             <button 
                               key={res.id}
                               onClick={() => {
                                  const newDays = [...days];
                                  if (!newDays[idx].items) newDays[idx].items = [];
                                  newDays[idx].items.push({ id: res.id });
                                  setItinerary({ ...itinerary, days: newDays });
                                  setAddingForDay(null);
                                  setQuickSearch('');
                               }}
                               className="text-left flex items-start gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 shadow-sm"
                             >
                                <span className="text-lg mt-0.5">{res.emoji}</span>
                                <div>
                                  <div className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-200 leading-tight">{res.name}</div>
                                  <div className="text-[11px] text-neutral-500 mt-0.5">{res.subtitle}</div>
                                </div>
                             </button>
                           ))}
                        </div>
                     )}
                     {quickSearch.trim() && quickSearchResults.length === 0 && (
                        <div className="text-[12px] text-neutral-500 text-center mt-2 p-2">Nenalezeno...</div>
                     )}
                  </div>
                ) : (
                  <button onClick={() => { setAddingForDay(idx); setQuickSearch(''); }} className="mt-3 w-full py-2 border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-xl flex items-center justify-center gap-2 text-sm transition font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                     <Plus size={16}/> Přidat zastávku
                  </button>
                )}

                {weatherWarnings[idx] && (
                  <div className="mt-4 p-3.5 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                    {weatherWarnings[idx].loading ? (
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-sm font-medium">
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500 dark:border-blue-400 border-t-transparent animate-spin"/>
                        Koukáme na mraky z nebe...
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 font-bold text-[13px] uppercase tracking-wide mb-2">
                          <CloudSun size={16}/> Místní Záchranář
                        </div>
                        <div className="text-[13px] text-blue-900/80 dark:text-blue-200/90 whitespace-pre-wrap leading-relaxed">
                          {weatherWarnings[idx].msg}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PackingTab({ packing, setPacking, tripStart, geminiKey, navigate }: any) {
  const [template, setTemplate] = useLocalStorage<any>('sm_packing_template', null);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentTemplate = template || SM_DATA.PACKING_TEMPLATE;

  const toggle = (key: string) => setPacking({ ...packing, [key]: !packing[key] });
  let checked = 0;
  let total = 0;
  currentTemplate.forEach((g: any) => { total += g.items.length; });
  Object.values(packing).forEach(v => { if (v) checked++; });

  const enrichPackingList = async () => {
    if (!geminiKey) {
       alert("Pro tuto funkci potřebuješ uložit API klíč v Nastavení.");
       navigate('settings');
       return;
    }
    if (!tripStart) {
       alert("Prosím nastav si nejdřív u Itineráře datum začátku cesty, ať vím jaké tam bude počasí.");
       return;
    }

    setIsGenerating(true);

    try {
      const month = new Date(tripStart).toLocaleString('cs-CZ', { month: 'long' });
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      
      const prompt = `Jsi expert na Azorské ostrovy. Uživatel letí na São Miguel a toalně brzy - měsíc začátku cesty: ${month}.
Zde je standardní balicí seznam:
${JSON.stringify(currentTemplate)}

Přidej 2-4 polożky specifické přímo pro počasí nebo aktivity tohoto měsíce (např. pršiplášť, krém proti slunci, věci na velryby co letí zrovna kolem, deštník). Zaměř se vždy na dané roční období a jeho vrtochy. 
Všechny tebou přidané položky musí začínat nějakým emoji, aby uživatel poznal že je to AI doporučení. Přidej je do patřičných kategorií. Nic ze stávajícího seznamu nemaž, jenom doplň do těch strukturálních Categories items pollí. Budeš vracet POUZE validní pole JSON objektů ve formátu:
[ { "group": "...", "items": ["..."] }, ... ]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                group: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      });

      const data = JSON.parse(response.text.trim());
      if (data && Array.isArray(data)) {
        setTemplate(data);
      } else {
        alert("Pardon, formát se nezdařil.");
      }
    } catch (e) {
      console.error(e);
      alert("Chyba při stahování AI balíčku.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* AI Box */}
      <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20 border border-purple-200 dark:border-purple-800/30 rounded-2xl p-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={60} />
        </div>
        <h3 className="font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-2 mt-1">
          <Sparkles size={18} /> Pokročilé AI Balení
        </h3>
        <p className="text-[13px] text-purple-800 dark:text-purple-400 mt-1 mb-4 leading-relaxed max-w-[90%]">
          Letíš v měsíci <strong>{tripStart ? new Date(tripStart).toLocaleString('cs-CZ', { month: 'long' }) : '?'}</strong>? Nech AI zkontrolovat tvůj sbalený kufr a přihodit tipy podle specifického azorského počasí na tohle roční období. 
          {(!tripStart) && " (Nejdřív ale zadej datum v itineráři)"}
        </p>
        <button 
           onClick={enrichPackingList} 
           disabled={isGenerating || !tripStart}
           className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium w-full active:scale-95 transition shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
         >
          {isGenerating ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/> : <Sparkles size={16}/>}
          {isGenerating ? 'AI prohledává skříně...' : 'Upravit seznam na tělo'}
        </button>
      </div>

      <div className="p-4 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl flex justify-between items-center">
        <div>
          <div className="font-semibold">Balicí seznam</div>
          <div className="text-xs text-neutral-500 mt-1">Zaškrtni co máš</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-accent leading-none">{checked}/{total}</div>
        </div>
      </div>
      
      {currentTemplate.map((g: any, i: number) => (
        <div key={i}>
          <h2 className="text-[13px] font-bold text-neutral-500 uppercase tracking-widest mb-3">{g.group}</h2>
          <div className="bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl overflow-hidden divide-y divide-neutral-100/50 dark:divide-neutral-800/50">
            {g.items.map((item: string, j: number) => {
              const k = `${g.group}-${item}`;
              const isChecked = packing[k] === true;
              const isAiItem = item.match(/^\p{Emoji}.+/u);
              return (
                <button key={j} onClick={() => toggle(k)} className={`flex items-center gap-3 w-full p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition text-left ${isAiItem ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''}`}>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors flex-shrink-0 ${isChecked ? 'bg-accent border-accent text-white' : 'border-neutral-300 dark:border-neutral-700 text-transparent'}`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div className={`text-[14px] ${isChecked ? 'line-through text-neutral-400' : (isAiItem ? 'text-purple-800 font-medium dark:text-purple-200' : 'text-neutral-700 dark:text-neutral-200')}`}>{item}</div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex gap-2 mt-4">
        <button onClick={() => { if (confirm('Resetovat stávající zaškrtnutí seznamu? (AI tipy zůstanou)')) setPacking({}); }} className="flex-1 py-3 bg-neutral-200 dark:bg-neutral-800 rounded-xl font-medium text-sm text-neutral-700 dark:text-neutral-300 active:scale-95 transition">Resetovat seznam</button>
        {template !== null && (
          <button onClick={() => { if (confirm('Odstranit AI tipy a vrátit se k původní šabloně?')) setTemplate(null); }} className="flex-1 py-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-sm active:scale-95 transition">Odsranit AI položky</button>
        )}
      </div>
    </div>
  );
}

function NotesTab({ notes, setNotes }: any) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between px-2 mb-1">
        <span className="text-[13px] font-semibold">Vlastní poznámky</span>
        <span className="text-xs text-neutral-400">Autosave</span>
      </div>
      <textarea 
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="w-full bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl p-4 min-h-[300px] outline-none focus:border-accent resize-y transition-colors"
        placeholder="Restaurace k vyzkoušení, telefony na ubytko..."
      />
    </div>
  );
}
