export type SnowFrame = { time:number; beat:number; impact:number; opacity:number };

function program(gl:WebGLRenderingContext, vertex:string, fragment:string){
  const shaders=[gl.VERTEX_SHADER,gl.FRAGMENT_SHADER].map((type,i)=>{
    const shader=gl.createShader(type)!;
    gl.shaderSource(shader,i===0?vertex:fragment);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader)||'Shader failed');
    return shader;
  });
  const output=gl.createProgram()!;
  shaders.forEach(shader=>gl.attachShader(output,shader));
  gl.linkProgram(output);
  shaders.forEach(shader=>gl.deleteShader(shader));
  if(!gl.getProgramParameter(output,gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(output)||'Link failed');
  return output;
}

const vertex=`
precision highp float;
attribute vec3 a_point;
uniform float u_time,u_beat,u_impact,u_dpr,u_halo;
varying float v_light;
float hash(float n){ return fract(sin(n)*43758.5453123); }
void main(){
  float seed=hash(a_point.z*97.13+a_point.x*31.7+a_point.y*17.9);
  float angle=seed*6.2831853+sin(u_time*.31+seed*12.)*.8;
  float speed=.018+hash(seed*41.7)*.075;
  float travel=u_time*speed;
  float dirX=cos(angle), dirY=sin(angle);
  float swirlX=sin(u_time*(.24+seed*.5)+seed*19.)*.075;
  float swirlY=cos(u_time*(.19+seed*.7)+seed*23.)*.075;
  float burst=(.03+hash(seed*71.)*.11)*u_beat;
  float x=fract(a_point.x+dirX*travel+swirlX+dirX*burst)*2.-1.;
  float y=fract(a_point.y+dirY*travel+swirlY+dirY*burst)*2.-1.;
  gl_Position=vec4(x,y,0.,1.);
  float twinkle=.45+.55*hash(seed*83.+u_time*(.8+seed*2.));
  v_light=twinkle*(.65+u_beat*.95+u_impact*.35);
  gl_PointSize=u_dpr*(u_halo>.5?7.5:1.6)*(1.+hash(seed*53.)*2.8)*(1.+u_beat*.75);
}
`;

const fragment=`
precision highp float;
uniform float u_opacity,u_halo;
varying float v_light;
void main(){
  float r=length(gl_PointCoord-.5)*2.;
  if(r>1.) discard;
  float falloff=u_halo>.5?exp(-r*r*3.)*.16:(1.-smoothstep(.18,1.,r));
  float alpha=falloff*v_light*u_opacity;
  gl_FragColor=vec4(vec3(alpha),alpha);
}`;

export function snowScene(canvas:HTMLCanvasElement){
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true});
  if(!gl) throw Error('WebGL unavailable');
  const shader=program(gl,vertex,fragment);
  gl.useProgram(shader);
  const mobile=matchMedia('(max-width:680px)').matches;
  let seed=491;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const snow:number[]=[];
  for(let i=0;i<(mobile?650:1250);i++) snow.push(random(),random(),random());
  const buffer=gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(snow),gl.STATIC_DRAW);
  const attr=gl.getAttribLocation(shader,'a_point');
  gl.enableVertexAttribArray(attr);
  const names=['time','beat','impact','dpr','halo','opacity'];
  const locations=Object.fromEntries(names.map(name=>[name,gl.getUniformLocation(shader,'u_'+name)]));
  const set=(name:string,value:number)=>gl.uniform1f(locations[name],value);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE,gl.ONE);
  gl.clearColor(0,0,0,0);
  return {
    draw(frame:SnowFrame){
      const dpr=Math.min(devicePixelRatio||1,mobile?1.25:1.5);
      const width=Math.round(innerWidth*dpr),height=Math.round(innerHeight*dpr);
      if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}
      gl.clear(gl.COLOR_BUFFER_BIT);
      set('time',frame.time);set('beat',frame.beat);set('impact',frame.impact);set('dpr',dpr);set('opacity',frame.opacity);
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.vertexAttribPointer(attr,3,gl.FLOAT,false,0,0);
      for(let halo=1;halo>=0;halo--){set('halo',halo);gl.drawArrays(gl.POINTS,0,snow.length/3);}
    },
    destroy(){gl.deleteBuffer(buffer);gl.deleteProgram(shader);},
  };
}
