import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { SM_DATA } from '../data';
import { ChevronRight, Search } from 'lucide-react';

function createCustomIcon(emoji: string, color: string) {
  return L.divIcon({
    className: 'sm-marker',
    html: `<div style="width:34px;height:34px;border-radius:50% 50% 50% 0;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid #fff;"><span style="transform:rotate(45deg);font-size:16px;line-height:1;">${emoji}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 30],
    popupAnchor: [0, -28]
  });
}

export default function MapPage({ navigate }: any) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const cats = [
    { id: 'all', emoji: '🌐', label: 'Vše' },
    ...Object.values(SM_DATA.CATEGORIES).filter((c: any) => c.id !== 'city'),
    { id: 'city', emoji: '🏘️', label: 'Města' }
  ];

  const markers = useMemo(() => {
    let items = SM_DATA.PLACES.slice();
    if (filter !== 'all') items = items.filter(p => p.category === filter);
    
    let trails = (filter === 'all' || filter === 'trail') ? SM_DATA.TRAILS.slice() : [];

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.short.toLowerCase().includes(q));
      trails = trails.filter(t => t.name.toLowerCase().includes(q) || t.code?.toLowerCase().includes(q));
    }

    return { items, trails };
  }, [filter, search]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative mb-3 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        <input 
          type="text"
          placeholder="Hledat na mapě..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-xl py-2 pl-10 pr-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition text-sm" 
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide flex-shrink-0">
        {cats.map((c: any) => (
          <button 
            key={c.id} 
            onClick={() => setFilter(c.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${filter === c.id ? 'bg-accent border-accent text-white shadow-sm' : 'bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md border-neutral-200/50 dark:border-neutral-800/50 text-neutral-700 dark:text-neutral-300 hover:bg-white/90 dark:hover:bg-neutral-800/80 shadow-sm'}`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 shadow-md relative z-0">
        <MapContainer 
          center={[37.79, -25.5]} 
          zoom={10} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
          />
          
          {markers.items.map((p: any) => {
            const cat = (SM_DATA.CATEGORIES as any)[p.category];
            return (
              <Marker 
                key={p.id} 
                position={p.coords as [number, number]} 
                icon={createCustomIcon(cat.emoji, cat.color)}
              >
                <Popup>
                  <div className="font-sans">
                    <div className="font-bold text-[14px] leading-tight mb-1">{p.name}</div>
                    <div className="text-neutral-500 text-[12px] mb-2">{cat.label}</div>
                    <button onClick={() => navigate('detail', p.id)} className="text-accent text-[13px] font-medium flex items-center gap-1">Detail <ChevronRight size={14}/></button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {markers.trails.map((t: any) => (
             <Marker 
              key={`trail-${t.id}`} 
              position={t.start as [number, number]} 
              icon={createCustomIcon('🥾', '#15803d')}
            >
              <Popup>
                <div className="font-sans">
                  <div className="font-bold text-[14px] leading-tight mb-1">{t.name}</div>
                  <div className="text-neutral-500 text-[12px] mb-2">{t.code} · {t.lengthKm} km</div>
                  <button onClick={() => navigate('detail', 'trail-' + t.id)} className="text-accent text-[13px] font-medium flex items-center gap-1">Detail <ChevronRight size={14}/></button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
