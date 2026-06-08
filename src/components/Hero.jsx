import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import DitheredHeroCanvas from './DitheredHeroCanvas';
import { softSpring, tapMotion } from '../lib/motion';

const emailAddress = 'contact@lukepitstick.com';

const SOCIAL_HIDE_SCROLL_Y = 96;

const Hero = () => {
  const [socialsVisible, setSocialsVisible] = React.useState(true);
  const [arrowPinned, setArrowPinned] = React.useState(false);
  const [arrowVisible, setArrowVisible] = React.useState(true);
  const [arrowTop, setArrowTop] = React.useState(80);
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollPastHero = () => {
    const home = document.getElementById('home');
    if (!home) return;

    const top = home.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({
      top,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  React.useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const home = document.getElementById('home');
      const nav = document.querySelector('nav[aria-label="Primary navigation"]');
      const navBottom = nav?.getBoundingClientRect().bottom ?? 80;
      const homeBottom = home?.getBoundingClientRect().bottom ?? 0;

      setSocialsVisible(scrollY < SOCIAL_HIDE_SCROLL_Y);
      setArrowPinned(scrollY >= SOCIAL_HIDE_SCROLL_Y);
      setArrowTop(navBottom + 8);
      setArrowVisible(homeBottom > navBottom + 48);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative grid min-h-screen overflow-hidden bg-[#f8f7f1] px-4 text-[#101617]"
    >
      <DitheredHeroCanvas />

      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : y,
          opacity: shouldReduceMotion ? 1 : opacity,
        }}
        className="pointer-events-none relative z-30 mx-auto grid min-h-screen w-full max-w-6xl content-start justify-items-center pt-[clamp(7.5rem,16vh,11rem)] text-center"
      >
        <motion.div className="grid w-full justify-items-center gap-6">
          <div className="hero-identity motion-reveal [--motion-delay:0.18s] [--reveal-scale:0.98] [--reveal-y:16px]">
            <motion.figure className="hero-profile-frame m-0">
              <img
                src="/pictureofme.jpg"
                alt="Luke Pitstick"
                className="h-full w-full object-cover object-[50%_24%]"
                width="4000"
                height="6000"
              />
            </motion.figure>

            <motion.h1 className="dithered-hero-title m-0 max-w-[9ch] font-heading font-bold">
              Luke Pitstick
            </motion.h1>
          </div>

          <motion.p className="motion-reveal mx-auto max-w-2xl bg-[#101617] px-3 py-2 font-body text-base font-extrabold leading-relaxed text-[#f5f0d8] shadow-[8px_8px_0_rgba(255,58,18,0.9)] sm:text-xl md:text-2xl [--motion-delay:0.38s] [--reveal-y:12px]">
            AI/ML research and software development for practical, human-centered tools.
          </motion.p>

          <motion.div
            initial={false}
            animate={{
              opacity: socialsVisible ? 1 : 0,
              y: socialsVisible ? 0 : 12,
            }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.3, ease: 'easeOut' }}
            className="pointer-events-auto flex flex-wrap justify-center gap-4 pt-2 sm:gap-5"
            style={{ pointerEvents: socialsVisible ? 'auto' : 'none' }}
            aria-hidden={!socialsVisible}
          >
            <SocialLink href="https://github.com/Luke-Pitstick" label="GitHub" delay="0.62s" />
            <SocialLink href="https://www.linkedin.com/in/luke-pitstick" label="LinkedIn" delay="0.69s" />
            <SocialLink href={`mailto:${emailAddress}`} label="Email" delay="0.76s" local />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={scrollPastHero}
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: arrowVisible ? 1 : 0,
          y: arrowVisible ? 0 : 8,
        }}
        whileHover={shouldReduceMotion ? { scale: 1.03 } : { y: -4, scale: 1.03 }}
        whileTap={tapMotion}
        transition={{ duration: shouldReduceMotion ? 0.15 : 0.25, ease: 'easeOut' }}
        style={{
          x: '-50%',
          top: arrowPinned ? arrowTop : undefined,
          pointerEvents: arrowVisible ? 'auto' : 'none',
        }}
        className={`focus-ring left-1/2 z-40 rounded-full border-2 border-[#101617] bg-[#faf9f4]/90 px-4 py-2 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[#101617] shadow-[4px_4px_0_0_rgba(255,58,18,0.9)] backdrop-blur-sm transition-[background-color,box-shadow,color,transform,top] duration-300 hover:bg-[#ffda18] hover:shadow-[6px_6px_0_0_rgba(16,22,23,0.9)] ${
          arrowPinned ? 'fixed' : 'absolute bottom-4'
        }`}
        aria-label="Scroll past hero to about section"
        aria-hidden={!arrowVisible}
      >
        <motion.span
          animate={shouldReduceMotion ? { y: 0 } : { y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
          className="block"
        >
          Scroll
        </motion.span>
      </motion.button>
    </section>
  );
};

const SocialLink = ({ href, label, delay = '0s', local = false }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      target={local ? undefined : "_blank"}
      rel={local ? undefined : "noopener noreferrer"}
      whileHover={shouldReduceMotion ? { scale: 1.03 } : { y: -4, scale: 1.05 }}
      whileTap={tapMotion}
      className="focus-ring motion-reveal rounded-full border-2 border-[#101617] bg-[#faf9f4] px-4 py-2 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[#101617] shadow-[3px_3px_0_0_rgba(16,22,23,0.85)] transition-[background-color,box-shadow,color,transform] duration-300 hover:-translate-y-1 hover:bg-[#ffda18] hover:shadow-[5px_5px_0_0_rgba(255,58,18,0.95)] [--reveal-scale:0.92] [--reveal-y:12px]"
      style={{ '--motion-delay': delay }}
      aria-label={label}
    >
      {label}
    </motion.a>
  );
};

export default Hero;
