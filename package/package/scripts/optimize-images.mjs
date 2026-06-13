import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const imagesDir = path.resolve("src/assets/images");

const PRIORITY = [
  { rel: "hero-jakarta.png", maxWidth: 1920, quality: 82 },
  { rel: "adv-bg.png", maxWidth: 1600, quality: 78 },
  { rel: "landscape-pic.png", maxWidth: 1200, quality: 80 },
  { rel: "founder-simran.png", maxWidth: 800, quality: 80 },
  { rel: "offer/pic1.png", maxWidth: 800, quality: 80 },
  { rel: "Girl-Image.png", maxWidth: 800, quality: 80 },
  { rel: "Left-Man-Image.png", maxWidth: 600, quality: 80 },
  ...Array.from({ length: 4 }, (_, i) => ({
    rel: `trv-testimonial2/pic${i + 1}.png`,
    maxWidth: 600,
    quality: 80,
  })),
  { rel: "background/inr-banner.jpg", out: "background/inr-banner.jpg", maxWidth: 1920, quality: 78 },
  { rel: "image-cont.png", maxWidth: 1600, quality: 80 },
  { rel: "logo-dark.png", maxWidth: 400, quality: 85 },
  { rel: "butterfly.gif", maxWidth: 400 },
  { rel: "li-eye.gif", maxWidth: 200 },
  { rel: "Advertisment.png", maxWidth: 1200, quality: 80 },
  ...Array.from({ length: 10 }, (_, i) => ({
    rel: `destinations/style1/pic${i + 1}.jpg`,
    maxWidth: 800,
    quality: 80,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    rel: `trv-pricing/pic${i + 1}.png`,
    maxWidth: 800,
    quality: 80,
  })),
  { rel: "we-rec-pic.jpg", maxWidth: 1200, quality: 80 },
  { rel: "we-rec-pic2.jpg", maxWidth: 1200, quality: 80 },
];

async function writeOptimizedImage(file, buffer) {
  const tmp = `${file}.opt.tmp`;
  await fs.writeFile(tmp, buffer);
  await fs.rename(tmp, file);
}

async function optimizeEntry(entry) {
  const input = path.join(imagesDir, entry.rel);
  const output = path.join(imagesDir, entry.out || entry.rel);
  try {
    await fs.access(input);
  } catch {
    return null;
  }

  const before = (await fs.stat(input)).size;
  const inputBuffer = await fs.readFile(input);
  const image = sharp(inputBuffer, { animated: entry.rel.endsWith(".gif") });
  const meta = await image.metadata();
  let pipeline = image;
  if (meta.width && meta.width > (entry.maxWidth ?? 1920)) {
    pipeline = pipeline.resize(entry.maxWidth ?? 1920, null, { withoutEnlargement: true });
  }

  const ext = path.extname(entry.rel).toLowerCase();
  let buffer;
  if (ext === ".png") {
    buffer = await pipeline.png({ quality: entry.quality ?? 80, compressionLevel: 9 }).toBuffer();
  } else if (ext === ".gif") {
    buffer = await pipeline.gif().toBuffer();
  } else {
    buffer = await pipeline
      .jpeg({ quality: entry.quality ?? 80, mozjpeg: true })
      .toBuffer();
  }

  await writeOptimizedImage(output, buffer);
  const webpPath = output.replace(/\.(jpe?g|png|gif)$/i, ".webp");
  await sharp(buffer).webp({ quality: entry.quality ?? 80 }).toFile(webpPath);

  return { rel: entry.rel, before, after: buffer.length, webp: (await fs.stat(webpPath)).size };
}

async function createHeroPoster() {
  const banner = path.join(imagesDir, "background/inr-banner-opt.jpg");
  const poster = path.join(imagesDir, "hero-poster.jpg");
  await sharp(banner)
    .resize(1920, 1080, { fit: "cover" })
    .jpeg({ quality: 75, mozjpeg: true })
    .toFile(poster);
  console.log("Created hero-poster.jpg");
}

async function main() {
  for (const entry of PRIORITY) {
    try {
      const result = await optimizeEntry(entry);
      if (result) {
        console.log(
          `${result.rel}: ${(result.before / 1024).toFixed(0)}KB → ${(result.after / 1024).toFixed(0)}KB (webp ${(result.webp / 1024).toFixed(0)}KB)`
        );
      }
    } catch (err) {
      console.warn(`Skip ${entry.rel}: ${err.message}`);
    }
  }
  try {
    await createHeroPoster();
  } catch (err) {
    console.warn(`Hero poster: ${err.message}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
