# Handoff: ThreatCube Landing Page (LP)

## Overview
A marketing/landing page for **ThreatCube** — the local-first STRIDE threat-modeling
web app that visualizes **Asset × Interface × STRIDE** risk as an interactive 3D cube.
The page's job is to communicate the product concept (visualize → surface the most
important threats → act on them first) and drive the visitor into the app.

The centerpiece is a **live, auto-rotating, drag-to-orbit 3D threat cube** rendered with
Three.js + UnrealBloom glow, colored by the same risk palette the real app uses.

---

## About the Design Files
The files in this bundle are **design references created in plain HTML/CSS/JS** — a
high-fidelity prototype of the intended look and behavior. **They are not meant to be
shipped as-is.** The task is to **recreate this design inside the existing ThreatCube
codebase** (React 18 + TypeScript + Vite + Tailwind + React Router, with Three.js already
present for the cube view), reusing its established patterns, design tokens, and libraries.

The existing repo already contains everything needed to do this natively:
- **Risk color tokens** live in `src/domain/risk.ts` → `RISK_COLORS`. Use these, do **not**
  re-hardcode hex values. They already match this design exactly.
- **Tailwind** is configured with `darkMode` and a violet accent — build the LP with Tailwind
  utility classes rather than porting `styles.css` verbatim.
- **Three.js / R3F / drei** are already a dependency (see `src/pages/CubePage.tsx` and
  `src/components/cube/`). The hero cube should be built as an R3F component to match the
  codebase, not as the raw imperative `hero-cube.js` in this bundle (that file is a reference
  for the visual target and the math/encoding, not the implementation to copy).

### Where it slots into the app
- Add a new **`/` (index) marketing route** OR a dedicated `/welcome` route in
  `src/app/routes.tsx`. Currently `index: true` renders `DashboardPage`. Decide with the team
  whether the LP becomes the new landing surface (recommended: LP at `/`, move the app
  dashboard behind a "ブラウザで開く"/"Open app" CTA that routes to `/dashboard` or `/cube`).
- Routing is **hash-based** (`createHashRouter`) for GitHub Pages — keep CTAs as in-app
  router links (`/#/cube`) where they lead into the app.

---

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions are all
specified. Recreate the UI to match this prototype closely, but express it through Tailwind
+ the existing token system rather than copying CSS.

---

## Language
All visible copy is **Japanese**. Exact strings are listed per-section below; copy them
verbatim. The product retains English technical terms (Asset, Interface, STRIDE, Critical/High/…)
intentionally — keep that bilingual mix.

---

## Page Structure (top → bottom)

The page is a single scroll. Max content width **1200px**, centered, with 24px side gutters
(`width: min(100% - 48px, 1200px)`).

### 0. Fixed Nav (`<nav>`)
- Fixed top, full-width. Transparent initially; on `scrollY > 24` gains
  `background: rgba(5,7,15,0.72)`, `backdrop-filter: blur(14px)`, and a 1px bottom border
  `rgba(148,163,184,0.12)`.
- Left: brand — 26px favicon + "Threat**Cube**" (the "Cube" half is violet `#a98bff`, weight 700, 17px).
- Right: nav links (14px, muted `#98a4b8`, hover → `#e7ecf4`): 課題 / 3つの軸 / 機能 / プライバシー,
  then a ghost button **「ブラウザで開く」**.
- Links are in-page anchors (`#problem`, `#axes`, `#features`, `#local`); the ghost button →
  app entry (in real app: `/#/cube` or `/#/`).

### 1. Hero (`#top`)
- Two-column grid `1.02fr / 1fr`, gap 40px, vertically centered. Collapses to 1 column < 940px
  (cube moves below copy, max-width 460px, centered).
- Padding-top 168px (130px on mobile) to clear the fixed nav.
- A large radial **violet glow** is absolutely positioned top-right behind the content
  (`820×820px`, `radial-gradient(circle, rgba(139,92,246,0.28), transparent 62%)`, blurred 8px).
  ⚠️ The hero **must** be `position: relative; overflow: hidden` so this glow never causes
  horizontal page overflow (this was a real bug — don't drop it).
- **Left column copy:**
  - Eyebrow (JetBrains Mono, 12px, letter-spacing 0.22em, uppercase, violet `#a98bff`, with a
    22px gradient lead-in rule): `LOCAL-FIRST STRIDE THREAT MODELING`
  - H1 (`clamp(38px,5.6vw,68px)`, weight 700, letter-spacing -0.02em):
    line 1 `危険な脅威を、` (white) — line 2 `すぐに見つけ出す。` (gradient text:
    `linear-gradient(110deg,#fff 10%,#a98bff 55%,#8b5cf6)` clipped to text).
  - Lead paragraph (18px, muted, max-width 540px):
    `STRIDE分析を Asset × Interface の立体に可視化。リスクの集中も、未分析の空白も明らかになり、いま対処すべき重大な脅威を見つけ出せる ── 組込み・製品セキュリティのためのローカルファースト脅威モデリング。`
  - CTA row (gap 14px): primary **「3Dで試す」** (play-triangle icon) + ghost **「コンセプトを見る」**.
  - Meta legend row (JetBrains Mono 12.5px, faint): 5 colored dots + labels —
    CRITICAL `#d946ef` / HIGH `#ef4444` / MEDIUM `#f59e0b` / LOW `#22c55e` / 未評価 `#9ca3af`.
- **Right column:** the 3D cube stage (see "Hero 3D Cube" section).

### 2. Problem (`#problem`) — "2Dでは構造が見えない"
- Section head: eyebrow `THE PROBLEM`, H2 `2Dのマトリクスでは、構造が見えない。`,
  paragraph explaining a spreadsheet flattens Asset/Interface/STRIDE/Risk into rows.
  Exact copy:
  `STRIDE分析は、Asset・Interface・脅威カテゴリ・リスクという複数の次元を持っています。スプレッドシートの平面に押し込めると、どこにリスクが集中し、どこがまだ分析されていないのかが、行と列の海に埋もれてしまいます。`
- **Before → After compare** (3-col grid `1fr auto 1fr`, gap 36px; arrow rotates to 90° on mobile):
  - **Before card** (`平らな表`): muted "flat-grid" of 24 small squares, mostly gray, a few
    slightly-lighter "hot" cells — deliberately illegible.
  - Arrow `→` (faint, 26px).
  - **After card** (`立体の脅威キューブ`): violet-bordered, faint violet bg, soft outer glow.
    Same grid but cells are risk-colored with glow on high/critical — structure is now legible.
  - Card copy: before tag `Before · Spreadsheet`, after tag `After · ThreatCube`.

### 3. Axes (`#axes`) — the three dimensions (bg `#080b16`, hairline top/bottom borders)
- Section head: eyebrow `THREE DIMENSIONS`, H2 `1つの脅威を、3つの軸で位置づける。`
- 3-col grid of axis cards (1 col on mobile). Each card: a mono ID chip (X/Y/Z, violet), title,
  Japanese subtitle, description, and a wrap of mono "tag" pills. On hover: lift -4px + a violet
  top glowline fades in.
  - **X · Asset / 資産** — pills: `secret_key`, `firmware`, `certificate`, `clinical_data`
  - **Y · Interface / インターフェース・データフロー** — pills: `usb`, `ci_cd`, `service_port`, `hl7_dicom`
  - **Z · STRIDE / 脅威カテゴリ** — pills: `なりすまし`, `改ざん`, `否認`, `情報漏えい`, `DoS`, `権限昇格`
- Below the grid, an **encoding legend** (mono 12.5px): `色 = リスクレベル` (5 swatches),
  `大きさ = リスクスコア`, `不透明度 / 形状 = ステータス`. This mirrors the real cube encoding in
  `risk.ts` (`riskScoreToSize`, `statusToOpacity`) — keep it accurate to those functions.

### 4. Features (`#features`) — core workflow
- Section head: eyebrow `CORE WORKFLOW`, H2 `見る・直す・伝える。3つのビューを行き来する。`
- Three alternating feature rows (2-col, image and text swap sides per row; stack on mobile).
  Each visual is a "window" mock with 3 traffic-light dots.
  - **01 / CUBE VIEW — 3Dキューブビュー.** Bullets: 回転/パン/ズーム/カメラリセット;
    ホバーでツールチップ・クリックで編集パネル; 軸ラベル・リスク・ステータスでフィルタ.
    Visual: small isometric SVG cube with risk-colored cells (a static stand-in; in the real app
    consider a mini R3F instance or a screenshot of CubePage).
  - **02 / TABLE VIEW — テーブルビュー.** Bullets: 列ソート・フィルタ; 3Dと同じデータをリアルタイム共有;
    High/Critical/未評価をワンクリック抽出. Visual: a mono data table with risk **pills**
    (Critical/High/Medium/未評価) — mirror the real `TablePage` columns: Asset, Interface, STRIDE, Risk.
  - **03 / EXPORT — エクスポート.** Bullets: High/Critical要約レポート自動生成; JSONで保存したモデルを読み込み.
    Visual: three export rows `.md` / `.csv` / `.json` with descriptions + a download glyph.
    These map 1:1 to `src/export/exportMarkdown.ts`, `exportCsv.ts`, `exportJson.ts`.

### 5. Domains strip (bg `#080b16`, hairline borders)
- Section head: eyebrow `BUILT FOR`, H2 `規制された組込みの世界へ。`
- A wrap of pill "domain chips" (each with a colored glowing dot, hover lifts -2px):
  組込み医療機器 / セキュアブート・信頼の起点 / ファームウェア・コード署名 / 製造プロビジョニング /
  サービス保守ワークフロー / PKI・HSM署名基盤 / 製品セキュリティ全般.

### 6. Local-first / Privacy (`#local`)
- A green radial glow bottom-left (`rgba(34,197,94,0.10)`) — the one place green appears, to
  signal "safe/private".
- Section head: eyebrow `PRIVACY BY DEFAULT`, H2 `データは、あなたのブラウザの中だけに。`,
  paragraph: no backend, all data in-browser, never transmitted.
- 3 cards (icon chip + title + body):
  - **サーバー送信なし** — no cloud/API; works offline.
  - **ローカル保存** — persisted to the browser's **IndexedDB** (the real app uses Dexie.js,
    see `src/db/dexie.ts`); survives reload.
  - **自分の手で持ち運ぶ** — JSON export/import for backup & sharing.

### 7. CTA (`#start`)
- Centered, large violet ellipse glow behind.
- Eyebrow `SEE THREATS EXCEL CANNOT SHOW`, H2 `重大な脅威から、対処しはじめる。` (last clause gradient),
  paragraph: インストール不要・ブラウザで開けば組込み医療機器のサンプルが立ち上がる。
- Primary **「ブラウザで開く」** (→ app) + ghost **「機能をもう一度見る」** (→ `#features`).
- Note (mono, faint): `無料 · ローカルファースト · アカウント登録なし`.

### 8. Footer
- Brand + tagline `See threats Excel cannot show. Visualize Asset × Interface × STRIDE risk in 3D.`
- Tech stack line (mono, faint): `React · Three.js · Zustand · Dexie.js (IndexedDB) · Tailwind`.
  (Note: the actual store is **Zustand** at `src/store/useProjectStore.ts` — keep the stack line truthful to the repo.)
- Two link columns (Product / Concept) of in-page anchors.

---

## Hero 3D Cube (the centerpiece)

**What it is:** a 5 (Asset, X) × 5 (STRIDE, Y) × 6 (Interface, Z) lattice of small cubes,
~44% of slots populated (sparse "data cube" look), each cell colored by risk level. A faint
violet wireframe cage wraps the whole volume; ~26 dim lattice dots add depth.

**Encoding (matches the real app's `risk.ts`):**
- **Color** = risk level → `RISK_COLORS` (not_assessed `#9ca3af`, low `#22c55e`, medium `#f59e0b`,
  high `#ef4444`, critical `#d946ef`).
- **Size** = risk score (bigger = higher). In the prototype, per-level base scales are
  na .60 / low .66 / med .78 / high .90 / crit 1.02 (×0.72). In the real app, drive size from
  `riskScoreToSize(score, level)`.
- **Emissive intensity** scales with severity; **high/critical cells gently pulse**
  (`scale ±6%`, `emissiveIntensity` oscillates, ~2.1 rad/s, random phase per cell).

**Materials & lighting:** `MeshStandardMaterial` (roughness 0.34, metalness 0.12, slight
transparency). Ambient `#5b6276` + a white directional key + two violet point lights
(`#8b5cf6`, `#a98bff`) for rim glow.

**Camera & controls:** PerspectiveCamera fov 38 at ~`(7.4, 5.2, 8.6)` looking at origin.
OrbitControls with damping, **pan & zoom disabled**, polar angle clamped to `0.24π–0.76π`.
**Auto-rotates** at speed 0.9; auto-rotate pauses while the user drags and resumes ~2.2s after
they let go. Cursor is `grab` / `grabbing`.

**Glow:** `EffectComposer` → `RenderPass` → `UnrealBloomPass(strength 0.85, radius 0.55,
threshold 0.08)`. Transparent clear color so the page bg shows through.

**Perf:** `setPixelRatio(min(dpr, 2))`. Pause the RAF loop via IntersectionObserver when the
cube scrolls off-screen. `ResizeObserver` keeps renderer/composer/bloom sized to the stage.

**WebGL fallback:** probe for a WebGL context; if unavailable, reveal a dashed
`.cube-fallback` placeholder instead of a blank canvas.

**Overlays (HTML, absolutely positioned over the canvas):** axis tags
`ASSET →` / `↑ STRIDE` / `INTERFACE ↗`, a `ドラッグで回転` hint (fades in once ready), and a
bottom legend (Critical/High/Medium/Low swatches). The stage is `aspect-ratio: 1/1`.

**Implementation note for the codebase:** rebuild this as an **R3F** component (the repo already
uses R3F/drei in `src/components/cube/` and `CubePage.tsx`). `@react-three/postprocessing`
provides `<EffectComposer><Bloom/>`. drei's `<OrbitControls autoRotate .../>` covers the
controls. Reuse `RISK_COLORS` / `riskScoreToSize` / `statusToOpacity` so the hero stays in sync
with the real cube. The bundled `hero-cube.js` is the **visual + math reference**, not the code to paste.

---

## Interactions & Behavior
- **Nav:** background/blur/border fade in on `scrollY > 24` (transition 0.3s).
- **Scroll reveal:** elements with `.reveal` start at `opacity:0; translateY(26px)` and animate to
  visible (0.7s, `cubic-bezier(0.22,0.61,0.36,1)`) when they cross into view (IntersectionObserver,
  threshold 0.12, `rootMargin 0 0 -8% 0`, unobserve after firing). Optional stagger via
  `data-d="1|2|3"` (delays 0.08/0.16/0.24s).
  ⚠️ **Must degrade gracefully:** under `prefers-reduced-motion: reduce`, force `.reveal` to
  visible with no transform/transition. Also ensure content is visible if JS fails.
- **Hover states:** buttons lift -2px with intensified shadow; cards lift -4px and brighten
  border/bg; export rows shift +4px right and gain violet border; domain chips lift -2px.
- **Smooth scrolling** for in-page anchor links (`scroll-behavior: smooth`, disabled under
  reduced-motion).
- **Cube:** auto-rotate + drag-to-orbit as described above.

---

## State Management
The LP itself is essentially **stateless** (scroll position drives reveals; the cube manages its
own animation state). No app data is needed to render it. The only "state" is whether the cube's
RAF loop is running (gated by viewport visibility).

When integrating: the CTAs are the handoff point to the app's real state
(Zustand `useProjectStore`, Dexie persistence). "ブラウザで開く" should route into the app and let
the existing seed-data flow (`src/domain/seedData.ts`) spin up the sample medical-device project.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| bg | `#05070f` | page background |
| bg-2 | `#080b16` | alt section bg (axes, domains) |
| panel | `rgba(148,163,184,0.045)` | card fill |
| panel-2 | `rgba(148,163,184,0.07)` | hover card fill |
| line | `rgba(148,163,184,0.12)` | hairline borders |
| line-strong | `rgba(148,163,184,0.22)` | stronger borders |
| text | `#e7ecf4` | primary text |
| muted | `#98a4b8` | secondary text |
| faint | `#5d6a82` | tertiary / mono labels |
| violet | `#8b5cf6` | brand accent |
| violet-bright | `#a98bff` | brand highlight / gradient |
| violet-deep | `#6d28d9` | deep accent |
| risk · not_assessed | `#9ca3af` | risk gray |
| risk · low | `#22c55e` | risk green |
| risk · medium | `#f59e0b` | risk amber |
| risk · high | `#ef4444` | risk red |
| risk · critical | `#d946ef` | risk magenta |

The risk-5 values are **already in `src/domain/risk.ts` → `RISK_COLORS`**. The slate/violet
values align with Tailwind's `slate-*` / `violet-*` scales — prefer Tailwind classes
(`bg-slate-950`, `text-violet-400`, etc.) when rebuilding.

### Typography
- **Headings & body:** Noto Sans JP (400/500/700), with `font-feature-settings: "palt" 1` for
  tighter Japanese kerning. (Latin fallback: Inter / system-ui.)
- **Labels, code, mono accents:** JetBrains Mono (400/500/700).
- H1 `clamp(38px,5.6vw,68px)` / 700 / ls -0.02em. Section H2 `clamp(28px,4.2vw,46px)` / 700.
  Feature H3 `clamp(24px,3vw,32px)`. Body 16–18px, line-height 1.7. Eyebrows 12px mono,
  ls 0.22em, uppercase.

### Spacing & radius
- Container: `min(100% - 48px, 1200px)`. Section padding: 96px (`.block`), 72px (`.block-tight`).
- Card radius 16px; buttons 11px; pills 999px; feature visuals 18px.
- Card padding 26–28px; button padding 13×22px.

### Shadows / effects
- Primary button: `0 0 0 1px rgba(167,139,255,0.3), 0 12px 34px -12px rgba(139,92,246,0.85)`
  (intensifies on hover).
- After-card glow: `0 0 60px -28px rgba(139,92,246,0.8)`.
- Feature visual: `0 40px 80px -50px rgba(0,0,0,0.9)`.
- Section glows: large blurred radial gradients (violet in hero/CTA, green in local-first).

---

## Assets
- **`favicon.svg`** — the ThreatCube mark (dark rounded square + violet cube glyph). Already in
  the repo at `public/favicon.svg`; reuse it.
- **No raster images.** All visuals are CSS/SVG or the live WebGL cube. The feature-card mocks
  (cube SVG, table, export rows) are hand-built HTML/SVG stand-ins — in the real app you may
  swap them for screenshots of the actual `CubePage` / `TablePage` / `ExportPage`.
- **Fonts** load from Google Fonts (Noto Sans JP, JetBrains Mono). The repo can keep that or
  self-host to match its existing font strategy.

---

## Files in this bundle (design references)
- **`ThreatCube LP.html`** — the full page markup, copy, and section structure. The source of
  truth for layout, content, and Japanese copy.
- **`styles.css`** — all visual styling with CSS custom properties at the top (the token list
  above is derived from `:root` here). Reference for exact values; reimplement via Tailwind.
- **`hero-cube.js`** — the Three.js hero-cube reference (geometry, risk encoding, lighting,
  OrbitControls config, bloom, perf gating, WebGL fallback). Rebuild as R3F in the codebase.
- **`favicon.svg`** — the brand mark.

To view the prototype: open `ThreatCube LP.html` in a browser (needs network for Google Fonts
and the Three.js CDN module import).

---

## Recommended integration steps
1. Decide routing: LP at `/` (move dashboard to `/dashboard` or gate behind a CTA), or LP at `/welcome`.
2. Build the LP as a React page (e.g. `src/pages/LandingPage.tsx`) composed of small section
   components, styled with Tailwind. Pull copy verbatim from `ThreatCube LP.html`.
3. Build `HeroCube` as an R3F component under `src/components/cube/`, reusing `RISK_COLORS`,
   `riskScoreToSize`, `statusToOpacity`. Lazy-load it like `CubePage` so the 3D chunk stays out
   of the initial bundle.
4. Wire CTAs ("3Dで試す", "ブラウザで開く") to the in-app route (`/#/cube` or `/#/`).
5. Port the scroll-reveal as a small `useReveal` hook (IntersectionObserver) with a
   `prefers-reduced-motion` guard.
6. QA: no horizontal overflow (hero glow), reveals fire and degrade under reduced-motion, cube
   falls back cleanly without WebGL, Japanese copy renders with `palt`.
