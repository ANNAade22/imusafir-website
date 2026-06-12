import fs from "fs";

const html = fs.readFileSync("src/index.html", "utf8");
const start = html.indexOf('id="offcanvas-right"');
const end = html.indexOf("<!-- JAVASCRIPT", start);
const chunk = html.slice(start, end);
console.log("Panel HTML length:", chunk.length);
console.log("Has Invitation Only:", chunk.includes("Invitation Only"));
console.log("Has headline:", chunk.includes("Founders"));
console.log(chunk);
