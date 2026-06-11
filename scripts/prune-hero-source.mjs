import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const distOriginal = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'dist', 'pictureofme.jpg');

try {
  await unlink(distOriginal);
  console.log(`Removed ${distOriginal} from build output`);
} catch (error) {
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
    console.log('No full-size portrait to prune from dist');
  } else {
    throw error;
  }
}
