# iMusafir Website — Run Guide

All commands run from this folder:

```
c:\Users\Administrator\Desktop\imusafir-website\package\package
```

> **Note:** The repo root (`imusafir-website`) has no `package.json`. Always `cd` into `package\package` first.

---

## First time setup

```powershell
cd c:\Users\Administrator\Desktop\imusafir-website\package\package
npm install
```

---

## Daily development (recommended)

Starts Tailwind CSS watch **and** a local server:

```powershell
npm start
```

Open: **http://localhost:3000**

---

## Commands

| Command | What it does |
|---------|----------------|
| `npm start` | CSS watch + serve `src/` on port 3000 |
| `npm run dev` | Tailwind watch only (no web server) |
| `npm run serve` | Static server only (`src/` on port 3000) |
| `npm run build` | Full production build → `dist/` |
| `npm run preview` | Serve `dist/` on port 3000 (run `build` first) |
| `npm run build:gallery` | Regenerate gallery manifest only |
| `npm run verify` | Check production build |

---

## Production build & preview

```powershell
npm run build
npm run preview
```

Open: **http://localhost:3000**

---

## Troubleshooting

### `ENOENT package.json` at repo root

You are in the wrong folder. Run commands from `package\package`.

### Page shows 404 on localhost:3000

- **Dev:** Use `npm start`, not only `npm run dev`. `dev` does not start a server.
- **Preview:** Run `npm run build` first. `preview` serves `dist/`, which is created by the build.

### Port 3000 already in use

Stop the other process (Ctrl+C in that terminal), or change the port in `package.json` (`serve` / `preview` scripts).

### `serve` crashes with `Unknown Chalk style: bold`

Run `npm install` again in `package\package`. The project pins `chalk-template@1.1.2` via `overrides` in `package.json`.

### Build fails on gallery images

Gallery build needs JPEG/PNG source files in `src/assets/images/gallery/`. If only `.webp` files exist, run `npm run build:gallery` after adding the originals, or restore missing gallery assets from backup.

---

## Project layout

| Path | Purpose |
|------|---------|
| `src/` | Source HTML, CSS, JS, images (dev server root) |
| `dist/` | Production output (generated; not committed) |
| `scripts/` | Build and gallery tooling |
