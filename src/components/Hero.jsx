import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';

import { scrollToSection } from '../lib/scroll';

const SOCIAL_HIDE_SCROLL_Y = 96;

let ditheredHeroCanvasModulePromise;

const loadDitheredHeroCanvasModule = () => {
  ditheredHeroCanvasModulePromise ??= import('./DitheredHeroCanvas').catch((error) => {
    ditheredHeroCanvasModulePromise = undefined;
    throw error;
  });
  return ditheredHeroCanvasModulePromise;
};

const LazyDitheredHeroCanvas = lazy(loadDitheredHeroCanvasModule);

const Hero = () => {
  const [canvasReady, setCanvasReady] = useState(false);
  const [heroShaderActive, setHeroShaderActive] = useState(false);
  const [heroShaderAutoOnly, setHeroShaderAutoOnly] = useState(false);
  const [shaderHintDismissed, setShaderHintDismissed] = useState(false);
  const shouldReduceMotion = usePrefersReducedMotion();
  const arrowRef = useRef(null);
  const dismissShaderHint = useCallback(() => setShaderHintDismissed(true), []);
  const handleHeroAutoOnlyChange = useCallback((autoOnly) => {
    setHeroShaderAutoOnly(autoOnly);
  }, []);
  const handleHeroInteractiveChange = useCallback((interactive) => {
    setHeroShaderActive(interactive);
  }, []);
  const showShaderHint = heroShaderActive && !shaderHintDismissed;

  const scrollPastHero = () => {
    scrollToSection('about', { behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    const content = document.querySelector('#home .hero-content-parallax');
    const socials = document.getElementById('hero-socials');
    const arrow = arrowRef.current;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const home = document.getElementById('home');
      const nav = document.querySelector('nav[aria-label="Primary navigation"]');
      const navBottom = nav?.getBoundingClientRect().bottom ?? 80;
      const homeBottom = home?.getBoundingClientRect().bottom ?? 0;
      const homeHeight = home?.offsetHeight || window.innerHeight || 1;
      const progress = home ? clamp((-home.getBoundingClientRect().top) / homeHeight, 0, 1) : 0;

      if (content) {
        const contentY = shouldReduceMotion ? '0%' : `${progress * 50}%`;
        const contentOpacity = shouldReduceMotion ? '1' : String(clamp(1 - progress * 2, 0, 1));

        content.style.setProperty('--hero-content-y', contentY);
        content.style.setProperty('--hero-content-opacity', contentOpacity);
      }

      const arrowPinned = scrollY >= SOCIAL_HIDE_SCROLL_Y;
      const arrowTop = navBottom + 8;
      const arrowVisible = homeBottom > navBottom + 48;
      const socialsVisible = scrollY < SOCIAL_HIDE_SCROLL_Y;

      if (socials) {
        socials.classList.toggle('translate-y-0', socialsVisible);
        socials.classList.toggle('opacity-100', socialsVisible);
        socials.classList.toggle('translate-y-3', !socialsVisible);
        socials.classList.toggle('opacity-0', !socialsVisible);
        socials.style.pointerEvents = socialsVisible ? 'auto' : 'none';
        socials.setAttribute('aria-hidden', socialsVisible ? 'false' : 'true');
      }

      if (arrow) {
        arrow.style.opacity = arrowVisible ? '1' : '0';
        arrow.style.top = arrowPinned ? `${arrowTop}px` : '';
        arrow.style.transform = `translateX(-50%) translateY(${arrowVisible ? '0' : '8px'})`;
        arrow.style.pointerEvents = arrowVisible ? 'auto' : 'none';
        arrow.classList.toggle('fixed', arrowPinned);
        arrow.classList.toggle('absolute', !arrowPinned);
        arrow.classList.toggle('bottom-4', !arrowPinned);
        arrow.setAttribute('aria-hidden', arrowVisible ? 'false' : 'true');
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let cancelled = false;
    void loadDitheredHeroCanvasModule()
      .then((module) => {
        if (cancelled) {
          return;
        }

        module.preloadDitheredHeroCanvasData?.();
        setCanvasReady(true);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {canvasReady ? (
        <Suspense fallback={null}>
          <LazyDitheredHeroCanvas
            onAutoOnlyChange={handleHeroAutoOnlyChange}
            onInteractiveChange={handleHeroInteractiveChange}
          />
        </Suspense>
      ) : null}

      {showShaderHint ? <ShaderHint autoOnly={heroShaderAutoOnly} onDismiss={dismissShaderHint} /> : null}

      <button
        ref={arrowRef}
        type="button"
        onClick={scrollPastHero}
        className="focus-ring absolute bottom-4 left-1/2 z-40 grid h-12 w-12 place-items-center rounded-full border-2 border-[#101617] bg-[#faf9f4]/90 text-[#101617] shadow-[4px_4px_0_0_rgba(255,58,18,0.9)] backdrop-blur-sm transition-[background-color,box-shadow,color,transform,top] duration-300 hover:bg-[#ffda18] hover:shadow-[6px_6px_0_0_rgba(16,22,23,0.9)] sm:h-14 sm:w-14"
        aria-label="Scroll past hero to about section"
      >
        <ArrowDown className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={3.25} aria-hidden="true" />
      </button>
    </>
  );
};

const ShaderHint = ({ autoOnly, onDismiss }) => {
  return (
    <aside
      role="note"
      className="motion-reveal pointer-events-auto absolute bottom-6 left-4 right-4 z-20 mx-auto max-w-[20rem] rounded-sm border-2 border-[#101617] bg-[#faf9f4]/92 p-4 pr-10 shadow-[6px_6px_0_0_rgba(255,58,18,0.88)] backdrop-blur-sm [--motion-delay:1.1s] [--reveal-y:14px] sm:bottom-8 sm:left-6 sm:right-auto sm:mx-0 sm:max-w-[22rem] sm:p-5 sm:pr-11"
    >
      <p className="m-0 font-mono text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#ff3a12] sm:text-xs">
        Live shaders
      </p>
      <p className="m-0 mt-2 font-body text-[0.9rem] font-semibold leading-snug text-[#101617] sm:text-base">
        Fun Fact! This scene is painted in real time on your GPU.
      </p>
      {!autoOnly ? (
        <p className="m-0 mt-1.5 font-body text-[0.84rem] leading-snug text-[#101617]/80 sm:text-[0.92rem]">
          Move your cursor over the scene to reveal the clouds.
        </p>
      ) : null}
      <button
        type="button"
        onClick={onDismiss}
        className="focus-ring absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#101617] font-mono text-base font-bold leading-none text-[#101617] transition-colors hover:bg-[#ffda18]"
        aria-label="Dismiss shader hint"
      >
        ×
      </button>
    </aside>
  );
};

function usePrefersReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return undefined;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setShouldReduceMotion(media.matches);

    updatePreference();
    media.addEventListener('change', updatePreference);

    return () => media.removeEventListener('change', updatePreference);
  }, []);

  return shouldReduceMotion;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default Hero;
