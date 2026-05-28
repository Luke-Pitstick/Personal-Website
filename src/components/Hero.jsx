import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, Github, Linkedin, Mail, Snowflake } from 'lucide-react';
import SoftHeroBackground from './SoftHeroBackground';
import { softSpring, tapMotion } from '../lib/motion';

const portraitUrl = 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/pictureofme.jpg';
const emailAddress = 'contact@lukepitstick.com';

// Swap this constant to test another background without touching hero content.
const ActiveHeroBackground = SoftHeroBackground;

const SOCIAL_HIDE_SCROLL_Y = 96;

const Hero = () => {
  const [isSnowing, setIsSnowing] = React.useState(false);
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
  const hillY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const mountainsY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#eaf7f1] px-4"
    >
      <ActiveHeroBackground
        isSnowing={isSnowing}
        hillY={shouldReduceMotion ? 0 : hillY}
        mountainsY={shouldReduceMotion ? 0 : mountainsY}
      />

      <motion.button
        type="button"
        onClick={() => setIsSnowing(!isSnowing)}
        whileHover={shouldReduceMotion ? undefined : { y: -2, rotate: isSnowing ? -8 : 8 }}
        whileTap={tapMotion}
        transition={softSpring}
        className={`focus-ring absolute right-4 top-24 z-[100] rounded-full p-2 transition-[background-color,box-shadow,color,transform] duration-300 ${
          isSnowing ? 'bg-blue-100 text-blue-500 shadow-lg' : 'bg-white/60 text-slate-500 shadow-sm hover:bg-white'
        }`}
        aria-label="Toggle Snow"
      >
        <Snowflake size={20} aria-hidden="true" focusable="false" />
      </motion.button>

      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : y,
          opacity: shouldReduceMotion ? 1 : opacity,
        }}
        className="relative z-30 w-full max-w-5xl text-center"
      >
        <motion.div className="space-y-8">
          <motion.div
            className="motion-reveal inline-block [--motion-delay:0.08s] [--reveal-scale:0.94]"
          >
            <div className="hand-drawn relative bg-white/90 p-6 backdrop-blur-sm sm:p-8">
              <motion.div
                className="motion-reveal mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-[4px_4px_0px_0px_rgba(47,62,70,0.25)] [--motion-delay:0.18s] [--reveal-scale:0.9] [--reveal-y:14px]"
              >
                <img
                  src={portraitUrl}
                  alt="Luke Pitstick"
                  width="384"
                  height="384"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </motion.div>
              <motion.div
                className="motion-reveal mb-4 flex items-center justify-center gap-3 font-body text-xs uppercase tracking-widest text-emerald-800 sm:text-sm [--motion-delay:0.28s] [--reveal-y:10px]"
              >
                <span className="h-[2px] w-7 rounded-full bg-emerald-600 sm:w-8"></span>
                Based in Boulder, CO
                <span className="h-[2px] w-7 rounded-full bg-emerald-600 sm:w-8"></span>
              </motion.div>

              <motion.h1
                className="motion-reveal font-heading text-5xl font-bold leading-none tracking-tight text-slate-900 sm:text-6xl md:text-8xl [--motion-delay:0.36s] [--reveal-scale:0.98] [--reveal-y:16px]"
              >
                Luke Pitstick
              </motion.h1>

              <motion.p
                className="motion-reveal mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-slate-700 sm:text-xl md:text-2xl [--motion-delay:0.46s] [--reveal-y:12px]"
              >
                AI/ML <span className="font-bold text-emerald-700">research</span> and <span className="font-bold text-emerald-700">software development</span> for practical, human-centered tools.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={{
              opacity: socialsVisible ? 1 : 0,
              y: socialsVisible ? 0 : 12,
            }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.3, ease: 'easeOut' }}
            className="flex flex-wrap justify-center gap-5 pt-5 sm:gap-6"
            style={{ pointerEvents: socialsVisible ? 'auto' : 'none' }}
            aria-hidden={!socialsVisible}
          >
            <SocialLink href="https://github.com/Luke-Pitstick" icon={<Github />} label="GitHub" delay="0.62s" />
            <SocialLink href="https://www.linkedin.com/in/luke-pitstick" icon={<Linkedin />} label="LinkedIn" delay="0.69s" />
            <SocialLink href={`mailto:${emailAddress}`} icon={<Mail />} label="Email" delay="0.76s" local />
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
        className={`focus-ring left-1/2 z-40 rounded-full border-2 border-slate-800 bg-white/90 p-3 text-slate-800 shadow-[3px_3px_0_0_rgba(47,62,70,0.55)] backdrop-blur-sm transition-[background-color,box-shadow,color,transform,top] duration-300 hover:bg-emerald-50 hover:shadow-[5px_5px_0_0_rgba(47,62,70,0.75)] ${
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
          <ChevronDown size={24} aria-hidden="true" focusable="false" />
        </motion.span>
      </motion.button>
    </section>
  );
};

const SocialLink = ({ href, icon, label, delay = '0s', local = false }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      target={local ? undefined : "_blank"}
      rel={local ? undefined : "noopener noreferrer"}
      whileHover={shouldReduceMotion ? { scale: 1.03 } : { y: -4, scale: 1.05 }}
      whileTap={tapMotion}
      className="focus-ring motion-reveal rounded-full border-2 border-slate-800 bg-white p-3 text-slate-800 transition-[background-color,box-shadow,color,transform] duration-300 hover:-translate-y-1 hover:bg-emerald-50 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] [--reveal-scale:0.92] [--reveal-y:12px]"
      style={{ '--motion-delay': delay }}
      aria-label={label}
    >
      {React.cloneElement(icon, { 'aria-hidden': true, focusable: 'false' })}
    </motion.a>
  );
};

export default Hero;
