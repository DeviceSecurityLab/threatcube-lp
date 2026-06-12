# CLAUDE.md

Guidance for working in this repo. See `README.md` for the user-facing overview.

## What this is

A **static** marketing landing page for ThreatCube (the local-first STRIDE
threat-modeling app at https://cube.osamusic.org). Three source files —
`index.html`, `styles.css`, `hero-cube.js` — plus `favicon.svg`, `CNAME`, `.nojekyll`.
Served as-is by GitHub Pages at https://cube-lp.osamusic.org.

## No build system

There is **no bundler, framework, or package manager**. Do not add `package.json`,
Vite, npm scripts, or a build step. Three.js is pulled at runtime from unpkg via the
native import map in `index.html`; `hero-cube.js` is a plain ES module.

To preview, serve the directory over HTTP (`python3 -m http.server`) — `file://` breaks
ES modules and the import map. There is nothing to compile and no test suite.

## Structure

- `index.html` — the source of truth for layout, section order, and all copy. Sections
  top→bottom: nav, hero, problem (Before/After), axes (the three dimensions), features,
  domains strip, local-first/privacy, CTA, footer. A small inline `<script>` handles nav
  scroll state and scroll-reveal; `hero-cube.js` is loaded as a module at the end.
- `styles.css` — all styling. Design tokens (colors, violet brand accent, risk-5 palette,
  spacing, radii) are CSS custom properties in `:root` at the top; reuse them rather than
  hardcoding new hex values.
- `hero-cube.js` — the 3D cube: a sparse Asset × Surface × STRIDE lattice, cells colored
  by risk level, auto-rotate + drag-to-orbit (pan/zoom disabled), UnrealBloom glow. It
  gates its RAF loop with IntersectionObserver, resizes with ResizeObserver, and falls
  back to a dashed placeholder when WebGL is unavailable.

## The three axes

The product models risk along **Asset × Surface × STRIDE**. The Y axis is named
**Surface** (formerly "Interface"). Use **Surface** in all visible copy and labels; the
Japanese gloss "インターフェース / データフロー" remains as its explanation. Keep this
terminology consistent with the main app.

## Editing conventions

- Copy is Japanese with intentional English technical terms (Asset, Surface, STRIDE, risk
  levels). Preserve that mix; don't translate the English terms.
- All CTAs point to the app at `https://cube.osamusic.org`. In-page nav links are anchors
  (`#problem`, `#axes`, `#features`, `#local`, `#start`).
- Risk palette: not_assessed `#9ca3af`, low `#22c55e`, medium `#f59e0b`, high `#ef4444`,
  critical `#d946ef`. The hero cube and the page legend must agree on these.
- Accessibility/robustness to preserve: `prefers-reduced-motion` disables reveals and
  smooth scroll (content stays visible); the hero clips its glow to avoid horizontal
  overflow; the cube degrades gracefully without WebGL.

## Deploy

Push to the default branch → GitHub Pages publishes. `CNAME` binds the custom domain,
`.nojekyll` ships files unprocessed. Don't remove either.
