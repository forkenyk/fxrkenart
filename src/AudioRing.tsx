import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { particleScene, plasmaScene } from './ParticleScene';
import type { RefObject } from 'react';
import { VISUALIZER as V } from './visualizer-config';

/** Beat-triggered particle membrane with an attack/release envelope and fading trails. */
export function AudioRing({ analyser, audio }: { analyser: RefObject<AnalyserNode | null>; audio: RefObject<HTMLAudioElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const background = useRef<HTMLCanvasElement>(null);
  const [error,setError] = useState(false);
  useEffect(() => {
    const el = canvas.current!;
    let particles: ReturnType<typeof particleScene> | undefined;
    let plasma: ReturnType<typeof plasmaScene> | undefined;
    try { particles=particleScene(el); plasma=plasmaScene(background.current!); }
    catch { particles?.destroy(); plasma?.destroy();setError(true);return; }
    let frame = 0, previous = 0, phase = 0;
    let bass = 0, mid = 0, high = 0, envelope = 0, impact = 0, lastBass = 0;
    let slowBass = 0, fastBass = 0, pulse = 0, visibility = 0, sinceBeat = 10;
    const previousSpectrum = new Float32Array(V.fftSize / 2);
    const spectrum = new Uint8Array(V.fftSize / 2);
    const bands = new Float32Array(32);
    const wave = new Float32Array(V.fftSize);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      const dt = Math.min((time - (previous || time)) / 1000, .25); previous = time;
      if (document.hidden) return;
      const node = analyser.current;
      let rms = 0;
      if (node && node.context.state === 'running' && audio.current && !audio.current.paused && !audio.current.ended) {
        node.getByteFrequencyData(spectrum); node.getFloatTimeDomainData(wave);
        for (const v of wave) rms += v * v;
        rms = Math.sqrt(rms / wave.length);
      } else { spectrum.fill(0); wave.fill(0); }
      const gate = Math.min(1, Math.max(0, (rms - .002) * 35));
      const band = (lo: number, hi: number) => {
        if (!node) return 0;
        const h = node.context.sampleRate / V.fftSize;
        let sum = 0, n = 0;
        for(let i = Math.max(1,Math.floor(lo/h)); i <= Math.min(spectrum.length-1,Math.ceil(hi/h)); i++) {sum += (spectrum[i]/255)**2; n++;}
        return sum / Math.max(1,n) * gate;
      };
      const raw = band(30,150);
      // Positive low-frequency spectral flux detects a fresh kick/sub onset.
      // A sustained bass note cannot hold the visualizer permanently visible.
      let flux = 0, bins = 0;
      const binHz = node ? node.context.sampleRate / V.fftSize : 12;
      for(let i=Math.max(1,Math.floor(30/binHz));i<=Math.min(spectrum.length-1,Math.ceil(220/binHz));i++) {
        const energy = (spectrum[i]/255)**2;
        flux += Math.max(0,energy-previousSpectrum[i]);
        previousSpectrum[i] = energy; bins++;
      }
      flux = flux / Math.max(1,bins) * gate;
      fastBass += (raw-fastBass)*(1-Math.exp(-dt/.025));
      slowBass += (raw-slowBass)*(1-Math.exp(-dt/.28));
      sinceBeat += dt;
      const onset = fastBass-slowBass;
      if(gate>.12 && raw>V.beatFloor && flux>V.beatThreshold && onset>V.beatThreshold*.55 && sinceBeat>V.beatCooldown) {
        pulse = Math.min(1,.65+flux*9); sinceBeat=0;
      } else pulse *= Math.exp(-dt/V.fadeSeconds);
      visibility += (pulse-visibility)*(1-Math.exp(-dt/(pulse>visibility?.022:.065)));
      if(visibility<.003 && pulse<.003) {
        const off={phase,bass:0,mid:0,high:0,impact:0,opacity:0,motion:0};
        particles!.draw(off);plasma!.draw(off);
        return;
      }
      impact = Math.max(impact*Math.exp(-dt/.1),Math.max(0,raw-lastBass)*3); lastBass = raw;
      const follow = (old: number, value: number) => old + (value-old)*(1-Math.exp(-dt/(value>old?.025:.085)));
      bass = follow(bass,raw); mid = follow(mid,band(150,2400)); high = follow(high,band(2400,12000));
      envelope = follow(envelope,gate);
      const motion = reduced.matches ? .15 : 1;
      phase += dt * (envelope*.55 + visibility*.45) * (.55 + bass*.9) * motion * V.rotationSpeed;
      for(let i=0;i<32;i++) {
        const hz=35*Math.pow(10000/35,i/31);
        const index=node?Math.min(spectrum.length-1,Math.round(hz*V.fftSize/node.context.sampleRate)):0;
        const target=spectrum[index]/255*gate;
        bands[i]+=(target-bands[i])*(1-Math.exp(-dt/.04));
      }
      const state={phase,bass,mid,high,impact,opacity:visibility,motion,bands};
      particles!.draw(state);plasma!.draw(state);
    };
    frame=requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame);particles?.destroy();plasma?.destroy(); };
  }, [analyser, audio]);
  return <>
    <canvas ref={canvas} className="fx-audio-ring" aria-hidden="true" />
    {createPortal(<canvas ref={background} className="fx-plasma-background" aria-hidden="true" />,document.body)}
    {error && <span className="fx-visualizer-error" role="status">Bật tăng tốc đồ họa trong trình duyệt để hiển thị visualizer.</span>}
  </>;
}
