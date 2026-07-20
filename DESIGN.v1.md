---
version: alpha
name: briefloop.ai
description: Restrained developer-tool design system for the BriefLoop marketing and docs site. Light warm paper, editorial type, hairline rules, one brand green. Bilingual zh-CN / en.

colors:
  primary: "#006838"
  brand-deep: "#05351d"
  brand-hover: "#0a4a29"
  brand-wash: "rgba(0, 104, 56, 0.07)"
  brand-line: "rgba(0, 104, 56, 0.35)"
  paper: "#faf9f6"
  paper-deep: "#f3f1ec"
  surface: "#ffffff"
  ink: "#1e1c19"
  ink-soft: "#38352f"
  muted: "#66625b"
  faint: "#8f8a81"
  line: "rgba(30, 28, 25, 0.14)"
  line-soft: "rgba(30, 28, 25, 0.07)"
  pass: "#2c7a4b"
  pass-wash: "rgba(44, 122, 75, 0.09)"
  warn: "#a8540a"
  warn-wash: "rgba(168, 84, 10, 0.09)"
  block: "#c2401f"
  block-wash: "rgba(194, 64, 31, 0.08)"
  dark: "#0e241a"
  dark-text: "#eef3ee"
  dark-muted: "#b6c5ba"
  term-bg: "#101613"
  term-text: "#d7ded8"
  term-muted: "#8b968d"
  term-green: "#63c381"

typography:
  display-hero:
    fontFamily: Newsreader
    fontSize: 62px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.015em
  display-page:
    fontFamily: Newsreader
    fontSize: 46px
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: -0.015em
  display-section:
    fontFamily: Newsreader
    fontSize: 38px
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: -0.01em
  display-callout:
    fontFamily: Newsreader
    fontSize: 23px
    fontWeight: 400
    lineHeight: 1.5
  heading-card:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.35
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.65
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 15.5px
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 13.5px
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: IBM Plex Mono
    fontSize: 11.5px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.09em
  data-mono:
    fontFamily: IBM Plex Mono
    fontSize: 12.5px
    fontWeight: 400
    lineHeight: 1.7

rounded:
  xs: 7px
  sm: 8px
  md: 12px
  lg: 16px
  pill: 20px

spacing:
  header-h: 60px
  container-max: 1120px
  gutter: 24px
  gap: 16px
  card-pad: 22px
  section-y: 96px
  section-y-mobile: 72px

components:
  button-primary:
    backgroundColor: "{colors.brand-deep}"
    textColor: "#ffffff"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.brand-hover}"
    textColor: "#ffffff"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-soft}"
    borderColor: "{colors.line}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-secondary-hover:
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
  badge-version:
    backgroundColor: "{colors.brand-wash}"
    textColor: "{colors.brand-deep}"
    borderColor: "{colors.brand-line}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.pill}"
    padding: 3px
  badge-pill:
    textColor: "{colors.faint}"
    borderColor: "{colors.line}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.pill}"
    padding: 3px
  card-elevated:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.line-soft}"
    rounded: "{rounded.md}"
    padding: 24px
  card-flat:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.line-soft}"
    rounded: "{rounded.sm}"
    padding: "{spacing.card-pad}"
  finding:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    padding: 9px
  status-verified:
    backgroundColor: "{colors.pass-wash}"
    textColor: "{colors.pass}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.md}"
    padding: 2px
  status-editing:
    backgroundColor: "{colors.warn-wash}"
    textColor: "{colors.warn}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.md}"
    padding: 2px
  terminal:
    backgroundColor: "{colors.term-bg}"
    textColor: "{colors.term-text}"
    typography: "{typography.data-mono}"
    rounded: "{rounded.md}"
    padding: 16px
  dark-panel:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.dark-text}"
    rounded: "{rounded.lg}"
    padding: 60px
  input-mono:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    borderColor: "{colors.line-soft}"
    typography: "{typography.data-mono}"
    rounded: "{rounded.xs}"
    padding: 10px
---

# briefloop.ai Design System

## Overview

briefloop.ai is the marketing and documentation site for BriefLoop, a
traceability-first AI briefing workflow. The audience is engineering-minded
buyers and developers who evaluate claims skeptically, so the UI must feel
institutional, precise, and quietly confident — never salesy.

The system is best described as a **restrained developer-tool aesthetic**:
light warm paper, editorial serif headlines, hairline rules, and a single
brand green. Beauty comes from type, spacing, and hierarchy — not decoration.
The site ships in zh-CN and en with full parity, so every stylistic choice
must survive CJK line breaking and mixed-script prose.

## Colors

The palette is warm-neutral paper tones plus one reserved brand green. A
second, strictly semantic triplet (pass / warn / block) exists only for
audit states.

- **Primary / brand (#006838):** Forest green. Used sparingly — links,
  primary actions, active states, and small accents such as step numbers,
  the eyebrow dash, and disclosure `+ / –` markers. (`--brand` in CSS.)
- **Brand deep (#05351d) / hover (#0a4a29):** Filled primary-button
  backgrounds and brand-adjacent emphasis text on light washes.
- **Paper (#faf9f6) / paper deep (#f3f1ec) / surface (#ffffff):** Warm
  limestone page ground; `surface` white is reserved for cards and exhibits
  so content reads as "documents on a desk".
- **Ink (#1e1c19) / ink soft (#38352f):** Headlines and core text.
- **Muted (#66625b) / faint (#8f8a81):** Secondary text, captions, metadata.
  `faint` is intentionally quiet — use only for low-priority metadata,
  never for body copy.
- **Line / line soft (ink at 14% / 7%):** The hairline rule system. Borders
  and separators come from these two tokens only.
- **Pass (#2c7a4b) / warn (#a8540a) / block (#c2401f) + washes:** Audit
  states only — gate results, findings, status markers. Never decoration.
- **Dark (#0e241a) + dark text/muted:** The single inverted "responsibility
  boundary" panel — a deep green-black, not a generic dark mode.
- **Term bg (#101613) / text / muted / green (#63c381):** Terminal blocks
  and install command strips only.

## Typography

Three families with strict roles. CJK fallbacks are part of the contract:
`Songti SC` / `Noto Serif SC` for display, `PingFang SC` / `Microsoft YaHei`
for body.

- **Display (Newsreader, 600):** Hero, page, and section headlines plus
  editorial pull-quotes and callouts. Display sizes are fluid —
  `display-hero` clamps 40→62px, `display-page` 32→46px,
  `display-section` 28→38px; token values are the desktop maxima.
- **Body (IBM Plex Sans, 400/600):** All prose and UI text. `body-md`
  (15.5px / 1.7) is the default reading size; `body-sm` (13.5px) for card
  copy and dense UI; `body-lg` (17px) only for the hero lede.
- **Mono (IBM Plex Mono):** Labels, kickers, timestamps, data, code, and
  terminal text. `label-caps` labels are rendered uppercase via
  `text-transform` (not expressible in tokens) with 0.09em tracking.

All display headings use `text-wrap: balance` so CJK wraps never leave
orphan characters. Font weights stay in {400, 500, 600} — no bold, no black.

## Layout

A fixed-max-width container (1120px, 24px gutters) centers all content;
sections breathe on a 96px vertical rhythm (72px on mobile) separated by
`line-soft` hairlines. Grids are simple 2/3/4-column layouts with 16px
gaps; cards group related content with ~22px internal padding.

Responsive breakpoints: 1024px (grids collapse to 2-up), 860px (mobile nav,
single-column), 560px (stacked buttons, single-column everything).

## Elevation & Depth

Nearly flat. Hierarchy is conveyed through tonal layering (paper → surface)
and hairline rules, not shadows. A single soft shadow
(`0 1px 2px` + `0 12px 32px`, ink at ~4-5%) is reserved for floating
exhibits: the hero review card, comparison table, sandbox shell, and
terminal window. Never stack or multiply shadows.

## Shapes

Quiet, engineered rounding. Cards and exhibits use 12px (`card-elevated`)
or 8px (`card-flat`); small controls (nav buttons, scenario chips, copy
buttons) use 7px; the inverted boundary panel uses 16px. Pills (20px) are
reserved for badges, tags, and status chips. A recurring motif is the 2px
left accent border for findings, fact strips, and boundary notes — prefer
it over adding boxes.

## Components

- **Buttons:** `button-primary` (brand-deep fill, white text) for the one
  most important action per view; `button-secondary` (white, hairline
  border, ink-soft text) for everything else. Padding is 12px 22px on
  primary/secondary; token `padding` records the vertical value.
- **Badges:** `badge-version` (brand wash + brand line) for version/state
  pills; `badge-pill` (hairline border, faint mono text) for tags and the
  language switch.
- **Cards:** `card-elevated` (12px radius + the one soft shadow) for hero
  exhibits; `card-flat` (8px, hairline only) for step, outcome, and list
  cards. Hover raises `line-soft` to `line` — never add shadow on hover.
- **Finding:** 2px left accent border on a paper or state-wash ground;
  border and tag color carry the pass/warn/block semantics while body text
  stays ink-soft.
- **Status markers:** `status-verified` / `status-editing` — small mono
  pills in pass/warn washes, used inside the sandbox demo only.
- **Terminal:** `terminal` block with `term-green` prompts/carets; links
  inside terminals are `term-green`, not brand green.
- **Dark panel:** the one inverted section (responsibility boundary);
  nothing else inverts.
- **Inputs:** `input-mono` — paper ground, hairline border, mono text.

## Do's and Don'ts

- Do use the brand green only for links, primary actions, active states,
  and small accents — scarcity is what makes it meaningful.
- Don't use pass/warn/block decoratively; they mean audit states, nothing
  else.
- Do keep body text in ink/ink-soft; reserve muted/faint for secondary
  text and metadata, and never set body copy in `faint`.
- Don't add gradients, illustrations, heavy shadows, or new hues — type
  and spacing carry the design.
- Do use Newsreader only for display type and pull quotes; mono only for
  labels, data, and code.
- Don't mix radii beyond the scale; pills are for badges and tags only.
- Do keep motion subtle (≤0.6s ease, small translateY reveals) and honor
  `prefers-reduced-motion`.
- Do verify zh-CN and en parity for any visual change — CJK wrapping and
  fallbacks are first-class, not an afterthought.
