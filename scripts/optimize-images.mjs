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

// Les six vignettes de la page d'accueil sont affichées en 3 colonnes,
// dans un cadre 2:1. Servir les photos pleine largeur (jusqu'à 1920 px)
// gaspillait plus de 1,5 Mo au premier chargement.
const cardSources = [
  'porsche-cayman.jpg',
  'pl-recuperation.jpg',
  'intervention-a9.jpg',
  'transport-international.jpg',
  'flotte-electrique.jpg',
  'peyrou-vertical.jpg',
];

for (const file of cardSources) {
  const input = join(imageDir, file);
  const output = join(imageDir, `${parse(file).name}-card.webp`);
  await sharp(input)
    .rotate()
    .resize(720, 360, { fit: 'cover', position: 'attention', withoutEnlargement: true })
    .webp({ quality: 70, smartSubsample: true })
    .toFile(output);
  const result = await stat(output);
  console.log(`${file} -> ${parse(file).name}-card.webp (${Math.round(result.size / 1024)} KB)`);
}

// Icônes dédiées : le logo source de 486 Ko ne doit jamais être téléchargé
// comme favicon sur chaque visite.
const logo = join(imageDir, 'logo-mdp.png');
for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180]]) {
  const output = join(imageDir, name);
  await sharp(logo)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png({ compressionLevel: 9, palette: true })
    .toFile(output);
  const result = await stat(output);
  console.log(`${name} (${Math.round(result.size / 1024)} KB)`);
}
