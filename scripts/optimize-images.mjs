import { readdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const imageDir = fileURLToPath(new URL('../public/img/', import.meta.url));
const files = (await readdir(imageDir)).filter((file) => /\.(?:jpe?g|png)$/i.test(file));

for (const file of files) {
  // QR codes are better kept as PNG because lossy compression makes them less reliable to scan.
  if (file === 'qr-avis.png') continue;

  const input = join(imageDir, file);
  const output = join(imageDir, `${parse(file).name}.webp`);
  const meta = await sharp(input).metadata();
  const maxWidth = file === 'logo-mdp.png' ? 600 : 1920;
  const pipeline = sharp(input, { animated: false }).rotate();

  if (meta.width && meta.width > maxWidth) {
    pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await pipeline.webp({ quality: 78, smartSubsample: true }).toFile(output);
  const result = await stat(output);
  console.log(`${file} -> ${parse(file).name}.webp (${Math.round(result.size / 1024)} KB)`);
}
