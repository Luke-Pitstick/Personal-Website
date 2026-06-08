import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DitheredParticleCanvas } from '@dithered-particle-canvas/react';

const HERO_WIDTH = 1280;
const HERO_HEIGHT = 720;
const LOW_RESOLUTION_SCALE = 0.52;
const BACKGROUND_PIXEL_SIZE = 3;
const FOREGROUND_PIXEL_SIZE = 6;
const REVEAL_EDGE_NOISE = 0.56;
const REVEAL_EDGE_DITHER = 0.94;
const REVEAL_EDGE_FLICKER = 0.78;
const REVEAL_FOREGROUND_BLEND = 0.9;
const REVEAL_FADE_MS = 760;
const REVEAL_RADIUS = 170;
const TRAIL_DURATION_MS = 1550;
const TRAIL_DUST_FLICKER = 0.72;
const TRAIL_DUST_SIZE = 7;
const TRAIL_IDLE_MS = 180;
const TRAIL_MAX_POINTS = 30;
const SKY_BACKGROUND_BLUE_BIAS = 112;
const SKY_BACKGROUND_SATURATION = 2.45;
const BACKGROUND_REVEAL_SRC = '/background.jpg';
const FOREGROUND_MOUNTAINS_SRC = '/chautauqua-flatirons_fg.jpg';
const FALLBACK_BLUE_TINT = 22;

const MOUNTAIN_PALETTE = {
  black: [8, 12, 14],
  green: [119, 203, 45],
  orange: [255, 58, 18],
  pale: [242, 239, 214],
  yellow: [255, 218, 24],
};

const LAYER_CONTROLS = {
  background: {
    brightness: 1.08,
    contrast: 1.16,
    ditherAmount: 0.9,
    ditherMatrixSize: 8,
    ditherPixelSize: BACKGROUND_PIXEL_SIZE,
    opacity: 1,
    revealEdgeDither: REVEAL_EDGE_DITHER,
    revealEdgeFlicker: REVEAL_EDGE_FLICKER,
    revealEdgeNoise: REVEAL_EDGE_NOISE,
    revealFadeMs: REVEAL_FADE_MS,
    revealPixelSize: FOREGROUND_PIXEL_SIZE,
    revealRadius: REVEAL_RADIUS,
    revealSoftness: 0.58,
    trailDustFlicker: TRAIL_DUST_FLICKER,
    trailDustSize: TRAIL_DUST_SIZE,
    trailDurationMs: TRAIL_DURATION_MS,
    trailIdleMs: TRAIL_IDLE_MS,
    trailSpacing: 28,
    trailStrength: 0.9,
  },
  foreground: {
    brightness: 1,
    contrast: 1.02,
    ditherAmount: 0,
    ditherMatrixSize: 8,
    ditherPixelSize: FOREGROUND_PIXEL_SIZE,
    opacity: 1,
    revealEdgeDither: REVEAL_EDGE_DITHER,
    revealEdgeFlicker: REVEAL_EDGE_FLICKER,
    revealEdgeNoise: REVEAL_EDGE_NOISE,
    revealFadeMs: REVEAL_FADE_MS,
    revealPixelSize: FOREGROUND_PIXEL_SIZE,
    revealRadius: REVEAL_RADIUS,
    revealSoftness: 0.58,
    trailDustFlicker: TRAIL_DUST_FLICKER,
    trailDustSize: TRAIL_DUST_SIZE,
    trailDurationMs: TRAIL_DURATION_MS,
    trailIdleMs: TRAIL_IDLE_MS,
    trailSpacing: 28,
    trailStrength: 0.9,
  },
};

const MOUNTAIN_CONTROLS = {
  brightness: 1,
  colorCount: 5,
  colorMode: 'limited',
  contrast: 1,
  hue: 0,
  saturation: 1,
  warmth: 0,
};

const QUALITY = {
  backend: 'webgl2',
  resolutionScale: LOW_RESOLUTION_SCALE,
  targetFps: 60,
};

const AUTO_CURSOR_RESUME_MS = 2400;
const AUTO_CURSOR_LOOP_MS = 14500;
const TAU = Math.PI * 2;

const DitheredHeroCanvas = ({ onInteractiveChange, onUserInteract }) => {
  const rootRef = useRef(null);
  const fallbackCanvasRef = useRef(null);
  const mountainCanvasRef = useRef(null);
  const [idleLayer, setIdleLayer] = useState();
  const [revealBackground, setRevealBackground] = useState();
  const [mountainBase, setMountainBase] = useState();
  const [useStaticFallback, setUseStaticFallback] = useState(shouldUseStaticFallback);

  useEffect(() => {
    setIdleLayer(createIdleSurfaceImageData(HERO_WIDTH, HERO_HEIGHT));
  }, []);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || useStaticFallback) {
      return undefined;
    }

    let frame = 0;
    let pauseUntil = 0;
    const startedAt = performance.now();

    const pauseForUser = (event) => {
      if (event.isTrusted) {
        pauseUntil = performance.now() + AUTO_CURSOR_RESUME_MS;
        onUserInteract?.();
      }
    };

    const animate = (time) => {
      const canvas = root.querySelector('.dithered-hero-canvas canvas');

      if (canvas && time >= pauseUntil) {
        const rect = canvas.getBoundingClientRect();
        const progress = moduloFloat((time - startedAt) / AUTO_CURSOR_LOOP_MS, 1);
        dispatchAutoPointer(canvas, rect, sampleInfinityAutoCursorPath(progress));
      }

      frame = window.requestAnimationFrame(animate);
    };

    root.addEventListener('pointermove', pauseForUser, { passive: true });
    root.addEventListener('pointerdown', pauseForUser, { passive: true });
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      root.removeEventListener('pointermove', pauseForUser);
      root.removeEventListener('pointerdown', pauseForUser);
    };
  }, [useStaticFallback, onUserInteract]);

  useEffect(() => {
    if (useStaticFallback) {
      return undefined;
    }

    let cancelled = false;

    loadSkyRevealBackground(HERO_WIDTH, HERO_HEIGHT)
      .then((imageData) => {
        if (!cancelled) {
          setRevealBackground(imageData);
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

  useEffect(() => {
    let cancelled = false;

    loadMattedMountainForeground(FOREGROUND_MOUNTAINS_SRC, HERO_WIDTH, HERO_HEIGHT)
      .then((imageData) => {
        if (!cancelled) {
          setMountainBase(imageData);
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
  }, []);

  const layers = useMemo(() => {
    if (useStaticFallback || !idleLayer) {
      return undefined;
    }

    return createHeroLayers(idleLayer, revealBackground);
  }, [useStaticFallback, idleLayer, revealBackground]);

  const fallbackSurface = useMemo(() => {
    if (!useStaticFallback) {
      return undefined;
    }

    return createIdleSurfaceImageData(HERO_WIDTH, HERO_HEIGHT, { blueTint: FALLBACK_BLUE_TINT });
  }, [useStaticFallback]);

  const isInteractive = !useStaticFallback && Boolean(layers) && Boolean(revealBackground);

  useEffect(() => {
    onInteractiveChange?.(isInteractive);
  }, [isInteractive, onInteractiveChange]);

  useEffect(() => {
    if (useStaticFallback) {
      onInteractiveChange?.(false);
    }
  }, [useStaticFallback, onInteractiveChange]);

  const mountains = useMemo(() => {
    if (!mountainBase) {
      return undefined;
    }

    return applyMountainColorFilters(mountainBase, MOUNTAIN_CONTROLS);
  }, [mountainBase]);

  useEffect(() => {
    const canvas = fallbackCanvasRef.current;

    if (!canvas || !fallbackSurface) {
      return;
    }

    canvas.width = fallbackSurface.width;
    canvas.height = fallbackSurface.height;
    canvas.getContext('2d')?.putImageData(fallbackSurface, 0, 0);
  }, [fallbackSurface]);

  useEffect(() => {
    const canvas = mountainCanvasRef.current;

    if (!canvas || !mountains) {
      return;
    }

    canvas.width = mountains.width;
    canvas.height = mountains.height;
    canvas.getContext('2d')?.putImageData(mountains, 0, 0);
  }, [mountains]);

  return (
    <div ref={rootRef} className="dithered-hero">
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
        <DitheredParticleCanvas
          aria-label="Dithered Flatirons reveal background"
          className="dithered-hero-canvas"
          fallback="Dithered hero"
          height={HERO_HEIGHT}
          layers={layers}
          motion="full"
          onError={() => setUseStaticFallback(true)}
          preset="browserbase"
          quality={QUALITY}
          revealLayer="background"
          width={HERO_WIDTH}
        />
      ) : null}
      <canvas
        ref={mountainCanvasRef}
        className="dithered-hero-mountains"
        height={HERO_HEIGHT}
        width={HERO_WIDTH}
      />
      <div className="dithered-hero-shade" />
    </div>
  );
};

function shouldUseStaticFallback() {
  if (typeof window === 'undefined') {
    return false;
  }

  if (/Windows/i.test(navigator.userAgent)) {
    return true;
  }

  try {
    const canvas = document.createElement('canvas');
    return !canvas.getContext('webgl2');
  } catch {
    return true;
  }
}

function createHeroLayers(idleLayer, revealBackground) {
  return {
    background: {
      dither: buildDitherConfig(LAYER_CONTROLS.background),
      fit: 'stretch',
      filters: buildFilters(LAYER_CONTROLS.background),
      opacity: LAYER_CONTROLS.background.opacity,
      reveal: buildRevealConfig(LAYER_CONTROLS.background),
      src: revealBackground ?? idleLayer,
    },
    foreground: {
      dither: buildDitherConfig(LAYER_CONTROLS.foreground),
      fit: 'stretch',
      filters: buildFilters(LAYER_CONTROLS.foreground),
      opacity: LAYER_CONTROLS.foreground.opacity,
      reveal: buildRevealConfig(LAYER_CONTROLS.foreground),
      src: idleLayer,
    },
  };
}

function buildFilters(controls) {
  const filters = [];

  if (controls.contrast !== 1) {
    filters.push({ type: 'contrast', amount: controls.contrast });
  }

  if (controls.brightness !== 1) {
    filters.push({ type: 'brightness', amount: controls.brightness });
  }

  return filters;
}

function buildDitherConfig(controls) {
  if (controls.ditherAmount <= 0) {
    return false;
  }

  return {
    amount: controls.ditherAmount,
    matrixSize: controls.ditherMatrixSize,
    palette: 'browserbase',
    pixelSize: controls.ditherPixelSize,
  };
}

function buildRevealConfig(controls) {
  return {
    edgeDither: controls.revealEdgeDither,
    edgeFlicker: controls.revealEdgeFlicker,
    edgeNoise: controls.revealEdgeNoise,
    fadeMs: controls.revealFadeMs,
    foregroundBlend: REVEAL_FOREGROUND_BLEND,
    pixelSize: controls.revealPixelSize,
    radius: controls.revealRadius,
    softness: controls.revealSoftness,
    strength: 1,
    trail: {
      dustFlicker: controls.trailDustFlicker,
      dustSize: controls.trailDustSize,
      durationMs: controls.trailDurationMs,
      idleMs: controls.trailIdleMs,
      maxPoints: TRAIL_MAX_POINTS,
      spacing: controls.trailSpacing,
      strength: controls.trailStrength,
    },
  };
}

function applyMountainColorFilters(source, controls) {
  const output = new ImageData(new Uint8ClampedArray(source.data), source.width, source.height);
  const hueShift = controls.hue / 360;

  if (controls.colorMode === 'limited') {
    applyMountainPalette(output, controls.colorCount);
  }

  for (let index = 0; index < output.data.length; index += 4) {
    const alpha = output.data[index + 3] ?? 0;

    if (alpha === 0) {
      continue;
    }

    let r = adjustContrast(output.data[index] ?? 0, controls.contrast);
    let g = adjustContrast(output.data[index + 1] ?? 0, controls.contrast);
    let b = adjustContrast(output.data[index + 2] ?? 0, controls.contrast);

    r = r * controls.brightness + controls.warmth * 26;
    g = g * controls.brightness + controls.warmth * 6;
    b = b * controls.brightness - controls.warmth * 24;

    const hsl = rgbToHsl(r, g, b);
    const shifted = hslToRgb(
      moduloFloat(hsl.h + hueShift, 1),
      clamp01(hsl.s * controls.saturation),
      hsl.l
    );

    output.data[index] = clampByte(shifted.r);
    output.data[index + 1] = clampByte(shifted.g);
    output.data[index + 2] = clampByte(shifted.b);
  }

  return output;
}

function adjustContrast(value, contrast) {
  return (value - 128) * contrast + 128;
}

function rgbToHsl(r, g, b) {
  const red = clamp01(r / 255);
  const green = clamp01(g / 255);
  const blue = clamp01(b / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, l, s: 0 };
  }

  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const h =
    max === red
      ? (green - blue) / delta + (green < blue ? 6 : 0)
      : max === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4;

  return { h: h / 6, l, s };
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const value = l * 255;

    return { b: value, g: value, r: value };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    b: hueToRgb(p, q, h - 1 / 3) * 255,
    g: hueToRgb(p, q, h) * 255,
    r: hueToRgb(p, q, h + 1 / 3) * 255,
  };
}

function hueToRgb(p, q, t) {
  const hue = moduloFloat(t, 1);

  if (hue < 1 / 6) {
    return p + (q - p) * 6 * hue;
  }

  if (hue < 1 / 2) {
    return q;
  }

  if (hue < 2 / 3) {
    return p + (q - p) * (2 / 3 - hue) * 6;
  }

  return p;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function moduloFloat(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function sampleInfinityAutoCursorPath(progress) {
  const theta = moduloFloat(progress, 1) * TAU;

  return {
    x: 0.5 + Math.sin(theta) * 0.38 + Math.sin(theta * 3 + 0.55) * 0.1,
    y: 0.52 + Math.sin(theta * 2 + 0.18) * 0.31 + Math.sin(theta * 3 - 0.75) * 0.07,
  };
}

function dispatchAutoPointer(canvas, rect, point) {
  const xRatio = Math.max(0.08, Math.min(0.92, point.x));
  const yRatio = Math.max(0.1, Math.min(0.9, point.y));

  canvas.dispatchEvent(
    new PointerEvent('pointermove', {
      bubbles: true,
      clientX: rect.left + rect.width * xRatio,
      clientY: rect.top + rect.height * yRatio,
      pointerType: 'mouse',
      pressure: 0.65,
    })
  );
}

async function loadSkyRevealBackground(width, height) {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.decoding = 'async';
  image.src = BACKGROUND_REVEAL_SRC;
  await image.decode();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) {
    throw new Error('Canvas2D is unavailable for background image loading.');
  }

  context.drawImage(image, 0, 0, width, height);

  const imageData = context.getImageData(0, 0, width, height);
  enhanceSkyBackground(imageData);

  return imageData;
}

function enhanceSkyBackground(image) {
  for (let index = 0; index < image.data.length; index += 4) {
    const alpha = image.data[index + 3] ?? 0;

    if (alpha === 0) {
      continue;
    }

    const r = image.data[index] ?? 0;
    const g = image.data[index + 1] ?? 0;
    const b = image.data[index + 2] ?? 0;
    const brightness = (r + g + b) / 3;
    const skyWeight = clamp01((brightness - 92) / 150);
    const hsl = rgbToHsl(r, g, b);
    const saturated = hslToRgb(hsl.h, clamp01(hsl.s * SKY_BACKGROUND_SATURATION), hsl.l);

    image.data[index] = clampByte(saturated.r - SKY_BACKGROUND_BLUE_BIAS * 0.55 * skyWeight);
    image.data[index + 1] = clampByte(saturated.g + SKY_BACKGROUND_BLUE_BIAS * 0.16 * skyWeight);
    image.data[index + 2] = clampByte(saturated.b + SKY_BACKGROUND_BLUE_BIAS * skyWeight);
  }
}

function createIdleSurfaceImageData(width, height, { blueTint = 0 } = {}) {
  const image = new ImageData(width, height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const vertical = y / height;
      const grain = (((x * 17 + y * 31) % 19) - 9) * 0.8;
      const paper = Math.sin(x / 120) * 3 + Math.cos((x + y) / 180) * 4 + grain;

      image.data[index] = clampByte(228 + vertical * 12 + paper - blueTint * 0.55);
      image.data[index + 1] = clampByte(232 + vertical * 8 + paper + blueTint * 0.2);
      image.data[index + 2] = clampByte(220 + vertical * 5 + paper + blueTint * 0.85);
      image.data[index + 3] = 255;
    }
  }

  return image;
}

async function loadMattedMountainForeground(src, width, height) {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.decoding = 'async';
  image.src = src;
  await image.decode();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) {
    throw new Error('Canvas2D is unavailable for foreground matte generation.');
  }

  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawnWidth = image.naturalWidth * scale;
  const drawnHeight = image.naturalHeight * scale;
  const x = (width - drawnWidth) / 2;
  const y = (height - drawnHeight) / 2 + height * 0.12;

  context.drawImage(image, x, y, drawnWidth, drawnHeight);

  const imageData = context.getImageData(0, 0, width, height);

  applyConnectedSkyMatte(imageData);
  pixelateOpaqueForeground(imageData, FOREGROUND_PIXEL_SIZE);

  return imageData;
}

function applyConnectedSkyMatte(image) {
  const skyColor = estimateSkyColor(image);
  const visited = new Uint8Array(image.width * image.height);
  const queue = [];

  for (let x = 0; x < image.width; x += 1) {
    seedSkyPixel(image, visited, queue, skyColor, x, 0);
  }

  for (let y = 1; y < image.height; y += 1) {
    seedSkyPixel(image, visited, queue, skyColor, 0, y);
    seedSkyPixel(image, visited, queue, skyColor, image.width - 1, y);
  }

  for (let head = 0; head < queue.length; head += 1) {
    const current = queue[head];
    const x = current % image.width;
    const y = Math.floor(current / image.width);
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    for (const [nextX, nextY] of neighbors) {
      seedSkyPixel(image, visited, queue, skyColor, nextX, nextY);
    }
  }

  const originalAlpha = new Uint8Array(visited);

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const offset = y * image.width + x;
      const alphaIndex = offset * 4 + 3;

      if (originalAlpha[offset] === 1) {
        image.data[alphaIndex] = 0;
        continue;
      }

      const touchesSky =
        isVisited(originalAlpha, image.width, image.height, x + 1, y) ||
        isVisited(originalAlpha, image.width, image.height, x - 1, y) ||
        isVisited(originalAlpha, image.width, image.height, x, y + 1) ||
        isVisited(originalAlpha, image.width, image.height, x, y - 1);

      if (touchesSky && isSkyColorPixel(image, skyColor, x, y, 132, 90)) {
        image.data[alphaIndex] = 160;
      }
    }
  }
}

function estimateSkyColor(image) {
  let topImageY = 0;

  while (topImageY < image.height && !rowHasOpaquePixel(image, topImageY)) {
    topImageY += 1;
  }

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  const sampleHeight = Math.min(image.height, topImageY + 24);

  for (let y = topImageY; y < sampleHeight; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const pixel = getOpaquePixel(image, x, y);

      if (!pixel || getBrightness(pixel) < 150) {
        continue;
      }

      r += pixel.r;
      g += pixel.g;
      b += pixel.b;
      count += 1;
    }
  }

  if (count === 0) {
    return { b: 235, g: 235, r: 235 };
  }

  return {
    b: b / count,
    g: g / count,
    r: r / count,
  };
}

function rowHasOpaquePixel(image, y) {
  for (let x = 0; x < image.width; x += 1) {
    const index = (y * image.width + x) * 4;

    if ((image.data[index + 3] ?? 0) > 0) {
      return true;
    }
  }

  return false;
}

function seedSkyPixel(image, visited, queue, skyColor, x, y) {
  if (x < 0 || x >= image.width || y < 0 || y >= image.height) {
    return;
  }

  const offset = y * image.width + x;

  if (visited[offset] === 1 || !isSkyColorPixel(image, skyColor, x, y, 150, 74)) {
    return;
  }

  visited[offset] = 1;
  queue.push(offset);
}

function isVisited(visited, width, height, x, y) {
  return x >= 0 && x < width && y >= 0 && y < height && visited[y * width + x] === 1;
}

function isSkyColorPixel(image, skyColor, x, y, minimumBrightness, maximumDistance) {
  const pixel = getOpaquePixel(image, x, y);

  if (!pixel) {
    return false;
  }

  const brightness = getBrightness(pixel);
  const distance = getColorDistance(pixel, skyColor);

  return brightness >= minimumBrightness && distance <= maximumDistance;
}

function getOpaquePixel(image, x, y) {
  const index = (y * image.width + x) * 4;
  const alpha = image.data[index + 3] ?? 0;

  if (alpha === 0) {
    return undefined;
  }

  return {
    b: image.data[index + 2] ?? 0,
    g: image.data[index + 1] ?? 0,
    r: image.data[index] ?? 0,
  };
}

function getBrightness(color) {
  return (color.r + color.g + color.b) / 3;
}

function getColorDistance(from, to) {
  const r = from.r - to.r;
  const g = from.g - to.g;
  const b = from.b - to.b;

  return Math.sqrt(r * r + g * g + b * b);
}

function clampByte(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function applyMountainPalette(image, colorCount = 5) {
  const palette = createMountainPalette(colorCount);

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const index = (y * image.width + x) * 4;
      const alpha = image.data[index + 3] ?? 0;

      if (alpha === 0) {
        continue;
      }

      const r = image.data[index] ?? 0;
      const g = image.data[index + 1] ?? 0;
      const b = image.data[index + 2] ?? 0;
      const luma = r * 0.299 + g * 0.587 + b * 0.114;
      const threshold = (getMountainDitherThreshold(x, y) - 0.5) * 58;
      const shade = luma + threshold;
      const greenBias = g - Math.max(r, b);
      const color = getMountainPaletteColor(shade, greenBias, palette, colorCount);

      image.data[index] = color[0];
      image.data[index + 1] = color[1];
      image.data[index + 2] = color[2];
      image.data[index + 3] = alpha > 80 ? 255 : alpha;
    }
  }
}

function createMountainPalette(colorCount) {
  const count = Math.max(2, Math.min(12, Math.round(colorCount)));
  const anchors = [
    MOUNTAIN_PALETTE.black,
    MOUNTAIN_PALETTE.orange,
    MOUNTAIN_PALETTE.yellow,
    MOUNTAIN_PALETTE.green,
    MOUNTAIN_PALETTE.pale,
  ];

  if (count === 5) {
    return [
      MOUNTAIN_PALETTE.black,
      MOUNTAIN_PALETTE.orange,
      MOUNTAIN_PALETTE.yellow,
      MOUNTAIN_PALETTE.green,
      MOUNTAIN_PALETTE.pale,
    ];
  }

  return Array.from({ length: count }, (_, index) => {
    const position = count === 1 ? 0 : index / (count - 1);
    const scaled = position * (anchors.length - 1);
    const leftIndex = Math.min(anchors.length - 2, Math.floor(scaled));
    const rightIndex = leftIndex + 1;
    const mix = scaled - leftIndex;
    const left = anchors[leftIndex];
    const right = anchors[rightIndex];

    return [
      Math.round(lerp(left[0], right[0], mix)),
      Math.round(lerp(left[1], right[1], mix)),
      Math.round(lerp(left[2], right[2], mix)),
    ];
  });
}

function getMountainPaletteColor(shade, greenBias, palette, colorCount) {
  if (Math.round(colorCount) === 5) {
    return shade < 70
      ? MOUNTAIN_PALETTE.black
      : greenBias > 14 && shade < 190
        ? MOUNTAIN_PALETTE.green
        : shade < 128
          ? MOUNTAIN_PALETTE.orange
          : shade < 198
            ? MOUNTAIN_PALETTE.yellow
            : MOUNTAIN_PALETTE.pale;
  }

  const shadeRatio = clamp01(shade / 235);
  const index = Math.max(0, Math.min(palette.length - 1, Math.round(shadeRatio * (palette.length - 1))));

  return palette[index] ?? palette[palette.length - 1];
}

function lerp(from, to, amount) {
  return from + (to - from) * amount;
}

function pixelateOpaqueForeground(image, blockSize) {
  for (let blockY = 0; blockY < image.height; blockY += blockSize) {
    for (let blockX = 0; blockX < image.width; blockX += blockSize) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;

      for (let y = blockY; y < Math.min(blockY + blockSize, image.height); y += 1) {
        for (let x = blockX; x < Math.min(blockX + blockSize, image.width); x += 1) {
          const index = (y * image.width + x) * 4;
          const alpha = image.data[index + 3] ?? 0;

          if (alpha === 0) {
            continue;
          }

          r += image.data[index] ?? 0;
          g += image.data[index + 1] ?? 0;
          b += image.data[index + 2] ?? 0;
          a += alpha;
          count += 1;
        }
      }

      if (count === 0) {
        continue;
      }

      const average = [
        clampByte(r / count),
        clampByte(g / count),
        clampByte(b / count),
        clampByte(a / count),
      ];

      for (let y = blockY; y < Math.min(blockY + blockSize, image.height); y += 1) {
        for (let x = blockX; x < Math.min(blockX + blockSize, image.width); x += 1) {
          const index = (y * image.width + x) * 4;

          if ((image.data[index + 3] ?? 0) === 0) {
            continue;
          }

          image.data[index] = average[0];
          image.data[index + 1] = average[1];
          image.data[index + 2] = average[2];
          image.data[index + 3] = average[3];
        }
      }
    }
  }
}

function getMountainDitherThreshold(x, y) {
  const matrix = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
  ];
  const row = ((Math.floor(y) % matrix.length) + matrix.length) % matrix.length;
  const column = ((Math.floor(x) % matrix[row].length) + matrix[row].length) % matrix[row].length;

  return (matrix[row][column] + 0.5) / 64;
}

export default DitheredHeroCanvas;
