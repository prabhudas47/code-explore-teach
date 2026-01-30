import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const fragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iScroll;

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

float chess(vec3 p){
    vec3 g=floor(p);
    return mod(g.x+g.y+g.z,2.0);
}

// More organic living terrain with mouse influence
float terrain(vec3 p, vec2 mouse, float scroll){
    // Base wave motion
    p.y += sin(p.x*0.35+iTime*0.5)*0.4;
    p.y += sin(p.z*0.45-iTime*0.6)*0.35;
    p.y += sin((p.x+p.z)*0.2+iTime*0.4)*0.25;
    
    // Mouse-driven wave ripples (stronger dramatic effect)
    float mouseInfluence = sin(p.x*0.4 + mouse.x*5.0)*0.4 + sin(p.z*0.4 + mouse.y*5.0)*0.4;
    mouseInfluence += sin((p.x-p.z)*0.25 + mouse.x*4.0 + mouse.y*4.0)*0.3;
    p.y += mouseInfluence * 1.2;
    
    // Scroll-driven forward wave pulse
    p.y += sin(p.z*0.2 - scroll*0.003)*0.3;
    
    return p.y + 3.0;
}

float map(vec3 p, vec2 mouse, float scroll){
    return terrain(p, mouse, scroll);
}

float trace(vec3 ro, vec3 rd, vec2 mouse, float scroll){
    float d=0.;
    for(int i=0;i<150;i++){
        vec3 p=ro+rd*d;
        float h=map(p, mouse, scroll);
        if(h<.001||d>250.)break;
        d+=h*.8;
    }
    return d;
}

vec3 norm(vec3 p, vec2 mouse, float scroll){
    vec2 e=vec2(.001,0);
    return normalize(vec3(
        map(p+e.xyy, mouse, scroll)-map(p-e.xyy, mouse, scroll),
        map(p+e.yxy, mouse, scroll)-map(p-e.yxy, mouse, scroll),
        map(p+e.yyx, mouse, scroll)-map(p-e.yyx, mouse, scroll)
    ));
}

void main()
{
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv=(fragCoord-0.5*iResolution.xy)/iResolution.y;
    float t=iTime;
    
    // Normalized mouse position (-1 to 1)
    vec2 mouse = iMouse / iResolution - 0.5;
    float scroll = iScroll;

    // 🎥 CINEMATIC TRAVEL with mouse parallax
    float speed = 1.2;
    vec3 ro = vec3(
        sin(t*0.2)*1.5 + mouse.x * 2.0,     // side sway + mouse X parallax
        2.5 + sin(t*0.6)*0.3 + mouse.y * 1.0, // vertical float + mouse Y parallax
        18.0 - t*speed - scroll*0.01          // forward motion + scroll influence
    );

    // Look target follows mouse subtly
    vec3 ta = vec3(mouse.x * 1.5, mouse.y * 0.5, ro.z - 6.0);
    vec3 f=normalize(ta-ro);
    vec3 r=normalize(cross(vec3(0,1,0),f));
    vec3 u=cross(f,r);
    vec3 rd=normalize(f+uv.x*r+uv.y*u);

    float d=trace(ro, rd, mouse, scroll);
    vec3 col=vec3(0);

    if(d<250.){
        vec3 p=ro+rd*d;
        vec3 n=norm(p, mouse, scroll);

        vec3 white=vec3(1.95);
        vec3 black=vec3(0.01);
        vec3 base=mix(white,black,chess(p));

        vec3 light=normalize(vec3(.6,.9,.7));
        float diff=max(dot(n,light),0.);
        float fres=pow(1.-max(dot(n,-rd),0.),3.);

        col=base*diff + fres*1.4;

        // Depth fog for realism
        col*=exp(-d*.035);
    }

    // 🎬 VERY LATE FADE (gives long visual experience)
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

export const ChessShaderBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const scrollRef = useRef<number>(0);
  const targetScrollRef = useRef<number>(0);

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
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iMouse: { value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2) },
        iScroll: { value: 0 }
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking with smooth interpolation
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current.x = e.clientX;
      targetMouseRef.current.y = window.innerHeight - e.clientY; // Flip Y for shader
    };

    // Touch tracking for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetMouseRef.current.x = touch.clientX;
        targetMouseRef.current.y = window.innerHeight - touch.clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetMouseRef.current.x = touch.clientX;
        targetMouseRef.current.y = window.innerHeight - touch.clientY;
      }
    };

    // Scroll tracking
    const handleScroll = () => {
      targetScrollRef.current = window.scrollY;
    };

    // Wheel event for scroll-like motion even on single-page
    const handleWheel = (e: WheelEvent) => {
      targetScrollRef.current += e.deltaY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleWheel);

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

      // Smooth mouse interpolation (lerp factor 0.08 for natural feel)
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.08;
      material.uniforms.iMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      // Smooth scroll interpolation
      scrollRef.current += (targetScrollRef.current - scrollRef.current) * 0.1;
      material.uniforms.iScroll.value = scrollRef.current;

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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
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
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: '#000',
        overflow: 'hidden'
      }}
    >
    </div>
  );
};
