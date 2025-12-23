'use client';
import { useState } from 'react';

export default function ReviewForm({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(5);

  return (
    <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 shadow-inner">
      <form className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-transform hover:scale-125 ${star <= rating ? 'text-yellow-400' : 'text-slate-200'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Review Title</label>
            <input type="text" className="w-full bg-white border-none rounded-xl p-4 text-sm font-bold shadow-sm" placeholder="Summarize your experience" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Message</label>
            <textarea rows={4} className="w-full bg-white border-none rounded-xl p-4 text-sm font-bold shadow-sm" placeholder="Tell us more about the quality..." />
          </div>
          <button type="submit" className="w-full bg-brand-primary text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
}