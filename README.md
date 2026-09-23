# FXRKENART

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Cloudflare

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`

The intro uses Vietnam time:

- 06:00–17:59: white background and black animated contour.
- 18:00–05:59: black background and white animated contour.
- The original 3D color logo is revealed after the contour animation.

Intro assets:

- `public/fxrken-outline.svg`: animated vector contour.
- `public/fxrken-logo-3d.png`: original transparent 3D logo.

After the reveal finishes, the 3D logo stays on screen and the bright contour
continues running indefinitely. Future post-intro destinations can be added
independently in `src/intro-config.ts`.
