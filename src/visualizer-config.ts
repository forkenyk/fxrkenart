/** Thay bài: thay public/audio/track.mp3 hoặc đổi src bên dưới. */
export const MUSIC = {
  src: '/audio/track.mp3',
  title: 'Cung Thiên Bình (天秤座) — Rinv Rmx',
  volume: 0.7,
};

export const VISUALIZER = {
  fftSize: 4096,
  // Snow is almost hidden at rest and blooms only around a fresh beat.
  idleSnowOpacity: 0.012,
  beatSnowOpacity: 0.92,
  idleSnowSpeed: 0.045,
  beatSnowSpeed: 1.15,
  beatThreshold: 0.009,
  beatFloor: 0.012,
  beatCooldown: 0.13,
  fadeSeconds: 0.22,
  logoBeatScale: 0.018,
  logoBeatGlow: 6.5,
};
