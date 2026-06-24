import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const DIST_SOURCE_ASSETS = [
  'pictureofme.jpg',
  'background.jpg',
  'chautauqua-flatirons_fg.jpg',
];

for (const asset of DIST_SOURCE_ASSETS) {
  const distAsset = join(DIST, asset);

  try {
    await unlink(distAsset);
    console.log(`Removed ${distAsset} from build output`);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      console.log(`No ${asset} source asset to prune from dist`);
    } else {
      throw error;
    }
  }
}
