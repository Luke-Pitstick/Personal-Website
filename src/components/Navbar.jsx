import React, { useState, useEffect } from 'react';
import { Menu, X, Home, User, Briefcase, Mail } from 'lucide-react';
import * as motion from 'motion/react-client';
import { AnimatePresence, useReducedMotion } from 'motion/react';

import { SootSprite } from './GhibliAssets';
import { createReveal, createStagger, softSpring, tapMotion } from '../lib/motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('/#home');
  const [hoveredHref, setHoveredHref] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const navLinks = [
    { name: 'Home', href: '/#home', icon: Home },
    { name: 'About', href: '/#about', icon: User },
    { name: 'Projects', href: '/#projects', icon: Briefcase },
    { name: 'Contact', href: '/#contact', icon: Mail },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const currentSection = ['home', 'about', 'projects', 'contact'].reduce((current, id) => {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= 140 ? id : current;
      }, 'home');

      if (currentSection) {
        setActiveHref(`/#${currentSection}`);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full transition-[background-color,box-shadow,padding,backdrop-filter] duration-300 ${
        scrolled || isOpen ? 'bg-white/90 py-2 shadow-sm backdrop-blur-md' : 'bg-transparent py-4'
      }`}
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <motion.a
          href="/#home"
          whileHover={shouldReduceMotion ? { opacity: 0.82 } : { y: -1 }}
          whileTap={tapMotion}
          transition={softSpring}
          className="focus-ring group flex min-w-0 items-center gap-2 rounded-lg font-heading text-xl font-bold text-emerald-950 transition-opacity hover:opacity-80 sm:text-2xl"
          aria-label="Luke Pitstick home"
        >
          <SootSprite className="h-8 w-8 -translate-y-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
          <span className="truncate">Luke Pitstick</span>
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-5 md:flex lg:gap-7">
          {navLinks.map((link) => {
            const isHighlighted = (hoveredHref || activeHref) === link.href;
            const Icon = link.icon;

            return (
            <motion.a
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHoveredHref(link.href)}
              onMouseLeave={() => setHoveredHref(null)}
              onFocus={() => setHoveredHref(link.href)}
              onBlur={() => setHoveredHref(null)}
              onClick={() => setActiveHref(link.href)}
              whileHover={shouldReduceMotion ? undefined : { y: -1 }}
              whileTap={tapMotion}
              transition={softSpring}
              className="focus-ring relative flex items-center gap-2 rounded-lg px-1 text-sm font-bold text-emerald-900 transition-colors hover:text-emerald-600 lg:text-base"
              aria-current={activeHref === link.href ? 'page' : undefined}
            >
              <Icon size={18} aria-hidden="true" focusable="false" />
              <span>{link.name}</span>
              {isHighlighted && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-emerald-600"
                  transition={softSpring}
                />
              )}
            </motion.a>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          type="button"
          className="focus-ring rounded-lg p-2 text-emerald-950 transition-colors hover:bg-white/70 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={tapMotion}
          transition={softSpring}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={24} aria-hidden="true" focusable="false" /> : <Menu size={24} aria-hidden="true" focusable="false" />}
        </motion.button>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              variants={createStagger(0.05, 0.06)}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -14, transition: { duration: 0.18 } }}
              className="absolute left-0 top-full w-full border-t border-slate-100 bg-white shadow-lg md:hidden"
              id="mobile-menu"
            >
              <div className="flex flex-col gap-2 p-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                  <motion.a
                    key={link.name} 
                    href={link.href} 
                    variants={createReveal({ y: -10 }, shouldReduceMotion)}
                    whileTap={tapMotion}
                    className="focus-ring flex items-center gap-3 rounded-lg p-3 font-bold text-emerald-900 transition-colors hover:bg-emerald-50"
                    aria-current={activeHref === link.href ? 'page' : undefined}
                    onClick={() => {
                      setActiveHref(link.href);
                      setIsOpen(false);
                    }}
                  >
                    <Icon size={18} aria-hidden="true" focusable="false" />
                    <span>{link.name}</span>
                  </motion.a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
