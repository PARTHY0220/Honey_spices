import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '../src/assets');

const imagesToConvert = [
  { input: 'turmeric_jar.png', output: 'turmeric_jar.webp' },
  { input: 'chili_jar.png', output: 'chili_jar.webp' },
  { input: 'garam_masala_jar.png', output: 'garam_masala_jar.webp' },
  { input: 'hero.png', output: 'hero.webp' },
  { input: 'logo.jpg', output: 'logo.webp' }
];

async function convert() {
  console.log('Starting image conversion to WebP...');
  for (const img of imagesToConvert) {
    const inputPath = path.join(assetsDir, img.input);
    const outputPath = path.join(assetsDir, img.output);
    try {
      console.log(`Converting ${img.input} to ${img.output}...`);
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Successfully created ${img.output}`);
    } catch (err) {
      console.error(`Error converting ${img.input}:`, err);
    }
  }
  console.log('Image conversion completed.');
}

convert();
