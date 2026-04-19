import { useState } from 'react';
import { SM_DATA } from '../data';

export default function InfoPage() {
  const [tab, setTab] = useState('weather');

  const tabs = [
    { id: 'weather', label: '⛅ Počasí' },
    { id: 'car', label: '🚗 Auto' },
    { id: 'money', label: '💶 Peníze' },
    { id: 'shopping', label: '🛒 Nákupy' },
    { id: 'thermalTips', label: '♨️ Lázně' },
    { id: 'gastro', label: '🍲 Gastro' },
    { id: 'whales', label: '🐋 Velryby' },
    { id: 'phrases', label: '🇵🇹 Fráze' },
    { id: 'etiquette', label: '🤝 Etiketa' },
    { id: 'emergency', label: '🚨 Nouze' }
  ];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {tabs.map((t) => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id)} 
            className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${tab === t.id ? 'bg-accent border-accent text-white' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-2 text-neutral-800 dark:text-neutral-200">
        {tab === 'weather' && <GenericSection data={SM_DATA.PRACTICAL.weather} />}
        {tab === 'car' && <GenericSection data={SM_DATA.PRACTICAL.car} />}
        {tab === 'money' && <GenericSection data={SM_DATA.PRACTICAL.money} />}
        {tab === 'shopping' && <ShoppingView data={SM_DATA.PRACTICAL.shopping} />}
        {tab === 'thermalTips' && <GenericSection data={SM_DATA.PRACTICAL.thermalTips} />}
        {tab === 'gastro' && <GastroView />}
        {tab === 'whales' && <WhalesView />}
        {tab === 'phrases' && <PhrasesView />}
        {tab === 'etiquette' && <GenericSection data={SM_DATA.PRACTICAL.etiquette} />}
        {tab === 'emergency' && <GenericSection data={SM_DATA.PRACTICAL.emergency} />}
      </div>
    </div>
  );
}

function GenericSection({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-lg font-bold flex items-center gap-2">{data.emoji} {data.title}</h2>
      </div>

      {data.sections && data.sections.map((s: any, idx: number) => {
        if (s.items) {
          return (
            <div key={idx} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              {s.title && <div className="bg-neutral-50 dark:bg-neutral-800/50 px-4 py-2 text-[12px] font-bold text-neutral-500 uppercase">{s.title}</div>}
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {s.items.map((it: any, i: number) => (
                  <div key={i} className="p-4">
                    <div className="font-semibold text-[14px]">{it.name}</div>
                    <div className="text-[13px] text-neutral-500 mt-1">{it.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        
        const isWarn = s.type === 'warn' || s.type === 'danger';
        if (s.type) {
          return (
            <div key={idx} className={`p-4 rounded-xl border ${isWarn ? 'bg-orange-50 border-orange-200 text-orange-900' : 'bg-blue-50 border-blue-200 text-blue-900'}`}>
              <div className="font-semibold text-sm mb-1">{isWarn ? '⚠️' : '💡'} {s.title}</div>
              <div className="text-[13px] leading-relaxed">{s.body}</div>
            </div>
          );
        }

        return (
          <div key={idx} className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h3 className="font-semibold text-[15px] mb-2">{s.title}</h3>
            <p className="text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-300">{s.body}</p>
          </div>
        );
      })}

      {data.items && (
        <div className="flex flex-col gap-3">
          {data.items.map((it: any, i: number) => (
             <div key={i} className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="font-semibold text-[14px] mb-1">{it.name}</div>
              <div className="text-[13px] text-neutral-500">{it.detail}</div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShoppingView({ data }: { data: any }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-lg font-bold flex items-center gap-2">{data.emoji} {data.title}</h2>
      </div>
      <div className="flex flex-col gap-3">
        {data.chains.map((c: any, i: number) => (
          <div key={i} className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="font-semibold text-[14px] mb-1">{c.name}</div>
            <div className="text-[13px] text-neutral-500 leading-relaxed">{c.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GastroView() {
  const data = SM_DATA.GASTRO;
  return (
     <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-lg font-bold flex items-center gap-2">🍲 {data.title}</h2>
      </div>
      <div className="flex flex-col gap-4">
        {data.specialities.map((s: any, i: number) => (
          <div key={i} className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
             <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{s.emoji}</div>
                <div>
                  <div className="font-bold text-[15px]">{s.name}</div>
                  <div className="text-[12px] text-neutral-500 mt-0.5">{s.price}</div>
                </div>
              </div>
             </div>
             <p className="text-[14px] leading-relaxed mb-4 text-neutral-700 dark:text-neutral-300">{s.description}</p>
             <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 text-[13px] text-neutral-600 dark:text-neutral-300 flex gap-2">
              <span>📍</span> <span>{s.where}</span>
             </div>
          </div>
        ))}
      </div>
     </div>
  );
}

function WhalesView() {
  const data = SM_DATA.WHALES;
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-lg font-bold flex items-center gap-2">🐋 {data.title}</h2>
        <p className="text-[14px] leading-relaxed mt-3 text-neutral-600 dark:text-neutral-300">{data.intro}</p>
      </div>

      <h3 className="text-[13px] font-bold text-neutral-500 uppercase tracking-widest mt-2 ml-1">Druhy kytovců</h3>
      <div className="flex flex-col gap-2">
        {data.species.map((s: any, i: number) => (
          <div key={i} className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
            <div>
              <div className="font-semibold text-[14px]">{s.name}</div>
              <div className="text-[11px] italic text-neutral-500">{s.latin}</div>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.type === 'Rezidentní' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>{s.type}</span>
              <div className="text-[11px] text-neutral-500 mt-1">{s.season}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhrasesView() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-lg font-bold flex items-center gap-2">🇵🇹 Užitečné fráze</h2>
      </div>
      <div className="flex flex-col gap-2">
        {SM_DATA.PHRASES.map((p: any, i: number) => (
          <div key={i} className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="font-semibold text-[13px] text-neutral-500 mb-1">{p.cz}</div>
            <div className="flex justify-between items-end">
              <div className="text-[17px] font-bold text-accent">{p.pt}</div>
              <div className="text-[14px] text-neutral-500 italic">[{p.phon}]</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
