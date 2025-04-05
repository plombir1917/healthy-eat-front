import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
};

async function generateIcons() {
  const sourceSvg = join(__dirname, '../public/logo.svg');
  const publicDir = join(__dirname, '../public');

  // Генерируем иконки разных размеров
  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(sourceSvg)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, filename));
    console.log(`Generated ${filename}`);
  }

  // Создаем favicon.ico (16x16)
  await sharp(sourceSvg).resize(16, 16).toFile(join(publicDir, 'favicon.ico'));
  console.log('Generated favicon.ico');
}

generateIcons().catch(console.error);
