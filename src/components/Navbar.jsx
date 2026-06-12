import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as motion from 'motion/react-client';
import { AnimatePresence, useReducedMotion } from 'motion/react';

import { createReveal, createStagger, softSpring, tapMotion } from '../lib/motion';
import { scrollToSection } from '../lib/scroll';
import { SITE_SHELL } from './SectionChrome';

const SECTION_IDS = ['home', 'about', 'projects', 'experience', 'contact'];
const SCROLL_LOCK_MS = 900;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('/#home');
  const [hoveredHref, setHoveredHref] = useState(null);
  const scrollLockRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = useCallback(
    (event, href) => {
      event.preventDefault();
      const sectionId = href.split('#')[1] ?? 'home';

      scrollLockRef.current = href;
      window.setTimeout(() => {
        if (scrollLockRef.current === href) {
          scrollLockRef.current = null;
        }
      }, SCROLL_LOCK_MS);

      setActiveHref(href);
      setScrolled(sectionId !== 'home');
      setIsOpen(false);

      scrollToSection(sectionId, {
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    },
    [shouldReduceMotion],
  );

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && SECTION_IDS.includes(hash)) {
      requestAnimationFrame(() => {
        scrollLockRef.current = `/#${hash}`;
        setActiveHref(`/#${hash}`);
        setScrolled(hash !== 'home');
        scrollToSection(hash, { behavior: 'auto' });
        window.setTimeout(() => {
          scrollLockRef.current = null;
        }, SCROLL_LOCK_MS);
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (scrollLockRef.current) {
        return;
      }

      const currentSection = SECTION_IDS.reduce((current, id) => {
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

  const navSurfaceClass =
    scrolled || isOpen
      ? 'border-[#101617] bg-[#faf9f4]/92 backdrop-blur-md'
      : 'border-transparent bg-transparent shadow-none';

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full border-b-2 py-3 transition-[background-color,box-shadow,backdrop-filter,border-color] duration-300 ${navSurfaceClass}`}
      aria-label="Primary navigation"
    >
      <div className={`${SITE_SHELL} flex items-center justify-between`}>
        <motion.a
          href="/#home"
          onClick={(event) => handleNavClick(event, '/#home')}
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
                onClick={(event) => handleNavClick(event, link.href)}
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
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    variants={createReveal({ y: -10 }, shouldReduceMotion)}
                    whileTap={tapMotion}
                    className="focus-ring rounded-lg p-3 font-extrabold text-[#101617] transition-colors hover:bg-[#ffda18]"
                    aria-current={activeHref === link.href ? 'page' : undefined}
                    onClick={(event) => handleNavClick(event, link.href)}
                  >
                    <span>{link.name}</span>
                  </motion.a>
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
