---
version: alpha
name: briefloop.ai — Audit Ledger
description: Typewriter-ledger design language for briefloop.ai. The site itself reads as a deterministic run record — monospace is the machine's voice, serif is reserved for human judgment. Applied to both zh-CN and en via per-glyph CJK fallback stacks. Extracted from the v2 hero mockups; hex values are eyeballed from the renders and tuned at implementation time.

colors:
  primary: "#0B3D2A"
  primary-hover: "#145238"
  gate: "#1E7F4B"
  advisory: "#5756C9"
  blocked: "#C0392B"
  paper: "#F7F6F1"
  surface: "#FFFFFF"
  ink: "#242A25"
  ink-soft: "#3F4541"
  muted: "#83887F"
  line: "rgba(36, 42, 37, 0.14)"
  line-soft: "rgba(36, 42, 37, 0.07)"

typography:
  display-hero:
    fontFamily: "Newsreader, Songti SC, Noto Serif SC, serif"
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.01em
  display-quote:
    fontFamily: "Newsreader, Songti SC, Noto Serif SC, serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  mono-logo:
    fontFamily: "IBM Plex Mono, PingFang SC, Microsoft YaHei, monospace"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.2
  mono-lede:
    fontFamily: "IBM Plex Mono, PingFang SC, Microsoft YaHei, monospace"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  mono-body:
    fontFamily: "IBM Plex Mono, PingFang SC, Microsoft YaHei, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.7
  mono-button:
    fontFamily: "IBM Plex Mono, PingFang SC, Microsoft YaHei, monospace"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
  mono-meta:
    fontFamily: "IBM Plex Mono, PingFang SC, Microsoft YaHei, monospace"
    fontSize: 12.5px
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: "IBM Plex Mono, PingFang SC, Microsoft YaHei, monospace"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.08em

rounded:
  sm: 10px
  md: 12px
  full: 9999px

spacing:
  container-max: 920px
  gutter: 24px
  section-y: 96px
  gap: 16px
  card-pad: 28px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    typography: "{typography.mono-button}"
    rounded: "{rounded.sm}"
    padding: 13px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "#FFFFFF"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.mono-body}"
    padding: 2px
  version-pill:
    textColor: "{colors.ink-soft}"
    borderColor: "{colors.line}"
    typography: "{typography.mono-meta}"
    rounded: "{rounded.full}"
    padding: 5px
  gate-pass:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.gate}"
    borderColor: "{colors.gate}"
    typography: "{typography.mono-button}"
    rounded: "{rounded.full}"
    padding: 8px
  advisory-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.advisory}"
    borderColor: "{colors.advisory}"
    typography: "{typography.mono-button}"
    rounded: "{rounded.full}"
    padding: 8px
  blocked-line:
    textColor: "{colors.blocked}"
    typography: "{typography.mono-body}"
  audit-slip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "{spacing.card-pad}"
  principle-item:
    textColor: "{colors.ink-soft}"
    typography: "{typography.mono-body}"
---

# briefloop.ai — Audit Ledger (v2)

## Overview

The v2 language turns the site into the product's own evidence: every page
reads like a **deterministic run record** — an audit slip printed by the
harness, not a marketing brochure written about it. This is the product
story ("AI writes. Code enforces. You approve." / "No code written by
hand") rendered as typography.

The system has exactly two voices:

- **Monospace is the machine's voice.** Navigation, labels, buttons,
  statuses, metadata, hashes, timestamps — anything the deterministic
  system asserts is set in mono.
- **Serif is the human's voice.** The hero headline and quoted report prose
  (the content being audited) are set in Newsreader. Serif appears nowhere
  else — it marks text that a human wrote or must judge.

The mood shifts from v1's "restrained editorial tool" to "typewriter
ledger": still warm paper and hairlines, but tighter, narrower, and more
procedural. Color is semantic, never decorative.

## Colors

A green-tinted neutral base plus a three-hue semantic triangle. Hex values
were eyeballed from the mockup render — tune against the real display
before shipping.

- **Primary / deep forest (#0B3D2A):** Headline ink, logo, the single CTA
  fill. This is both brand color and display ink — the headline being green
  *is* the brand statement.
- **Gate (#1E7F4B):** Verified / PASS states — outlined chips, checkmarks,
  the logo's square period. Brighter and more "stamped" than primary.
- **Advisory (#5756C9):** The AI's voice. Indigo is reserved for things the
  agent said or suggested ("AI: advisory"). It must never appear on
  human-authored or system-enforced UI.
- **Blocked (#C0392B):** Conflicts and gate failures — red mono labels and
  strikethrough evidence lines.
- **Paper (#F7F6F1) / surface (#FFFFFF):** Warm cream ground; white only
  for the audit-slip card and interactive chips.
- **Ink (#242A25) / ink soft (#3F4541):** Green-charcoal body text.
- **Muted (#83887F):** Metadata only — hashes, timestamps, separators.
  Never body copy; at this lightness it sits below AA for small text.
- **Line / line soft (ink at 14% / 7%):** Hairlines and nav underlines.

## Typography

Two families, strict roles. Continuity with v1 is deliberate: Newsreader
and IBM Plex Mono are already loaded, so v2 needs no new fonts — it
re-assigns them.

- **display-hero (Newsreader, 600, ~64px):** The one large serif moment per
  page. Set in `primary` green.
- **display-quote (Newsreader, 400, ~18px):** Quoted report prose inside
  exhibits — e.g. the struck-through offending sentence on the audit slip.
  Italic where the tone is citation rather than headline.
- **mono-body / mono-lede / mono-meta (IBM Plex Mono):** All UI text,
  including the hero subhead and nav. Hierarchy comes from size, weight
  (400/500/600), caps, and color — not from family changes.
- **label-caps:** Panel headers and kickers ("QUALITY PANEL — AUDIT SLIP"),
  rendered uppercase via `text-transform` with 0.08em tracking.

**CJK rendering (decided, per the zh-CN mockup):** zh-CN uses this language
as-is — the "mono is the machine's voice" rule holds on the Chinese pages
too. Font stacks carry CJK fallbacks and fallback is per-glyph: Latin,
digits, and punctuation render in IBM Plex Mono (Newsreader for display),
while CJK runs render in `PingFang SC` / `Microsoft YaHei` for mono
contexts and `Songti SC` / `Noto Serif SC` for display. The resulting
mixed texture — mono Latin inside sans CJK, visible in the lede
("一个开源治理 harness，…") and chips ("门禁：通过") — is the intended look,
not a defect. Mono metrics are never expected from CJK glyphs, so
alignment-sensitive layouts (ledgers, metadata rows) keep their
column-critical content in Latin/digits.

## Layout

Narrower than v1: a single centered column around **920px** holds
everything — hero, slip, principles, footer. The composition is stacked and
ceremonial: version pill → headline → lede → CTA → meta line → audit slip →
principle row → colophon, each separated by air and the occasional
hairline. Sections keep the 96px vertical rhythm. Nothing spans full
bleed; the slip floats in the middle of the paper like a printed receipt
on a desk.

## Elevation & Depth

One shadow in the entire system: the soft lift under the **audit slip**
card, enough to read as paper-on-paper. Everything else is flat hairlines.
Inside the slip, structure comes from ruled lines — a solid hairline under
the panel header, a **dashed** hairline as the tear-off line above the run
metadata. Dashes mean "receipt"; use them nowhere else.

## Shapes

Status chips (`gate-pass`, `advisory-chip`, version pill) are fully rounded
— stamped seals on the slip. The slip itself and the CTA use modest
10–12px radii. No other shapes; icons are thin-stroke line icons (pencil,
lock, check-circle) at consistent 1.5px stroke.

## Components

- **button-primary:** Deep forest fill, white mono text. One per viewport.
- **nav-link:** Ink mono text with a *persistent* hairline underline (not
  hover-only) — the signature-bar treatment.
- **version-pill:** Hairline ring, mono meta text, `·`-separated facts.
- **gate-pass / advisory-chip:** Outlined stamps — 1px colored ring,
  colored mono text, white ground. These are seals, not buttons; they don't
  get hover fills.
- **blocked-line:** Red mono label plus the offending prose in serif with
  strikethrough — the evidence exhibit pattern.
- **audit-slip:** The hero exhibit. Header (label-caps kicker + right-aligned
  context), ruled divider, chip row + findings, dashed tear-off, mono
  metadata footer (run id, sha256, runtime, UTC timestamp).
- **principle-item:** Thin-stroke icon + mono claim ("Agents draft — zero
  authority"), separated by hairline vertical rules.

## Do's and Don'ts

- Do keep the two-voice rule absolute: serif = human words, mono = system
  words. If you're unsure which voice a string has, it's mono.
- Don't introduce any hue outside the semantic triangle (gate / advisory /
  blocked) plus the forest primary. There is no decorative color.
- Do treat the audit slip as the canonical exhibit — new sections should
  extend its vocabulary (ruled lines, stamps, metadata rows) rather than
  invent new card styles.
- Don't use the advisory indigo for links, buttons, or anything clickable
  by default — it belongs to the agent's output.
- Do use `·` for inline metadata separators and em-dashes for the
  claim-constraint pattern ("Python enforces — deterministic").
- Do rely on the per-glyph CJK fallback stacks (see Typography) instead of
  forcing a CJK monospace; test mixed-script lines on every visual change.
- Do keep one CTA, one shadow, one serif moment per viewport. Restraint is
  the brand.
