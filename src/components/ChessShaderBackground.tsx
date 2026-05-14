import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { bgPerf, isLowPowerForced, setLowPowerForced } from '@/lib/bgPerf';
import { getOrientationSensitivity, getPauseOnIdle, getLowPowerFpsThreshold, getLowPowerWindows } from '@/lib/bgSettings';

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

    float fadeStart = 5.0;
    float fade = clamp((t-fadeStart)/1.0,0.0,1.0);
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

    // If user (or a previous session) forced low-power, skip WebGL entirely.
    if (isLowPowerForced()) {
      bgPerf.set({ active: false, lowPower: true, parallax: 0, dpr: 1, fps: 0 });
      // Still notify the intro that fade is "complete" so the page can mount.
      const t = setTimeout(() => onFadeComplete?.(), 50);
      return () => clearTimeout(t);
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const isReducedMotion = () =>
      document.documentElement.getAttribute('data-reduced-motion') === 'true' ||
      (document.documentElement.getAttribute('data-reduced-motion') !== 'false' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    let reducedMotion = isReducedMotion();

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

    // Device orientation -> subtle camera drift on mobile/tablet
    // gamma: left-right tilt (-90..90), beta: front-back tilt (-180..180)
    let orientationActive = false;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      orientationActive = true;
      const sens = getOrientationSensitivity(); // user-tunable, 0..1
      const gx = Math.max(-25, Math.min(25, e.gamma)) / 25;
      const gy = Math.max(-25, Math.min(25, (e.beta ?? 0) - 35)) / 25;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetMouseRef.current.x = cx + gx * cx * sens;
      targetMouseRef.current.y = cy + gy * cy * sens;
    };
    const isTouchDevice = 'ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0;
    if (isTouchDevice && !reducedMotion) {
      // iOS 13+ requires explicit permission; attempt silently and listen if granted
      const DOE = (window as any).DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === 'function') {
        // Defer until first user gesture
        const requestOnce = () => {
          DOE.requestPermission().then((state: string) => {
            if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation);
          }).catch(() => {});
          window.removeEventListener('touchend', requestOnce);
        };
        window.addEventListener('touchend', requestOnce, { once: true, passive: true });
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }

    // Live-react to user toggling reduce-motion via the visible toggle
    const motionObserver = new MutationObserver(() => {
      const next = isReducedMotion();
      if (next === reducedMotion) return;
      reducedMotion = next;
      material.uniforms.iParallax.value = next ? 0.0 : 1.0;
    });
    motionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduced-motion'] });

    let isVisible = true;
    let isPausedForIdle = false;

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !isPausedForIdle) {
        startTimeRef.current = Date.now() - (material.uniforms.iTime.value * 1000);
        animate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Idle-pause: stop rendering after N seconds of no input (reading mode)
    const IDLE_MS = 6000;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const resumeFromIdle = () => {
      if (!isPausedForIdle) return;
      isPausedForIdle = false;
      bgPerf.set({ active: true });
      startTimeRef.current = Date.now() - (material.uniforms.iTime.value * 1000);
      animate();
    };
    const pauseForIdle = () => {
      if (!getPauseOnIdle()) return;
      // Don't pause during the cinematic intro fade window
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed < 4) return;
      isPausedForIdle = true;
      bgPerf.set({ active: false });
    };
    const resetIdleTimer = () => {
      resumeFromIdle();
      if (idleTimer) clearTimeout(idleTimer);
      if (getPauseOnIdle()) idleTimer = setTimeout(pauseForIdle, IDLE_MS);
    };
    ['mousemove', 'touchstart', 'scroll', 'keydown'].forEach((ev) =>
      window.addEventListener(ev, resetIdleTimer, { passive: true })
    );
    resetIdleTimer();

    // Adaptive quality state — scales pixel ratio + parallax intensity to hold ~60fps
    const maxDpr = isMobile ? Math.min(window.devicePixelRatio, 1.0) : Math.min(window.devicePixelRatio, 1.5);
    const minDpr = isMobile ? 0.6 : 0.75;
    let currentDpr = maxDpr;
    let targetParallax = reducedMotion ? 0.0 : 1.0;
    let lastFrameTs = performance.now();
    let frameAccum = 0;
    let frameCount = 0;
    let lastQualityAdjust = performance.now();
    let lowFpsStreak = 0; // consecutive 1s windows below target while already at min quality

    bgPerf.set({ active: true, dpr: currentDpr, parallax: targetParallax, lowPower: false });

    const animate = () => {
      if (!isVisible || isPausedForIdle) return;

      const now = performance.now();
      const dt = now - lastFrameTs;
      lastFrameTs = now;
      frameAccum += dt;
      frameCount++;

      // Sample FPS every ~1s and adapt quality
      if (now - lastQualityAdjust > 1000 && frameCount > 10) {
        const avgMs = frameAccum / frameCount;
        const fps = 1000 / avgMs;
        if (!reducedMotion) {
          const lpFpsThreshold = getLowPowerFpsThreshold();
          const lpWindowsRequired = getLowPowerWindows();
          if (fps < 50 && (currentDpr > minDpr || targetParallax > 0.45)) {
            currentDpr = Math.max(minDpr, currentDpr - 0.15);
            targetParallax = Math.max(0.45, targetParallax - 0.15);
            renderer.setPixelRatio(currentDpr);
            material.uniforms.iResolution.value.set(window.innerWidth * currentDpr, window.innerHeight * currentDpr);
            lowFpsStreak = 0;
          } else if (fps < lpFpsThreshold && currentDpr <= minDpr + 0.001) {
            // Already at the floor and still struggling — escalate
            lowFpsStreak++;
            if (lowFpsStreak >= lpWindowsRequired) {
              setLowPowerForced(true);
              bgPerf.set({ lowPower: true, active: false, fps, dpr: currentDpr, parallax: 0 });
              cancelAnimationFrame(animationRef.current);
              if (!fadeCalledRef.current) {
                fadeCalledRef.current = true;
                onFadeComplete?.();
              }
              return;
            }
          } else if (fps > 58 && (currentDpr < maxDpr || targetParallax < 1.0)) {
            currentDpr = Math.min(maxDpr, currentDpr + 0.1);
            targetParallax = Math.min(1.0, targetParallax + 0.1);
            renderer.setPixelRatio(currentDpr);
            material.uniforms.iResolution.value.set(window.innerWidth * currentDpr, window.innerHeight * currentDpr);
            lowFpsStreak = 0;
          } else {
            lowFpsStreak = 0;
          }
          material.uniforms.iParallax.value += (targetParallax - material.uniforms.iParallax.value) * 0.5;
        }
        bgPerf.set({
          fps,
          dpr: currentDpr,
          parallax: material.uniforms.iParallax.value,
          active: true,
        });
        frameAccum = 0;
        frameCount = 0;
        lastQualityAdjust = now;
      }

      const rawElapsed = (Date.now() - startTimeRef.current) / 1000;
      const elapsed = reducedMotion ? rawElapsed * 0.08 : rawElapsed;
      material.uniforms.iTime.value = elapsed;

      if (reducedMotion) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        mouseRef.current.x = cx;
        mouseRef.current.y = cy;
      } else {
        const lerp = orientationActive ? 0.08 : 0.3;
        mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * lerp;
        mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * lerp;
      }
      const pr = renderer.getPixelRatio();
      material.uniforms.iMouse.value.set(mouseRef.current.x * pr, mouseRef.current.y * pr);

      if (rawElapsed > 4 && !fadeCalledRef.current) {
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
      window.removeEventListener('deviceorientation', handleOrientation);
      ['mousemove', 'touchstart', 'scroll', 'keydown'].forEach((ev) =>
        window.removeEventListener(ev, resetIdleTimer)
      );
      if (idleTimer) clearTimeout(idleTimer);
      motionObserver.disconnect();
      bgPerf.set({ active: false });
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
