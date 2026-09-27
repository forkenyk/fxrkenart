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

The opening sequence goes directly into the animated contour intro using the
current supplied logo.
It stays in dark mode at every hour: the background is always black and the
animated contour is always white. The original 3D color logo is revealed after
the moving contour through one synchronized inline SVG. A cumulative mask grows only
from the path already travelled, opening the logo from its real silhouette
inward—without whole-logo fading, rotating slices, blur, or scaling.

Intro asset:

- `public/fxrken-logo-3d.png`: supplied 3D logo. Its traced contour and reveal mask live in `src/LogoReveal.tsx`.

After the reveal finishes, the 3D logo stays on screen and the bright contour
continues travelling around the complete silhouette forever. The loop uses
native SVG animation instead of a CSS timeout, so it does not stop after the
first pass.

## Replace/deploy the complete project

Do not merge this build with an older `src` or `dist` folder. Replace the old
project with this complete folder, then run:

```bash
npm install
npm run deploy
```

The included `dist` folder is rebuilt from the source in this package.
