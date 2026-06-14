import fs from "fs/promises";
import path from "path";

const fontsOut = path.resolve("src/assets/fonts");
const fontsCss = path.resolve("src/assets/css/fonts.css");

const copies = [
  ["node_modules/@fontsource/figtree/files/figtree-latin-400-normal.woff2", "figtree-400.woff2"],
  ["node_modules/@fontsource/figtree/files/figtree-latin-500-normal.woff2", "figtree-500.woff2"],
  ["node_modules/@fontsource/figtree/files/figtree-latin-600-normal.woff2", "figtree-600.woff2"],
  ["node_modules/@fontsource/figtree/files/figtree-latin-700-normal.woff2", "figtree-700.woff2"],
  ["node_modules/@fontsource/afacad/files/afacad-latin-400-normal.woff2", "afacad-400.woff2"],
  ["node_modules/@fontsource/afacad/files/afacad-latin-500-normal.woff2", "afacad-500.woff2"],
  ["node_modules/@fontsource/afacad/files/afacad-latin-600-normal.woff2", "afacad-600.woff2"],
  ["node_modules/@fontsource/afacad/files/afacad-latin-700-normal.woff2", "afacad-700.woff2"],
  [
    "node_modules/@fontsource/kaushan-script/files/kaushan-script-latin-400-normal.woff2",
    "kaushan-script-400.woff2",
  ],
  [
    "node_modules/@fontsource/great-vibes/files/great-vibes-latin-400-normal.woff2",
    "great-vibes-400.woff2",
  ],
];

const css = `@font-face {
  font-family: "Figtree";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("../fonts/figtree-400.woff2") format("woff2");
}

@font-face {
  font-family: "Figtree";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("../fonts/figtree-500.woff2") format("woff2");
}

@font-face {
  font-family: "Figtree";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("../fonts/figtree-600.woff2") format("woff2");
}

@font-face {
  font-family: "Figtree";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("../fonts/figtree-700.woff2") format("woff2");
}

@font-face {
  font-family: "Afacad";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("../fonts/afacad-400.woff2") format("woff2");
}

@font-face {
  font-family: "Afacad";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("../fonts/afacad-500.woff2") format("woff2");
}

@font-face {
  font-family: "Afacad";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("../fonts/afacad-600.woff2") format("woff2");
}

@font-face {
  font-family: "Afacad";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("../fonts/afacad-700.woff2") format("woff2");
}

@font-face {
  font-family: "Kaushan Script";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("../fonts/kaushan-script-400.woff2") format("woff2");
}

@font-face {
  font-family: "Great Vibes";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("../fonts/great-vibes-400.woff2") format("woff2");
}
`;

async function main() {
  await fs.mkdir(fontsOut, { recursive: true });
  for (const [from, to] of copies) {
    await fs.copyFile(path.resolve(from), path.join(fontsOut, to));
    console.log(`Copied ${to}`);
  }
  await fs.writeFile(fontsCss, css);
  console.log("Wrote fonts.css");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
