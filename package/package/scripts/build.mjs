import fs from "fs/promises";
import path from "path";
import { cp, rm } from "fs/promises";
import sharp from "sharp";

const root = path.resolve(".");
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");

const STRIP_FROM_DIST = [
  "assets/vendor/lightgallery",
  "assets/vendor/flatpickr",
  "assets/vendor/masonry",
  "assets/vendor/nouislider",
  "assets/vendor/form-wizard",
  "assets/vendor/wnumb",
  "assets/vendor/magnific-popup",
  "assets/vendor/imagesloaded",
  "assets/icons/line-awesome",
  "assets/icons/themify-icons",
  "assets/icons/feather",
  "assets/icons/flaticon",
  "assets/fonts/Figtree",
  "assets/fonts/Afacad",
  "assets/js/swiper-bundle.min.js",
  "assets/js/magnific-popup.min.js",
  "assets/js/owl.carousel.min.js",
  "assets/js/isotope.pkgd.min.js",
  "assets/js/theia-sticky-sidebar.js",
  "assets/vendor/gsap/ScrollSmoother.js",
  "assets/vendor/gsap/Draggable.min.js",
  "assets/vendor/gsap/InertiaPlugin.min.js",
  "assets/vendor/gsap/MotionPathPlugin.min.js",
  "assets/images/main-slider",
  "assets/images/trv-blog",
  "assets/images/detail-slider",
  "assets/images/tour",
  "assets/images/tour-cat",
  "assets/images/trv-guide",
  "assets/images/trv-destinations",
  "assets/images/trv-services",
  "assets/images/trv-faq",
  "assets/images/trv-gallery",
  "assets/images/trv-mostfav",
  "assets/images/trv-trend",
  "assets/images/hpy-cus",
  "assets/images/comment-author",
  "assets/images/mask-pic",
  "assets/images/search-icon",
  "assets/images/trv-testimonial",
];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

async function writeOptimizedImage(file, buffer) {
  const tmp = `${file}.opt.tmp`;
  await fs.writeFile(tmp, buffer);
  await fs.rename(tmp, file);
}

async function optimizeDistImages() {
  const imagesDir = path.join(distDir, "assets/images");
  const files = await walk(imagesDir);

  const bannerPath = path.join(imagesDir, "background/inr-banner.jpg");
  const bannerOptPath = path.join(imagesDir, "background/inr-banner-opt.jpg");
  await rm(bannerPath, { force: true });

  try {
    await fs.access(bannerOptPath);
    const bannerBuffer = await fs.readFile(bannerOptPath);
    await sharp(bannerBuffer).webp({ quality: 78 }).toFile(bannerOptPath.replace(/\.jpg$/i, ".webp"));
    console.log(`Banner ready: inr-banner-opt.jpg (${(bannerBuffer.length / 1024).toFixed(0)}KB)`);
  } catch (err) {
    console.warn("Banner optimize skipped:", err.message);
  }

  for (const file of files) {
    if (file.includes("inr-banner")) continue;
    if (!/\.(jpe?g|png)$/i.test(file) || file.endsWith(".webp")) continue;

    try {
      const size = (await fs.stat(file)).size;
      if (size < 40 * 1024) continue;

      const inputBuffer = await fs.readFile(file);
      const image = sharp(inputBuffer);
      const meta = await image.metadata();
      let pipeline = image;
      const isDestination = file.includes(`${path.sep}destinations${path.sep}`);
      const maxWidth = isDestination ? 800 : 1920;
      if (meta.width && meta.width > maxWidth) {
        pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
      }

      const ext = path.extname(file).toLowerCase();
      let buffer;
      if (ext === ".png") {
        buffer = await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer();
      } else {
        buffer = await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
      }
      await writeOptimizedImage(file, buffer);

      const webp = file.replace(/\.(jpe?g|png)$/i, ".webp");
      await sharp(buffer).webp({ quality: 80 }).toFile(webp);
    } catch (err) {
      console.warn(`Skip ${path.relative(distDir, file)}: ${err.message}`);
    }
  }
}

async function main() {
  console.log("Generating gallery manifest and assets...");
  const { spawn } = await import("child_process");
  await new Promise((resolve, reject) => {
    const child = spawn("node", ["scripts/generate-gallery.mjs"], {
      cwd: root,
      stdio: "inherit",
      shell: true,
    });
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`generate-gallery exited ${code}`))
    );
  });

  console.log("Copying src → dist...");
  await rm(distDir, { recursive: true, force: true });
  await cp(srcDir, distDir, { recursive: true });

  console.log("Optimizing dist images...");
  await optimizeDistImages();

  console.log("Stripping unused vendor files from dist...");
  for (const rel of STRIP_FROM_DIST) {
    const target = path.join(distDir, rel);
    await rm(target, { recursive: true, force: true });
  }

  console.log("Build complete → dist/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
