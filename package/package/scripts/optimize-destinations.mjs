import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const dir = path.resolve("src/assets/images/destinations/style1");
const TARGET_W = 618;
const TARGET_H = 1000;
const QUALITY = 82;

async function main() {
  const files = (await fs.readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  for (const file of files) {
    const input = path.join(dir, file);
    const outputName = file.replace(/\.jpeg$/i, ".jpg");
    const output = path.join(dir, outputName);
    const before = (await fs.stat(input)).size;

    const temp = path.join(dir, `.tmp-${outputName}`);
    await sharp(input)
      .rotate()
      .resize(TARGET_W, TARGET_H, { fit: "cover", position: "centre" })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(temp);

    const after = (await fs.stat(temp)).size;
    if (input !== output) {
      await fs.unlink(input).catch(() => {});
    } else {
      await fs.unlink(input);
    }
    await fs.rename(temp, output);

    console.log(
      `${file} → ${outputName}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (${TARGET_W}x${TARGET_H})`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
