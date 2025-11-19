import React from 'react';
import { motion } from 'framer-motion';

export const Tree = ({ className, delay = 0 }) => (
  <motion.svg
    initial={{ scaleY: 0, opacity: 0 }}
    animate={{ scaleY: 1, opacity: 1 }}
    transition={{ delay, duration: 1, ease: "backOut" }}
    viewBox="0 0 100 200"
    className={className}
    preserveAspectRatio="none"
  >
    {/* Trunk */}
    <path d="M45,200 C45,200 40,150 45,120 C50,90 45,80 45,80" stroke="#5D4037" strokeWidth="8" fill="none" />
    
    {/* Leaves - Layer 1 */}
    <circle cx="45" cy="80" r="35" fill="#2E7D32" fillOpacity="0.9" />
    <circle cx="25" cy="90" r="25" fill="#388E3C" fillOpacity="0.9" />
    <circle cx="65" cy="90" r="25" fill="#388E3C" fillOpacity="0.9" />
    
    {/* Leaves - Layer 2 (Highlight) */}
    <circle cx="45" cy="70" r="25" fill="#4CAF50" fillOpacity="0.8" />
    <circle cx="35" cy="60" r="15" fill="#66BB6A" fillOpacity="0.8" />
    <circle cx="55" cy="60" r="15" fill="#66BB6A" fillOpacity="0.8" />
  </motion.svg>
);

export const Cloud = ({ className, delay = 0, duration = 20 }) => (
  <motion.svg
    animate={{ x: [0, 100, 0] }}
    transition={{ repeat: Infinity, duration, ease: "linear", delay }}
    viewBox="0 0 200 100"
    className={className}
  >
    <path d="M20,80 Q40,60 50,70 Q60,40 90,50 Q110,20 140,40 Q170,30 180,60 Q200,70 190,90 H20 Z" fill="white" fillOpacity="0.8" />
  </motion.svg>
);

// Soot Sprite variants with different expressions
export const SootSprite = ({ className, variant = 'normal' }) => {
  const expressions = {
    normal: { eyeY: 45, pupilY: 45 },
    surprised: { eyeY: 42, pupilY: 40 },
    sleepy: { eyeY: 48, pupilY: 50 },
    happy: { eyeY: 45, pupilY: 45, smile: true }
  };
  
  const expr = expressions[variant] || expressions.normal;
  
  return (
    <motion.div
      whileHover={{ scale: 1.2, rotate: 180 }}
      animate={{ 
        y: [0, -5, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`relative w-8 h-8 ${className}`}
    >
      <svg viewBox="0 0 100 100">
        {/* Fuzzy body with spikes */}
        <circle cx="50" cy="50" r="40" fill="black" />
        {/* Add some fuzzy spikes around the edges */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x = 50 + 35 * Math.cos(angle);
          const y = 50 + 35 * Math.sin(angle);
          return (
            <circle key={i} cx={x} cy={y} r="6" fill="black" opacity="0.8" />
          );
        })}
        {/* Eyes */}
        <circle cx="35" cy={expr.eyeY} r="10" fill="white" />
        <circle cx="65" cy={expr.eyeY} r="10" fill="white" />
        <circle cx="35" cy={expr.pupilY} r="3" fill="black" />
        <circle cx="65" cy={expr.pupilY} r="3" fill="black" />
        {/* Optional smile */}
        {expr.smile && (
          <path d="M40,55 Q50,60 60,55" stroke="white" strokeWidth="2" fill="none" />
        )}
      </svg>
    </motion.div>
  );
};

// Kodama - cute tree spirits that bob and tilt their heads
export const Kodama = ({ className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ 
      opacity: 1,
      y: [0, -10, 0],
      rotate: [0, -5, 5, 0]
    }}
    transition={{
      opacity: { duration: 0.5, delay },
      y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay },
      rotate: { duration: 3, repeat: Infinity, ease: "easeInOut", delay }
    }}
    className={`relative ${className}`}
  >
    <svg viewBox="0 0 60 100" className="w-full h-full">
      {/* Body */}
      <ellipse cx="30" cy="60" rx="20" ry="35" fill="white" stroke="#333" strokeWidth="2" />
      {/* Head */}
      <circle cx="30" cy="25" r="18" fill="white" stroke="#333" strokeWidth="2" />
      {/* Eyes - triangle shaped */}
      <polygon points="22,22 26,27 18,27" fill="black" />
      <polygon points="38,22 42,27 34,27" fill="black" />
      {/* Mouth - triangle */}
      <polygon points="30,32 26,36 34,36" fill="black" />
      {/* Arms (optional small bumps) */}
      <ellipse cx="10" cy="60" rx="4" ry="8" fill="white" stroke="#333" strokeWidth="1.5" />
      <ellipse cx="50" cy="60" rx="4" ry="8" fill="white" stroke="#333" strokeWidth="1.5" />
    </svg>
  </motion.div>
);

// Totoro peeking from the side
export const Totoro = ({ className }) => (
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    whileHover={{ x: 10, scale: 1.05 }}
    transition={{ duration: 1, ease: "backOut" }}
    className={`relative ${className}`}
  >
    <svg viewBox="0 0 120 140" className="w-full h-full">
      {/* Body */}
      <ellipse cx="60" cy="85" rx="50" ry="55" fill="#9CA3AF" />
      {/* Belly */}
      <ellipse cx="60" cy="95" rx="35" ry="38" fill="#D1D5DB" />
      {/* Belly pattern */}
      <path d="M40,75 Q60,85 80,75" stroke="#9CA3AF" strokeWidth="2" fill="none" />
      <path d="M35,85 Q60,95 85,85" stroke="#9CA3AF" strokeWidth="2" fill="none" />
      <path d="M38,95 Q60,105 82,95" stroke="#9CA3AF" strokeWidth="2" fill="none" />
      {/* Ears */}
      <ellipse cx="35" cy="35" rx="15" ry="25" fill="#9CA3AF" />
      <ellipse cx="85" cy="35" rx="15" ry="25" fill="#9CA3AF" />
      {/* Head */}
      <circle cx="60" cy="50" r="35" fill="#9CA3AF" />
      {/* Eyes */}
      <ellipse cx="45" cy="48" rx="8" ry="12" fill="white" />
      <ellipse cx="75" cy="48" rx="8" ry="12" fill="white" />
      <circle cx="45" cy="50" r="5" fill="black" />
      <circle cx="75" cy="50" r="5" fill="black" />
      {/* Nose */}
      <polygon points="60,55 55,62 65,62" fill="black" />
      {/* Whiskers */}
      <line x1="20" y1="52" x2="38" y2="50" stroke="black" strokeWidth="1.5" />
      <line x1="20" y1="58" x2="38" y2="56" stroke="black" strokeWidth="1.5" />
      <line x1="82" y1="50" x2="100" y2="52" stroke="black" strokeWidth="1.5" />
      <line x1="82" y1="56" x2="100" y2="58" stroke="black" strokeWidth="1.5" />
      {/* Smile */}
      <path d="M45,65 Q60,72 75,65" stroke="black" strokeWidth="2" fill="none" />
    </svg>
  </motion.div>
);

// Calcifer - flickering flame
export const Calcifer = ({ className }) => (
  <motion.div
    animate={{
      scale: [1, 1.1, 0.95, 1.05, 1],
      y: [0, -3, 2, -2, 0]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={`relative ${className}`}
  >
    <svg viewBox="0 0 100 120" className="w-full h-full">
      {/* Outer flame (orange) */}
      <motion.path
        d="M50,10 C30,20 20,35 25,55 C28,65 35,75 50,80 C65,75 72,65 75,55 C80,35 70,20 50,10 Z"
        fill="#FF6B35"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {/* Middle flame (yellow) */}
      <motion.path
        d="M50,20 C38,28 32,38 35,52 C37,60 42,68 50,72 C58,68 63,60 65,52 C68,38 62,28 50,20 Z"
        fill="#FFB627"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      {/* Inner flame (light yellow) */}
      <motion.path
        d="M50,30 C42,36 38,42 40,52 C42,58 45,63 50,66 C55,63 58,58 60,52 C62,42 58,36 50,30 Z"
        fill="#FFF4A3"
        animate={{ opacity: [1, 0.9, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      {/* Face - eyes */}
      <ellipse cx="42" cy="50" rx="4" ry="6" fill="black" />
      <ellipse cx="58" cy="50" rx="4" ry="6" fill="black" />
      {/* Mouth - mischievous smile */}
      <path d="M42,58 Q50,62 58,58" stroke="black" strokeWidth="2" fill="none" />
    </svg>
  </motion.div>
);

// Catbus eyes peeking
export const CatbusEyes = ({ className }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: [0.6, 1, 0.6], x: 0 }}
    transition={{ 
      opacity: { duration: 3, repeat: Infinity },
      x: { duration: 1 }
    }}
    className={`relative ${className}`}
  >
    <svg viewBox="0 0 100 40" className="w-full h-full">
      {/* Eyes glowing in the dark */}
      <ellipse cx="30" cy="20" rx="12" ry="16" fill="#FFF4A3" opacity="0.9" />
      <ellipse cx="70" cy="20" rx="12" ry="16" fill="#FFF4A3" opacity="0.9" />
      <ellipse cx="30" cy="22" rx="6" ry="12" fill="black" />
      <ellipse cx="70" cy="22" rx="6" ry="12" fill="black" />
      {/* Shine in eyes */}
      <circle cx="28" cy="18" r="2" fill="white" opacity="0.8" />
      <circle cx="68" cy="18" r="2" fill="white" opacity="0.8" />
    </svg>
  </motion.div>
);

// Paper Airplane (Kiki's Delivery Service inspired)
export const PaperAirplane = ({ className }) => (
  <motion.div
    initial={{ x: -100, y: 50, rotate: 45 }}
    animate={{ 
      x: ['-100vw', '100vw'],
      y: [50, 20, 40, 10, 30],
      rotate: [45, 40, 45, 42, 45]
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }}
    className={`absolute ${className}`}
  >
    <svg viewBox="0 0 60 30" className="w-full h-full drop-shadow-md">
      <path d="M5,15 L55,5 L50,15 L55,25 Z" fill="white" stroke="#94A3B8" strokeWidth="1" />
      <line x1="5" y1="15" x2="50" y2="15" stroke="#CBD5E1" strokeWidth="0.5" />
    </svg>
  </motion.div>
);


export const Hill = ({ className, color = "#4CAF50" }) => (
  <svg viewBox="0 0 1440 320" className={className} preserveAspectRatio="none">
    <path fill={color} fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </svg>
);

export const FallingLeaves = () => {
  // Generate random leaves
  const leaves = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10,
    scale: 0.5 + Math.random() * 0.5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ y: -20, x: `${leaf.x}%`, opacity: 0, rotate: 0 }}
          animate={{ 
            y: '100vh', 
            x: [`${leaf.x}%`, `${leaf.x + 5}%`, `${leaf.x - 5}%`, `${leaf.x}%`],
            opacity: [0, 1, 1, 0],
            rotate: 360 
          }}
          transition={{ 
            duration: leaf.duration, 
            delay: leaf.delay, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-0"
          style={{ scale: leaf.scale }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#4CAF50" style={{ opacity: 0.6 }}>
            <path d="M12,2 C12,2 20,4 20,12 C20,20 12,22 12,22 C12,22 4,20 4,12 C4,4 12,2 12,2 Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export const DustMotes = () => {
    const motes = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 4 + Math.random() * 4,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {motes.map((mote) => (
                <motion.div
                    key={mote.id}
                    initial={{ x: `${mote.x}%`, y: `${mote.y}%`, opacity: 0 }}
                    animate={{ 
                        y: [`${mote.y}%`, `${mote.y - 10}%`, `${mote.y}%`],
                        opacity: [0, 0.5, 0] 
                    }}
                    transition={{ 
                        duration: mote.duration, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: Math.random() * 5
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
                />
            ))}
        </div>
    );
};

export const Mountains = ({ className }) => (
  <svg viewBox="0 0 1200 600" className={className} preserveAspectRatio="none">
    <defs>
      <linearGradient id="mistGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
    
    <g transform="translate(0, 50)">
        {/* --- Layer 1: The Furthest Horizon (Very Pale) --- */}
        <path d="M0,600 L0,350 
                 C150,340 250,280 400,320 
                 C550,360 650,250 800,300 
                 C950,350 1050,280 1200,340 
                 L1200,600 Z" fill="#cbd5e1" opacity="0.5" />

        {/* --- Layer 2: Distant Peaks (Overlapping, Soft Blue-Grey) --- */}
        <path d="M-100,600 L0,400 
                 L100,280 L200,380 L300,250 L450,350 
                 L600,200 L750,320 L900,220 L1050,350 
                 L1200,280 L1300,600 Z" fill="#94a3b8" opacity="0.6" />
        
        {/* --- Layer 3: Mid-Range Ridge (Interlocking Shapes) --- */}
        <path d="M0,600 L0,500 
                 L150,300 L250,450 L350,320 L450,480 
                 L550,350 L650,500 L800,320 L950,480 
                 L1100,350 L1200,500 L1200,600 Z" fill="#64748b" />
                 
        {/* Mist between layers */}
        <path d="M0,600 L0,450 L1200,450 L1200,600 Z" fill="url(#mistGradient)" />

        {/* --- Layer 4: Main Rugged Peaks (Detailed, Darker Slate) --- */}
        <path d="M-50,600 L50,450 
                 L200,250 L300,400 L400,200 L550,450 
                 L700,150 L850,400 L1000,250 L1150,450 
                 L1250,600 Z" fill="#475569" />
        
        {/* Organic Snow Caps (Following Peak Geometry) */}
        {/* Peak 1 at 200,250 */}
        <path d="M200,250 L220,280 L210,270 L200,285 L190,270 L170,290 Z" fill="#f1f5f9" opacity="0.9" />
        
        {/* Peak 2 at 400,200 */}
        <path d="M400,200 L430,250 L415,235 L400,260 L385,235 L380,240 Z" fill="#f1f5f9" opacity="0.9" />
        
        {/* Peak 3 at 700,150 (Highest) */}
        <path d="M700,150 L730,200 L715,185 L700,210 L685,185 L670,210 Z" fill="#f1f5f9" opacity="0.95" />
        
        {/* Peak 4 at 1000,250 */}
        <path d="M1000,250 L1030,290 L1015,275 L1000,300 L985,275 L970,280 Z" fill="#f1f5f9" opacity="0.9" />

        {/* --- Layer 5: Foreground Foothills (Darkest, Framing) --- */}
        <path d="M0,600 L0,550 
                 C100,520 200,580 300,540 
                 C400,500 500,560 600,520 
                 C700,480 800,540 900,500 
                 C1000,460 1100,520 1200,550 
                 L1200,600 Z" fill="#334155" />
                 
        {/* Foreground Trees (Silhouettes) */}
        <g fill="#1e293b">
            <path d="M50,600 L80,500 L110,600 Z" />
            <path d="M150,600 L190,480 L230,600 Z" />
            <path d="M850,600 L900,450 L950,600 Z" />
            <path d="M1050,600 L1080,520 L1110,600 Z" />
        </g>
    </g>
  </svg>
);
