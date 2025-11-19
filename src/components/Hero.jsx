import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';
import { Tree, Cloud, Hill, SootSprite, Mountains} from './GhibliAssets';

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const hillY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const mountainsY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section 
      ref={ref} 
      className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-blue-50"
    >
      
      {/* Sky Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Cloud className="absolute top-20 left-10 w-32 opacity-80" delay={0} duration={60} />
        <Cloud className="absolute top-40 right-20 w-48 opacity-60" delay={5} duration={80} />
        <Cloud className="absolute top-10 left-1/2 w-24 opacity-40" delay={10} duration={100} />
      </div>

      {/* Main Content */}
      <motion.div style={{ y, opacity }} className="max-w-5xl w-full z-20 relative text-center mt-[-100px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-8"
        >
           <div className="inline-block">
             <div className="bg-white/80 backdrop-blur-sm p-8 hand-drawn relative">
                <SootSprite className="absolute -top-4 -right-4" />
                <div className="flex items-center justify-center gap-3 text-emerald-800 font-body text-sm tracking-widest uppercase mb-4">
                    <span className="w-8 h-[2px] bg-emerald-600 rounded-full"></span>
                    Based in Boulder, CO
                    <span className="w-8 h-[2px] bg-emerald-600 rounded-full"></span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none text-slate-800 font-heading">
                    Luke Pitstick
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-700 max-w-2xl mx-auto font-body leading-relaxed mt-6">
                    Cultivating digital gardens with <span className="text-emerald-700 font-bold">Data</span> & <span className="text-emerald-700 font-bold">Policy</span>.
                </p>
             </div>
           </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex justify-center gap-6 pt-8"
          >
            <SocialLink href="https://github.com/Luke-Pitstick" icon={<Github />} label="GitHub" />
            <SocialLink href="https://www.linkedin.com/in/luke-pitstick-2ab1a5239/" icon={<Linkedin />} label="LinkedIn" />
            <SocialLink href="mailto:contact@lukepitstick.com" icon={<Mail />} label="Email" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Landscape Foreground */}
      
      {/* Mountains - Longs Peak & Range */}
      <motion.div style={{ y: mountainsY }} className="absolute bottom-0 left-0 w-full z-0 pointer-events-none opacity-90">
        <Mountains className="w-full h-auto min-w-[1000px] -mb-20 md:-mb-32" />
      </motion.div>

      <motion.div style={{ y: hillY }} className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <Hill className="w-full h-auto text-emerald-200" color="#A5D6A7" />
      </motion.div>
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none translate-y-10">
         <Hill className="w-full h-auto text-emerald-400" color="#66BB6A" />
      </div>
      
      {/* Trees */}
      <div className="absolute bottom-0 w-full flex justify-between px-10 z-10 pointer-events-none">
        <Tree className="w-24 h-48 md:w-40 md:h-80 -mb-10" delay={0.2} />
        <Tree className="w-16 h-32 md:w-24 md:h-48 -mb-5 mx-auto" delay={0.4} />
        <Tree className="w-32 h-64 md:w-56 md:h-[400px] -mb-20" delay={0.3} />
      </div>
    </section>
  );
};

const SocialLink = ({ href, icon, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="p-3 rounded-full bg-white border-2 border-slate-800 text-slate-800 hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    aria-label={label}
  >
    {icon}
  </a>
);

export default Hero;
