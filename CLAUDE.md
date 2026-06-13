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

## Security

GitHub Pages cannot send HTTP headers, so all hardening is delivered via `<meta>` in the
head of `index.html`:

- A **Content-Security-Policy** locks sources down: `default-src 'self'`; scripts only from
  `'self'` + `https://unpkg.com` (Three.js); styles/fonts only from Google Fonts;
  `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`, `upgrade-insecure-requests`.
- **Inline scripts are allowlisted by SHA-256 hash, not `'unsafe-inline'`.** Three inline
  blocks are hashed: the `importmap`, the `application/ld+json` structured data, and the
  nav/scroll-reveal script at the bottom. **If you edit any of them, the page breaks until
  you recompute the hash.** Regenerate with the snippet below and update `script-src`:
  ```sh
  python3 - <<'PY'
  import re, hashlib, base64
  html = open('index.html').read()
  for m in re.finditer(r'<script([^>]*)>(.*?)</script>', html, re.S):
      if 'src=' in m.group(1): continue
      print(m.group(1).strip() or '(plain)',
            'sha256-'+base64.b64encode(hashlib.sha256(m.group(2).encode()).digest()).decode())
  PY
  ```
- `style-src` keeps `'unsafe-inline'` because the markup relies on inline `style="…"`
  attributes (CSP hashes/nonces cannot cover style *attributes*). Don't add inline event
  handlers (`onclick=` etc.) — those would need the same exception for scripts and undo the
  hardening.
- `frame-ancestors`/`X-Frame-Options` (anti-clickjacking) are header-only and **cannot** be
  set on GitHub Pages — don't re-add `frame-ancestors` to the meta CSP; it's silently
  ignored and only emits a console error.
- A `referrer` meta sets `strict-origin-when-cross-origin`.

After any change touching the head or those scripts, serve over HTTP and confirm the
browser console shows **no CSP violations** and the hero cube still renders.

## Deploy

Push to the default branch → GitHub Pages publishes. `CNAME` binds the custom domain,
`.nojekyll` ships files unprocessed. Don't remove either.
