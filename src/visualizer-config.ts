/** Thay bài: thay public/audio/track.mp3 hoặc đổi src bên dưới. */
export const MUSIC = {
  src: '/audio/track.mp3',
  title: 'Cung Thiên Bình (天秤座) — Rinv Rmx',
  volume: 0.7,
};

export const VISUALIZER = {
  fftSize: 4096,
  // Tăng gain để sóng nhạy hơn; khoảng 0.6–1.8.
  gain: 1.15,
  // Kích thước khối hạt so với chiều rộng logo.
  radius: 0.62,
  glow: 22,
  // Số màng hạt sát nhau; viền tròn cố định, bề mặt cuộn bên trong.
  layers: 3,
  rotationSpeed: 1.6,
  backgroundEnabled: true,
  backgroundOpacity: 0.8,
  // Nhỏ hơn = nhận cả nhịp nhẹ; lớn hơn = chỉ hiện ở nhịp mạnh.
  beatThreshold: 0.009,
  beatFloor: 0.012,
  beatCooldown: 0.13,
  // Thời gian suy giảm: tăng để tan chậm, giảm để tắt nhanh (giây).
  fadeSeconds: 0.22,
  // Vệt hạt mờ phía sau chuyển động (giây).
  trailSeconds: 0.065,
};
