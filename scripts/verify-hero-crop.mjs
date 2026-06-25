import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const css = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');
const heroCanvas = readFileSync(join(ROOT, 'src/components/DitheredHeroCanvas.jsx'), 'utf8');
const homePage = readFileSync(join(ROOT, 'src/pages/index.astro'), 'utf8');

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
  {
    name: 'hero image preloads keep existing asset discovery and priorities',
    pass:
      hasPreload('ditheredHeroBackgroundSrc') &&
      hasPreload('ditheredHeroPaperSrc', 'fetchpriority="high"') &&
      hasPreload('ditheredHeroMountainsSrc', 'fetchpriority="low"'),
  },
  {
    name: 'static poster images keep existing dimensions and decode priorities',
    pass:
      hasStaticImage('dithered-hero-paper', 'ditheredHeroPaperSrc', 'fetchpriority="high"') &&
      hasStaticImage('dithered-hero-mountains', 'ditheredHeroMountainsSrc', 'fetchpriority="low"'),
  },
  {
    name: 'interactive mountain overlay keeps low-priority async loading',
    pass:
      blockFor('className="dithered-hero-mountains"', heroCanvas).includes('decoding="async"') &&
      blockFor('className="dithered-hero-mountains"', heroCanvas).includes('fetchPriority="low"') &&
      blockFor('className="dithered-hero-mountains"', heroCanvas).includes('height={HERO_HEIGHT}') &&
      blockFor('className="dithered-hero-mountains"', heroCanvas).includes('width={HERO_WIDTH}'),
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

function blockFor(selector, source = css) {
  const start = source.indexOf(`${selector} {`);

  if (start === -1) {
    return blockTagFor(selector, source);
  }

  const end = source.indexOf('}', start);
  return end === -1 ? '' : source.slice(start, end + 1);
}

function blockTagFor(anchor, source) {
  const anchorIndex = source.indexOf(anchor);

  if (anchorIndex === -1) {
    return '';
  }

  const start = source.lastIndexOf('<', anchorIndex);
  const end = source.indexOf('>', anchorIndex);

  if (start === -1 || end === -1) {
    return '';
  }

  return source.slice(start, end + 1);
}

function hasPreload(hrefValue, priority = undefined) {
  const tag = blockTagFor(`href={${hrefValue}}`, homePage);

  return (
    tag.includes('rel="preload"') &&
    tag.includes('as="image"') &&
    tag.includes('type="image/webp"') &&
    (priority === undefined || tag.includes(priority))
  );
}

function hasStaticImage(className, srcValue, priority) {
  const tag = blockTagFor(`class="${className}"`, homePage);

  return (
    tag.includes('decoding="async"') &&
    tag.includes(priority) &&
    tag.includes('height="720"') &&
    tag.includes(`src={${srcValue}}`) &&
    tag.includes('width="1280"')
  );
}

function countMatches(value, pattern) {
  return value.split(pattern).length - 1;
}
