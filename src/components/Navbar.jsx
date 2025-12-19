import React, { useState, useEffect } from 'react';
import { Menu, X, Home, User, Briefcase, FileText, PenTool, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { SootSprite } from './GhibliAssets';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home size={18} /> },
    { name: 'About', href: '/about', icon: <User size={18} /> },
    { name: 'Projects', href: '/projects', icon: <Briefcase size={18} /> },
    { name: 'Resume', href: '/resume', icon: <FileText size={18} /> },
    { name: 'Legislation', href: '/legislation', icon: <FileText size={18} /> },
    //{ name: 'Art', href: '/art', icon: <Palette size={18} /> },
    //{ name: 'Blog', href: '/blog', icon: <PenTool size={18} /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2 text-2xl font-heading font-bold text-emerald-900 hover:opacity-80 transition-opacity group">
          <SootSprite className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-1" />
          <span>Luke Pitstick</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="flex items-center gap-2 text-emerald-800 font-bold hover:text-emerald-600 transition-colors relative group"
            >
              {link.icon}
              <span>{link.name}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-emerald-900 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-slate-100 md:hidden"
            >
              <div className="flex flex-col p-4 gap-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className="flex items-center gap-3 text-emerald-800 font-bold p-2 hover:bg-emerald-50 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
