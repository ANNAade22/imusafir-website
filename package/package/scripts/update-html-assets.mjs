import fs from "fs/promises";
import path from "path";

const srcDir = path.resolve("src");
const pages = [
  "index.html",
  "contact.html",
  "gallery.html",
  "pricing.html",
  "our-team.html",
  "error-404.html",
];

function baseCss(lineAwesome = false) {
  const la = lineAwesome
    ? `\n    <link rel="stylesheet" type="text/css" href="assets/icons/line-awesome/css/line-awesome.min.css">`
    : "";
  return `\t<link rel="stylesheet" type="text/css" href="assets/icons/fontawesome/css/all.min.css">${la}
    <link rel="stylesheet" href="assets/css/fonts.css">
    <link rel="stylesheet" href="assets/css/style.css">`;
}

function coreScripts(extra = "") {
  return `<!-- JAVASCRIPT  FILES ========================================= -->
<script defer src="assets/vendor/gsap/gsap.min.js"></script>
<script defer src="assets/js/jquery-3.7.1.min.js"></script>
<script defer src="assets/vendor/xmenu/xmenu.js"></script>${extra}
<script defer src="assets/js/custom.js"></script>`;
}

const pageConfig = {
  "index.html": {
    css: `${baseCss()}\n    <link rel="stylesheet" href="assets/vendor/swiper/swiper-bundle.min.css">\n    <link rel="stylesheet" href="assets/vendor/magnific-popup/magnific-popup.css">`,
    scripts: coreScripts(`
<script defer src="assets/vendor/gsap/ScrollTrigger.min.js"></script>
<script defer src="assets/vendor/swiper/swiper-bundle.min.js"></script>
<script defer src="assets/js/dz.carousel.js"></script>
<script defer src="assets/vendor/magnific-popup/magnific-popup.js"></script>
<script defer src="assets/js/animation.js"></script>`),
  },
  "gallery.html": {
    css: `${baseCss()}\n    <link rel="stylesheet" href="assets/vendor/swiper/swiper-bundle.min.css">\n    <link rel="stylesheet" href="assets/css/lc_lightbox.css">`,
    scripts: coreScripts(`
<script defer src="assets/vendor/gsap/ScrollTrigger.min.js"></script>
<script defer src="assets/vendor/swiper/swiper-bundle.min.js"></script>
<script defer src="assets/js/dz.carousel.js"></script>
<script defer src="assets/vendor/group-slide/group-loop.js"></script>
<script defer src="assets/js/lc_lightbox.lite.js"></script>
<script defer src="assets/js/animation.js"></script>`),
  },
  "contact.html": {
    css: baseCss(),
    scripts: coreScripts(`
<script defer src="assets/vendor/gsap/ScrollTrigger.min.js"></script>
<script defer src="assets/js/form-config.js"></script>
<script defer src="assets/js/dz.ajax.js"></script>
<script defer src="assets/js/map-facade.js"></script>
<script defer src="assets/js/animation.js"></script>`),
  },
  "pricing.html": {
    css: `${baseCss(true)}\n    <link rel="stylesheet" href="assets/vendor/swiper/swiper-bundle.min.css">`,
    scripts: coreScripts(`
<script defer src="assets/vendor/gsap/ScrollTrigger.min.js"></script>
<script defer src="assets/vendor/swiper/swiper-bundle.min.js"></script>
<script defer src="assets/js/dz.carousel.js"></script>
<script defer src="assets/js/animation.js"></script>`),
  },
  "our-team.html": {
    css: `${baseCss(true)}\n    <link rel="stylesheet" href="assets/vendor/swiper/swiper-bundle.min.css">`,
    scripts: coreScripts(`
<script defer src="assets/vendor/gsap/ScrollTrigger.min.js"></script>
<script defer src="assets/vendor/swiper/swiper-bundle.min.js"></script>
<script defer src="assets/js/dz.carousel.js"></script>
<script defer src="assets/js/animation.js"></script>`),
  },
  "error-404.html": {
    css: baseCss(),
    scripts: coreScripts(""),
  },
};

const headRegex =
  /\t<link rel="stylesheet" type="text\/css" href="assets\/icons\/(?:line-awesome|flaticon|fontawesome)[^]*?rel="stylesheet">\s*\n?\s*<\/head>/;

const scriptRegex =
  /<!-- JAVASCRIPT  FILES ========================================= -->[\s\S]*?<script(?: defer)? src="assets\/js\/custom\.js"><\/script>/;

async function main() {
  for (const page of pages) {
    const file = path.join(srcDir, page);
    let html = await fs.readFile(file, "utf8");
    const cfg = pageConfig[page];

    html = html.replace(headRegex, `${cfg.css}\n\t\n</head>`);
    html = html.replace(scriptRegex, cfg.scripts);

    await fs.writeFile(file, html);
    console.log(`Updated ${page}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
