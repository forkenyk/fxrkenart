# FXRKENART — particle wave background

## Run
`npm ci` then `npm run dev`. Production build: `npm run build`.

## Current design
After the logo intro, a white particle-wave landscape spreads across the lower background. Small particles float slowly above it. Plasma and the circular NCS visualizer have been removed. Dynamic Info, logo intro, MP3 playback, seek and volume remain.

The wave surface drifts slowly at rest. Kick/sub slightly increases its travel speed, with a smooth return to idle; amplitude and brightness also respond to the real audio analysis. Upper particles receive small upward velocity impulses. Pausing leaves the calm ambient landscape visible.

## Adjust
`src/visualizer-config.ts`:
- `idleWaveSpeed`: normal wave travel speed.
- `subSpeedBoost` and `kickSpeedBoost`: mild audio-driven wave acceleration.
- `waveHeight`: vertical wave size.
- `ambientOpacity`: normal wave brightness.
- `idleParticleSpeed` and `beatLift`: upper particles' slow drift and upward push.

Replace `public/audio/track.mp3` to change music; edit the title in the same config.

`src/ParticleScene.ts` contains the GPU wave field and dust renderer. `src/AudioRing.tsx` retains its filename for compatibility but now drives the fullscreen particle field; it contains no circular geometry. The reference image gives the composition; this is a realtime interpretation in white.
