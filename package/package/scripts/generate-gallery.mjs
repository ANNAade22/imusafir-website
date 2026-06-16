import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const root = path.resolve(".");
const srcDir = path.join(root, "src");
const galleryDir = path.join(srcDir, "assets/images/gallery");
const gallery2Dir = path.join(srcDir, "assets/images/gallery-2");
const thumbsDir = path.join(galleryDir, "thumbs");
const postersDir = path.join(gallery2Dir, "posters");
const dataDir = path.join(srcDir, "assets/data");
const manifestPath = path.join(dataDir, "gallery-manifest.json");
const galleryHtmlPath = path.join(srcDir, "gallery.html");

const PHOTO_EXT = /\.(jpe?g|png)$/i;
const VIDEO_EXT = /\.mp4$/i;
const SKIP_DIRS = new Set(["thumbs", "posters"]);

function parseWhatsAppTimestamp(filename) {
  const match = filename.match(
    /(\d{4}-\d{2}-\d{2})\s+at\s+(\d{1,2})\.(\d{2})\.(\d{2})\s+(AM|PM)/i
  );
  if (!match) return null;
  const [, date, hour, min, sec, ampm] = match;
  let h = parseInt(hour, 10);
  if (ampm.toUpperCase() === "PM" && h !== 12) h += 12;
  if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
  return new Date(
    `${date}T${String(h).padStart(2, "0")}:${min}:${sec}`
  ).getTime();
}

function sortKey(filename, mtime) {
  return parseWhatsAppTimestamp(filename) ?? mtime;
}

async function sortByTimestamp(files) {
  const withMeta = await Promise.all(
    files.map(async (filePath) => {
      const stat = await fs.stat(filePath);
      return {
        path: filePath,
        key: sortKey(path.basename(filePath), stat.mtimeMs),
      };
    })
  );
  return withMeta.sort((a, b) => a.key - b.key).map((entry) => entry.path);
}

function findClosestPhotoPath(videoTs, photoMeta) {
  if (videoTs == null) return null;
  let best = null;
  let bestDiff = Infinity;
  for (const photo of photoMeta) {
    if (photo.ts == null) continue;
    const diff = Math.abs(photo.ts - videoTs);
    if (diff < bestDiff && diff <= 5000) {
      bestDiff = diff;
      best = photo.path;
    }
  }
  return best;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function listMediaFiles(dir, pattern, excludeSubdirs = true) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (excludeSubdirs && SKIP_DIRS.has(entry.name)) continue;
        continue;
      }
      if (pattern.test(entry.name)) {
        files.push(path.join(dir, entry.name));
      }
    }
    return files;
  } catch {
    return [];
  }
}

async function generateVideoPoster(posterWebp, posterJpeg, matchedPhoto) {
  let pipeline;
  if (matchedPhoto) {
    pipeline = sharp(matchedPhoto).resize(600, null, { withoutEnlargement: true });
  } else {
    const svg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="400" fill="#0a2540"/>
    <circle cx="300" cy="200" r="52" fill="#C9A24D" opacity="0.95"/>
    <polygon points="278,168 278,232 342,200" fill="#ffffff"/>
  </svg>`;
    pipeline = sharp(Buffer.from(svg)).resize(600, 400);
  }

  const jpegBuffer = await pipeline
    .clone()
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  await fs.writeFile(posterJpeg, jpegBuffer);
  await sharp(jpegBuffer).webp({ quality: 80 }).toFile(posterWebp);
}

async function generatePhotoThumb(srcPath, thumbWebp, thumbJpeg, fullWebp) {
  const input = await fs.readFile(srcPath);
  const meta = await sharp(input).metadata();

  let fullPipeline = sharp(input);
  if (meta.width && meta.width > 1920) {
    fullPipeline = fullPipeline.resize(1920, null, { withoutEnlargement: true });
  }
  const fullBuffer = await fullPipeline
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  await fs.writeFile(srcPath, fullBuffer);
  await sharp(fullBuffer).webp({ quality: 80 }).toFile(fullWebp);

  const thumbBuffer = await sharp(input)
    .resize(400, null, { withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();
  await sharp(thumbBuffer).webp({ quality: 78 }).toFile(thumbWebp);
  await fs.writeFile(thumbJpeg, thumbBuffer);
}

async function normalizePhotos(existingPhotos) {
  const sorted = await sortByTimestamp(existingPhotos);

  const normalized = [];
  for (let i = 0; i < sorted.length; i++) {
    const src = sorted[i];
    const ext = path.extname(src).toLowerCase() === ".png" ? ".jpeg" : ".jpeg";
    const id = `photo-${String(i + 1).padStart(3, "0")}`;
    const dest = path.join(galleryDir, `${id}${ext}`);

    if (path.resolve(src) !== path.resolve(dest)) {
      await fs.rename(src, dest);
    }
    normalized.push({ id, path: dest, ext });
  }
  return normalized;
}

async function normalizeVideos(existingVideos) {
  const sorted = await sortByTimestamp(existingVideos);

  const normalized = [];
  for (let i = 0; i < sorted.length; i++) {
    const src = sorted[i];
    const id = `video-${String(i + 1).padStart(3, "0")}`;
    const dest = path.join(gallery2Dir, `${id}.mp4`);

    if (path.resolve(src) !== path.resolve(dest)) {
      await fs.rename(src, dest);
    }
    normalized.push({ id, path: dest });
  }
  return normalized;
}

async function embedManifestInHtml(manifest) {
  let html = await fs.readFile(galleryHtmlPath, "utf8");
  const json = JSON.stringify(manifest);
  const marker = '<script type="application/json" id="gallery-manifest">';
  const endMarker = "</script>";

  if (html.includes(marker)) {
    const start = html.indexOf(marker) + marker.length;
    const end = html.indexOf(endMarker, start);
    html = html.slice(0, start) + json + html.slice(end);
  } else {
    console.warn("gallery-manifest script tag not found in gallery.html — manifest written to JSON only");
  }
  await fs.writeFile(galleryHtmlPath, html);
}

async function main() {
  await ensureDir(galleryDir);
  await ensureDir(gallery2Dir);
  await ensureDir(thumbsDir);
  await ensureDir(postersDir);
  await ensureDir(dataDir);

  const galleryPhotos = await listMediaFiles(galleryDir, PHOTO_EXT);
  const galleryVideos = await listMediaFiles(galleryDir, VIDEO_EXT);
  const gallery2Videos = await listMediaFiles(gallery2Dir, VIDEO_EXT);

  const allVideos = [...galleryVideos, ...gallery2Videos];

  console.log(`Found ${galleryPhotos.length} photos, ${allVideos.length} videos`);

  const sortedPhotoPaths = await sortByTimestamp(galleryPhotos);
  const sortedVideoPaths = await sortByTimestamp(allVideos);

  const photoMeta = await Promise.all(
    sortedPhotoPaths.map(async (filePath) => {
      const stat = await fs.stat(filePath);
      return {
        path: filePath,
        ts: parseWhatsAppTimestamp(path.basename(filePath)) ?? stat.mtimeMs,
      };
    })
  );

  const videoMeta = await Promise.all(
    sortedVideoPaths.map(async (filePath) => {
      const stat = await fs.stat(filePath);
      return {
        path: filePath,
        ts: parseWhatsAppTimestamp(path.basename(filePath)) ?? stat.mtimeMs,
      };
    })
  );

  const photos = await normalizePhotos(sortedPhotoPaths);
  const videos = await normalizeVideos(sortedVideoPaths);

  const photoMetaRenamed = photos.map((photo, index) => ({
    path: photo.path,
    ts: photoMeta[index]?.ts ?? null,
  }));

  const manifest = { photos: [], videos: [] };

  for (const photo of photos) {
    const thumbWebp = path.join(thumbsDir, `${photo.id}.webp`);
    const thumbJpeg = path.join(thumbsDir, `${photo.id}.jpeg`);
    const fullWebp = photo.path.replace(/\.(jpe?g|png)$/i, ".webp");

    await generatePhotoThumb(photo.path, thumbWebp, thumbJpeg, fullWebp);

    manifest.photos.push({
      id: photo.id,
      src: `assets/images/gallery/${photo.id}.jpeg`,
      webp: `assets/images/gallery/${photo.id}.webp`,
      thumb: `assets/images/gallery/thumbs/${photo.id}.webp`,
      thumbFallback: `assets/images/gallery/thumbs/${photo.id}.jpeg`,
      title: "iMusafir Gallery",
    });
  }

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const posterWebp = path.join(postersDir, `${video.id}.webp`);
    const posterJpeg = path.join(postersDir, `${video.id}.jpeg`);
    const byTimestamp = findClosestPhotoPath(videoMeta[i]?.ts, photoMetaRenamed);
    const byIndex = photoMetaRenamed[Math.min(i, photoMetaRenamed.length - 1)]?.path;
    const matchedPhoto = byTimestamp || byIndex || null;
    await generateVideoPoster(posterWebp, posterJpeg, matchedPhoto);

    manifest.videos.push({
      id: video.id,
      src: `assets/images/gallery-2/${video.id}.mp4`,
      poster: `assets/images/gallery-2/posters/${video.id}.webp`,
      posterFallback: `assets/images/gallery-2/posters/${video.id}.jpeg`,
      title: "iMusafir Video",
    });
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  await embedManifestInHtml(manifest);

  console.log(
    `Gallery ready: ${manifest.photos.length} photos, ${manifest.videos.length} videos`
  );
  console.log(`Manifest: ${path.relative(root, manifestPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
