import React, { useState, useEffect } from 'react';
import * as motion from 'motion/react-client';
import { AnimatePresence, useReducedMotion } from 'motion/react';

import { createReveal, createStagger, softSpring, tapMotion } from '../lib/motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('/#home');
  const [hoveredHref, setHoveredHref] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Contact', href: '/#contact' },
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
        scrolled || isOpen ? 'border-b-2 border-[#101617] bg-[#faf9f4]/92 py-2 shadow-[0_5px_0_rgba(255,58,18,0.8)] backdrop-blur-md' : 'bg-transparent py-4'
      }`}
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <motion.a
          href="/#home"
          whileHover={shouldReduceMotion ? { opacity: 0.82 } : { y: -1 }}
          whileTap={tapMotion}
          transition={softSpring}
          className="focus-ring group flex min-w-0 items-center rounded-lg font-heading text-xl font-bold text-[#101617] transition-opacity hover:opacity-80 sm:text-2xl"
          aria-label="Luke Pitstick home"
        >
          <span className="truncate">Luke Pitstick</span>
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-5 md:flex lg:gap-7">
          {navLinks.map((link) => {
            const isHighlighted = (hoveredHref || activeHref) === link.href;

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
              className="focus-ring relative rounded-lg px-1 text-sm font-extrabold text-[#101617] transition-colors hover:text-[#ff3a12] lg:text-base"
              aria-current={activeHref === link.href ? 'page' : undefined}
            >
              <span>{link.name}</span>
              {isHighlighted && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-[#ff3a12]"
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
          className="focus-ring rounded-lg border-2 border-[#101617] bg-[#faf9f4]/80 px-3 py-2 text-sm font-extrabold text-[#101617] shadow-[3px_3px_0_0_rgba(255,58,18,0.9)] transition-colors hover:bg-[#ffda18] md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={tapMotion}
          transition={softSpring}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? 'Close' : 'Menu'}
        </motion.button>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              variants={createStagger(0.05, 0.06)}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -14, transition: { duration: 0.18 } }}
              className="absolute left-0 top-full w-full border-y-2 border-[#101617] bg-[#faf9f4] shadow-[0_5px_0_rgba(255,58,18,0.8)] md:hidden"
              id="mobile-menu"
            >
              <div className="flex flex-col gap-2 p-4">
                {navLinks.map((link) => {
                  return (
                  <motion.a
                    key={link.name} 
                    href={link.href} 
                    variants={createReveal({ y: -10 }, shouldReduceMotion)}
                    whileTap={tapMotion}
                    className="focus-ring rounded-lg p-3 font-extrabold text-[#101617] transition-colors hover:bg-[#ffda18]"
                    aria-current={activeHref === link.href ? 'page' : undefined}
                    onClick={() => {
                      setActiveHref(link.href);
                      setIsOpen(false);
                    }}
                  >
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
