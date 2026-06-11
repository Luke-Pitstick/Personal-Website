import { access, mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');
const INPUT = join(PUBLIC_DIR, 'pictureofme.jpg');
const REMOTE_INPUT = 'https://www.lukepitstick.com/pictureofme.jpg';
const OUTPUT_SIZES = [256, 384, 512, 768];
const OUTPUT_FORMATS = [
  { extension: 'avif', options: { effort: 5, quality: 58 } },
  { extension: 'webp', options: { quality: 78 } },
  { extension: 'jpg', options: { mozjpeg: true, quality: 78 } },
];

const CROP_FOCUS = {
  x: 0.5,
  y: 0.24,
};

async function readInputImage() {
  try {
    await access(INPUT);
    return {
      buffer: await sharp(INPUT).rotate().toBuffer(),
      source: INPUT,
    };
  } catch {
    const response = await fetch(REMOTE_INPUT);

    if (!response.ok) {
      throw new Error(`Unable to fetch ${REMOTE_INPUT}: ${response.status} ${response.statusText}`);
    }

    const sourceBuffer = Buffer.from(await response.arrayBuffer());

    return {
      buffer: await sharp(sourceBuffer).rotate().toBuffer(),
      source: REMOTE_INPUT,
    };
  }
}

function getSquareCrop(width, height) {
  const cropSize = Math.min(width, height);
  const left = Math.round((width - cropSize) * CROP_FOCUS.x);
  const top = Math.round((height - cropSize) * CROP_FOCUS.y);

  return {
    height: cropSize,
    left: Math.max(0, Math.min(width - cropSize, left)),
    top: Math.max(0, Math.min(height - cropSize, top)),
    width: cropSize,
  };
}

async function writeVariant(inputBuffer, crop, size, format) {
  const output = join(PUBLIC_DIR, `pictureofme-${size}.${format.extension}`);

  await sharp(inputBuffer)
    .extract(crop)
    .resize(size, size, { fit: 'fill', kernel: 'lanczos3' })
    .toFormat(format.extension, format.options)
    .toFile(output);

  const { size: bytes } = await stat(output);
  console.log(`Wrote ${output} (${size}w, ${Math.round(bytes / 1024)} KiB)`);
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });

  const { buffer, source } = await readInputImage();
  const metadata = await sharp(buffer).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to read image dimensions from ${source}`);
  }

  const crop = getSquareCrop(metadata.width, metadata.height);
  console.log(`Generating hero portrait variants from ${source} (${metadata.width}x${metadata.height})`);

  for (const size of OUTPUT_SIZES) {
    for (const format of OUTPUT_FORMATS) {
      await writeVariant(buffer, crop, size, format);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
