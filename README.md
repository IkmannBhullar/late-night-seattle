# Late night in Seattle

Personal portfolio of Ikmann Singh Bhullar — one illustrated, explorable scene:
his Seattle apartment late on a rainy night. Every object opens a part of the story.

- Plain HTML / CSS / JS, scene drawn in inline SVG, no build step, no libraries.
- All links live in the `CONFIG` object at the top of `main.js`.

## Run locally

```bash
python3 -m http.server 5173
```

## Deploy

- **Vercel:** import the repo, framework preset "Other", no build command, output dir `.`.
- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root.
