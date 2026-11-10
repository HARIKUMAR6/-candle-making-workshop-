# Ember & Wick — Design System & Architecture (Phase 01)

> Living reference: run `npm run dev` and open `http://localhost:5173/styleguide.html`.
> Every value in this document is defined once in `src/css/tokens.css` / `src/css/theme.css`.

---

## 1. Creative direction — "Candlelit Atelier"

**The brand in one line:** a small studio where you learn to make candles slowly and by hand, then take that calm home.

The site should feel like a **craft journal kept by a perfumer**: editorial pages, generous but controlled whitespace, warm light falling on real materials. It is *not* a shop template and *not* a SaaS landing page.

### What we took from the research

| Reference territory | What we borrow | What we avoid |
|---|---|---|
| Heritage candle houses (wax-seal labels, oval monograms, apothecary jars) | Restraint, a confident serif, small caps labels, label-like metadata | Luxury coldness, black-and-gold clichés |
| Modern indie candle brands | Warm, tactile colour; playful italic accents | Pastel candy palettes, novelty type |
| Craft & workshop studios | Process-led storytelling with numbered steps and hands at work | Generic "class cards" grids, stock smiling groups |
| Editorial magazines (slow-living, interiors) | Asymmetric grids, big type against small captions, image-led pacing | Endless whitespace, unreadably light grey text |

### Signature motifs (use deliberately, not everywhere)

1. **The arch.** It reads as a candle flame and a chapel window. It's the hero and feature image frame (`.frame-arch`). Use it at most **once or twice per page**.
2. **The wick line.** A short 1px rule that leads every eyebrow label (`.eyebrow::before`). It flips automatically in RTL.
3. **Italic accent words.** One Cormorant italic word or phrase in a headline (`<em class="accent-word">`). Never more than one per heading.
4. **Numbered sequences.** `01 / 02 / 03` for process steps, menus and workshop stages. These suit a craft that has real steps.
5. **Warm-graded photography.** A consistent grade (`.img-graded`) so mixed sources read as one shoot.

### Home 01 vs Home 02 (direction for the page phases)

Both pages carry the full story: craft, workshops, kits, about, and contact or booking. They tell it differently:

- **Home 01 — "The Atelier" (product & craft led).** Arch-framed hero with a lit candle and a split editorial headline. An asymmetric "what we make" spread, then workshop formats as an editorial list (not cards). Kits get a single hero object with its contents laid out, then founder notes and a booking band.
- **Home 02 — "Studio Stories" (experience & journey led).** A cinematic full-bleed hero of hands pouring wax, with type overlaid on a scrim. A horizontal "evening at the studio" timeline (arrive → blend → pour → cure). Then voices from makers, kits as "continue at home", and a closing calendar-style session strip.

No section layout is repeated between the two.

---

## 2. Project architecture

**Stack:** HTML5 · Tailwind CSS v4 via the **Tailwind CLI** (`@tailwindcss/cli`) · vanilla JavaScript ES modules. No framework, no bundler, no runtime dependencies.

```
Candle Making Workshop/
├── index.html, home-2.html, about.html,      ← pages live at the web root (Phase 02+)
│   workshops.html, kits.html, contact.html
├── styleguide.html                            ← living design-system reference (noindex)
├── src/
│   └── css/                                   ← Tailwind SOURCE (not served)
│       ├── main.css         entry: imports + @source + custom variants
│       ├── tokens.css       raw semantic tokens, light/dark/RTL overrides
│       ├── theme.css        Tailwind @theme: maps tokens → utilities; scales
│       ├── base.css         element defaults
│       ├── components.css   reusable brand primitives (.btn, .frame, .field…)
│       └── utilities.css    custom @utility (flip-rtl, surface-*, img-focus-*)
├── assets/                                    ← everything that is served
│   ├── css/styles.css       COMPILED output (do not edit)
│   ├── js/
│   │   ├── preferences.js   pre-paint theme/dir (classic script, blocking, tiny)
│   │   ├── main.js          module entry for every page
│   │   ├── core/            storage.js, theme.js, direction.js, disclosure.js
│   │   ├── components/      site-header.js, site-footer.js, partials.js (logo + toggles), icons.js
│   │   ├── data/site.js     brand + nav: single source of truth
│   │   └── pages/           page-specific modules (styleguide.js, …)
│   ├── images/              see §8 for sub-folders and naming
│   ├── icons/favicon.svg    theme-aware favicon
│   └── fonts/               reserved for self-hosted WOFF2 (see §11)
├── scripts/
│   ├── serve.mjs            zero-dependency static server (allowlist: root *.html + /assets)
│   └── dev.mjs              Tailwind watch + server together
└── docs/
    ├── DESIGN-SYSTEM.md
    └── CONTENT-NEEDS.md     business facts still to confirm (nothing invented)
```

**Commands**

| Command | Purpose |
|---|---|
| `npm run dev` | Build once, then watch CSS and serve on :5173 |
| `npm run build` | Minified production CSS → `assets/css/styles.css` |
| `npm run serve` | Static server only |

ES modules need http(s): open pages through the server, not `file://`.

> **Watch mode must be `--watch=always`.** Tailwind v4's plain `--watch` exits as soon as stdin closes (background terminals, editors, CI) — after truncating the output file, which silently ships an empty `styles.css`. `scripts/dev.mjs` runs the CLI through `node` directly (no shell, no `npx`) so stopping dev also stops the watcher.

### Page head template (every page)

```html
<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page · Ember &amp; Wick</title>
  <meta name="description" content="…">
  <meta name="color-scheme" content="light dark">
  <link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
  <script src="assets/js/preferences.js"></script>          <!-- 1. pre-paint, blocking -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Fraunces:opsz,wght@9..144,300..600&family=Manrope:wght@400..700&family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;600&display=swap">
  <link rel="stylesheet" href="assets/css/styles.css">
  <script type="module" src="assets/js/main.js"></script>   <!-- 2. components + controllers -->
</head>
<body data-page="workshops">   <!-- marks the current nav item -->
  <site-header></site-header>
  <main id="main">…</main>      <!-- add pt-header unless the hero sits under the header -->
  <site-footer></site-footer>
</body>
</html>
```

---

## 3. Colour system

Two layers:

1. **Raw tokens** (`--c-*`) in `tokens.css`. These are the only place hex values live, and each theme overrides them.
2. **Tailwind colours** in `theme.css` (`@theme inline`). The default Tailwind palette is **removed** (`--color-*: initial`), so only brand tokens exist. Utilities resolve to live variables, so switching themes needs **no `dark:` variants** for colour.

| Role | Tailwind utility | Token |
|---|---|---|
| Page background | `bg-page` | `--c-page` |
| Section background | `bg-section`, `bg-section-alt`, `bg-inverse` | `--c-section`, `--c-section-alt`, `--c-section-inverse` |
| Cards / panels | `bg-surface`, `bg-surface-raised` | `--c-surface`, `--c-surface-raised` |
| Headings | `text-ink` | `--c-ink` |
| Body text | `text-text` | `--c-text` |
| Secondary text | `text-muted` | `--c-text-muted` |
| Accent / links | `text-accent`, `bg-accent`, `bg-accent-soft` | `--c-accent`, `--c-link` |
| Borders | `border-line`, `border-line-strong` | `--c-border`, `--c-border-strong` |
| Image scrim | `bg-overlay` | `--c-overlay` |
| Buttons | `.btn-primary` / `.btn-accent` / `.btn-secondary` | `--c-btn-*` |
| Form fields | `.input` `.select` `.textarea` | `--c-field-*` |
| Focus | `:focus-visible` (global) | `--c-focus-ring` |

### Light — "Beeswax & Linen"

| Token | Hex | Use |
|---|---|---|
| page | `#FBF7F0` | warm ivory canvas |
| section | `#F4ECDF` | cream band |
| section-alt | `#EADDC8` | soft beige feature band |
| section-inverse | `#2A1C13` | deep brown drama band |
| surface | `#FFFDF9` | cards, fields |
| ink | `#2A1C13` | headings |
| text | `#3B2B20` | body |
| text-muted | `#6A5444` | secondary |
| accent | `#9A4521` | ember terracotta: links, accent CTAs |
| accent-hover | `#7E3717` | |
| accent-soft | `#F3E0CF` | tags, tints |
| honey | `#C98B2B` | flame, decorative **only** (never text) |
| sage | `#56654A` | botanical secondary accent, "beginner" |
| border | `#E2D4BF` | hairlines (decorative) |
| border-strong | `#8C7558` | form control outlines |
| error | `#A3261B` | |

### Dark — "Candlelit Studio"

| Token | Hex | Use |
|---|---|---|
| page | `#16110E` | charcoal-chocolate |
| section | `#1D1713` | |
| section-alt | `#271E18` | |
| section-inverse | `#F3E9DA` | inverse bands flip to ivory |
| surface | `#231B16` | |
| ink | `#F6EEE1` | soft ivory headings |
| text | `#EADFCD` | |
| text-muted | `#BCAA94` | |
| accent | `#E3A25B` | candlelight amber |
| accent-hover | `#EDB678` | |
| accent-soft | `#3A2717` | |
| sage | `#A9B794` | |
| border | `#382C23` | |
| border-strong | `#857059` | |
| error | `#F08A7E` | |

### Verified contrast (WCAG 2.2)

Every pair was computed during Phase 01:

| Pair | Light | Dark | Requirement |
|---|---|---|---|
| ink on page / section / section-alt / surface | 15.4 / 14.1 / 12.3 / 16.2 | 16.3 / 15.4 / 14.2 / 14.7 | AA 4.5 ✔ |
| text on all surfaces | ≥ 10.1 | ≥ 12.4 | ✔ |
| text-muted on all surfaces | ≥ 5.3 | ≥ 7.3 | ✔ |
| accent on all surfaces | ≥ 4.8 | ≥ 7.5 | ✔ |
| sage on all surfaces | ≥ 4.7 | ≥ 7.7 | ✔ |
| placeholder on field | 5.5 | 5.3 | ✔ |
| field border vs field / page | 4.3 / 4.1 | 3.6 / 4.0 | non-text 3:1 ✔ |
| primary button label | 15.4 | 14.8 | ✔ |
| accent button label (rest / hover) | 6.1 / 8.2 | 8.4 / 10.2 | ✔ |
| ivory caption on image scrim | ≥ 12 | ≥ 12 | ✔ |

**Never colour alone:** current nav item = underline mark plus `aria-current`; field errors = thicker inline-start border, icon and message text; tags always carry words; disabled = reduced opacity plus `disabled` / `aria-disabled`.

---

## 4. Typography

| Role | Family | Weight | Token / class |
|---|---|---|---|
| Primary heading (display, h1–h3) | **Fraunces** (variable, optical size) | 300–400 | `font-display`, `text-display/h1/h2/h3` |
| Secondary heading / accent | **Cormorant Garamond** *italic* | 500–600 | `font-accent`, `.accent-word` |
| Body | **Manrope** | 400 | `font-sans`, `text-body`, `.lead` |
| Navigation | Manrope | 600 · 15px | `.nav-link` |
| Buttons | Manrope | 600 · 15px · +0.01em | `.btn` |
| h4, labels | Manrope | 600 | `text-h4`, `.field-label` |
| Eyebrow / small / caption | Manrope | 700 caps +0.18em / 400 / 400 | `.eyebrow`, `text-small`, `text-caption` |
| RTL display / accent | **Amiri** | 400–700 | auto via `[dir=rtl]` |
| RTL body / UI | **IBM Plex Sans Arabic** | 400–600 | auto via `[dir=rtl]` |

**Why these fonts.** Fraunces has soft, slightly "wonky" old-style curves that feel hand-made without being twee. Its optical sizing keeps large headlines delicate. Cormorant italic adds the calligraphic flourish of a hand-written label. Manrope is a warm geometric sans that stays readable at small sizes and contrasts cleanly with both serifs.

### Fluid scale (360 px → 1440 px viewport)

| Token | Min → Max | Line height |
|---|---|---|
| `text-display` | 44 → 100 px | 0.98 |
| `text-h1` | 36 → 72 px | 1.04 |
| `text-h2` | 30 → 52 px | 1.10 |
| `text-h3` | 22 → 32 px | 1.20 |
| `text-h4` | 18 → 22 px | 1.30 |
| `text-lead` | 17 → 21 px | 1.60 |
| `text-body` | 16 px | 1.70 |
| `text-small` | 14 px | 1.55 |
| `text-caption` | 12 px | 1.40 |

**Rules.** Body copy should run 45–75 characters (`max-w-[65ch]`). Never set body text below 16 px. Headings use `text-wrap: balance` and paragraphs use `pretty`. In RTL, negative tracking and uppercase transforms are removed and line height increases.

---

## 5. Spacing & containers

Spacing uses Tailwind's 4 px base (`p-4` = 16 px) plus named fluid tokens:

| Token | Value | Use |
|---|---|---|
| `gutter` (`px-gutter`) | 16 → 40 px | page side padding (inside every shell) |
| `section` (`py-section`, `.section`) | 64 → 128 px | standard section rhythm |
| `section-sm` (`.section-sm`) | 48 → 80 px | tighter bands, footer, follow-ups |
| `stack` (`gap-stack`) | 24 → 40 px | vertical rhythm inside sections |
| `header` (`h-header`, `pt-header`) | 72 px | fixed header offset |

| Shell | Max content width | Use |
|---|---|---|
| `.shell-prose` | 640 px | long reading |
| `.shell-narrow` | 832 px | forms, contact, FAQs |
| `.shell` | 1216 px | default |
| `.shell-wide` | 1440 px | editorial imagery, full-bleed compositions |

### The alignment rule (verified)

**Every horizontal edge on every page comes from a `.shell*` class.** Header, main content and footer all use `.shell`, and at every tested width (320–1920 px, LTR and RTL) their content edges match to the pixel. For future sections:

- **Full-bleed backgrounds and images are fine.** Put the colour or image on the `<section>`, and its *content* inside a `.shell` (or `.shell-wide` / `.shell-narrow` when the design calls for it).
- **Never add `px-*` to a section to create side padding.** The gutter lives only in the shells. Never set a `max-w-*` page container by hand.
- Inside a shell, use grids and columns freely. To bleed one image to the viewport edge, take it out of the shell rather than using negative margins.

**Anti-patterns.** Don't nest shells. Don't put a section's text in a wider container than its imagery calls for. Don't stack two `.section` bands with the same background (alternate page → section → section-alt).

### Radius

`xs 4` · `sm 8` (fields) · `md 14` (images) · `lg 22` (panels) · `xl 32` (notch corners) · `pill` (buttons, tags). Plus the arch: `999px 999px 14px 14px`.

---

## 6. Responsive strategy

Mobile-first `min-width` breakpoints (the Tailwind defaults are replaced):

| Name | Min width | Device class | Key layout changes |
|---|---|---|---|
| base | 0 | phones | single column, stacked media, mobile sheet nav |
| `sm` | 576 px | large phones | theme/dir toggles visible in header, 2-up small grids |
| `md` | 768 px | tablet portrait | 12-col grid begins, header CTA appears |
| `lg` | 1024 px | tablet landscape / laptop | full desktop nav, asymmetric editorial splits |
| `xl` | 1280 px | desktop | wider gutters, max type sizes approach |
| `2xl` | 1536 px | large desktop | content capped by shells, never stretches |

- **Type and spacing are fluid** (`clamp()`), so few breakpoint overrides are needed.
- **Grids:** use a 12-column grid from `md`. Below that, everything stacks in reading order. Visual reordering uses `order-*` only when DOM order stays logical.
- **Images:** ratios can change per breakpoint (e.g. `aspect-landscape md:aspect-cinema`). Crops keep their focal point via `img-focus-[x_y]`.
- **Overflow guard:** `body { overflow-x: clip }` plus shells with gutters. Never use `100vw` widths (scrollbar overflow). Use `w-full` inside shells or full-bleed sections outside them.
- **Touch targets:** at least 44 px (`.btn` 48 px, `.icon-btn` 44 px).

---

## 7. RTL / LTR strategy

1. **Single switch:** `<html dir="ltr|rtl">`. It's saved by `core/direction.js` and applied pre-paint by `preferences.js`. Any `[data-dir-toggle]` button toggles it.
2. **Logical properties only.** CSS uses `margin-inline`, `padding-inline`, `inset-inline-*`, `border-inline-start`, `text-align: start`. Tailwind equivalents: `ms-* me-* ps-* pe-* start-* end-* text-start rounded-s-* border-s-*`. **Don't use `ml-/mr-/pl-/pr-/left-/right-/text-left`** (review rule).
3. **Flex and grid flip automatically.** Source order follows reading order, and `justify-between` / `gap` mirror on their own.
4. **Transforms aren't logical.** Use the `rtl:` variant or a component rule (see `.offcanvas-sheet`, `.link-arrow` hover).
5. **Icons:** directional icons (arrows, chevrons pointing along the reading direction, and the menu icon's short bar) use `flip-rtl`. Never mirror the logo, social marks, clocks, play buttons, checkmarks or images of real objects.
6. **Typography:** in RTL, Arabic glyphs fall back to Amiri and IBM Plex Sans Arabic. Latin families stay first in the stack, because fallback works per glyph: English and numbers keep the brand faces. Letter-spacing and uppercase are removed and line height is raised.
   - **The logo never changes.** The lockup has `dir="ltr" lang="en"` and uses `--ff-brand`, which isn't touched by RTL.
7. **Mixed-direction text.** In RTL, text blocks (`p`, headings, `li`, labels…) get `unicode-bidi: plaintext`, so each block takes its base direction from its own content. English sentences keep their punctuation ("materials." not ".materials") and Arabic stays RTL.
   - Line alignment still follows the layout through `text-align: match-parent` plus `-webkit-match-parent`. Chrome computes the standard keyword as `start`, which is paragraph-relative, so the prefixed keyword is required. This was verified in Chrome.
   - Codes, emails and phone numbers are wrapped in `<span class="bidi-ltr">` (or use `<code>`).
   - **Don't** set `text-align: right` globally.
8. **Forms:** inputs use `text-align: start`. The select chevron moves to the left in RTL. Error emphasis uses `border-inline-start`.
9. **Images:** asymmetric frames (`.frame-notch`) use logical corner radii, so they mirror. Image *content* isn't flipped.
10. **Nav:**
    - The mobile sheet anchors to the **inline-start** edge, so it slides in from the left in LTR and from the right in RTL. Its close button sits at the sheet's inner (inline-end) edge.
    - The Home dropdown anchors to `start-0` of its button, so it extends toward the reading direction.

---

## 8. Image art direction

### Visual language

- **Light:** warm (2700–3200 K) window or candle light. Soft directional shadows and shallow depth of field.
- **Palette in-frame:** beeswax, linen, oak, clay, amber glass, dried botanicals. Nothing neon, no clinical white seamless backgrounds.
- **Subjects:** hands at work over faces posing. Materials in close-up. Real studio clutter, styled with restraint.
- **Grade:** `.img-graded` (slight desaturation plus warmth) applies to every photo so sources match.
- **Reject list:** generic office or business stock, unrelated lifestyle shots, the same image reused on several pages, AI-looking glossy renders, watermarked or low-resolution files.

### Categories → where they're used

| Category | Primary use | Ratio | Frame |
|---|---|---|---|
| Hero lit candle / styled still life | Home 01 hero, Kits hero | 4:5 | `frame-arch` |
| Wax pouring, hands at work | Home 02 hero, Workshops | 21:9 desktop → 3:2 mobile | `frame` + `frame-scrim` |
| Workshop sessions (groups at bench) | Workshops, Home sections | 4:3 | `frame-notch` |
| Fragrance oils, wicks, wax flakes (macro) | Process steps, details | 1:1 | circle (`rounded-pill`) or `frame` |
| DIY kits flat-lay & contents | Kits, Home kit features | 4:5 or 3:2 | `frame` |
| Studio environment | About, Contact | 3:2 or 2:3 | `frame` |
| Artisan product shots | Kits, Home | 4:5 | `frame`, `frame-hover` |

### Treatment rules

- **Cropping:** set a focal point with `img-focus-[x_y]` (e.g. keep the flame in frame). Never crop through a flame or a hand's fingertips.
- **Radius:** images use `md` (14 px). The arch and notch are for featured images only. Small thumbnails use `sm`.
- **Overlays:** only where text sits on the image (`.frame-scrim` + `.frame-caption`). No decorative colour washes.
  - `.frame-caption` carries its own full-strength scrim behind every line of text, so contrast never depends on the photo or the frame height.
  - Measured worst case (ivory text over a pure-white image at 320 px, light theme): 4.88:1.
- **Hover:** `.frame-hover` gives a 4% scale over 900 ms. Use it only on clickable images. It's disabled under reduced motion.
- **Loading:** `.frame` shows a warm beige fill until the image loads, so there's no white flash.

### Responsive delivery

Pattern used on the homepages (WebP only; every supported browser handles it, and one format keeps the repo lean):

```html
<figure class="frame frame-arch aspect-portrait">
  <img src="assets/images/hero/jar-candle-twine-960.webp"
       srcset="…-480.webp 480w, …-960.webp 960w, …-1440.webp 1440w, …-2048.webp 2048w"
       sizes="(min-width: 64rem) 46vw, 92vw" width="960" height="640"
       alt="A hand-poured candle in a glass jar tied with red twine, glowing by an evening window"
       loading="lazy" decoding="async" class="img-graded img-focus-[60%_50%]">
</figure>
```

- **Widths:** 480 / 960 / 1440 / 2048.
- **Loading:** always set `width` and `height` (no layout shift). Use `loading="lazy"` everywhere except the hero image, which gets `loading="eager" fetchpriority="high"` plus a matching `<link rel="preload" … imagesrcset>` in the `<head>`.
- **Folders:** `assets/images/{hero,workshops,process,studio,gallery,community,kits}/`.
- **Naming:** `subject-descriptor-width.webp`, e.g. `wax-melt-pool-1440.webp`.
- **Provenance:** every file is listed in `assets/images/CREDITS.md` (source page, photographer, verified licence) together with the **photo-pending checklist**. Missing subjects use `.photo-pending` inside the final `.frame`, so a real photo drops in without layout changes.
- **Alt text** describes what the image shows and why it's there. Decorative textures get `alt=""`.

---

## 9. Reusable component strategy

Three tiers keep the code DRY without a framework:

| Tier | Where | Examples | When to use |
|---|---|---|---|
| **Tokens** | `tokens.css` / `theme.css` | colours, type, spacing, radius, motion | every visual decision |
| **CSS components** | `components.css` | `.btn*`, `.link`, `.link-arrow`, `.eyebrow`, `.accent-word`, `.lead`, `.tag*`, `.field*`, `.input/.select/.textarea`, `.frame*`, `.hero`, `.hero-title`, `.hero-actions`, `.hero-scrim`, `.photo-pending`, `.timeline`, `.site-header`, `.nav-link`, `.dropdown-link`, `.mobile-link`, `.offcanvas*`, `.footer-heading`, `.footer-link`, `.shell*`, `.section*` | a brand decision repeated in 3+ places |
| **Surface utilities** | `utilities.css` | `surface-inverse` (re-colours eyebrows, accents, buttons, links and borders inside the band), `on-image` (copy on photography; works with variants, e.g. `lg:on-image`) | backgrounds that change what sits on them |
| **JS custom elements** | `assets/js/components/` | `<site-header>`, `<site-footer>`, `partials.js` (logo, theme toggle, direction toggle), `icons.js` | markup shared across every page, or with behaviour |
| **Behaviour modules** | `assets/js/core/` | `theme.js`, `direction.js`, `disclosure.js`, `storage.js` | logic reused by more than one component |
| **Utilities in HTML** | page files | layout grids, one-off spacing | page-specific composition |

Rules:

- Custom elements render into the **light DOM** so Tailwind classes apply. Data comes from `data/site.js`.
- Behaviour hooks use `data-*` attributes (`data-theme-toggle`, `data-dir-toggle`, `data-menu-open`), never styling classes.
- New components emit events namespaced `ew:*` (e.g. `ew:themechange`, `ew:controls-rendered`).
- **Listener hygiene.** Components render once (`data-rendered`). Every listener is bound with an `AbortSignal`, which is aborted in `disconnectedCallback`. `initTheme()` and `initDirection()` are idempotent. Re-attaching an element never duplicates handlers, and this is tested.

### Shared header: behaviour contract

| Feature | Behaviour |
|---|---|
| Height | Exactly `--header-h` (72 px) including its border; fixed. Transparent at the top of the page, then a translucent page-colour surface with a hairline once scrolled. |
| Home dropdown | Contains **Home 01** and **Home 02** only. Closed by default and opens only on click. Closes on selection, outside pointer-down, Esc (focus returns to Home) and Tab-out. ↓/↑ on the button open it and focus the first/last link; inside, ↓/↑ cycle and Home/End jump. No layout shift. |
| Mobile menu (< 1024 px) | Modal sheet from inline-start: `role="dialog"`, `aria-modal`, `inert` when closed. Focus goes to the close button on open, and Tab is trapped. Closes via Esc, the backdrop, the close button, any link, or growing to the desktop layout. Background scroll is locked through `html[data-scroll-lock]`, and `scrollbar-gutter: stable` means locking causes no layout shift. Home is an accordion with the same two links. |
| Theme toggle | `aria-pressed` with the stable name "Dark theme". Every toggle on the page stays in sync. |
| Direction toggle | Shows the current direction. Its accessible name is "Text direction: LTR/RTL", which includes the visible text. |

### Shared footer: structure

1. A closing invitation (headline and booking CTA).
2. Brand: logo, intro and social links (Instagram, Pinterest, YouTube; these open in a new tab, which is announced). Explore: all six pages in two columns. Contact: email and "Plan a visit".
3. Legal line plus the theme and direction toggles.

Columns: stacked on phones; at `md`, brand spans the full row with Explore | Contact below; at `lg`, a 5 / 3 / 3 split on the 12-column grid.

**Planned for the page phases** (built when the first page needs them, not before): section heading pattern, workshop session row, kit feature block, numbered process steps, testimonial, FAQ (`<details>`-based), newsletter strip, contact form validation module, scroll-reveal (respects reduced motion).

---

## 10. Accessibility baseline

- Skip link, `<main id="main">`, one `<h1>` per page, landmarks labelled (`Primary`, `Mobile`, `Footer`).
- Visible `:focus-visible` ring in both themes.
- Disclosure nav and mobile menu: see the header behaviour contract in §9.
- Current page is shown by an underline mark plus `aria-current="page"`, not by colour alone.
- Theme switches happen in one frame (`html[data-theme-switching]` suspends transitions), so surfaces never fade at different speeds.
- `prefers-reduced-motion` disables transitions and animations globally.
- **Phase 02 audit:** axe-core reported 0 WCAG 2.2 AA violations across 16 rendered states (4 theme/direction combinations × closed, dropdown open, scrolled, and mobile menu open with Home expanded).

---

### Hero viewport strategy (Phase 03, applies to every homepage)

- **One class sizes every hero:** `.hero` sets `min-block-size: clamp(34rem, 100svh, 60rem)`. Heroes start under the fixed header, which already sits inside that box.
  - It's a *minimum* height, so if text wraps further than designed, the hero grows instead of clipping.
  - Above 60rem (≈1080px-tall screens and tall tablets) the next section starts to show.
- **Headline size tracks height too:** `.hero-title` uses `clamp(2.125rem, min(1.4rem + 3.6vw, 9svh), 4.75rem)`, so short laptops (1366×768, 1280×800) keep the headline and CTAs in the first view.
- **The same amount of photography on phones:** `--hero-media-min` (`clamp(7.5rem, 24svh, 18rem)`) is reserved on both heroes. Home 01 puts its arch below the copy; Home 02 leaves that band of the photo clear above the copy (and its scrim is solid everywhere else). This keeps the two heroes equal even when the copy outgrows a small screen.
- **Copy length is part of the system:** both hero headlines and leads are kept to matching lengths (headline ≈ 35 characters, lead ≈ 112). A much longer line on one page will make its hero taller on small phones.
- **CTAs:** `.hero-actions` stacks equal full-width buttons below `sm`, then sits inline.

Verified in Phase 03 at 1920×1080, 1440×900, 1366×768, 1280×800, 1024×768, 768×1024, 576, 430, 390, 375 and 320 widths. In LTR the two heroes are identical in height at every one, including 320×568.

### Homepage section map

| # | Home 01 — product & craft | Home 02 — an evening at the studio |
|---|---|---|
| 1 | Split hero: headline + arch photo + circular detail | Full-bleed photo, direction-aware scrim, journey chips |
| 2 | Intro: notch photo ← text | Welcome: text → arch photo with overlapping detail |
| 3 | Workshops: numbered editorial rows with thumbnails | Journey: 4-stage icon timeline (vertical on phones) |
| 4 | The art: staggered 4-image composition on inverse band | Workshops: "choose your evening" menu beside a tall photo |
| 5 | Kits: wide photo + purpose list | Gallery: mixed-proportion "what you can create" |
| 6 | Process: sticky heading + photo, 5 numbered steps | Kits: "the craft doesn't end" on inverse band |
| 7 | Why: statement + 2×2 values on rules | People & craft: centred statement, photo + principles |
| 8 | Studio story: cinematic photo, caption on scrim (lg+) | Why join: 3 icon columns divided by rules |
| 9 | Community: text + photo | Community: wide photo, caption set beside it |
| 10 | Centred typographic CTA on inverse band | Split booking finale: oversized headline + flame photo |

Both pages hide the footer's closing invitation (`<site-footer data-invitation="off">`) because they end with their own booking section.

### About & Contact section map (Phase 04, exactly six sections each)

| # | About (`about.html`) | Contact (`contact.html`) |
|---|---|---|
| 1 | Hero: copy in shell; photo **bleeds to the inline-end edge** from `lg` | Hero: centred copy above a **wide photo band** |
| 2 | Our story: wide statement → photo + 2×2 short notes | Contact details: rendered from `site.js` (confirmed values only) |
| 3 | Approach: **triptych**, craft notes flanking a central arch | Enquiry / booking form (`#enquiry`) |
| 4 | Studio experience: inverse band, photo **bleeds to the inline-start edge** | Interactive map (OpenStreetMap embed, confirmed location only) |
| 5 | What we offer: 7/5 split, workshop formats list · kits | Visiting the studio: photo + address/hours/directions once confirmed |
| 6 | Signature row: round photo · headline · stacked CTAs | Bordered panel CTA (presets a workshop enquiry) |

All four heroes use `.hero` + `.hero-title` + `.hero-actions` + `--hero-media-min`, so they're the same height by
construction (verified at every required viewport; see the Phase 04 report).

### Contact integrations (one configuration point: `assets/js/data/site.js`)

- **Contact details** (`components/contact-details.js`): each value has `confirmed: true|false`. Unconfirmed values are either hidden or carry a visible "to be confirmed" tag. Nothing is invented.
- **Map** (`components/studio-map.js`): an OpenStreetMap `export/embed` iframe (no API key, no dependency). It renders **only** when `contact.location.confirmed === true` and has numeric `lat`/`lng`; otherwise it shows a pending state. `renderStudioMap(container, location)` is exported, so the code path can be tested with sample coordinates without shipping them.
- **Enquiry form** (`components/enquiry-form.js`):
  - **Semantic, labelled fields** with an error summary that links to each field, plus per-field errors (text + icon + border).
  - **Validation** on blur and on submit.
  - **Booking-only fields** sit in `<fieldset data-show-when="workshop">`, which is disabled while hidden, so its fields are neither validated nor sent.
  - **Pre-fill:** `?enquiry=<format-id>|kits|general` pre-fills the form, and `<a data-preset="workshop">` does the same in-page.
  - **Submission:** sends `POST` FormData to `forms.enquiryEndpoint`, with a duplicate-submit guard and a honeypot.
  - **No endpoint configured:** it says nothing was sent and offers a prefilled `mailto:`.
  - **Success:** the message states it is *not* a booking confirmation.
- **Form components** in `components.css`: `.choice` (radio tiles: border + inset bar + tint when checked, native dot visible), `.notice` / `.notice-success|error|info`, `.spinner`. `.field` now uses `align-content: start`, so inputs keep equal heights when a row-mate has a hint.
- **Bidi in form fields:** free-text inputs use `dir="auto"` (an English entry reads correctly in RTL). Email and phone use `dir="ltr"`.

---

## 11. Known gaps / next steps

- **Photography:** the homepages use 21 verified CC0 stand-ins and 5 photo-pending slots (see `assets/images/CREDITS.md`). Replace them with the studio's own shoot before launch.
- **Business details** still to confirm are listed in `docs/CONTENT-NEEDS.md`.
- **Fonts** load from Google Fonts. Self-host WOFF2 subsets in `assets/fonts/` before launch (performance and privacy).
- **Nav links** point to pages not built yet, so they 404 until the page phases.
- **Social links** in `data/site.js` point to the networks' home pages. Replace them with the studio's real profile URLs before launch.
- **RTL** is fully supported in layout. Real Arabic or Hebrew copy needs translation; the toggle currently mirrors English content to prove the layout.
