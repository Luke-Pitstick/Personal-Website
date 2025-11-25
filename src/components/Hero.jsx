import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';
import { Tree, Cloud, Hill, SootSprite, Mountains, Flower, Snow } from './GhibliAssets';
import { Snowflake } from 'lucide-react';

const Hero = () => {
  const [isSnowing, setIsSnowing] = React.useState(false);
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

      {/* Snow Effect */}
      {isSnowing && <Snow />}

      {/* Snow Toggle Button */}
      <button
        onClick={() => setIsSnowing(!isSnowing)}
        className={`absolute top-24 right-4 z-[100] p-2 rounded-full transition-all duration-300 ${
          isSnowing ? 'bg-blue-100 text-blue-500 shadow-lg' : 'bg-white/50 text-slate-400 hover:bg-white'
        }`}
        aria-label="Toggle Snow"
      >
        <Snowflake size={20} />
      </button>

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
      {/* Mountains - Longs Peak & Range */}
      <motion.div style={{ y: mountainsY }} className="absolute bottom-0 left-0 w-full z-0 pointer-events-none opacity-90">
        <Mountains className="w-full h-auto min-w-[1000px] -mb-20 md:-mb-32" />
      </motion.div>

      <motion.div style={{ y: hillY }} className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <Hill className={`w-full h-auto transition-colors duration-1000 ${isSnowing ? 'text-slate-100' : 'text-emerald-200'}`} color={isSnowing ? "#F5F5F5" : "#A5D6A7"} />
        {/* Background Trees (Parallax) */}
        <Tree className="absolute bottom-[12%] left-[5%] w-16 h-32 md:w-24 md:h-48 opacity-80" delay={0.2} isSnowing={isSnowing} />
        <div className="absolute bottom-[22%] left-[15%] w-12 h-24 md:w-16 md:h-32 opacity-0 md:opacity-70 transition-opacity duration-700">
          <Tree className="w-full h-full" delay={0.4} isSnowing={isSnowing} />
        </div>
        <Tree className="absolute bottom-[15%] right-[8%] w-20 h-40 md:w-28 md:h-56 opacity-80" delay={0.3} isSnowing={isSnowing} />
        <div className="absolute bottom-[25%] right-[20%] w-10 h-20 md:w-14 md:h-28 opacity-0 md:opacity-60 transition-opacity duration-700">
          <Tree className="w-full h-full" delay={0.5} isSnowing={isSnowing} />
        </div>
        <div className="absolute bottom-[18%] left-[35%] w-14 h-28 md:w-18 md:h-36 opacity-0 md:opacity-70 transition-opacity duration-700">
          <Tree className="w-full h-full" delay={0.6} isSnowing={isSnowing} />
        </div>
        
        {/* Flowers on Hill */}
        {!isSnowing && (
          <>
            <Flower className="hidden md:block absolute bottom-[25%] left-[28%] w-6 h-6" delay={0.7} color="#F48FB1" />
            <Flower className="hidden md:block absolute bottom-[20%] right-[35%] w-5 h-5" delay={0.8} color="#CE93D8" />
            <Flower className="hidden md:block absolute bottom-[22%] left-[50%] w-5 h-5" delay={1.1} color="#FFCC80" />
            <Flower className="hidden md:block absolute bottom-[18%] left-[65%] w-4 h-4" delay={1.3} color="#CE93D8" />
            <Flower className="hidden md:block absolute bottom-[32%] right-[45%] w-5 h-5" delay={1.4} color="#90CAF9" />
            <Flower className="hidden md:block absolute bottom-[24%] left-[2%] w-6 h-6" delay={1.5} color="#FFAB91" />
            <Flower className="hidden md:block absolute bottom-[26%] right-[2%] w-5 h-5" delay={1.6} color="#F48FB1" />
          </>
        )}
      </motion.div>
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none translate-y-10">
         <Hill className={`w-full h-auto transition-colors duration-1000 ${isSnowing ? 'text-white' : 'text-emerald-400'}`} color={isSnowing ? "#FFFFFF" : "#66BB6A"} />
      </div>
      
      {/* Foreground Trees */}
      <div className="absolute bottom-0 w-full h-full pointer-events-none z-10">
         {/* Left Group */}
         <Tree className="absolute bottom-[-2%] left-[-2%] w-24 h-48 md:w-32 md:h-64" delay={0.1} isSnowing={isSnowing} />
         <div className="absolute bottom-[5%] left-[8%] w-16 h-32 md:w-20 md:h-40 opacity-0 md:opacity-100 transition-opacity duration-700">
           <Tree className="w-full h-full" delay={0.3} isSnowing={isSnowing} />
         </div>
         <Tree className="absolute bottom-[2%] left-[18%] w-28 h-56 md:w-40 md:h-80" delay={0.2} isSnowing={isSnowing} />
         
         {/* Scattered Middle */}
         <div className="absolute bottom-[8%] left-[45%] w-20 h-40 md:w-24 md:h-48 opacity-0 md:opacity-100 transition-opacity duration-700">
           <Tree className="w-full h-full" delay={0.5} isSnowing={isSnowing} />
         </div>
         <div className="absolute bottom-[4%] left-[55%] w-14 h-28 md:w-16 md:h-32 opacity-0 md:opacity-100 transition-opacity duration-700">
           <Tree className="w-full h-full" delay={0.4} isSnowing={isSnowing} />
         </div>
         
         {/* Flowers in Foreground */}
         {!isSnowing && (
          <>
            {/* Left Side - Adjusted to avoid trees at -2%, 8%, 18% */}
            <Flower className="hidden md:block absolute bottom-[5%] left-[28%] w-7 h-7" delay={0.5} color="#FFAB91" />
            <Flower className="hidden md:block absolute bottom-[3%] left-[32%] w-6 h-6" delay={0.9} color="#90CAF9" />
            <Flower className="hidden md:block absolute bottom-[5%] left-[36%] w-8 h-8" delay={0.6} color="#F48FB1" />
            <Flower className="hidden md:block absolute bottom-[4%] left-[40%] w-7 h-7" delay={1.3} color="#FFCC80" />
            
            {/* Center-Right - Adjusted to avoid trees at 45%, 55% */}
            <Flower className="hidden md:block absolute bottom-[3%] left-[62%] w-6 h-6" delay={0.8} color="#CE93D8" />
            <Flower className="hidden md:block absolute bottom-[5%] left-[66%] w-7 h-7" delay={1.2} color="#90CAF9" />
            <Flower className="hidden md:block absolute bottom-[7%] left-[70%] w-6 h-6" delay={1.0} color="#F48FB1" />
            
            {/* Far Right - Adjusted to avoid trees at 75%(R25%), 88%(R12%), 95%(R5%) */}
            <Flower className="hidden md:block absolute bottom-[6%] right-[35%] w-7 h-7" delay={0.7} color="#FFAB91" />
            <Flower className="hidden md:block absolute bottom-[2%] right-[32%] w-8 h-8" delay={1.1} color="#CE93D8" />
            <Flower className="hidden md:block absolute bottom-[5%] right-[18%] w-6 h-6" delay={1.7} color="#F48FB1" />
            <Flower className="hidden md:block absolute bottom-[3%] right-[22%] w-7 h-7" delay={1.8} color="#90CAF9" />
            <Flower className="hidden md:block absolute bottom-[3%] right-[40%] w-8 h-8" delay={1.4} color="#F48FB1" />
            <Flower className="hidden md:block absolute bottom-[6%] right-[2%] w-7 h-7" delay={1.5} color="#CE93D8" />
          </>
        )}

         {/* Right Group */}
         <div className="absolute bottom-[6%] right-[25%] w-24 h-48 md:w-36 md:h-72 opacity-0 md:opacity-100 transition-opacity duration-700">
           <Tree className="w-full h-full" delay={0.6} isSnowing={isSnowing} />
         </div>
         <Tree className="absolute bottom-[-4%] right-[-5%] w-32 h-64 md:w-48 md:h-96" delay={0.2} isSnowing={isSnowing} />
         <div className="absolute bottom-[3%] right-[12%] w-18 h-36 md:w-24 md:h-48 opacity-0 md:opacity-100 transition-opacity duration-700">
           <Tree className="w-full h-full" delay={0.4} isSnowing={isSnowing} />
         </div>
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
