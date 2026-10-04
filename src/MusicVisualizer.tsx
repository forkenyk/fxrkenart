import { useEffect, useRef } from 'react';
import { AudioRing } from './AudioRing';
import { MUSIC, VISUALIZER } from './visualizer-config';

/**
 * The visualizer owns the audio element, but deliberately renders no player
 * controls. We make the strongest autoplay attempt the browser allows:
 * audible first, then muted autoplay as a policy-safe fallback.
 */
export function MusicVisualizer() {
  const audio = useRef<HTMLAudioElement>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const context = useRef<AudioContext | null>(null);
  const source = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    element.autoplay = true;
    element.loop = true;
    element.preload = 'auto';
    element.volume = MUSIC.volume;

    let disposed = false;
    const setupAudioGraph = () => {
      if (context.current || !('AudioContext' in window || 'webkitAudioContext' in window)) return;
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;
      const ctx = new AudioContextCtor();
      const fft = ctx.createAnalyser();
      fft.fftSize = VISUALIZER.fftSize;
      fft.smoothingTimeConstant = 0.25;
      fft.minDecibels = -85;
      fft.maxDecibels = -15;
      const input = ctx.createMediaElementSource(element);
      input.connect(fft);
      fft.connect(ctx.destination);
      context.current = ctx;
      source.current = input;
      analyser.current = fft;
    };
    const attemptPlay = async (allowSound: boolean) => {
      if (disposed) return;
      try {
        element.muted = !allowSound;
        await element.play();
        setupAudioGraph();
        // Do not await resume() here: some Chromium builds leave this promise
        // pending until a gesture, while muted media autoplay can proceed.
        if (context.current?.state === 'suspended') void context.current.resume().catch(() => undefined);
      } catch {
        // Audible autoplay is intentionally retried muted. Browsers do not
        // expose a safe API to override their user-gesture policy.
        if (allowSound && !disposed) {
          try {
            element.muted = true;
            await element.play();
            setupAudioGraph();
          } catch { /* Wait for a later visibility/interaction retry. */ }
        }
      }
    };

    void attemptPlay(true);
    // A media element can be present before its first MP3 range is ready.
    // Retrying on the media readiness events makes muted autoplay reliable
    // without exposing a control surface.
    const retryMuted = () => {
      if (disposed || !element.paused) return;
      element.muted = true;
      void element.play().then(() => {
        setupAudioGraph();
        if (context.current?.state === 'suspended') void context.current.resume().catch(() => undefined);
      }).catch(() => undefined);
    };
    const autoplayTimer = window.setTimeout(retryMuted, 450);
    element.addEventListener('loadeddata', retryMuted);
    element.addEventListener('canplay', retryMuted);
    const retryWithSound = () => { void attemptPlay(true); };
    const retryWhenVisible = () => { if (!document.hidden) void attemptPlay(!element.muted); };
    window.addEventListener('pointerdown', retryWithSound, { passive: true });
    window.addEventListener('keydown', retryWithSound, { passive: true });
    window.addEventListener('touchstart', retryWithSound, { passive: true });
    document.addEventListener('visibilitychange', retryWhenVisible);

    return () => {
      disposed = true;
      window.clearTimeout(autoplayTimer);
      element.removeEventListener('loadeddata', retryMuted);
      element.removeEventListener('canplay', retryMuted);
      window.removeEventListener('pointerdown', retryWithSound);
      window.removeEventListener('keydown', retryWithSound);
      window.removeEventListener('touchstart', retryWithSound);
      document.removeEventListener('visibilitychange', retryWhenVisible);
      element.pause();
      source.current?.disconnect();
      analyser.current?.disconnect();
      void context.current?.close();
      source.current = null;
      analyser.current = null;
      context.current = null;
    };
  }, []);

  return <>
    <AudioRing analyser={analyser} audio={audio} />
    <audio ref={audio} src={MUSIC.src} autoPlay loop playsInline preload="auto" aria-hidden="true" />
  </>;
}
