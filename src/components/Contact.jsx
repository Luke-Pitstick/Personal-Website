import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { SootSprite } from './GhibliAssets';

const Contact = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 px-4 border-t-4 border-emerald-800/20 bg-white/50 backdrop-blur-lg overflow-hidden">
      <SootSprite className="absolute -bottom-2 right-20 w-12 h-12 opacity-20 rotate-12" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-slate-800 font-heading">
            Let's Connect
          </h3>
          <p className="text-slate-600 mt-1 font-body">Open for opportunities and collaborations.</p>
        </div>

        <div className="flex gap-6">
          <a href="https://github.com/Luke-Pitstick" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-emerald-700 transition-colors hover:scale-110">
            <Github size={28} />
          </a>
          <a href="https://www.linkedin.com/in/luke-pitstick-2ab1a5239/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-sky-700 transition-colors hover:scale-110">
            <Linkedin size={28} />
          </a>
          <a href="mailto:contact@lukepitstick.com" className="text-slate-600 hover:text-emerald-600 transition-colors hover:scale-110">
            <Mail size={28} />
          </a>
        </div>

        <button 
          onClick={scrollToTop}
          className="p-3 rounded-full bg-white border-2 border-emerald-800 hover:bg-emerald-50 transition-colors text-emerald-800 shadow-[2px_2px_0px_0px_rgba(6,78,59,1)]"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      </div>
      
      <div className="text-center mt-12 text-slate-500 text-sm font-body">
        © {new Date().getFullYear()} Luke Pitstick. Built with Astro & React.
      </div>
    </footer>
  );
};

export default Contact;
