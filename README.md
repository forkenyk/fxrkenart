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

The opening sequence is split into two independent stages:

1. A liquid-chrome reveal forms from the 3D logo alpha, catches a metallic
   light sweep, and zooms through the camera.
2. The existing contour-and-3D-logo intro starts immediately underneath the
   metallic transition and then remains on screen.

The existing intro uses Vietnam time:

- 06:00–17:59: white background and black animated contour.
- 18:00–05:59: black background and white animated contour.
- The original 3D color logo is revealed after the contour animation.

Intro assets:

- `public/fxrken-contour-run.svg`: animated moving contour segment.
- `public/fxrken-logo-3d.png`: original transparent 3D logo.

After both reveals finish, the 3D logo stays on screen and the bright contour
continues running indefinitely. Metallic timing and future post-intro options
are isolated in `src/intro-config.ts`.
