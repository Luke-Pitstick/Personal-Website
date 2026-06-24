import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT = join(ROOT, 'public/hero-paper.webp');

const HERO_WIDTH = 1280;
const HERO_HEIGHT = 720;
const IDLE_SURFACE_CONTRAST = 1.02;
const WEBP_OPTIONS = {
  effort: 6,
  lossless: true,
};

function createHeroPaperBuffer(width, height, contrast = 1) {
  const buffer = Buffer.alloc(width * height * 4);
  const { cosXY, sinX } = createWaveTables(width, height);
  const grainRows = createGrainRows(width);
  const contrastOffset = 128 - 128 * contrast;

  for (let y = 0; y < height; y += 1) {
    const vertical = y / height;
    const redBase = (228 + vertical * 12) * contrast + contrastOffset;
    const greenBase = (232 + vertical * 8) * contrast + contrastOffset;
    const blueBase = (220 + vertical * 5) * contrast + contrastOffset;
    const grainRow = grainRows[y % grainRows.length];
    const rowOffset = y * width;

    for (let x = 0; x < width; x += 1) {
      const paper = (sinX[x] + cosXY[x + y] + grainRow[x]) * contrast;
      const index = (rowOffset + x) * 4;

      buffer[index] = Math.round(redBase + paper);
      buffer[index + 1] = Math.round(greenBase + paper);
      buffer[index + 2] = Math.round(blueBase + paper);
      buffer[index + 3] = 255;
    }
  }

  return buffer;
}

function createGrainRows(width) {
  return Array.from({ length: 19 }, (_, yMod) => {
    const row = new Float64Array(width);

    for (let x = 0; x < width; x += 1) {
      row[x] = (((x * 17 + yMod * 31) % 19) - 9) * 0.8;
    }

    return row;
  });
}

function createWaveTables(width, height) {
  const sinX = new Float64Array(width);
  const cosXY = new Float64Array(width + height - 1);

  for (let x = 0; x < width; x += 1) {
    sinX[x] = Math.sin(x / 120) * 3;
  }

  for (let index = 0; index < cosXY.length; index += 1) {
    cosXY[index] = Math.cos(index / 180) * 4;
  }

  return { cosXY, sinX };
}

async function main() {
  const buffer = createHeroPaperBuffer(HERO_WIDTH, HERO_HEIGHT, IDLE_SURFACE_CONTRAST);

  await sharp(buffer, {
    raw: {
      channels: 4,
      height: HERO_HEIGHT,
      width: HERO_WIDTH,
    },
  })
    .webp(WEBP_OPTIONS)
    .toFile(OUTPUT);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
