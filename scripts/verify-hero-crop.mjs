import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const css = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');
const heroCanvas = readFileSync(join(ROOT, 'src/components/DitheredHeroCanvas.jsx'), 'utf8');

const checks = [
  {
    name: 'static hero background crops with background-size: cover',
    pass: blockFor('.dithered-hero').includes('background-size: cover;'),
  },
  {
    name: 'hero art elements use object-fit: cover',
    pass:
      css.includes('.dithered-hero-paper,\n.dithered-hero-mountains,\n.dithered-hero-fallback,\n.dithered-hero-canvas canvas') &&
      css.includes('object-fit: cover;') &&
      css.includes('object-position: center;'),
  },
  {
    name: 'narrow static art keeps 16:9 proportions from container height',
    pass:
      css.includes('@media (max-aspect-ratio: 16 / 9)') &&
      css.includes('width: auto;') &&
      css.includes('min-width: 100%;') &&
      css.includes('height: 100%;') &&
      css.includes('transform: translate(-50%, -50%);'),
  },
  {
    name: 'interactive shader source layers use renderer cover fitting',
    pass:
      countMatches(heroCanvas, "fit: 'cover'") >= 2 &&
      !/fit:\s*['"]stretch['"]/.test(heroCanvas),
  },
  {
    name: 'image decode path center-crops before resizing mismatched sources',
    pass:
      heroCanvas.includes('function drawImageCover') &&
      heroCanvas.includes('sourceX = (sourceWidth - croppedWidth) / 2;') &&
      heroCanvas.includes('sourceY = (sourceHeight - croppedHeight) / 2;'),
  },
];

const failures = checks.filter((check) => !check.pass);

if (failures.length > 0) {
  console.error('Hero crop verification failed:');

  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }

  process.exit(1);
}

console.log(`Hero crop verification passed (${checks.length} checks).`);

function blockFor(selector) {
  const start = css.indexOf(`${selector} {`);

  if (start === -1) {
    return '';
  }

  const end = css.indexOf('}', start);
  return end === -1 ? '' : css.slice(start, end + 1);
}

function countMatches(value, pattern) {
  return value.split(pattern).length - 1;
}
