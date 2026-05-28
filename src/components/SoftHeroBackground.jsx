import React from 'react';
import * as motion from 'motion/react-client';
import { useReducedMotion } from 'motion/react';
import { Cloud, Flower, Hill, Mountains, Snow, Tree } from './GhibliAssets';

const BackgroundTrees = ({ isSnowing }) => (
  <>
    <Tree className="absolute bottom-[12%] left-[5%] h-32 w-16 opacity-80 md:h-48 md:w-24" delay={0.2} isSnowing={isSnowing} />
    <div className="absolute bottom-[22%] left-[15%] h-24 w-12 opacity-0 transition-opacity duration-700 md:h-32 md:w-16 md:opacity-70">
      <Tree className="h-full w-full" delay={0.4} isSnowing={isSnowing} />
    </div>
    <Tree className="absolute bottom-[15%] right-[8%] h-40 w-20 opacity-80 md:h-56 md:w-28" delay={0.3} isSnowing={isSnowing} />
    <div className="absolute bottom-[25%] right-[20%] h-20 w-10 opacity-0 transition-opacity duration-700 md:h-28 md:w-14 md:opacity-60">
      <Tree className="h-full w-full" delay={0.5} isSnowing={isSnowing} />
    </div>
    <div className="absolute bottom-[18%] left-[35%] h-28 w-14 opacity-0 transition-opacity duration-700 md:h-36 md:w-18 md:opacity-70">
      <Tree className="h-full w-full" delay={0.6} isSnowing={isSnowing} />
    </div>
  </>
);

const ForegroundTrees = ({ isSnowing }) => (
  <>
    <Tree className="absolute bottom-[-2%] left-[-2%] h-48 w-24 md:h-64 md:w-32" delay={0.1} isSnowing={isSnowing} />
    <div className="absolute bottom-[5%] left-[8%] h-32 w-16 opacity-0 transition-opacity duration-700 md:h-40 md:w-20 md:opacity-100">
      <Tree className="h-full w-full" delay={0.3} isSnowing={isSnowing} />
    </div>
    <Tree className="absolute bottom-[2%] left-[18%] h-56 w-28 md:h-80 md:w-40" delay={0.2} isSnowing={isSnowing} />

    <div className="absolute bottom-[8%] left-[45%] h-40 w-20 opacity-0 transition-opacity duration-700 md:h-48 md:w-24 md:opacity-100">
      <Tree className="h-full w-full" delay={0.5} isSnowing={isSnowing} />
    </div>
    <div className="absolute bottom-[4%] left-[55%] h-28 w-14 opacity-0 transition-opacity duration-700 md:h-32 md:w-16 md:opacity-100">
      <Tree className="h-full w-full" delay={0.4} isSnowing={isSnowing} />
    </div>

    <div className="absolute bottom-[6%] right-[25%] h-48 w-24 opacity-0 transition-opacity duration-700 md:h-72 md:w-36 md:opacity-100">
      <Tree className="h-full w-full" delay={0.6} isSnowing={isSnowing} />
    </div>
    <Tree className="absolute bottom-[-4%] right-[-5%] h-64 w-32 md:h-96 md:w-48" delay={0.2} isSnowing={isSnowing} />
    <div className="absolute bottom-[3%] right-[12%] h-36 w-18 opacity-0 transition-opacity duration-700 md:h-48 md:w-24 md:opacity-100">
      <Tree className="h-full w-full" delay={0.4} isSnowing={isSnowing} />
    </div>
  </>
);

const MeadowFlowers = ({ isSnowing }) => {
  if (isSnowing) return null;

  return (
    <>
      <Flower className="absolute bottom-[5%] left-[28%] hidden h-7 w-7 md:block" delay={0.5} color="#FFAB91" />
      <Flower className="absolute bottom-[3%] left-[32%] hidden h-6 w-6 md:block" delay={0.9} color="#90CAF9" />
      <Flower className="absolute bottom-[5%] left-[36%] hidden h-8 w-8 md:block" delay={0.6} color="#F48FB1" />
      <Flower className="absolute bottom-[4%] left-[40%] hidden h-7 w-7 md:block" delay={1.3} color="#FFCC80" />
      <Flower className="absolute bottom-[3%] left-[62%] hidden h-6 w-6 md:block" delay={0.8} color="#CE93D8" />
      <Flower className="absolute bottom-[5%] left-[66%] hidden h-7 w-7 md:block" delay={1.2} color="#90CAF9" />
      <Flower className="absolute bottom-[7%] left-[70%] hidden h-6 w-6 md:block" delay={1.0} color="#F48FB1" />
      <Flower className="absolute bottom-[6%] right-[35%] hidden h-7 w-7 md:block" delay={0.7} color="#FFAB91" />
      <Flower className="absolute bottom-[2%] right-[32%] hidden h-8 w-8 md:block" delay={1.1} color="#CE93D8" />
      <Flower className="absolute bottom-[5%] right-[18%] hidden h-6 w-6 md:block" delay={1.7} color="#F48FB1" />
      <Flower className="absolute bottom-[3%] right-[22%] hidden h-7 w-7 md:block" delay={1.8} color="#90CAF9" />
      <Flower className="absolute bottom-[3%] right-[40%] hidden h-8 w-8 md:block" delay={1.4} color="#F48FB1" />
      <Flower className="absolute bottom-[4%] right-[28%] hidden h-7 w-7 md:block" delay={1.5} color="#CE93D8" />
    </>
  );
};

const SoftHeroBackground = ({ isSnowing, hillY, mountainsY }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className={`absolute inset-0 transition-colors duration-1000 ${isSnowing ? 'bg-gradient-to-b from-sky-100 via-slate-50 to-blue-50' : 'bg-gradient-to-b from-sky-200 via-sky-100 to-blue-50'}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.72),transparent_26%),radial-gradient(circle_at_78%_36%,rgba(142,202,230,0.22),transparent_32%)]" />
      <div className="absolute inset-x-0 top-[34%] h-40 bg-gradient-to-b from-white/0 via-white/35 to-white/0 blur-xl" />

      <Cloud className="absolute left-10 top-20 w-32 opacity-80" delay={0} duration={60} />
      <Cloud className="absolute right-20 top-40 w-48 opacity-60" delay={5} duration={80} />
      <Cloud className="absolute left-1/2 top-10 w-24 opacity-40" delay={10} duration={100} />

      <motion.div style={{ y: shouldReduceMotion ? 0 : mountainsY }} className="absolute bottom-0 left-0 z-0 w-full opacity-90">
        <Mountains className="h-auto w-full min-w-[1000px] -mb-20 md:-mb-32" />
      </motion.div>

      <motion.div style={{ y: shouldReduceMotion ? 0 : hillY }} className="absolute bottom-0 left-0 z-10 w-full">
        <Hill className={`h-auto w-full transition-colors duration-1000 ${isSnowing ? 'text-slate-100' : 'text-emerald-200'}`} color={isSnowing ? "#F5F5F5" : "#A5D6A7"} />
        <BackgroundTrees isSnowing={isSnowing} />
      </motion.div>

      <div className="absolute bottom-0 left-0 z-10 w-full translate-y-10">
        <Hill className={`h-auto w-full transition-colors duration-1000 ${isSnowing ? 'text-white' : 'text-emerald-400'}`} color={isSnowing ? "#FFFFFF" : "#66BB6A"} />
      </div>

      <div className="absolute bottom-0 z-10 h-full w-full">
        <MeadowFlowers isSnowing={isSnowing} />
        <ForegroundTrees isSnowing={isSnowing} />
      </div>

      {isSnowing && <Snow />}
    </div>
  );
};

export default SoftHeroBackground;
