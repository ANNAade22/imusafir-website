import fs from "fs/promises";
import path from "path";

const srcDir = path.resolve("src");
const pages = [
  "index.html",
  "contact.html",
  "gallery.html",
  "services.html",
  "pricing.html",
  "our-team.html",
  "error-404.html",
];

async function main() {
  for (const page of pages) {
    const file = path.join(srcDir, page);
    let html = await fs.readFile(file, "utf8");
    html = html.replace('<div id="smooth-wrapper">', "<div>");
    html = html.replace('<div id="smooth-content">', "<div>");
    await fs.writeFile(file, html);
    console.log(`Removed smooth scroll wrappers in ${page}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
