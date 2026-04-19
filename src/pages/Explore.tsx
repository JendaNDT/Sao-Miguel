import { useState, useRef } from 'react';
import { SM_DATA } from '../data';
import { ListItem } from '../components/ListItem';
import { Search, ChefHat, Sparkles, Upload, X, Camera } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

export default function Explore({ navigate, favorites = [], toggleFav, geminiKey }: any) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const q = search.trim().toLowerCase();

  const cats = [
    { id: 'all', emoji: '🌐', label: 'Vše' },
    ...Object.values(SM_DATA.CATEGORIES)
  ];

  let places = SM_DATA.PLACES.slice();
  if (filter !== 'all' && filter !== 'trail') {
    places = places.filter(p => p.category === filter);
  } else if (filter === 'trail') {
    places = [];
  }
  if (q) {
    places = places.filter(p => p.name.toLowerCase().includes(q) || p.short.toLowerCase().includes(q));
  }

  let trails = SM_DATA.TRAILS.slice();
  if (filter !== 'all' && filter !== 'trail') trails = [];
  if (q) {
    trails = trails.filter(t => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q));
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        <input 
          type="search" 
          placeholder="Hledat lokaci, trasu..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-xl py-3 pl-10 pr-4 outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {cats.map(c => (
          <button 
            key={c.id} 
            onClick={() => setFilter(c.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${filter === c.id ? 'bg-accent border-accent text-white shadow-sm' : 'bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md border-neutral-200/50 dark:border-neutral-800/50 text-neutral-700 dark:text-neutral-300 hover:bg-white/90 dark:hover:bg-neutral-800/80 shadow-sm'}`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 mt-2">
        {filter === 'gastro' && <FoodSommelier geminiKey={geminiKey} navigate={navigate} />}

        {places.length === 0 && trails.length === 0 && (
          <div className="py-12 text-center text-neutral-500">
            <div className="text-4xl mb-4">🔍</div>
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">Nic jsme nenašli</div>
            <div className="text-sm mt-1">Zkuste jiný filtr nebo vyhledávání.</div>
          </div>
        )}

        {places.length > 0 && (
          <div>
            <h2 className="text-[13px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Lokace · {places.length}</h2>
            <div className="flex flex-col gap-2">
              {places.map((p: any) => (
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
        )}

        {trails.length > 0 && (
          <div>
            <h2 className="text-[13px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Trasy · {trails.length}</h2>
            <div className="flex flex-col gap-2">
              {trails.map((t: any) => {
                const favId = 'trail-' + t.id;
                return (
                  <ListItem 
                    key={t.id} 
                    data={t} 
                    isTrail 
                    onClick={() => navigate('detail', favId)} 
                    isFav={favorites.includes(favId)}
                    onToggleFav={() => toggleFav && toggleFav(favId)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FoodSommelier({ geminiKey, navigate }: any) {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // reset
    setResult(null);
    setImage(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setImage(base64);
      analyzeMenu(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeMenu = async (base64Image: string) => {
    if (!geminiKey) {
       alert("Pro tuto funkci potřebuješ uložit API klíč v Nastavení.");
       navigate('settings');
       return;
    }
    setIsAnalyzing(true);
    setResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const base64Data = base64Image.split(',')[1];
      const mimeType = base64Image.split(';')[0].split(':')[1];
      
      const prompt = `
Jsi lokální "Food Sommelier" pro ostrov São Miguel na Azorech. 
Uživatel vyfotil lístek z restaurace v portugalštině.
Tvé úkoly:
1. Přečti hlavní portugalské texty jídel na obrázku a přelož je stručně do češtiny (nepřekládej úplně všechno, vyber ty podstatná jídla).
2. Pokud najdeš nějakou azorskou specialitu (např. Bife, Lapas, Cozido, chobotnice, sýry, ananas, maracujá atd.), VÝRAZNĚ na ni upozorni, pochval ji a řekni, co to je.
3. Odpověz v hezkém formátování pomocí Markdown, používej emojis, buď stručný, užitečný a přátelský.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          }
        ]
      });

      setResult(response.text);
    } catch(e) {
      console.error(e);
      setResult("Omlouváme se, překlad se nepovedl. Zkontroluj foťák nebo API klíč.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200/50 dark:border-orange-800/30 rounded-2xl p-5 relative overflow-hidden animate-in fade-in zoom-in-95">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <ChefHat size={80} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-bold text-orange-900 dark:text-orange-300">Food Sommelier</h3>
            <p className="text-[11px] font-semibold text-orange-600/80 dark:text-orange-400/80 uppercase tracking-widest leading-none">AI Překladač menu</p>
          </div>
        </div>

        <p className="text-[13px] text-orange-800/80 dark:text-orange-200/80 mb-4 leading-relaxed max-w-[90%] mt-3">
          Nerozumíš lístku v místní taverně? Vyfoť ho. Zvýrazním ti to nejlepší z azorské kuchyně, abys nepropásl třeba čerstvé Lapas.
        </p>

        <div className="flex gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 text-white px-4 py-2.5 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-sm active:scale-95 transition"
          >
            <Camera size={18} /> Vyfotit lístek
          </button>
        </div>
        
        <input 
          type="file" 
          accept="image/*" 
          capture="environment"
          ref={fileInputRef}
          onChange={handleCapture}
          className="hidden"
        />

        {(image || isAnalyzing || result) && (
          <div className="mt-4 pt-4 border-t border-orange-200/50 dark:border-orange-800/30">
            {image && !result && !isAnalyzing && (
              <img src={image} alt="Menu" className="w-full max-h-48 object-cover rounded-xl border border-orange-200/50 dark:border-orange-800/50 opacity-50 grayscale mb-3" />
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-6 gap-3 text-orange-700 dark:text-orange-400">
                <div className="w-6 h-6 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"/>
                <span className="text-sm font-medium">Sommelier študuje lístek...</span>
              </div>
            )}

            {result && (
              <div className="prose prose-sm dark:prose-invert prose-orange max-w-none text-[14px]">
                <div className="markdown-body text-orange-900 dark:text-orange-100">
                  <Markdown>{result}</Markdown>
                </div>
              </div>
            )}
            
            {result && (
              <button 
                onClick={() => { setResult(null); setImage(null); }}
                className="mt-4 text-[13px] font-semibold text-orange-600 dark:text-orange-400 flex items-center justify-center w-full gap-1 p-2 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg transition"
              >
                <X size={14} /> Skrýt překlad
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
