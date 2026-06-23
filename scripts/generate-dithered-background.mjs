import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INPUT = join(ROOT, 'public/background.jpg');
const OUTPUT = join(ROOT, 'public/background-dithered.webp');

const HERO_WIDTH = 1280;
const HERO_HEIGHT = 720;
const BACKGROUND_PIXEL_SIZE = 3;
const SKY_BACKGROUND_BLUE_BIAS = 112;
const SKY_BACKGROUND_SATURATION = 2.45;

const BROWSERBASE_PALETTE = [
  { r: 239, g: 242, b: 220, a: 255 },
  { r: 183, g: 199, b: 218, a: 255 },
  { r: 72, g: 116, b: 183, a: 255 },
  { r: 23, g: 32, b: 51, a: 255 },
];

const BAYER_8 = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21],
];

const BACKGROUND_CONTROLS = {
  brightness: 1.08,
  contrast: 1.16,
  ditherAmount: 0.9,
  ditherMatrixSize: 8,
  ditherPixelSize: BACKGROUND_PIXEL_SIZE,
};
const BACKGROUND_WEBP_OPTIONS = {
  effort: 6,
  quality: 82,
};

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function clampByte(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
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

function hueToRgb(p, q, t) {
  const hue = ((t % 1) + 1) % 1;

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

function enhanceSkyBackground(data, width, height) {
  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3] ?? 0;

    if (alpha === 0) {
      continue;
    }

    const r = data[index] ?? 0;
    const g = data[index + 1] ?? 0;
    const b = data[index + 2] ?? 0;
    const brightness = (r + g + b) / 3;
    const skyWeight = clamp01((brightness - 92) / 150);
    const hsl = rgbToHsl(r, g, b);
    const saturated = hslToRgb(hsl.h, clamp01(hsl.s * SKY_BACKGROUND_SATURATION), hsl.l);

    data[index] = clampByte(saturated.r - SKY_BACKGROUND_BLUE_BIAS * 0.55 * skyWeight);
    data[index + 1] = clampByte(saturated.g + SKY_BACKGROUND_BLUE_BIAS * 0.16 * skyWeight);
    data[index + 2] = clampByte(saturated.b + SKY_BACKGROUND_BLUE_BIAS * skyWeight);
  }
}

function applyContrastBrightness(data, contrast, brightness) {
  for (let index = 0; index < data.length; index += 4) {
    if ((data[index + 3] ?? 0) === 0) {
      continue;
    }

    data[index] = clampByte(((data[index] ?? 0) - 128) * contrast + 128);
    data[index + 1] = clampByte(((data[index + 1] ?? 0) - 128) * contrast + 128);
    data[index + 2] = clampByte(((data[index + 2] ?? 0) - 128) * contrast + 128);
    data[index] = clampByte((data[index] ?? 0) * brightness);
    data[index + 1] = clampByte((data[index + 1] ?? 0) * brightness);
    data[index + 2] = clampByte((data[index + 2] ?? 0) * brightness);
  }
}

function findNearestPaletteColor(color, palette) {
  let nearest = palette[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const candidate of palette) {
    const distance =
      (color.r - candidate.r) ** 2 +
      (color.g - candidate.g) ** 2 +
      (color.b - candidate.b) ** 2 +
      ((color.a - candidate.a) ** 2) * 0.25;

    if (distance < nearestDistance) {
      nearest = candidate;
      nearestDistance = distance;
    }
  }

  return nearest;
}

function mixColors(from, to, amount) {
  const t = clamp01(amount);
  return {
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t,
    a: from.a + (to.a - from.a) * t,
  };
}

function applyOrderedDither(data, width, height, controls) {
  const amount = clamp01(controls.ditherAmount);
  const matrixSize = controls.ditherMatrixSize;
  const matrix = matrixSize === 8 ? BAYER_8 : BAYER_8;
  const pixelSize = Math.max(1, Math.round(controls.ditherPixelSize));
  const matrixDivisor = matrixSize * matrixSize;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const threshold =
        ((matrix[Math.floor(y / pixelSize) % matrixSize]?.[Math.floor(x / pixelSize) % matrixSize] ??
          0) +
          0.5) /
          matrixDivisor -
        0.5;
      const bias = threshold * 96 * amount;
      const original = {
        a: data[index + 3] ?? 0,
        b: data[index + 2] ?? 0,
        g: data[index + 1] ?? 0,
        r: data[index] ?? 0,
      };
      const biased = {
        ...original,
        b: clampByte(original.b + bias),
        g: clampByte(original.g + bias),
        r: clampByte(original.r + bias),
      };
      const nearest = findNearestPaletteColor(biased, BROWSERBASE_PALETTE);
      const mixed = mixColors(original, { ...nearest, a: original.a }, amount);

      data[index] = clampByte(mixed.r);
      data[index + 1] = clampByte(mixed.g);
      data[index + 2] = clampByte(mixed.b);
      data[index + 3] = clampByte(mixed.a);
    }
  }
}

async function main() {
  const { data, info } = await sharp(INPUT)
    .resize(HERO_WIDTH, HERO_HEIGHT, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8ClampedArray(data);
  enhanceSkyBackground(pixels, info.width, info.height);
  applyContrastBrightness(
    pixels,
    BACKGROUND_CONTROLS.contrast,
    BACKGROUND_CONTROLS.brightness,
  );
  applyOrderedDither(pixels, info.width, info.height, BACKGROUND_CONTROLS);

  await sharp(Buffer.from(pixels), {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .webp(BACKGROUND_WEBP_OPTIONS)
    .toFile(OUTPUT);

  console.log(`Wrote ${OUTPUT} (${info.width}x${info.height})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
