import { VISUALIZER as V } from './visualizer-config';

export type SceneFrame = { phase: number; bass: number; mid: number; high: number; impact: number; opacity: number; motion: number; bands?: Float32Array };
function program(gl: WebGLRenderingContext, vertex: string, fragment: string) {
  const shaders = [gl.VERTEX_SHADER,gl.FRAGMENT_SHADER].map((type,i)=>{
    const shader=gl.createShader(type)!;gl.shaderSource(shader,i===0?vertex:fragment);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader)||'Shader failed');
    return shader;
  });
  const p=gl.createProgram()!;shaders.forEach(s=>gl.attachShader(p,s));gl.linkProgram(p);
  shaders.forEach(s=>gl.deleteShader(s));
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'Program failed');
  return p;
}
const vertex=`
precision highp float;
attribute vec3 a_point;
uniform float u_phase,u_bass,u_mid,u_high,u_impact,u_radius,u_dpr,u_size,u_motion,u_pointSize,u_gain;
uniform float u_bands[32];
varying float v_light;
mat2 rotate(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
void main(){
 float lat=a_point.x,lon=a_point.y,layer=a_point.z;
 float t=u_phase*(.55+layer*.045);
 vec3 normal=vec3(sin(lat)*cos(lon),cos(lat),sin(lat)*sin(lon));
 // A spherical membrane keeps the circular silhouette visible throughout the motion.
 normal.xz=rotate(t*.2+layer*.14)*normal.xz;
 normal.yz=rotate(.18*sin(t*.27+layer*.6))*normal.yz;
 float az=atan(normal.y,normal.x);
 float spectralPosition=abs(az+1.5707963)/4.712389*31.;
 int bandIndex=int(clamp(floor(spectralPosition),0.,31.));
 float energy=u_bands[bandIndex];
 float fold=sin(lon*3.+lat*4.+t*1.7+layer*.8)*cos(lat*2.-lon-t*.7);
 float fine=sin(az*17.-t*3.+layer)*sin(az*9.+t*1.8);
 float rim=pow(1.-abs(normal.z),5.);
 float surface=.96+layer*.012;
 // Interior sheets billow deeply; the outer boundary only ripples slightly.
 float displacement=fold*(.16*(1.-rim)+.014)*u_motion;
 displacement+=rim*(energy*.035+fine*(.004+.018*u_high)+u_impact*.025)*u_motion*u_gain;
 vec3 p=normal*(surface+displacement);
 float perspective=1./(1.-p.z*.06);
 gl_Position=vec4(p.xy*u_radius*(1.+u_bass*.025*u_motion)*perspective,0.,1.);
 float lowerArc=1.-smoothstep(-.65,.8,normal.y);
 float movingPatch=.75+.25*sin(az*3.-t*1.2+fold);
 float edgeLight=pow(1.-abs(normal.z),4.)*(.16+.84*lowerArc)*movingPatch;
 float sheetLight=.025+.085*pow(abs(fold),6.);
 v_light=(edgeLight*1.9+sheetLight)*(layer<.5?1.:.55);
 gl_PointSize=u_pointSize*u_dpr*(.72+min(1.,edgeLight)*.35)*max(.8,u_size/720.);
}`;
const fragment=`
precision mediump float;
uniform float u_opacity,u_halo,u_line;
varying float v_light;
void main(){
 if(u_line>.5){float a=.05*v_light*u_opacity;gl_FragColor=vec4(vec3(a),a);return;}
 float r=length(gl_PointCoord-.5)*2.;
 if(r>1.)discard;
 float shape=u_halo>.5?exp(-r*r*4.)*.19:(1.-smoothstep(.18,1.,r))*.62;
 float a=shape*v_light*u_opacity;
 gl_FragColor=vec4(vec3(a),a);
}`;

export function particleScene(canvas: HTMLCanvasElement) {
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true});
  if(!gl)throw new Error('WebGL unavailable');
  const p=program(gl,vertex,fragment);gl.useProgram(p);
  const mobile=matchMedia('(max-width:680px)').matches;
  const points:number[]=[];const rows=mobile?80:112,cols=mobile?224:336;
  for(let l=0;l<V.layers;l++)for(let row=1;row<rows;row++)for(let col=0;col<cols;col++)points.push(Math.acos(1-2*row/rows),col/cols*Math.PI*2,l);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);
  const attr=gl.getAttribLocation(p,'a_point');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,3,gl.FLOAT,false,0,0);
  const names=['phase','bass','mid','high','impact','radius','dpr','size','motion','pointSize','opacity','halo','gain','line'];
  const uniforms=Object.fromEntries(names.map(n=>[n,gl.getUniformLocation(p,'u_'+n)]));
  const set=(n:string,v:number)=>gl.uniform1f(uniforms[n],v);
  const bands=gl.getUniformLocation(p,'u_bands[0]');const silentBands=new Float32Array(32);
  gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.clearColor(0,0,0,0);
  let width=0,dpr=1;
  return {
    draw(f:SceneFrame){
      const next=canvas.getBoundingClientRect().width; const ratio=Math.min(devicePixelRatio||1,mobile?1.5:1.75);
      if(width!==next||dpr!==ratio){width=next;dpr=ratio;canvas.width=Math.round(width*dpr);canvas.height=canvas.width;gl.viewport(0,0,canvas.width,canvas.height);}
      gl.clear(gl.COLOR_BUFFER_BIT);if(f.opacity<.003||!width)return;
      gl.uniform1fv(bands,f.bands||silentBands);set('gain',V.gain);set('bass',f.bass);set('mid',f.mid);set('high',f.high);set('impact',f.impact);set('motion',f.motion);
      set('radius',V.radius*2/2.25);set('dpr',dpr);set('size',width);
      // One dim past pose supplies an afterimage without accumulating stale pixels.
      set('line',0);
      for(let pass=0;pass<3;pass++){
        set('phase',f.phase-(pass===0?V.trailSeconds*V.rotationSpeed:0));
        set('opacity',f.opacity*(pass===0?.16:1));set('halo',pass===2?1:0);set('pointSize',pass===2?V.glow*.5:1.4);
        gl.drawArrays(gl.POINTS,0,points.length/3);
      }
      // Sparse faint threads reveal the moving membranes inside the glowing rim.
      set('line',1);set('opacity',f.opacity);set('phase',f.phase);
      for(let l=0;l<V.layers;l++)for(let ring=1;ring<=8;ring++){
        const row=Math.round(ring/9*(rows-2));
        gl.drawArrays(gl.LINE_LOOP,(l*(rows-1)+row)*cols,cols);
      }
    },
    destroy(){gl.deleteBuffer(buffer);gl.deleteProgram(p);},
  };
}

const backgroundVertex=`attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
const backgroundFragment=`
precision highp float;
varying vec2 v_uv;
uniform float u_phase,u_opacity,u_bass,u_impact,u_aspect;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float sum=0.,amp=.5;mat2 turn=mat2(.8,-.6,.6,.8);for(int i=0;i<4;i++){sum+=amp*noise(p);p=turn*p*2.07+vec2(11.3,7.1);amp*=.5;}return sum;}
void main(){
 vec2 p=(v_uv-.5)*vec2(u_aspect,1.)*3.6;
 float t=u_phase*.8;
 float beat=u_bass*.85+u_impact*1.4;
 // Audio changes the velocity AND the shape of the flow field, not only opacity.
 p*=1.-min(.16,beat*.1);
 vec2 advect=vec2(t*.27,-t*.19);
 vec2 q=vec2(fbm(p+advect),fbm(p+vec2(4.7,8.3)-advect*.8));
 vec2 r=vec2(fbm(p+q*(2.8+beat)+vec2(1.7+t*.31,9.2)),fbm(p+q*(2.8+beat)+vec2(8.3,2.8-t*.24)));
 vec2 warped=p+r*(3.6+beat*1.7)+advect;
 float field=fbm(warped*2.4);
 float filaments=pow(max(0.,1.-abs(field-.48)*12.),7.);
 float wisps=pow(fbm(warped*.85),3.);
 float fine=pow(max(0.,1.-abs(fbm(warped*5.)-.5)*15.),9.);
 float light=filaments*(.2+wisps*2.)+fine*.075+wisps*.24;
 float vignette=1.-smoothstep(.3,1.2,length(v_uv-.5));
 float a=u_opacity*vignette;
 gl_FragColor=vec4(vec3(min(.85,light))*a,a);
}`;
export function plasmaScene(canvas: HTMLCanvasElement) {
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true});
  if(!gl)throw new Error('WebGL unavailable');
  const p=program(gl,backgroundVertex,backgroundFragment);gl.useProgram(p);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const a=gl.getAttribLocation(p,'a_position');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  const phase=gl.getUniformLocation(p,'u_phase'),opacity=gl.getUniformLocation(p,'u_opacity'),bass=gl.getUniformLocation(p,'u_bass'),impact=gl.getUniformLocation(p,'u_impact'),aspect=gl.getUniformLocation(p,'u_aspect');
  gl.clearColor(0,0,0,0);
  return {
    draw(f:SceneFrame){
      const scale=Math.min(1,850/innerWidth),w=Math.round(innerWidth*scale),h=Math.round(innerHeight*scale);
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
      gl.clear(gl.COLOR_BUFFER_BIT);if(f.opacity<.003||!V.backgroundEnabled)return;
      gl.uniform1f(phase,f.phase);gl.uniform1f(opacity,f.opacity*V.backgroundOpacity);gl.uniform1f(bass,f.bass*f.motion);gl.uniform1f(impact,f.impact*f.motion);gl.uniform1f(aspect,w/h);
      gl.drawArrays(gl.TRIANGLES,0,6);
    },
    destroy(){gl.deleteBuffer(buffer);gl.deleteProgram(p);},
  };
}
