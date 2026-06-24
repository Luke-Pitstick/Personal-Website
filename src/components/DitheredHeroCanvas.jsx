import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDitheredCanvas } from '@dithered-particle-canvas/react';

const HERO_WIDTH = 1280;
const HERO_HEIGHT = 720;
const LOW_RESOLUTION_SCALE = 0.6;
const BASE_RENDER_WIDTH = HERO_WIDTH * LOW_RESOLUTION_SCALE;
const BASE_RENDER_HEIGHT = HERO_HEIGHT * LOW_RESOLUTION_SCALE;
const FOREGROUND_PIXEL_SIZE = 6;
const REVEAL_EDGE_NOISE = 0.56;
const REVEAL_EDGE_DITHER = 0.94;
const REVEAL_EDGE_FLICKER = 0.78;
const REVEAL_FOREGROUND_BLEND = 0.9;
const REVEAL_FADE_MS = 760;
const REVEAL_RADIUS = 250;
const TRAIL_DURATION_MS = 1550;
const TRAIL_DUST_FLICKER = 0.72;
const TRAIL_DUST_SIZE = 9;
const TRAIL_IDLE_MS = 180;
const TRAIL_MAX_POINTS = 10;
const IDLE_SURFACE_CONTRAST = 1.02;
const DITHERED_BACKGROUND_SRC = '/background-dithered.webp';
const MOUNTAIN_FOREGROUND_SRC = '/hero-mountains.webp';
const FALLBACK_BLUE_TINT = 22;

const REVEAL_SOFTNESS = 0.58;
const TRAIL_SPACING = 28;
const TRAIL_STRENGTH = 0.9;
const EMPTY_FILTERS = [];

const QUALITY = {
  backend: 'webgl2',
  resolutionScale: LOW_RESOLUTION_SCALE,
};
const HERO_RENDERER_OPTIONS = {
  IntersectionObserver: false,
};

const AUTO_REVEAL_POINTER_INTERVAL_MS = 32;
const AUTO_CURSOR_RESUME_MS = 2400;
const AUTO_REVEAL_BOUNDS = {
  maxX: 0.92,
  maxY: 0.9,
  minX: 0.08,
  minY: 0.1,
};
const AUTO_REVEAL_BALLS = [
  { id: 1, x: 0.14, y: 0.2, vx: 0.00011, vy: 0.000076 },
  { id: 2, x: 0.34, y: 0.73, vx: -0.000084, vy: 0.000112 },
  { id: 3, x: 0.58, y: 0.28, vx: 0.000096, vy: -0.000089 },
  { id: 4, x: 0.78, y: 0.66, vx: -0.000118, vy: -0.000071 },
];
const AUTO_ONLY_MEDIA_QUERY = '(hover: none), (pointer: coarse)';
const idleSurfaceWaveCache = new Map();
const idleSurfaceGrainCache = new Map();
const canPackRgbaPixels = isLittleEndian();
let interactiveIdleLayerPromise;
let revealBackgroundPromise;
let staticFallbackPreference;

export function preloadDitheredHeroCanvasData() {
  if (typeof window === 'undefined' || shouldUseStaticFallback()) {
    return;
  }

  void getInteractiveIdleLayer().catch(() => {});
  void getDitheredRevealBackground().catch(() => {});
}

const DitheredHeroCanvas = ({ onAutoOnlyChange, onInteractiveChange, onUserInteract }) => {
  const rootRef = useRef(null);
  const shaderCanvasRef = useRef(null);
  const fallbackCanvasRef = useRef(null);
  const rendererRef = useRef(null);
  const [preparedImageData, setPreparedImageData] = useState();
  const [useStaticFallback, setUseStaticFallback] = useState(shouldUseStaticFallback);
  const autoOnly = useAutoOnlyShaderMode();

  const handleRendererError = useCallback((error) => {
    console.error('Dithered hero WebGL renderer failed.', error);
    setUseStaticFallback(true);
  }, []);
  const interactionScale = useInteractionScale(rootRef);

  useEffect(() => {
    if (useStaticFallback) {
      return undefined;
    }

    let cancelled = false;

    Promise.all([getInteractiveIdleLayer(), getDitheredRevealBackground()])
      .then(([idleLayer, revealBackground]) => {
        if (!cancelled) {
          setPreparedImageData({ idleLayer, revealBackground });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUseStaticFallback(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [useStaticFallback]);

  const layers = useMemo(() => {
    if (useStaticFallback || !preparedImageData) {
      return undefined;
    }

    return createHeroLayers(
      preparedImageData.idleLayer,
      preparedImageData.revealBackground,
      interactionScale
    );
  }, [useStaticFallback, preparedImageData, interactionScale]);

  const isInteractive = !useStaticFallback && Boolean(layers);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || !isInteractive) {
      return undefined;
    }

    let frame = 0;
    let autoRevealTimer = 0;
    let pauseUntil = 0;
    let lastAutoRevealTime = performance.now();
    let canvasRect;
    let observedCanvas;
    let isDocumentVisible = document.visibilityState !== 'hidden';
    let isHeroIntersecting = true;
    const autoRevealBalls = createAutoRevealBalls();

    const canRender = () => isDocumentVisible && isHeroIntersecting;

    const observeCanvas = (nextCanvas) => {
      if (observedCanvas === nextCanvas) {
        return;
      }

      if (observedCanvas) {
        rectResizeObserver.unobserve(observedCanvas);
      }

      observedCanvas = nextCanvas;

      if (observedCanvas) {
        rectResizeObserver.observe(observedCanvas);
      }
    };

    const getCurrentCanvas = () => {
      const currentCanvas = shaderCanvasRef.current;

      if (currentCanvas?.isConnected && root.contains(currentCanvas)) {
        observeCanvas(currentCanvas);
        return currentCanvas;
      }

      if (observedCanvas) {
        observeCanvas(undefined);
        canvasRect = undefined;
      }

      return undefined;
    };

    const refreshCanvasRect = () => {
      const currentCanvas = getCurrentCanvas();

      if (!currentCanvas) {
        canvasRect = undefined;
        return;
      }

      canvasRect = currentCanvas.getBoundingClientRect();
    };

    const cancelAnimation = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }

      if (autoRevealTimer) {
        window.clearTimeout(autoRevealTimer);
        autoRevealTimer = 0;
      }
    };

    const scheduleAnimation = (delayMs = 0) => {
      if (frame || autoRevealTimer) {
        return;
      }

      if (delayMs > 0) {
        autoRevealTimer = window.setTimeout(() => {
          autoRevealTimer = 0;

          if (!canRender()) {
            syncAnimation();
            return;
          }

          frame = window.requestAnimationFrame(animate);
        }, delayMs);
        return;
      }

      frame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (frame || autoRevealTimer) {
        return;
      }

      lastAutoRevealTime = performance.now();
      scheduleAnimation(AUTO_REVEAL_POINTER_INTERVAL_MS);
    };

    const syncAnimation = () => {
      if (canRender()) {
        rendererRef.current?.resume?.();
      } else {
        rendererRef.current?.pause?.();
      }

      if (canRender() && getCurrentCanvas()) {
        startAnimation();
        return;
      }

      cancelAnimation();
    };

    const pauseForUser = (event) => {
      if (event.isTrusted) {
        pauseUntil = performance.now() + AUTO_CURSOR_RESUME_MS;
        onUserInteract?.();
      }
    };

    const animate = (time) => {
      frame = 0;

      if (!canRender()) {
        syncAnimation();
        return;
      }

      const currentCanvas = getCurrentCanvas();

      if (!currentCanvas) {
        syncAnimation();
        return;
      }

      if (!canvasRect) {
        refreshCanvasRect();
      }

      let nextDelay = AUTO_REVEAL_POINTER_INTERVAL_MS;

      if (canvasRect) {
        const nextAutoRevealTime = Math.max(
          pauseUntil,
          lastAutoRevealTime + AUTO_REVEAL_POINTER_INTERVAL_MS
        );

        if (time >= nextAutoRevealTime) {
          const deltaMs = Math.min(64, Math.max(0, time - lastAutoRevealTime));

          stepAutoRevealBalls(autoRevealBalls, deltaMs);
          dispatchAutoPointers(currentCanvas, canvasRect, autoRevealBalls);
          lastAutoRevealTime = time;
        } else {
          nextDelay = nextAutoRevealTime - time;
        }
      }

      scheduleAnimation(nextDelay);
    };

    if (!autoOnly) {
      root.addEventListener('pointermove', pauseForUser, { passive: true });
      root.addEventListener('pointerdown', pauseForUser, { passive: true });
    }

    const handleRectInvalidation = () => {
      canvasRect = undefined;
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState !== 'hidden';
      handleRectInvalidation();
      syncAnimation();
    };

    const handleIntersectionChange = ([entry]) => {
      isHeroIntersecting = entry?.isIntersecting ?? true;
      handleRectInvalidation();
      syncAnimation();
    };

    const rectResizeObserver = new ResizeObserver(handleRectInvalidation);
    const intersectionObserver = new IntersectionObserver(handleIntersectionChange);
    const scrollListenerOptions = { capture: true, passive: true };

    intersectionObserver.observe(root);
    window.addEventListener('resize', handleRectInvalidation);
    window.addEventListener('scroll', handleRectInvalidation, scrollListenerOptions);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    syncAnimation();

    return () => {
      cancelAnimation();
      rectResizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('resize', handleRectInvalidation);
      window.removeEventListener('scroll', handleRectInvalidation, scrollListenerOptions);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      root.removeEventListener('pointermove', pauseForUser);
      root.removeEventListener('pointerdown', pauseForUser);
    };
  }, [autoOnly, isInteractive, onUserInteract]);

  const fallbackSurface = useMemo(() => {
    if (!useStaticFallback) {
      return undefined;
    }

    return createIdleSurfaceImageData(HERO_WIDTH, HERO_HEIGHT, { blueTint: FALLBACK_BLUE_TINT });
  }, [useStaticFallback]);

  useEffect(() => {
    onInteractiveChange?.(isInteractive);
  }, [isInteractive, onInteractiveChange]);

  useEffect(() => {
    onAutoOnlyChange?.(autoOnly);
  }, [autoOnly, onAutoOnlyChange]);

  useEffect(() => {
    const canvas = fallbackCanvasRef.current;

    if (!canvas || !fallbackSurface) {
      return;
    }

    canvas.width = fallbackSurface.width;
    canvas.height = fallbackSurface.height;
    canvas.getContext('2d')?.putImageData(fallbackSurface, 0, 0);
  }, [fallbackSurface]);

  return (
    <div
      ref={rootRef}
      className={`dithered-hero dithered-hero--interactive${autoOnly ? ' dithered-hero--auto-only' : ''}`}
    >
      {fallbackSurface ? (
        <canvas
          ref={fallbackCanvasRef}
          aria-hidden="true"
          className="dithered-hero-fallback"
          height={HERO_HEIGHT}
          width={HERO_WIDTH}
        />
      ) : null}
      {!useStaticFallback && layers ? (
        <DitheredHeroRenderer
          ref={rendererRef}
          aria-label="Dithered Flatirons reveal background"
          canvasElementRef={shaderCanvasRef}
          className="dithered-hero-canvas"
          height={HERO_HEIGHT}
          layers={layers}
          motion="full"
          onError={handleRendererError}
          preset="browserbase"
          quality={QUALITY}
          revealLayer="background"
          rendererOptions={HERO_RENDERER_OPTIONS}
          width={HERO_WIDTH}
        />
      ) : null}
      <img
        alt=""
        aria-hidden="true"
        className="dithered-hero-mountains"
        decoding="async"
        fetchPriority="low"
        height={HERO_HEIGHT}
        src={MOUNTAIN_FOREGROUND_SRC}
        width={HERO_WIDTH}
      />
      <div className="dithered-hero-shade" />
    </div>
  );
};

function shouldUseStaticFallback() {
  if (staticFallbackPreference !== undefined) {
    return staticFallbackPreference;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    staticFallbackPreference = !context;
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return staticFallbackPreference;
  } catch {
    staticFallbackPreference = true;
    return true;
  }
}

const DitheredHeroRenderer = React.forwardRef(function DitheredHeroRenderer(
  {
    canvasElementRef,
    className,
    height,
    width,
    'aria-label': ariaLabel,
    ...rendererProps
  },
  ref
) {
  const { canvasRef } = useDitheredCanvas(ref, { ...rendererProps, height, width });

  const setCanvasRef = useCallback(
    (canvas) => {
      canvasRef.current = canvas;
      canvasElementRef.current = canvas;
    },
    [canvasElementRef, canvasRef]
  );

  return (
    <div className={className}>
      <canvas
        ref={setCanvasRef}
        aria-label={ariaLabel}
        height={height}
        role={ariaLabel ? 'img' : undefined}
        width={width}
      />
    </div>
  );
});

function getInteractiveIdleLayer() {
  interactiveIdleLayerPromise ??= Promise.resolve()
    .then(() =>
      createIdleSurfaceImageData(HERO_WIDTH, HERO_HEIGHT, { contrast: IDLE_SURFACE_CONTRAST })
    )
    .catch((error) => {
      interactiveIdleLayerPromise = undefined;
      throw error;
    });

  return interactiveIdleLayerPromise;
}

function getDitheredRevealBackground() {
  revealBackgroundPromise ??= loadDitheredRevealBackground(HERO_WIDTH, HERO_HEIGHT).catch(
    (error) => {
      revealBackgroundPromise = undefined;
      throw error;
    }
  );

  return revealBackgroundPromise;
}

function createHeroLayers(idleLayer, revealBackground, interactionScale = 1) {
  const reveal = buildRevealConfig(interactionScale);

  return {
    background: {
      dither: false,
      fit: 'stretch',
      filters: EMPTY_FILTERS,
      opacity: 1,
      reveal,
      src: revealBackground,
    },
    foreground: {
      dither: false,
      fit: 'stretch',
      filters: EMPTY_FILTERS,
      opacity: 1,
      reveal,
      src: idleLayer,
    },
  };
}

function buildRevealConfig(interactionScale = 1) {
  return {
    edgeDither: REVEAL_EDGE_DITHER,
    edgeFlicker: REVEAL_EDGE_FLICKER,
    edgeNoise: REVEAL_EDGE_NOISE,
    fadeMs: REVEAL_FADE_MS,
    foregroundBlend: REVEAL_FOREGROUND_BLEND,
    pixelSize: scaleInteractionValue(FOREGROUND_PIXEL_SIZE, interactionScale),
    radius: REVEAL_RADIUS * interactionScale,
    softness: REVEAL_SOFTNESS,
    strength: 1,
    trail: {
      dustFlicker: TRAIL_DUST_FLICKER,
      dustSize: scaleInteractionValue(TRAIL_DUST_SIZE, interactionScale),
      durationMs: TRAIL_DURATION_MS,
      idleMs: TRAIL_IDLE_MS,
      maxPoints: TRAIL_MAX_POINTS,
      spacing: scaleInteractionValue(TRAIL_SPACING, interactionScale),
      strength: TRAIL_STRENGTH,
    },
  };
}

function useInteractionScale(rootRef) {
  const [interactionScale, setInteractionScale] = useState(getInitialInteractionScale);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || typeof window === 'undefined') {
      return undefined;
    }

    const updateScale = ([entry]) => {
      if (!entry) {
        return;
      }

      const nextScale = calculateInteractionScale(
        entry.contentRect.width,
        entry.contentRect.height,
        window.devicePixelRatio || 1
      );

      setInteractionScale((currentScale) =>
        Math.abs(currentScale - nextScale) < 0.01 ? currentScale : nextScale
      );
    };

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(root);

    return () => {
      resizeObserver.disconnect();
    };
  }, [rootRef]);

  return interactionScale;
}

function getInitialInteractionScale() {
  if (typeof window === 'undefined') {
    return 1;
  }

  return calculateInteractionScale(
    window.innerWidth || HERO_WIDTH,
    window.innerHeight || HERO_HEIGHT,
    window.devicePixelRatio || 1
  );
}

function calculateInteractionScale(width, height, devicePixelRatio = 1) {
  const renderWidth = width * QUALITY.resolutionScale * devicePixelRatio;
  const renderHeight = height * QUALITY.resolutionScale * devicePixelRatio;

  return Math.max(
    0.1,
    Math.min(1, renderWidth / BASE_RENDER_WIDTH, renderHeight / BASE_RENDER_HEIGHT)
  );
}

function useAutoOnlyShaderMode() {
  const [autoOnly, setAutoOnly] = useState(getInitialAutoOnlyShaderMode);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const media = window.matchMedia(AUTO_ONLY_MEDIA_QUERY);
    const updateAutoOnly = () => setAutoOnly(media.matches);

    updateAutoOnly();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', updateAutoOnly);
      return () => media.removeEventListener('change', updateAutoOnly);
    }

    media.addListener(updateAutoOnly);
    return () => media.removeListener(updateAutoOnly);
  }, []);

  return autoOnly;
}

function getInitialAutoOnlyShaderMode() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(AUTO_ONLY_MEDIA_QUERY).matches;
}

function scaleInteractionValue(value, interactionScale) {
  return Math.max(1, Math.round(value * interactionScale));
}

function createAutoRevealBalls() {
  return AUTO_REVEAL_BALLS.map((ball) => ({ ...ball }));
}

function stepAutoRevealBalls(balls, deltaMs) {
  for (let index = 0; index < balls.length; index += 1) {
    const ball = balls[index];

    ball.x += ball.vx * deltaMs;
    ball.y += ball.vy * deltaMs;

    if (ball.x <= AUTO_REVEAL_BOUNDS.minX || ball.x >= AUTO_REVEAL_BOUNDS.maxX) {
      ball.x = Math.max(AUTO_REVEAL_BOUNDS.minX, Math.min(AUTO_REVEAL_BOUNDS.maxX, ball.x));
      ball.vx *= -1;
    }

    if (ball.y <= AUTO_REVEAL_BOUNDS.minY || ball.y >= AUTO_REVEAL_BOUNDS.maxY) {
      ball.y = Math.max(AUTO_REVEAL_BOUNDS.minY, Math.min(AUTO_REVEAL_BOUNDS.maxY, ball.y));
      ball.vy *= -1;
    }
  }
}

function dispatchAutoPointers(canvas, rect, balls) {
  const originalGetBoundingClientRect = canvas.getBoundingClientRect;

  // Reuse the rect already measured by the wrapper for this synchronous pointer batch.
  canvas.getBoundingClientRect = () => rect;

  try {
    for (let index = 0; index < balls.length; index += 1) {
      const ball = balls[index];

      canvas.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: false,
          clientX: rect.left + rect.width * ball.x,
          clientY: rect.top + rect.height * ball.y,
          isPrimary: index === 0,
          pointerId: ball.id,
          pointerType: 'mouse',
          pressure: 0.65,
        })
      );
    }
  } finally {
    canvas.getBoundingClientRect = originalGetBoundingClientRect;
  }
}

async function loadDitheredRevealBackground(width, height) {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.decoding = 'async';
  image.src = DITHERED_BACKGROUND_SRC;
  await image.decode();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) {
    throw new Error('Canvas2D is unavailable for background image loading.');
  }

  context.drawImage(image, 0, 0, width, height);

  return context.getImageData(0, 0, width, height);
}

function createIdleSurfaceImageData(width, height, { blueTint = 0, contrast = 1 } = {}) {
  const image = new ImageData(width, height);
  const packedPixels =
    canPackRgbaPixels && !blueTint ? new Uint32Array(image.data.buffer) : undefined;
  const { cosXY, sinX } = getIdleSurfaceWaveTables(width, height);
  const grainRows = getIdleSurfaceGrainRows(width);
  const redTint = blueTint * 0.55;
  const greenTint = blueTint * 0.2;
  const blueTintBoost = blueTint * 0.85;
  const contrastOffset = 128 - 128 * contrast;

  for (let y = 0; y < height; y += 1) {
    const vertical = y / height;
    const redBase = (228 + vertical * 12 - redTint) * contrast + contrastOffset;
    const greenBase = (232 + vertical * 8 + greenTint) * contrast + contrastOffset;
    const blueBase = (220 + vertical * 5 + blueTintBoost) * contrast + contrastOffset;
    const grainRow = grainRows[y % grainRows.length];
    const rowOffset = y * width;

    for (let x = 0; x < width; x += 1) {
      const paper = (sinX[x] + cosXY[x + y] + grainRow[x]) * contrast;
      const red = Math.round(redBase + paper);
      const green = Math.round(greenBase + paper);
      const blue = Math.round(blueBase + paper);

      if (packedPixels) {
        packedPixels[rowOffset + x] = 0xff000000 | (blue << 16) | (green << 8) | red;
      } else {
        const index = (rowOffset + x) * 4;

        image.data[index] = red;
        image.data[index + 1] = green;
        image.data[index + 2] = blue;
        image.data[index + 3] = 255;
      }
    }
  }

  return image;
}

function getIdleSurfaceGrainRows(width) {
  const cached = idleSurfaceGrainCache.get(width);

  if (cached) {
    return cached;
  }

  const rows = Array.from({ length: 19 }, (_, yMod) => {
    const row = new Float64Array(width);

    for (let x = 0; x < width; x += 1) {
      row[x] = (((x * 17 + yMod * 31) % 19) - 9) * 0.8;
    }

    return row;
  });

  idleSurfaceGrainCache.set(width, rows);

  return rows;
}

function getIdleSurfaceWaveTables(width, height) {
  const cacheKey = `${width}x${height}`;
  const cached = idleSurfaceWaveCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const sinX = new Float64Array(width);
  const cosXY = new Float64Array(width + height - 1);

  for (let x = 0; x < width; x += 1) {
    sinX[x] = Math.sin(x / 120) * 3;
  }

  for (let index = 0; index < cosXY.length; index += 1) {
    cosXY[index] = Math.cos(index / 180) * 4;
  }

  const tables = { cosXY, sinX };
  idleSurfaceWaveCache.set(cacheKey, tables);

  return tables;
}

function isLittleEndian() {
  return new Uint8Array(new Uint32Array([0x0a0b0c0d]).buffer)[0] === 0x0d;
}

export default DitheredHeroCanvas;
