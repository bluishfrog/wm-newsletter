# Little Atelier — Playful Editorial Website

A small, modular website designed for GitHub Pages. Plain HTML/CSS/JavaScript; no build tools needed.

## Important: password is NOT secure
The password gate runs entirely in the visitor's browser. The password and all page content are publicly accessible in the repository and published source files. Anyone can bypass the gate. **Do not put private or sensitive content here.** The gate is only a casual visual deterrent.

## Quick start
1. Open `assets/js/config.js`. Change `name` and the placeholder `password` (`change-me-please`). Remember that anyone can read it in the published JavaScript.
2. Edit page text and sections in `assets/js/content.js`.
3. Adjust colors, fonts and spacing in `assets/css/style.css`.
4. Open `index.html` in a browser for a quick local preview.

## Publish to GitHub Pages
1. Create a **public** GitHub repository, e.g. `little-atelier`. (Pages availability for private repositories depends on your GitHub plan, but private repository status does not make a Pages website private.)
2. Upload **the contents of this folder** to the repository root, including `index.html`, `pages/`, and `assets/`.
3. In GitHub, open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, branch **main**, folder **/(root)**, and save.
4. After publishing, visit `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.
5. Later edits committed to `main` will automatically redeploy.

## Add a section
Inside `assets/js/content.js`, find the page's `sections` array. Copy a section object and paste it after another object, separating them with commas. Supported types:

```js
{ type: 'text', eyebrow: '04 / Notes', title: 'Another thought', paragraphs: ['Paragraph one.', 'Paragraph two.'] },
{ type: 'highlight', eyebrow: '05 / Spotlight', title: 'Worth noticing', paragraphs: ['A highlighted note.'] },
{ type: 'cards', eyebrow: '06 / Ideas', title: 'A collection', items: [{title:'One',text:'Details'},{title:'Two',text:'Details'}] }
```

## Add a page
1. Copy `pages/about.html` to `pages/new-page.html`.
2. In the new HTML file change `data-page="about"` to `data-page="new-page"` and update the `<title>`.
3. In `assets/js/content.js`, add `new-page: { eyebrow: '...', title: '...', introduction: '...', sections: [] }` inside `window.PAGE_CONTENT`. Because of the hyphen, quote the key as `'new-page'`.
4. In `assets/js/config.js`, add `{ label: 'New Page', href: 'pages/new-page.html' }` to `pages`.

## Other notes
- The homepage intentionally contains no content beyond shared header/footer.
- Unlock status lasts for the browser tab/session (`sessionStorage`). Use **Lock site** to reset it.
- Fonts load from Google Fonts, so they require internet access. Fallback fonts work offline.
- This site uses no cookies or analytics.
