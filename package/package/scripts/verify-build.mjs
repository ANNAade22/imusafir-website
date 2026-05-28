import fs from "fs/promises";
import path from "path";

const distDir = path.resolve("dist");

async function dirSize(dir) {
  let total = 0;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += await dirSize(full);
    else total += (await fs.stat(full)).size;
  }
  return total;
}

async function countMatches(file, pattern) {
  const html = await fs.readFile(file, "utf8");
  return (html.match(pattern) || []).length;
}

async function main() {
  const pages = ["index.html", "contact.html"];
  for (const page of pages) {
    const file = path.join(distDir, page);
    const htmlSize = (await fs.stat(file)).size;
    const scripts = await countMatches(file, /<script defer/g);
    const styles = await countMatches(file, /<link rel="stylesheet"/g);
    console.log(`${page}: HTML ${(htmlSize / 1024).toFixed(0)}KB, CSS links ${styles}, defer scripts ${scripts}`);
  }

  const imagesSize = await dirSize(path.join(distDir, "assets/images"));
  const cssSize = (await fs.stat(path.join(distDir, "assets/css/style.css"))).size;
  console.log(`Total images: ${(imagesSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Minified CSS: ${(cssSize / 1024).toFixed(0)}KB`);
}

main();
