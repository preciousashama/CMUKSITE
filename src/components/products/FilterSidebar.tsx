'use client';

export default function FilterSidebar({ updateUrl, searchParams }) {
  const selectedCats = searchParams.get('cat')?.split(',') || [];
  
  const toggle = (category: string) => {
    const next = selectedCats.includes(category) 
      ? selectedCats.filter(x => x !== category) 
      : [...selectedCats, category];
    updateUrl({ cat: next });
  };

  return (
    <aside className="w-full lg:w-64 space-y-10">
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6">Style</h4>
        <div className="flex flex-col gap-4">
          {['T-Shirts', 'Hoodies', 'Sweatshirts'].map(cat => (
            <button 
              key={cat} 
              onClick={() => toggle(cat)}
              className={`flex items-center gap-3 text-sm font-bold transition-all ${
                selectedCats.includes(cat) ? 'text-brand-primary translate-x-2' : 'text-slate-500'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${selectedCats.includes(cat) ? 'bg-brand-primary' : 'bg-slate-200'}`} />
              {cat}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}