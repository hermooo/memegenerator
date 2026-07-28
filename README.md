# Meme Generator

A client-side meme editor: browse Imgflip templates (or upload your own image), add top and bottom captions, adjust font size, and download a PNG.

**Version:** 1.2.0

## Requirements

- **Node.js** `20.19+` or `22.12+` (required by Vite 7). The repo includes [`.nvmrc`](.nvmrc) with `22`.

## Setup

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start Vite dev server          |
| `npm run build`   | Typecheck and production build |
| `npm run preview` | Preview production build       |
| `npm run lint`    | Run ESLint                     |

## Features (v1.2)

- Searchable template grid with random picker
- Favorite templates (stored in `localStorage`)
- Custom image upload
- Top/bottom captions, font size slider, uppercase toggle
- Canvas export with word wrapping
- Template list cached for 24 hours

## Changelog

### 1.2.0

- Template browser with search and favorites
- Image upload support
- Caption font size and uppercase controls
- Improved download pipeline with line wrapping
- UI refresh with design tokens and mobile preview-first layout
- Node.js engine documentation

### 1.1.0

- Initial random meme generator with Imgflip API and download

## License

Private project.
