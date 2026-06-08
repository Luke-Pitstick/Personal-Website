import * as motion from 'motion/react-client';
import { useReducedMotion } from 'motion/react';
import { createReveal, createStagger, softSpring, tapMotion, viewportOnce } from '../lib/motion';

const emailAddress = 'contact@lukepitstick.com';

const Contact = () => {
  const shouldReduceMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <motion.footer
      variants={createReveal({ y: 14 }, shouldReduceMotion)}
      initial={false}
      whileInView="show"
      viewport={viewportOnce}
      className="relative overflow-hidden border-t-4 border-[#101617] bg-[#101617] px-4 py-12 text-[#f5f0d8]"
    >
      <motion.div
        variants={createStagger(0.05, 0.07)}
        className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row"
      >
        
        <motion.div variants={createReveal({ y: 10 }, shouldReduceMotion)} className="text-center md:text-left">
          <h3 className="font-heading text-2xl font-bold text-[#f5f0d8]">
            Let's Connect
          </h3>
          <p className="mt-1 font-body font-bold text-[#dff1ef]">Open for opportunities and collaborations.</p>
          <a
            href={`mailto:${emailAddress}`}
            className="focus-ring mt-3 inline-flex rounded-md text-sm font-extrabold text-[#ffda18] transition-colors hover:text-[#f5f0d8]"
          >
            {emailAddress}
          </a>
        </motion.div>

        <motion.div variants={createStagger(0.03, 0.05)} className="flex gap-6">
          <FooterLink href="https://github.com/Luke-Pitstick" label="GitHub" />
          <FooterLink href="https://www.linkedin.com/in/luke-pitstick-2ab1a5239/" label="LinkedIn" />
          <FooterLink href={`mailto:${emailAddress}`} label="Email" local />
        </motion.div>

        <motion.button
          type="button"
          onClick={scrollToTop}
          variants={createReveal({ y: 10 }, shouldReduceMotion)}
          whileHover={shouldReduceMotion ? { scale: 1.03 } : { y: -3, scale: 1.03 }}
          whileTap={tapMotion}
          transition={softSpring}
          className="focus-ring rounded-full border-2 border-[#f5f0d8] bg-[#faf9f4] px-4 py-2 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[#101617] shadow-[4px_4px_0_0_rgba(255,58,18,0.95)] transition-[background-color,box-shadow,color,transform] hover:bg-[#ffda18] hover:shadow-[5px_5px_0_0_rgba(250,249,244,0.9)]"
          aria-label="Scroll to top"
        >
          Top
        </motion.button>
      </motion.div>
      
      <motion.div variants={createReveal({ y: 8 }, shouldReduceMotion)} className="relative z-10 mt-12 text-center font-body text-sm font-bold text-[#dff1ef]">
        © {new Date().getFullYear()} Luke Pitstick. Built with Astro & React.
      </motion.div>
    </motion.footer>
  );
};

const FooterLink = ({ href, label, local = false }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      target={local ? undefined : '_blank'}
      rel={local ? undefined : 'noopener noreferrer'}
      variants={createReveal({ y: 8, scale: 0.94 }, shouldReduceMotion)}
      whileHover={shouldReduceMotion ? { scale: 1.04 } : { y: -2, scale: 1.1 }}
      whileTap={tapMotion}
      transition={softSpring}
      className="focus-ring rounded-full border-2 border-[#f5f0d8] bg-[#faf9f4] px-4 py-2 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[#101617] shadow-[4px_4px_0_rgba(255,58,18,0.95)] transition-[background-color,box-shadow,color,transform] hover:bg-[#ffda18] hover:shadow-[5px_5px_0_rgba(250,249,244,0.9)]"
      aria-label={label}
    >
      {label}
    </motion.a>
  );
};

export default Contact;
