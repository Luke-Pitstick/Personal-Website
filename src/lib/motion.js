export const viewportOnce = {
  once: true,
  amount: 0.22,
  margin: '-80px 0px -80px 0px',
};

export const softSpring = {
  type: 'spring',
  stiffness: 170,
  damping: 22,
  mass: 0.9,
};

export const gentleEase = [0.22, 1, 0.36, 1];

export const revealTransition = {
  duration: 0.65,
  ease: gentleEase,
};

export const tapMotion = {
  scale: 0.94,
  y: 1,
};

export const liftHover = {
  y: -3,
  scale: 1.015,
};

export const createReveal = ({ x = 0, y = 18, scale = 1, delay = 0 } = {}, shouldReduceMotion = false) => ({
  hidden: {
    opacity: 0,
    x: shouldReduceMotion ? 0 : x,
    y: shouldReduceMotion ? 0 : y,
    scale: shouldReduceMotion ? 1 : scale,
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      ...revealTransition,
      delay: shouldReduceMotion ? 0 : delay,
    },
  },
});

export const createStagger = (delayChildren = 0.08, staggerChildren = 0.08) => ({
  hidden: {
    opacity: 1,
  },
  show: {
    opacity: 1,
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
});
