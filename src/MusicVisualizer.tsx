import { useEffect, useRef, useState } from 'react';
import { AudioRing } from './AudioRing';
import { MUSIC, VISUALIZER } from './visualizer-config';

const clock = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;

export function MusicVisualizer() {
  const audio = useRef<HTMLAudioElement>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const context = useRef<AudioContext | null>(null);
  const source = useRef<MediaElementAudioSourceNode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(MUSIC.volume);
  useEffect(() => {
    if (audio.current) audio.current.volume = MUSIC.volume;
    return () => {
      source.current?.disconnect();
      analyser.current?.disconnect();
      void context.current?.close();
      source.current = null;
      analyser.current = null;
      context.current = null;
    };
  }, []);
  const toggle = async () => {
    const element = audio.current;
    if (!element || busy) return;
    if (!element.paused) { element.pause(); return; }
    setBusy(true);
    setError('');
    try {
      if (!context.current) {
        const ctx = new AudioContext();
        context.current = ctx;
        const fft = ctx.createAnalyser();
        fft.fftSize = VISUALIZER.fftSize;
        fft.smoothingTimeConstant = .25;
        fft.minDecibels = -85;
        fft.maxDecibels = -15;
        const input = ctx.createMediaElementSource(element);
        input.connect(fft);
        fft.connect(ctx.destination);
        source.current = input;
        analyser.current = fft;
      }
      await context.current.resume();
      await element.play();
    } catch {
      element.pause();
      setError('Không phát được nhạc. Kiểm tra file audio rồi bấm phát lại.');
    } finally { setBusy(false); }
  };
  return <>
    <AudioRing analyser={analyser} audio={audio} />
    <div className="fx-music-panel">
      <audio ref={audio} src={MUSIC.src} preload="metadata" loop
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onTimeUpdate={() => setPosition(audio.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(Number.isFinite(audio.current?.duration) ? audio.current!.duration : 0)}
        onError={() => { setPlaying(false); setError('Không tải được nhạc. Kiểm tra public/audio/track.mp3.'); }} />
      <div className="fx-music-row">
        <button className="fx-play" onClick={() => void toggle()} disabled={busy}
          aria-label={playing ? 'Tạm dừng' : 'Phát nhạc'} title={playing ? 'Tạm dừng' : 'Phát nhạc'}>
          {playing ? <svg viewBox="0 0 24 24"><path d="M7 5h3v14H7zm7 0h3v14h-3z" /></svg>
            : <svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7z" /></svg>}
        </button>
        <div className="fx-track"><span>{MUSIC.title}</span><small>{error || (busy ? 'Đang tải nhạc…' : playing ? 'Đang phát' : 'Bấm phát để bật âm thanh')}</small></div>
        <label className="fx-volume" title="Âm lượng">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3zm12-2c3 3 3 7 0 10m3-13c5 5 5 11 0 16" /></svg>
          <input aria-label="Âm lượng" type="range" min="0" max="1" step="0.01" value={volume}
            onChange={e => { const v = Number(e.target.value); setVolume(v); if (audio.current) audio.current.volume = v; }} />
        </label>
      </div>
      <div className="fx-seek"><time>{clock(position)}</time><input aria-label="Tua nhạc" type="range" min="0" max={duration || 1} step="0.1" value={position} disabled={!duration}
        onChange={e => { const t = Number(e.target.value); if (audio.current) audio.current.currentTime = t; setPosition(t); }} /><time>{clock(duration)}</time></div>
      {error && <p className="fx-audio-error" role="alert">{error}</p>}
    </div>
  </>;
}
