import { VISUALIZER as V } from './visualizer-config';
export type SceneFrame = { phase:number; bass:number; mid:number; high:number; impact:number; opacity:number; motion:number; dustTravel:number; bands:Float32Array };
function program(gl:WebGLRenderingContext,vertex:string,fragment:string){
 const shaders=[gl.VERTEX_SHADER,gl.FRAGMENT_SHADER].map((type,i)=>{const s=gl.createShader(type)!;gl.shaderSource(s,i===0?vertex:fragment);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s)||'Shader failed');return s;});
 const p=gl.createProgram()!;shaders.forEach(s=>gl.attachShader(p,s));gl.linkProgram(p);shaders.forEach(s=>gl.deleteShader(s));if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p)||'Link failed');return p;
}
const vertex=`
precision highp float;
attribute vec3 a_point;
uniform float u_phase,u_bass,u_mid,u_high,u_impact,u_dpr,u_mode,u_halo,u_dustTravel,u_motion,u_waveHeight;
uniform float u_bands[32];
varying float v_light;
void main(){
 float x=a_point.x,z=a_point.y,layer=a_point.z;
 if(u_mode<.5){
  float t=u_phase;
  float depth=.35+z*.65;
  float wave=sin(x*7.+z*6.-t*.8+layer*.85)*.45;
  wave+=sin(x*13.-z*9.+t*.57+layer)*.23;
  wave+=sin(x*4.+z*12.+t*.36)*.32;
  int b=int(clamp((x+1.)*.5*31.,0.,31.));
  float local=u_bands[b];
  float amplitude=u_waveHeight*(1.+u_motion*(u_bass*.75+u_impact*.7+local*.18));
  float y=-.32-z*.38+wave*amplitude*depth-layer*.032;
  y+=sin(x*3.-t+z*8.)*u_impact*.025*u_motion;
  float spread=1.08+z*.14;
  gl_Position=vec4(x*spread,y,0.,1.);
  float edge=1.-smoothstep(.73,1.12,abs(x));
  float ridge=pow(.5+.5*wave,2.);
  v_light=edge*(.18+ridge*.9)*(.48+z*.52)*(1.-layer*.14);
  gl_PointSize=u_dpr*(u_halo>.5?5.:1.25)*( .7+z*.5);
 }else{
  // Integrated upward travel: an impulse adds speed, then friction returns it to a slow drift.
  float progress=fract(z+u_dustTravel*(.65+layer*.5));
  float y=-.3+progress*1.36;
  float sway=sin(u_phase*.32+z*21.)*.014;
  gl_Position=vec4(x+sway,y,0.,1.);
  float fade=smoothstep(0.,.14,progress)*(1.-smoothstep(.76,1.,progress));
  v_light=fade*(.16+pow(layer,5.)*.75)*(1.+u_impact*.35);
  gl_PointSize=u_dpr*(u_halo>.5?11.:2.5)*(.35+pow(layer,4.)*1.4);
 }
}`;
const fragment=`
precision highp float;
uniform float u_opacity,u_halo,u_mode;
varying float v_light;
void main(){
 float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
 float falloff=u_halo>.5?exp(-r*r*4.)*.065:(1.-smoothstep(.1,1.,r));
 float alpha=falloff*v_light*(u_mode>.5?.6:u_opacity);
 gl_FragColor=vec4(vec3(alpha),alpha);
}`;
export function particleScene(canvas:HTMLCanvasElement){
 const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true});if(!gl)throw Error('WebGL unavailable');
 const p=program(gl,vertex,fragment);gl.useProgram(p);
 const mobile=matchMedia('(max-width:680px)').matches;
 const sea:number[]=[];const nx=mobile?150:240,nz=mobile?70:110;
 for(let layer=0;layer<3;layer++)for(let row=0;row<nz;row++)for(let col=0;col<nx;col++)sea.push(col/(nx-1)*2-1,row/(nz-1),layer);
 let seed=491;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const dust:number[]=[];for(let i=0;i<(mobile?95:180);i++)dust.push(random()*2-1,random(),random());
 const make=(data:number[])=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return b;};
 const seaBuffer=make(sea),dustBuffer=make(dust);
 const attr=gl.getAttribLocation(p,'a_point');gl.enableVertexAttribArray(attr);
 const names=['phase','bass','mid','high','impact','dpr','mode','halo','dustTravel','motion','waveHeight','opacity'];
 const locations=Object.fromEntries(names.map(n=>[n,gl.getUniformLocation(p,'u_'+n)]));
 const set=(n:string,v:number)=>gl.uniform1f(locations[n],v);const bands=gl.getUniformLocation(p,'u_bands[0]');
 gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.clearColor(0,0,0,0);
 return {
  draw(f:SceneFrame){
   const dpr=Math.min(devicePixelRatio||1,mobile?1.25:1.5),w=Math.round(innerWidth*dpr),h=Math.round(innerHeight*dpr);
   if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
   gl.clear(gl.COLOR_BUFFER_BIT);
   set('phase',f.phase);set('bass',f.bass);set('mid',f.mid);set('high',f.high);set('impact',f.impact);set('dustTravel',f.dustTravel);set('motion',f.motion);
   set('dpr',dpr);set('waveHeight',V.waveHeight);set('opacity',f.opacity);gl.uniform1fv(bands,f.bands);
   for(let mode=0;mode<2;mode++){
    gl.bindBuffer(gl.ARRAY_BUFFER,mode?dustBuffer:seaBuffer);gl.vertexAttribPointer(attr,3,gl.FLOAT,false,0,0);set('mode',mode);
    for(let halo=1;halo>=0;halo--){set('halo',halo);gl.drawArrays(gl.POINTS,0,(mode?dust:sea).length/3);}
   }
  },
  destroy(){gl.deleteBuffer(seaBuffer);gl.deleteBuffer(dustBuffer);gl.deleteProgram(p);},
 };
}
