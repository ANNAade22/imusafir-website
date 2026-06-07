import fs from "fs/promises";
import path from "path";

const root = path.resolve(".");
const outFile = path.join(root, "src/assets/js/form-config.js");

const contactId = process.env.FORMSPREE_CONTACT_ID || "YOUR_CONTACT_FORM_ID";
const newsletterId = process.env.FORMSPREE_NEWSLETTER_ID || "YOUR_NEWSLETTER_FORM_ID";

const content = `/**
 * Formspree endpoints for static hosting.
 * Set FORMSPREE_CONTACT_ID and FORMSPREE_NEWSLETTER_ID in Netlify env vars,
 * or replace the placeholder IDs below manually.
 */
window.TRAVLLA_FORMS = {
  contact: 'https://formspree.io/f/${contactId}',
  newsletter: 'https://formspree.io/f/${newsletterId}'
};
`;

await fs.writeFile(outFile, content, "utf8");
console.log("Wrote form-config.js");
