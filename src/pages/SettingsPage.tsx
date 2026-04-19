import { ExternalLink, Key, ShieldCheck, Palette } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage({ geminiKey, setGeminiKey, navigate, bgMode, setBgMode }: any) {
  const [val, setVal] = useState(geminiKey || '');

  const handleSave = () => {
    setGeminiKey(val.trim());
    alert('Nastavení uloženo!');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-6 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-2xl mb-4">
          <Key size={28} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Nastavení</h1>
        <p className="text-sm text-neutral-500 leading-relaxed mb-6">
          Aby pro tebe aplikace mohla generovat chytré itineráře a reagovat přímo na tvá oblíbená místa, potřebuješ Google Gemini API klíč. 
        </p>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold">Váš Gemini API Klíč</label>
          <input 
            type="password" 
            placeholder="AIzaSy..." 
            value={val}
            onChange={e => setVal(e.target.value)}
            className="w-full p-3 bg-white/80 dark:bg-neutral-950/50 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 outline-none focus:ring-2 focus:ring-accent font-mono text-sm"
          />
          <button 
            onClick={handleSave}
            className="mt-2 w-full py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 active:scale-95 transition shadow-sm"
          >
            Uložit klíč
          </button>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50/80 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-900/30 rounded-xl">
            <ShieldCheck className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-yellow-800 dark:text-yellow-400">
              <span className="font-semibold block mb-1">Bezpečnost a soukromí</span>
              Tento klíč se nikam neodesílá. Uloží se pouze lokálně u tebe v telefonu (Local Storage) a používá se pro komunikaci tvého telefonu přímo s Google servery.
            </div>
          </div>

          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-white/50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-neutral-800/60 transition"
          >
            <div>
              <div className="font-medium text-sm">Získat API klíč zdarma</div>
              <div className="text-xs text-neutral-500 mt-1">Odkaz na Google AI Studio</div>
            </div>
            <ExternalLink size={18} className="text-neutral-400" />
          </a>
        </div>
      </div>

      <div className="p-6 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-2xl mb-4">
          <Palette size={28} />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-2">Vzhled</h2>
        <p className="text-sm text-neutral-500 leading-relaxed mb-6">
          Zvolte si typ pozadí. Dynamické pozadí využívá jemné optimalizované animace (fluid shader).
        </p>

        <div className="flex gap-3">
          <button 
            onClick={() => setBgMode('static')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm border transition-all ${bgMode === 'static' ? 'bg-accent text-white border-accent shadow-sm' : 'bg-white/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-300 border-neutral-200/50 dark:border-neutral-700/50 hover:bg-white/80'}`}
          >
            Statické
          </button>
          <button 
            onClick={() => setBgMode('dynamic')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm border transition-all ${bgMode === 'dynamic' ? 'bg-accent text-white border-accent shadow-sm' : 'bg-white/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-300 border-neutral-200/50 dark:border-neutral-700/50 hover:bg-white/80'}`}
          >
            Dynamické
          </button>
        </div>
      </div>
    </div>
  );
}
