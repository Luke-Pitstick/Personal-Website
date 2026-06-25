import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const css = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');
const heroCanvas = readFileSync(join(ROOT, 'src/components/DitheredHeroCanvas.jsx'), 'utf8');
const homePage = readFileSync(join(ROOT, 'src/pages/index.astro'), 'utf8');
const ACTIVE_HERO_ASSETS = [
  { maxBytes: 315_000, path: 'public/background-dithered.webp' },
  { maxBytes: 115_000, path: 'public/hero-paper.webp' },
  { maxBytes: 30_000, path: 'public/hero-mountains.webp' },
];
const HERO_ART_CROP_SELECTOR =
  '.dithered-hero-paper,\n.dithered-hero-mountains,\n.dithered-hero-fallback,\n.dithered-hero-canvas canvas';
const NARROW_STATIC_ART_SELECTOR =
  '.dithered-hero-paper,\n  .dithered-hero-mountains,\n  .dithered-hero-fallback';
const heroBackgroundBlock = blockFor('.dithered-hero');
const heroLayerSizingBlock = blockFor(
  '.dithered-hero-canvas,\n.dithered-hero-paper,\n.dithered-hero-mountains,\n.dithered-hero-fallback'
);
const heroArtCropBlock = blockFor(HERO_ART_CROP_SELECTOR);
const narrowHeroCropBlock = mediaBlockFor('@media (max-aspect-ratio: 16 / 9)');
const narrowStaticArtCropBlock = blockFor(NARROW_STATIC_ART_SELECTOR, narrowHeroCropBlock);

const checks = [
  {
    name: 'static hero background crops from the centered background rule',
    pass: hasDeclarations(heroBackgroundBlock, [
      'background-image: url(\'/background-dithered.webp\');',
      'background-position: center;',
      'background-size: cover;',
    ]),
  },
  {
    name: 'hero crop container clips over-wide art layers',
    pass: hasDeclarations(heroBackgroundBlock, ['overflow: hidden;']),
  },
  {
    name: 'hero art layers are anchored to the crop container',
    pass: hasDeclarations(heroLayerSizingBlock, [
      'position: absolute;',
      'inset: 0;',
      'display: block;',
      'width: 100%;',
      'height: 100%;',
    ]),
  },
  {
    name: 'hero art elements crop from their own object-fit rule',
    pass: hasDeclarations(heroArtCropBlock, ['object-fit: cover;', 'object-position: center;']),
  },
  {
    name: 'narrow static art keeps 16:9 proportions from container height',
    pass: hasDeclarations(narrowStaticArtCropBlock, [
      'inset: 50% auto auto 50%;',
      'width: auto;',
      'min-width: 100%;',
      'height: 100%;',
      'transform: translate(-50%, -50%);',
    ]),
  },
  {
    name: 'narrow crop sizing does not enlarge the interactive shader canvas',
    pass:
      narrowHeroCropBlock.length > 0 &&
      !narrowHeroCropBlock.includes('.dithered-hero-canvas') &&
      !narrowHeroCropBlock.includes('.dithered-hero-canvas canvas'),
  },
  {
    name: 'interactive shader source layers use centered renderer cover fitting',
    pass:
      countMatches(heroCanvas, "fit: 'cover'") >= 2 &&
      countMatches(heroCanvas, "position: 'center'") >= 2 &&
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
  ...(await buildAssetChecks()),
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

async function buildAssetChecks() {
  const metadata = await Promise.all(
    ACTIVE_HERO_ASSETS.map(async (asset) => ({
      ...asset,
      metadata: await sharp(join(ROOT, asset.path)).metadata(),
      sizeBytes: statSync(join(ROOT, asset.path)).size,
    }))
  );

  return [
    {
      name: 'active hero image assets keep the 1280x720 WebP crop source contract',
      pass: metadata.every(
        ({ metadata: assetMetadata }) =>
          assetMetadata.format === 'webp' &&
          assetMetadata.width === 1280 &&
          assetMetadata.height === 720
      ),
    },
    {
      name: 'active hero image assets stay within the current transfer budget',
      pass: metadata.every((asset) => asset.sizeBytes <= asset.maxBytes),
    },
  ];
}

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

function mediaBlockFor(anchor) {
  const start = css.indexOf(`${anchor} {`);

  if (start === -1) {
    return '';
  }

  let depth = 0;

  for (let index = start; index < css.length; index += 1) {
    const char = css[index];

    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;

      if (depth === 0) {
        return css.slice(start, index + 1);
      }
    }
  }

  return '';
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

function hasDeclarations(block, declarations) {
  return block.length > 0 && declarations.every((declaration) => block.includes(declaration));
}
