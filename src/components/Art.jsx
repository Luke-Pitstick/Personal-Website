import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Image as ImageIcon } from 'lucide-react';

const artPieces = [
  {
    title: "Digital Landscape",
    description: "A study of light and shadow in a digital medium.",
    color: "bg-rose-100",
    icon: <ImageIcon className="text-rose-500" />
  },
  {
    title: "Character Design",
    description: "Concept art for a personal project.",
    color: "bg-amber-100",
    icon: <Palette className="text-amber-500" />
  },
  {
    title: "Abstract Flow",
    description: "Exploring fluid dynamics through generative art.",
    color: "bg-blue-100",
    icon: <ImageIcon className="text-blue-500" />
  }
];

const Art = () => {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-purple-100 text-purple-800 mb-4">
          <Palette size={24} />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 font-heading">Creative <span className="text-purple-700">Art</span></h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg font-body">
          Beyond code and policy, I express myself through visual arts. Here are some of my recent creations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {artPieces.map((art, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-white hover:shadow-xl transition-shadow"
          >
            <div className={`absolute inset-0 ${art.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
              <div className="opacity-50">
                {art.icon}
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h3 className="text-white font-bold text-xl font-heading">{art.title}</h3>
              <p className="text-slate-200 text-sm font-body">{art.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Art;
