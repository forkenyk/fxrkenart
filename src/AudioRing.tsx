import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { snowScene } from './SnowScene';
import type { RefObject } from 'react';
import { VISUALIZER as V } from './visualizer-config';

/** Beat-triggered snow: nearly hidden at rest, bright and chaotic on kicks. */
export function AudioRing({ analyser, audio }: { analyser: RefObject<AnalyserNode | null>; audio: RefObject<HTMLAudioElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [error,setError] = useState(false);

  useEffect(() => {
    const canvasElement = canvas.current!;
    let snow: ReturnType<typeof snowScene> | undefined;
    try { snow=snowScene(canvasElement); }
    catch { snow?.destroy(); setError(true); return; }

    let frame=0, previous=0, snowTime=0, snowSpeed=V.idleSnowSpeed;
    let bass=0, impact=0, lastBass=0;
    let slowBass=0, fastBass=0, pulse=0, visibility=0, sinceBeat=10;
    // The canvas is portaled to <body>, so resolve the logo globally.
    const mark=document.querySelector<HTMLElement>('.fx-mark');
    const previousSpectrum=new Float32Array(V.fftSize/2);
    const spectrum=new Uint8Array(V.fftSize/2);
    const wave=new Float32Array(V.fftSize);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');

    const draw=(time:number)=>{
      frame=requestAnimationFrame(draw);
      const dt=Math.min((time-(previous||time))/1000,.25); previous=time;
      if(document.hidden) return;
      const node=analyser.current;
      let rms=0;
      if(node&&node.context.state==='running'&&audio.current&&!audio.current.paused&&!audio.current.ended){
        node.getByteFrequencyData(spectrum); node.getFloatTimeDomainData(wave);
        for(const value of wave) rms+=value*value;
        rms=Math.sqrt(rms/wave.length);
      }else{ spectrum.fill(0); wave.fill(0); }

      const gate=Math.min(1,Math.max(0,(rms-.002)*35));
      const band=(low:number,high:number)=>{
        if(!node) return 0;
        const hz=node.context.sampleRate/V.fftSize;
        let sum=0,count=0;
        for(let i=Math.max(1,Math.floor(low/hz));i<=Math.min(spectrum.length-1,Math.ceil(high/hz));i++){sum+=(spectrum[i]/255)**2;count++;}
        return sum/Math.max(1,count)*gate;
      };
      const raw=band(30,150);
      let flux=0,bins=0;
      const binHz=node?node.context.sampleRate/V.fftSize:12;
      for(let i=Math.max(1,Math.floor(30/binHz));i<=Math.min(spectrum.length-1,Math.ceil(220/binHz));i++){
        const energy=(spectrum[i]/255)**2;
        flux+=Math.max(0,energy-previousSpectrum[i]);
        previousSpectrum[i]=energy; bins++;
      }
      flux=flux/Math.max(1,bins)*gate;
      fastBass+=(raw-fastBass)*(1-Math.exp(-dt/.025));
      slowBass+=(raw-slowBass)*(1-Math.exp(-dt/.28));
      sinceBeat+=dt;
      const onset=fastBass-slowBass;
      if(gate>.12&&raw>V.beatFloor&&flux>V.beatThreshold&&onset>V.beatThreshold*.55&&sinceBeat>V.beatCooldown){
        pulse=Math.min(1,.65+flux*9); sinceBeat=0;
      }else pulse*=Math.exp(-dt/V.fadeSeconds);
      visibility+=(pulse-visibility)*(1-Math.exp(-dt/(pulse>visibility?.022:.065)));
      impact=Math.max(impact*Math.exp(-dt/.1),Math.max(0,raw-lastBass)*3); lastBass=raw;
      bass+= (raw-bass)*(1-Math.exp(-dt/(raw>bass?.025:.085)));

      const motion=reduced.matches?.15:1;
      const beat=Math.min(1,Math.max(visibility,impact*.9));
      const desiredSpeed=V.idleSnowSpeed+beat*V.beatSnowSpeed;
      snowSpeed+=(desiredSpeed-snowSpeed)*(1-Math.exp(-dt/(desiredSpeed>snowSpeed?.035:.18)));
      snowTime+=dt*snowSpeed*motion;

      // The response is intentionally gentle, but now follows the actual
      // transient/visibility envelope instead of staying visually static.
      const logoBeat=Math.min(1,visibility*.82+impact*.62+bass*.12);
      mark?.style.setProperty('--logo-beat-scale',(1+logoBeat*V.logoBeatScale).toFixed(4));
      mark?.style.setProperty('--logo-beat-glow',`${(logoBeat*V.logoBeatGlow).toFixed(2)}px`);
      snow!.draw({time:snowTime,beat,impact,opacity:V.idleSnowOpacity+(V.beatSnowOpacity-V.idleSnowOpacity)*visibility});
    };
    frame=requestAnimationFrame(draw);
    return ()=>{
      cancelAnimationFrame(frame); snow?.destroy();
      mark?.style.setProperty('--logo-beat-scale','1');
      mark?.style.setProperty('--logo-beat-glow','0px');
    };
  },[analyser,audio]);

  return <>
    {createPortal(<canvas ref={canvas} className="fx-snow-background" aria-hidden="true" />,document.body)}
    {error&&<span className="fx-visualizer-error" role="status">Bật tăng tốc đồ họa trong trình duyệt để hiển thị visualizer.</span>}
  </>;
}
