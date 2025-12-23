'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const STEPS = [
  { title: "Digital Brief", desc: "Submit your vision via our customisation form." },
  { title: "Art Consultation", desc: "Our lead designers review your item's material and your design goals." },
  { title: "Quote & Contract", desc: "Receive a formal estimate and sign our premium protection agreement." },
  { title: "Secure Intake", desc: "Ship your item to our London studio using tracked delivery." },
  { title: "Transformation", desc: "The customisation process begins. Minimum 10-14 business days." },
  { title: "Return Drop", desc: "Your upgraded piece is shipped back in CMUK collector packaging." }
];

export default function SendItemsPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-24">
      {/* Header Section */}
      <header className="mb-24 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary mb-4"
        >
          Exclusive Service
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-brand-dark leading-none"
        >
          Send <span className="text-brand-primary">Items</span> In
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left: Description */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-brand-dark mb-4">
              Bespoke Customisation
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Don't just buy new—upgrade what you own. Our "Send Items In" service allows you to 
              ship your personal jackets, denim, or footwear directly to our studio. 
              We treat every piece as a canvas for high-end streetwear art.
            </p>
          </section>

          <div className="p-10 border-2 border-brand-dark rounded-[2.5rem] flex flex-col items-center text-center">
            <span className="text-4xl mb-4">⏳</span>
            <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400">Processing Time</h3>
            <p className="text-xl font-black italic uppercase text-brand-dark mt-2">10–14 Business Days</p>
          </div>
        </div>

        {/* Right: The Timeline */}
        <div className="lg:col-span-7">
          <div className="relative space-y-12">
            {/* Vertical Line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 hidden md:block" />

            {STEPS.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative md:pl-16 flex flex-col gap-2"
              >
                {/* Step Circle */}
                <div className="hidden md:flex absolute left-0 top-0 w-8 h-8 bg-white border-4 border-brand-primary rounded-full z-10 items-center justify-center">
                  <span className="text-[10px] font-black">{idx + 1}</span>
                </div>
                
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-brand-dark">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <Link 
              href="/custom-request" 
              className="group block w-full bg-brand-dark text-white p-8 rounded-[2rem] text-center hover:bg-brand-primary transition-all duration-500 shadow-xl shadow-slate-200"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100">Ready to begin?</span>
              <h4 className="text-3xl font-black italic uppercase tracking-tighter mt-2">Start Custom Request</h4>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}