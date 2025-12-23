'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

// Mock data - eventually this comes from your DB
const MOCK_REVIEWS = [
  { id: 1, user: "Alex M.", rating: 5, title: "Best Hoodie Ever", body: "The print quality is insane.", date: "2023-10-12", product: "Hoodies" },
  { id: 2, user: "Sarah J.", rating: 4, title: "Great stickers", body: "Very durable, but shipping took a week.", date: "2023-11-05", product: "Stickers" },
];

export default function ReviewFeed() {
  const [showForm, setShowForm] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredReviews = useMemo(() => {
    let result = [...MOCK_REVIEWS];
    if (filterRating !== 'all') {
      result = result.filter(r => r.rating === parseInt(filterRating));
    }
    // Sort logic
    if (sortBy === 'highest') result.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return result;
  }, [filterRating, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <section className="text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-brand-dark">
          Verified <span className="text-brand-primary">Feedback</span>
        </h1>
        
        {/* Filter Bar */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <select 
            onChange={(e) => setFilterRating(e.target.value)}
            className="bg-slate-50 border-none rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none ring-2 ring-slate-100"
          >
            <option value="all">All Ratings</option>
            {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} Stars</option>)}
          </select>

          <select 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border-none rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none ring-2 ring-slate-100"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rating</option>
          </select>

          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-primary transition-colors"
          >
            {showForm ? 'Close Form' : 'Write a Review'}
          </button>
        </div>
      </section>

      {/* Animated Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-20"
          >
            <ReviewForm onClose={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}