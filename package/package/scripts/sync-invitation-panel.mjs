import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "../src");
const panel = (await fs.readFile(path.join(srcDir, "partials/invitation-panel.html"), "utf8")).trim();

const pages = ["index.html", "contact.html", "gallery.html", "indonesia-2026.html", "error-404.html"];

const panelPattern = /<div id="offcanvas-right"[\s\S]*?<\/div>\s*(?=\n\s*<!-- JAVASCRIPT)/;

const headerPattern =
  /<li class="inline-block" data-drawer="#offcanvas-right" data-drawer-placement="right">\s*<button class="([^"]*)" type="button" aria-label="Toggle drawer">/g;
const headerReplacement =
  '<li class="inline-block"><button class="$1" type="button" data-drawer="#offcanvas-right" data-drawer-placement="right" aria-label="Open invitation panel">';

for (const page of pages) {
  const filePath = path.join(srcDir, page);
  let html = await fs.readFile(filePath, "utf8");
  if (!panelPattern.test(html)) {
    console.warn(`Skipped ${page}: panel block not found`);
    continue;
  }
  html = html.replace(panelPattern, `${panel}\n`);
  html = html.replace(headerPattern, headerReplacement);
  await fs.writeFile(filePath, html);
  console.log(`Updated ${page}`);
}
