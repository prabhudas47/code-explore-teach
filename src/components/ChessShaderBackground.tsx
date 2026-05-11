import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const fragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iParallax;

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

float chess(vec3 p){
    vec3 g=floor(p);
    return mod(g.x+g.y+g.z,2.0);
}

// More organic living terrain - cinematic, faster, layered depth
float terrain(vec3 p){
    // Foreground (high-frequency, faster) - more active near camera
    p.y += sin(p.x*0.45+iTime*0.85)*0.42;
    p.y += sin(p.z*0.55-iTime*0.95)*0.36;
    // Mid layer
    p.y += sin((p.x+p.z)*0.25+iTime*0.65)*0.26;
    // Background (low-frequency, slower) - parallax depth
    p.y += sin(p.x*0.12 - iTime*0.35)*0.18;
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

    // Normalized mouse (-0.5 to 0.5), scaled by adaptive parallax intensity
    vec2 mouse = (iMouse / iResolution - 0.5) * iParallax;

    float speed = 1.75;
    vec3 ro = vec3(
        sin(t*0.28)*1.7 + mouse.x * 4.0,
        2.5 + sin(t*0.85)*0.35 + mouse.y * 1.4,
        18.0 - t*speed - mouse.y * 7.5
    );

    vec3 ta = vec3(
        mouse.x * 2.6,
        0.0 + mouse.y * 0.7,
        ro.z-6.0
    );

    vec3 f=normalize(ta-ro);
    vec3 r=normalize(cross(vec3(0,1,0),f));
    vec3 u=cross(f,r);
    vec3 rd=normalize(f+uv.x*r+uv.y*u);

    float d=trace(ro,rd);
    vec3 col=vec3(0);

    if(d<250.){
        vec3 p=ro+rd*d;
        vec3 n=norm(p);

        vec3 white=vec3(1.95);
        vec3 black=vec3(0.01);
        vec3 base=mix(white,black,chess(p));

        vec3 light=normalize(vec3(.6,.9,.7));
        float diff=max(dot(n,light),0.);
        float fres=pow(1.-max(dot(n,-rd),0.),3.);

        col=base*diff + fres*1.4;
        col*=exp(-d*.035);
    }

    float fadeStart = 18.0;
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

interface Props {
  onFadeComplete?: () => void;
}

export const ChessShaderBackground = ({ onFadeComplete }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const fadeCalledRef = useRef(false);
  const mouseRef = useRef<{ x: number; y: number }>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      alpha: true,
      powerPreference: isMobile ? 'default' : 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Lower pixel ratio on mobile for smooth performance
    const dpr = isMobile ? Math.min(window.devicePixelRatio, 1.0) : Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
        iMouse: { value: new THREE.Vector2(window.innerWidth * dpr / 2, window.innerHeight * dpr / 2) },
        iParallax: { value: reducedMotion ? 0.0 : 1.0 },
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current.x = e.clientX;
      targetMouseRef.current.y = window.innerHeight - e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseRef.current.x = e.touches[0].clientX;
        targetMouseRef.current.y = window.innerHeight - e.touches[0].clientY;
      }
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseRef.current.x = e.touches[0].clientX;
        targetMouseRef.current.y = window.innerHeight - e.touches[0].clientY;
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = window.innerHeight - e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

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

      const rawElapsed = (Date.now() - startTimeRef.current) / 1000;
      // Reduced motion: slow time to a near-still drift, lock mouse to center
      const elapsed = reducedMotion ? rawElapsed * 0.08 : rawElapsed;
      material.uniforms.iTime.value = elapsed;

      if (reducedMotion) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        mouseRef.current.x = cx;
        mouseRef.current.y = cy;
      } else {
        // Fast mouse lerp - nearly instant reaction
        mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.3;
        mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.3;
      }
      const pr = renderer.getPixelRatio();
      material.uniforms.iMouse.value.set(mouseRef.current.x * pr, mouseRef.current.y * pr);

      // Notify when fade to black is complete (~23s of real time)
      if (rawElapsed > 23 && !fadeCalledRef.current) {
        fadeCalledRef.current = true;
        onFadeComplete?.();
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      const currentDpr = renderer.getPixelRatio();
      material.uniforms.iResolution.value.set(width * currentDpr, height * currentDpr);
      // Reset mouse to center on resize/orientation change
      mouseRef.current.x = width / 2;
      mouseRef.current.y = height / 2;
      targetMouseRef.current.x = width / 2;
      targetMouseRef.current.y = height / 2;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => setTimeout(handleResize, 100));

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationRef.current);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      geometry.dispose();
      material.dispose();
    };
  }, [onFadeComplete]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        background: '#000',
        overflow: 'hidden'
      }}
    />
  );
};
