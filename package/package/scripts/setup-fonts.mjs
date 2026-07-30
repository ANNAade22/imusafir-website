import fs from "fs/promises";
import path from "path";

const fontsOut = path.resolve("src/assets/fonts");
const fontsCss = path.resolve("src/assets/css/fonts.css");

const copies = [
  [
    "node_modules/@fontsource/montserrat/files/montserrat-latin-400-normal.woff2",
    "montserrat-400.woff2",
  ],
  [
    "node_modules/@fontsource/montserrat/files/montserrat-latin-500-normal.woff2",
    "montserrat-500.woff2",
  ],
  [
    "node_modules/@fontsource/montserrat/files/montserrat-latin-600-normal.woff2",
    "montserrat-600.woff2",
  ],
  [
    "node_modules/@fontsource/montserrat/files/montserrat-latin-700-normal.woff2",
    "montserrat-700.woff2",
  ],
  [
    "node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2",
    "playfair-display-400.woff2",
  ],
  [
    "node_modules/@fontsource/playfair-display/files/playfair-display-latin-500-normal.woff2",
    "playfair-display-500.woff2",
  ],
  [
    "node_modules/@fontsource/playfair-display/files/playfair-display-latin-600-normal.woff2",
    "playfair-display-600.woff2",
  ],
  [
    "node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2",
    "playfair-display-700.woff2",
  ],
  [
    "node_modules/@fontsource/great-vibes/files/great-vibes-latin-400-normal.woff2",
    "great-vibes-400.woff2",
  ],
];

const css = `@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("../fonts/montserrat-400.woff2") format("woff2");
}

@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("../fonts/montserrat-500.woff2") format("woff2");
}

@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("../fonts/montserrat-600.woff2") format("woff2");
}

@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("../fonts/montserrat-700.woff2") format("woff2");
}

@font-face {
  font-family: "Playfair Display";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("../fonts/playfair-display-400.woff2") format("woff2");
}

@font-face {
  font-family: "Playfair Display";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("../fonts/playfair-display-500.woff2") format("woff2");
}

@font-face {
  font-family: "Playfair Display";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("../fonts/playfair-display-600.woff2") format("woff2");
}

@font-face {
  font-family: "Playfair Display";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("../fonts/playfair-display-700.woff2") format("woff2");
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
