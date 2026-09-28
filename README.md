# FXRKENART — White Audio Ring

Vòng spectrum trắng xuất hiện sau khi intro logo kết thúc. Giữ logo/contour hiện tại; vòng ở layer phía sau logo. Nhạc được phân tích trực tiếp bằng Web Audio AnalyserNode (FFT 4096), không dùng animation nhịp ngẫu nhiên. Đây là diễn giải kiểu vòng NCS cổ điển, chưa đối chiếu với một video NCS cụ thể.

## Chạy

Yêu cầu Node.js đáp ứng phiên bản Vite trong package-lock.json.

```powershell
npm ci
npm run dev
```

Sau intro, bấm nút phát. Trình duyệt cần thao tác người dùng để bật âm thanh. Có tạm dừng, tua, âm lượng và lặp bài. Không cần SoundCloud API.

## Thay bài

- Ghi đè `public/audio/track.mp3` bằng bài mới, giữ nguyên tên; hoặc đổi `MUSIC.src` trong `src/visualizer-config.ts`.
- Đổi `MUSIC.title` trong cùng file.
- Chạy `npm run build` và deploy lại để cập nhật bản online.
- File nhạc được phát trực tiếp từ website; chọn file được phép sử dụng.

## Chỉnh hiệu ứng

`src/visualizer-config.ts`:
- `gain`: độ nhạy (mặc định 1.15).
- `radius`: bán kính vòng so với chiều rộng logo (0.62).
- `amplitude`: chiều cao sóng (0.17).
- `glow`: độ lan sáng (15).

`src/AudioRing.tsx`: ánh xạ tần số, smoothing, bass và transient.
`src/MusicVisualizer.tsx`: nguồn audio và bộ điều khiển.
`src/main.tsx`: bật visualizer bằng sự kiện animation kết thúc của logo, không dùng thời gian đoán.
`src/styles.css`: fade-in vòng và bố cục player.

Không có chuyển động giả lúc nhạc im lặng. Bass/sub thay đổi liên tục; transient tạo phản ứng ngắn. Việc nhận diện kick dựa trên biến thiên năng lượng dải trầm, không phải tách nhạc cụ. Hỗ trợ giảm chuyển động theo cài đặt hệ điều hành.

## Build / Cloudflare

```powershell
npm run build
npm run deploy
```

`dist/` trong ZIP đã được build lại. Gói không kèm node_modules. Các file nguồn logo và intro vẫn có trong src/ và public/.


## Update: Dynamic Info + white particle membrane
- `src/DynamicInfo.tsx` is mounted after intro; the missing CSS has been reconstructed in `src/styles.css`. Existing component content and social links are retained.
- `src/AudioRing.tsx` now renders a projected particle mesh in white behind the logo, with bass/mid/high analysis of the MP3. Play requires a user gesture.
- The supplied `giphy.gif` contains ONE frame. This is an interpretation of its particle appearance; exact reference motion or a 100% NCS match is not claimed.
- Replace `public/audio/track.mp3` to change audio. Edit `src/visualizer-config.ts` for title, gain, size and glow.
- ZIP has one project root. `dist` is rebuilt from this source. Run `npm ci` then `npm run dev` or `npm run build`.

## Beat-triggered fade
The particle mesh is invisible before playback. Fresh low-frequency onsets trigger a short soft attack; opacity then decays to fully transparent. Sustained bass does not keep it lit. Short transparent trails add an ethereal afterimage.
In `src/visualizer-config.ts`: `beatThreshold` sets onset sensitivity, `fadeSeconds` controls release, `trailSeconds` controls afterimage length. Defaults: 0.009 / 0.22 s / 0.065 s.


## Update: white plasma + seven rotating membranes
- Background: supplied plasma still texture, converted to white in the GPU shader and gently warped. It shares the particle beat envelope and becomes transparent between triggers / after pause.
- Particles: seven nested membranes with independent inclined rotations and alternating directions. Approximately 63k points on desktop and 28k on mobile; rendered by WebGL.
- `src/visualizer-config.ts`: `layers`, `rotationSpeed`, `backgroundOpacity`, `beatThreshold`, `fadeSeconds`, `trailSeconds`.
- `src/ParticleScene.ts`: GPU geometry, rotations, glow and plasma rendering. `src/AudioRing.tsx`: audio analysis and shared beat fade.
- Both supplied .gif files actually contain a single PNG frame. This implements the visible style with procedural movement; exact reference motion is not verified.
- Requires WebGL / browser graphics acceleration. The background and particles remain white.


## Latest update: folded ribbons and live plasma flow
Supersedes the seven spherical shells: five broad twisted ribbons form one compact volume, with dense threads and illuminated edges. Alternating rotation remains, but the silhouette no longer spreads into a diffuse particle cloud.
Plasma is now procedural domain-warped noise. Bass and kick change its flow-field deformation as well as opacity. No background texture is sampled. White-on-black and beat-triggered fade remain.
The latest supplied `giphy(2).gif` is also a single-frame PNG. Exact animation matching is not claimed.


## Latest: matched structure to the 6-second MP4 reference
Replaces twisted ribbons with three tightly adjacent spherical membranes: stable circular silhouette, brighter lower crescent, dim upper edge, inward billowing sheets and subtle rim ripples. Equal-area latitude spacing prevents artificial bright pole clumps. Thirty-two logarithmic frequency bands add local audio-driven rim deformation; bass and kick still drive the whole shape and the shared beat-triggered fade.
The supplied MP4 has 145 frames at 24 fps and no audio stream. Shape and motion were inspected across the clip; the user's MP3 supplies live sound analysis. This is a white realtime reconstruction, not the source renderer or a claim of pixel-perfect identity.
