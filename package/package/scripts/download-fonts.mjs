import fs from "fs/promises";
import path from "path";

const fontsDir = path.resolve("src/assets/fonts");

async function extractWoff2Url(cssUrl) {
  const res = await fetch(cssUrl, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`Failed CSS ${cssUrl}: ${res.status}`);
  const css = await res.text();
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
  if (!match) throw new Error(`No woff2 URL in ${cssUrl}`);
  return match[1];
}

const fonts = [
  {
    name: "figtree-latin.woff2",
    css: "https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap",
  },
  {
    name: "afacad-latin.woff2",
    css: "https://fonts.googleapis.com/css2?family=Afacad:wght@400..700&display=swap",
  },
  {
    name: "kaushan-script-latin.woff2",
    css: "https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap",
  },
];

async function main() {
  await fs.mkdir(fontsDir, { recursive: true });
  for (const font of fonts) {
    const dest = path.join(fontsDir, font.name);
    const woff2Url = await extractWoff2Url(font.css);
    const res = await fetch(woff2Url);
    if (!res.ok) throw new Error(`Failed ${woff2Url}: ${res.status}`);
    await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
    console.log(`Downloaded ${font.name}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
