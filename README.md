# ThreatCube — Landing Page

Marketing landing page for **ThreatCube**, a local-first STRIDE threat-modeling web
app that visualizes **Asset × Surface × STRIDE** risk as an interactive 3D cube.

The centerpiece is a live, auto-rotating, drag-to-orbit 3D threat cube rendered with
Three.js + UnrealBloom glow, colored by the same risk palette the app uses. The page's
job is to communicate the product concept (visualize → surface the most important
threats → act on them first) and drive the visitor into the app.

- **Live site:** https://cube-lp.osamusic.org
- **App:** https://cube.osamusic.org (all CTAs link here)

## Stack

This is a **static site** — no build step, no framework, no bundler.

- Plain HTML / CSS / vanilla JS.
- [Three.js](https://threejs.org/) `0.160.0` loaded from unpkg via a native
  [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
  (see the `<script type="importmap">` block in `index.html`). `hero-cube.js` is an ES
  module that imports `three` and `three/addons/`.
- Fonts (Noto Sans JP, JetBrains Mono) from Google Fonts.
- Hosted on **GitHub Pages** with a custom domain.

## Files

| File | Purpose |
|---|---|
| `index.html` | Full page markup, copy, and section structure (single scroll). |
| `styles.css` | All visual styling. Design tokens live in `:root` custom properties. |
| `hero-cube.js` | The Three.js hero cube — geometry, risk encoding, lighting, OrbitControls, UnrealBloom, perf gating (IntersectionObserver/ResizeObserver), and a WebGL fallback. |
| `favicon.svg` | Brand mark (dark rounded square + violet cube glyph). |
| `CNAME` | Custom domain for GitHub Pages (`cube-lp.osamusic.org`). |
| `.nojekyll` | Disables Jekyll processing on GitHub Pages. |

## Develop locally

The import map and ES modules need to be served over HTTP (opening `index.html` via
`file://` will fail the module/font loads). Any static server works:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Edit `index.html` / `styles.css` / `hero-cube.js` and refresh — there is nothing to build.

## Deploy

Pushing to the default branch publishes the site via GitHub Pages. The `CNAME` file
keeps the custom domain bound; `.nojekyll` ships the files as-is.

## Conventions

- Visible copy is **Japanese**; English technical terms (Asset, Surface, STRIDE,
  Critical/High/…) are kept intentionally — preserve that bilingual mix.
- Respect `prefers-reduced-motion`: scroll-reveal and smooth-scroll must degrade to a
  static, fully-visible page.
- The hero must not introduce horizontal overflow — the large radial glow is clipped by
  `position: relative; overflow: hidden` on the hero.
- The cube probes for a WebGL context and reveals a dashed fallback placeholder when
  unavailable; keep that path working.
