# Outlook-safe HTML newsletter template (MJML)

A multi-section newsletter template built for Outlook desktop (Word rendering engine), Outlook web, Gmail, Apple Mail and mobile clients. Browser previews are in this repo; run your own client matrix (Litmus, Email on Acid or test sends) before shipping. Written in [MJML](https://mjml.io) and compiled to plain table-based HTML with inline CSS.

- Source: [`src/newsletter.mjml`](src/newsletter.mjml)
- Compiled output: [`dist/newsletter.html`](dist/newsletter.html) (~25 KB, no external CSS or JavaScript)
- Previews: [desktop](preview/newsletter-desktop.png) · [mobile](preview/newsletter-mobile.png)

## What it covers

| Block | Notes |
|---|---|
| Brand bar | Logo with fixed `width`/`height` attributes and alt text, so Outlook never upscales it and blocked images still show the name |
| Hero banner | Single 600 px image; 2x asset for retina screens, compressed under 200 KB; no CSS background image (Outlook desktop ignores them) |
| Headline + intro | Web-safe font stack (Arial/Helvetica); sizes and line heights inlined |
| Two-column stories | MJML emits MSO conditional comments (`<!--[if mso]>`) with a nested table so Outlook keeps the columns side by side; other clients stack them on mobile |
| Call to action | "Bulletproof" button: a table cell with `background-color` and padding, which Outlook honours (padding on `<a>` is ignored there) |
| Footer | Physical address, unsubscribe and view-in-browser placeholders (`{{unsubscribe_url}}`, `{{view_in_browser_url}}`) for the sending platform to fill |

## Techniques for Outlook desktop

Outlook 2016–2024 on Windows renders HTML with Microsoft Word, which is why most "normal" web techniques fail there. The compiled output handles that by:

1. **Tables for layout**, not `div`s or flexbox. Every section is a `<table role="presentation">` with explicit widths; the body is locked at 600 px.
2. **Inline CSS** on every element. `<style>` blocks are kept only for dark-mode hints that Outlook ignores anyway.
3. **MSO conditional comments** around columns and buttons, so Outlook receives a dedicated table structure while other clients use the lighter markup.
4. **VML** for the button background and `mso-line-height-rule: exactly`, `mso-table-lspace/rspace: 0` to stop Word from adding gaps.
5. **Fixed image dimensions** (`width`/`height` attributes) and `display:block` to remove the 2–4 px gap Outlook adds under images.
6. **No web fonts, no background images, no CSS shorthand that Word misreads** (e.g. `padding` on anchors, `max-width` alone).
7. **Preheader text** via `<mj-preview>` so the inbox snippet is controlled.

## Image pipeline recommended for this template

- Export banners at 1200×500 (2x of the 600×250 slot), crop to ratio, then compress to WebP + a JPEG fallback (Outlook desktop does not render WebP), targeting under 200 KB.
- Serve images from object storage (e.g. S3 behind a CDN) with long cache headers; never inline base64 (Gmail strips it, Outlook bloats the message).
- Store alt text with the asset so every `<img>` ships with it.

## Build

```bash
npm install
npm run build     # compiles src/*.mjml into dist/*.html with strict validation
```

Open `dist/newsletter.html` in a browser for a quick look, then send a test through your ESP or a rendering service (Litmus, Email on Acid) for the full client matrix.

## License

MIT. Replace the placeholder images and copy with your own.
