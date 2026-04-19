import { ChevronRight, Heart } from 'lucide-react';

export function ListItem({ data, category, onClick, isTrail = false, isFav = false, onToggleFav }: any) {
  return (
    <button onClick={onClick} className="flex gap-3 items-center w-full p-3 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-xl hover:bg-neutral-50/80 dark:hover:bg-neutral-800/80 transition active:scale-[0.98] text-left">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{ backgroundColor: isTrail ? '#15803d20' : `${category.color}20`, color: isTrail ? '#15803d' : category.color }}>
        {isTrail ? '🥾' : category.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[15px] text-neutral-900 dark:text-neutral-100 truncate">{data.name}</div>
        <div className="text-[13px] text-neutral-500 truncate mt-0.5" dangerouslySetInnerHTML={{ __html: isTrail ? `${data.code} &middot; ${data.lengthKm.toFixed(1)} km` : data.short }} />
      </div>
      <div className="flex items-center gap-2">
        {isTrail && data.difficulty && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${data.difficulty === 'Snadná' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400'}`}>
            {data.difficulty}
          </span>
        )}
        
        {onToggleFav ? (
          <div 
            onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
            className={`p-1.5 -mr-1 rounded-full transition-colors ${isFav ? 'text-accent hover:text-emerald-700' : 'text-neutral-300 hover:text-red-400 dark:text-neutral-600 dark:hover:text-red-400'}`}
          >
            <Heart size={20} fill={isFav ? "currentColor" : "none"} strokeWidth={isFav ? 0 : 2} className={isFav ? "" : "stroke-current"} />
          </div>
        ) : (
          <ChevronRight size={18} className="text-neutral-400" />
        )}
      </div>
    </button>
  );
}
