import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const imagesDir = path.resolve("src/assets/images");
const lottieDir = path.resolve("src/assets/lottie/images");
const source = path.join(imagesDir, "logo-source.png");

/** Flood-fill edge-connected black background; keeps gold intact. */
function removeEdgeBlackBackground(data, width, height) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const isBackground = (idx) => {
    const i = idx * 4;
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    return max < 45;
  };

  const push = (idx) => {
    if (idx < 0 || idx >= total || visited[idx]) return;
    if (!isBackground(idx)) return;
    visited[idx] = 1;
    queue[tail++] = idx;
  };

  for (let x = 0; x < width; x++) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (head < tail) {
    const idx = queue[head++];
    data[idx * 4 + 3] = 0;
    const x = idx % width;
    const y = Math.floor(idx / width);
    if (x > 0) push(idx - 1);
    if (x < width - 1) push(idx + 1);
    if (y > 0) push(idx - width);
    if (y < height - 1) push(idx + width);
  }

  // Soft feather on remaining near-black edge pixels
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    if (max < 28 && max - min < 14) {
      data[i + 3] = Math.round(255 * ((max - 10) / 18));
    }
  }
}

async function toTransparentBuffer(input, width, height, sourceWidth, sourceHeight) {
  const upscaling = width > sourceWidth || height > sourceHeight;
  let pipeline = sharp(input).resize(width, height, {
    fit: "fill",
    kernel: sharp.kernel.lanczos3,
    withoutEnlargement: false,
  });

  if (upscaling) {
    pipeline = pipeline.sharpen({ sigma: 0.4, m1: 0.35, m2: 0.35 });
  }

  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  removeEdgeBlackBackground(data, info.width, info.height);

  return { buffer: data, width: info.width, height: info.height };
}

async function writePng(name, rawBuffer, width, height) {
  const png = await sharp(rawBuffer, {
    raw: { width, height, channels: 4 },
  })
    .png({ compressionLevel: 1, effort: 10 })
    .toBuffer();
  await fs.writeFile(path.join(imagesDir, name), png);
  console.log(`${name}: ${width}x${height}, ${(png.length / 1024).toFixed(1)}KB`);
  return png;
}

async function writeWebp(name, rawBuffer, width, height) {
  const webp = await sharp(rawBuffer, {
    raw: { width, height, channels: 4 },
  })
    .webp({ quality: 98, effort: 6, alphaQuality: 100 })
    .toBuffer();
  await fs.writeFile(path.join(imagesDir, name), webp);
  console.log(`${name}: ${width}x${height}, ${(webp.length / 1024).toFixed(1)}KB`);
}

async function writeLogoSet(baseName, width, height, sourceWidth, sourceHeight) {
  const { buffer, width: w, height: h } = await toTransparentBuffer(
    source,
    width,
    height,
    sourceWidth,
    sourceHeight
  );
  await writePng(`${baseName}.png`, buffer, w, h);
  await writeWebp(`${baseName}.webp`, buffer, w, h);
}

async function writeLottie(name, width, height, sourceWidth, sourceHeight) {
  const { buffer, width: w, height: h } = await toTransparentBuffer(
    source,
    width,
    height,
    sourceWidth,
    sourceHeight
  );
  const png = await sharp(buffer, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 2 })
    .toBuffer();
  const targets = [
    path.join(lottieDir, name),
    path.join(lottieDir, "desktop", name),
    path.join(lottieDir, "mobile", name),
  ];
  for (const file of targets) {
    await fs.writeFile(file, png);
  }
  console.log(`lottie ${name}: ${w}x${h}`);
}

async function writeFavicon() {
  const master = await fs.readFile(path.join(imagesDir, "logo-dark@3x.png"));
  await sharp(master).resize(32, 32).png().toFile(path.join(imagesDir, "_favicon-tmp.png"));
  const { execSync } = await import("child_process");
  execSync(
    `python -c "from PIL import Image; img=Image.open('${path.join(imagesDir, "_favicon-tmp.png").replace(/\\/g, "/")}'); img.save('${path.join(imagesDir, "favicon.ico").replace(/\\/g, "/")}', format='ICO', sizes=[(32,32)])"`,
    { stdio: "inherit" }
  );
  await fs.unlink(path.join(imagesDir, "_favicon-tmp.png"));
  console.log("favicon.ico updated");
}

async function main() {
  const meta = await sharp(source).metadata();
  const sourceWidth = meta.width;
  const sourceHeight = meta.height;
  console.log(`Source: ${sourceWidth}x${sourceHeight}`);

  const w1 = Math.round(sourceWidth / 3);
  const h1 = Math.round(sourceHeight / 3);
  const w2 = Math.round(sourceWidth * 2 / 3);
  const h2 = Math.round(sourceHeight * 2 / 3);

  await writeLogoSet("logo-dark", w1, h1, sourceWidth, sourceHeight);
  await writeLogoSet("logo-dark@2x", w2, h2, sourceWidth, sourceHeight);
  await writeLogoSet("logo-dark@3x", sourceWidth, sourceHeight, sourceWidth, sourceHeight);

  await writeLottie("img_0.png", 300, 323, sourceWidth, sourceHeight);

  try {
    await writeFavicon();
  } catch {
    console.warn("favicon.ico skipped (PIL not available)");
  }

  console.log(`Done. 1x=${w1}x${h1}, 2x=${w2}x${h2}, 3x=${sourceWidth}x${sourceHeight}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
