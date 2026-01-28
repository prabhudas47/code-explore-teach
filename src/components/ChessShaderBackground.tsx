import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const fragmentShader = `
uniform float iTime;
uniform vec2 iResolution;

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

float chess(vec3 p){
    vec3 g=floor(p);
    return mod(g.x+g.y+g.z,2.0);
}

// More organic living terrain
float terrain(vec3 p){
    p.y += sin(p.x*0.35+iTime*0.5)*0.4;
    p.y += sin(p.z*0.45-iTime*0.6)*0.35;
    p.y += sin((p.x+p.z)*0.2+iTime*0.4)*0.25;
    return p.y + 3.0;
}

float map(vec3 p){
    return terrain(p);
}

float trace(vec3 ro,vec3 rd){
    float d=0.;
    for(int i=0;i<150;i++){
        vec3 p=ro+rd*d;
        float h=map(p);
        if(h<.001||d>250.)break;
        d+=h*.8;
    }
    return d;
}

vec3 norm(vec3 p){
    vec2 e=vec2(.001,0);
    return normalize(vec3(
        map(p+e.xyy)-map(p-e.xyy),
        map(p+e.yxy)-map(p-e.yxy),
        map(p+e.yyx)-map(p-e.yyx)
    ));
}

void main()
{
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv=(fragCoord-0.5*iResolution.xy)/iResolution.y;
    float t=iTime;

    // 🎥 LONG CINEMATIC TRAVEL (slow forward motion)
    float speed = 1.2;                     // slower = longer world
    vec3 ro = vec3(
        sin(t*0.2)*1.5,                    // side sway
        2.5 + sin(t*0.6)*0.3,              // vertical float
        18.0 - t*speed                     // forward motion
    );

    vec3 ta = vec3(0.0, 0.0, ro.z-6.0);
    vec3 f=normalize(ta-ro);
    vec3 r=normalize(cross(vec3(0,1,0),f));
    vec3 u=cross(f,r);
    vec3 rd=normalize(f+uv.x*r+uv.y*u);

    float d=trace(ro,rd);
    vec3 col=vec3(0);

    if(d<250.){
        vec3 p=ro+rd*d;
        vec3 n=norm(p);

        vec3 white=vec3(0.95);
        vec3 black=vec3(0.01);
        vec3 base=mix(white,black,chess(p));

        vec3 light=normalize(vec3(.6,.9,.7));
        float diff=max(dot(n,light),0.);
        float fres=pow(1.-max(dot(n,-rd),0.),3.);

        col=base*diff + fres*0.4;

        // Depth fog for realism
        col*=exp(-d*.035);
    }

    // 🎬 VERY LATE FADE (gives long visual experience)
    float fadeStart = 18.0;        // world visible for long time
    float fade = clamp((t-fadeStart)/4.0,0.0,1.0);
    col = mix(col, vec3(0), fade);

    gl_FragColor=vec4(col,1.);
}
`;

const vertexShader = `
void main() {
    gl_Position = vec4(position, 1.0);
}
`;

export const ChessShaderBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop with visibility check
    let isVisible = true;

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        startTimeRef.current = Date.now() - (material.uniforms.iTime.value * 1000);
        animate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      if (!isVisible) return;

      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      material.uniforms.iTime.value = elapsed;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      material.uniforms.iResolution.value.set(
        width * renderer.getPixelRatio(),
        height * renderer.getPixelRatio()
      );
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10"
      style={{ background: '#000' }}
    >
      {/* Vignette overlay for content readability */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.5)_70%,hsl(var(--background)/0.85)_100%)]" />
      
      {/* Top fade for navigation */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/90 via-background/50 to-transparent pointer-events-none" />
      
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
    </div>
  );
};
