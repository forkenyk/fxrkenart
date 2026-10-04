/** Thay bài: thay public/audio/track.mp3 hoặc đổi src bên dưới. */
export const MUSIC = {
  src: '/audio/track.mp3',
  title: 'Cung Thiên Bình (天秤座) — Rinv Rmx',
  volume: 0.7,
};

export const VISUALIZER = {
  fftSize: 4096,
  // Độ cao mặt sóng (theo chiều cao màn hình).
  waveHeight: 0.1,
  // Độ sáng lúc bình thường; nhịp đập làm sáng lên rồi dịu lại.
  ambientOpacity: 0.48,
  idleWaveSpeed: 0.22,
  // Sóng chạy nhanh hơn nhẹ khi kick/sub đập, sau đó hạ tốc mượt.
  subSpeedBoost: 0.5,
  kickSpeedBoost: 0.65,
  // Hạt phía trên: tốc độ nền và lực đẩy lên khi kick/bass đập.
  idleParticleSpeed: 0.018,
  beatLift: 0.42,
  beatThreshold: 0.009,
  beatFloor: 0.012,
  beatCooldown: 0.13,
  fadeSeconds: 0.22,
  logoBeatScale: 0.008,
  logoBeatGlow: 3.5,
};
