'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const REVIEWS = [
  "Amazing quality prints!", "Fast delivery service", "Love my custom shirt!",
  "Professional team", "Great customer support", "Excellent value",
  "Highly recommended!", "Perfect party supplies", "Quick turnaround", "Outstanding quality"
];

export default function BubbleReviews() {
  return (
    <section className="relative py-24 bg-brand-dark overflow-hidden min-h-[600px]">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase">
            Our Reviews
          </h2>
          <Link href="/all-reviews" 
            className="mt-6 inline-block bg-brand-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform">
            Read More
          </Link>
        </div>

        {/* The Bubbles Container */}
        <div className="absolute inset-0 z-0 opacity-50">
          {REVIEWS.map((text, i) => (
            <motion.div
              key={i}
              className="absolute p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-center text-[10px] font-black uppercase text-white tracking-tighter cursor-pointer"
              style={{
                width: 140,
                height: 140,
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 70}%`,
              }}
              animate={{
                x: [0, Math.random() * 40 - 20, 0],
                y: [0, Math.random() * 40 - 20, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "linear"
              }}
              whileHover={{ scale: 1.2, backgroundColor: "rgba(37, 99, 235, 0.4)", zIndex: 50 }}
            >
              {text}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}