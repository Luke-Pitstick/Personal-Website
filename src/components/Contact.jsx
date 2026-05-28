import * as motion from 'motion/react-client';
import { useReducedMotion } from 'motion/react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { SootSprite } from './GhibliAssets';
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
      className="relative overflow-hidden border-t-4 border-emerald-800/20 bg-white/70 px-4 py-12 backdrop-blur-lg"
    >
      <SootSprite className="absolute -bottom-2 right-20 h-12 w-12 rotate-12 opacity-20" />
      <motion.div
        variants={createStagger(0.05, 0.07)}
        className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row"
      >
        
        <motion.div variants={createReveal({ y: 10 }, shouldReduceMotion)} className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-slate-800 font-heading">
            Let's Connect
          </h3>
          <p className="mt-1 font-body text-slate-600">Open for opportunities and collaborations.</p>
          <a
            href={`mailto:${emailAddress}`}
            className="focus-ring mt-3 inline-flex rounded-md text-sm font-bold text-emerald-800 transition-colors hover:text-emerald-950"
          >
            {emailAddress}
          </a>
        </motion.div>

        <motion.div variants={createStagger(0.03, 0.05)} className="flex gap-6">
          <FooterLink href="https://github.com/Luke-Pitstick" label="GitHub" icon={Github} colorClass="hover:text-emerald-700" />
          <FooterLink href="https://www.linkedin.com/in/luke-pitstick-2ab1a5239/" label="LinkedIn" icon={Linkedin} colorClass="hover:text-sky-700" />
          <FooterLink href={`mailto:${emailAddress}`} label="Email" icon={Mail} colorClass="hover:text-emerald-600" local />
        </motion.div>

        <motion.button
          type="button"
          onClick={scrollToTop}
          variants={createReveal({ y: 10 }, shouldReduceMotion)}
          whileHover={shouldReduceMotion ? { scale: 1.03 } : { y: -3, scale: 1.03 }}
          whileTap={tapMotion}
          transition={softSpring}
          className="focus-ring rounded-full border-2 border-emerald-800 bg-white p-3 text-emerald-800 shadow-[2px_2px_0_0_rgba(6,78,59,1)] transition-[background-color,color,transform] hover:bg-emerald-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} aria-hidden="true" focusable="false" />
        </motion.button>
      </motion.div>
      
      <motion.div variants={createReveal({ y: 8 }, shouldReduceMotion)} className="mt-12 text-center font-body text-sm text-slate-500">
        © {new Date().getFullYear()} Luke Pitstick. Built with Astro & React.
      </motion.div>
    </motion.footer>
  );
};

const FooterLink = ({ href, icon: Icon, label, colorClass, local = false }) => {
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
      className={`focus-ring rounded-full text-slate-600 transition-[color,transform] ${colorClass}`}
      aria-label={label}
    >
      <Icon size={28} aria-hidden="true" focusable="false" />
    </motion.a>
  );
};

export default Contact;
