import React from 'react';
import { motion } from 'framer-motion';
import { Scroll, FileText } from 'lucide-react';

import { SootSprite } from './GhibliAssets';

const Legislation = () => {
  return (
    <section className="py-24 px-4 max-w-4xl mx-auto relative">
      <SootSprite className="absolute top-10 right-10 w-10 h-10 opacity-10 rotate-12 hidden md:block" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-emerald-100 text-emerald-800 border-2 border-emerald-800 shadow-[4px_4px_0px_0px_rgba(6,78,59,0.3)] mb-6">
          <Scroll size={32} />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 font-heading mb-4">Legislation</h2>
        <p className="text-slate-600 text-lg font-body">Legislation authored and passed during my time in Student Government.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-[#fdfbf7] p-8 md:p-12 rounded-sm border-2 border-[#e2e8f0] shadow-lg relative overflow-hidden"
        style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/aged-paper.png"), linear-gradient(to bottom right, #fffdf5, #f0fdf4)`,
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)"
        }}
      >
        {/* Decorative header line */}
        <div className="w-full h-2 bg-emerald-800/20 mb-8 rounded-full"></div>

        <div className="font-serif text-slate-800 space-y-6">
            <div className="text-center border-b-2 border-slate-200 pb-6 mb-6">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 font-heading">A Resolution in Support of Recycling Initiatives</h3>
                <div className="text-sm text-slate-500 font-mono uppercase tracking-wider">103 LCR 02 • Passed September 3, 2025</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-8 bg-white/50 p-4 rounded-lg border border-slate-200">
                <div>
                    <span className="font-bold text-slate-700 block mb-1">Prime Sponsor & Author:</span>
                    <span className="text-slate-600">Luke Pitstick</span>
                    <span className="text-slate-500 text-xs block">Historian | Representative-at-Large</span>
                </div>
            </div>

            <div className="prose prose-slate max-w-none font-body">
                <p className="italic text-slate-600">
                    "Whereas, the University of Colorado Boulder is committed to a zero-waste campus by 2025... and whereas, CU should strive for bin parity while also supporting recycling initiatives..."
                </p>

                <h4 className="font-bold text-lg mt-6 mb-2 font-heading text-emerald-800">Resolution Summary</h4>
                <p>
                    This resolution calls on the Environmental Center, Recycling Operations Center, and Facilities Management to pursue <strong>"bin parity"</strong>—ensuring every trash bin is accompanied by recycling options.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                    <li><strong>Campus-wide Audit:</strong> A comprehensive review of all waste bin locations.</li>
                    <li><strong>Classroom Consolidation:</strong> Removing individual trash bins from small classrooms to encourage central collection.</li>
                    <li><strong>Hallway Parity:</strong> Adding or removing bins in common areas to ensure equal access to recycling and trash disposal.</li>
                    <li><strong>Updated Signage:</strong> Ensuring all disposal areas have clear, up-to-date instructions consistent with Environmental Center standards.</li>
                </ul>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <FileText size={20} />
                    <span>Status: Passed</span>
                </div>
            </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Legislation;
