import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ArrowRight, Sparkles } from "lucide-react";

const fragmentShader = `
uniform float iTime;
uniform vec2 iResolution;

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

float chess(vec3 p){
    vec3 g=floor(p);
    return mod(g.x+g.y+g.z,2.0);
}

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

    float speed = 1.2;
    vec3 ro = vec3(
        sin(t*0.2)*1.5,
        2.5 + sin(t*0.6)*0.3,
        18.0 - mod(t*speed, 36.0)  // Loop infinitely
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
        col*=exp(-d*.035);
    }

    gl_FragColor=vec4(col,1.);
}
`;

const vertexShader = `
void main() {
    gl_Position = vec4(position, 1.0);
}
`;

export const ChessShaderHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.borderRadius = '24px';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(
          width * renderer.getPixelRatio(),
          height * renderer.getPixelRatio()
        )}
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

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

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      material.uniforms.iResolution.value.set(
        w * renderer.getPixelRatio(),
        h * renderer.getPixelRatio()
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left - Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Status badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-medium mb-8 animate-fade-up opacity-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              Open to opportunities
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6 animate-fade-up opacity-0 animate-delay-100">
              Building the future
              <br />
              <span className="text-gradient inline-flex items-center gap-3">
                through technology
                <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-primary animate-pulse" />
              </span>
            </h1>
            
            {/* Supporting text */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-up opacity-0 animate-delay-200">
              Computer Science undergraduate focused on data science, 
              analytical thinking, and building meaningful solutions.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up opacity-0 animate-delay-300">
              <button
                onClick={scrollToContact}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all duration-500 shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.4)] hover:-translate-y-1"
              >
                Connect
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-border/60 text-foreground font-semibold rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-500 hover:-translate-y-1"
              >
                Explore Profile
              </button>
            </div>
          </div>
          
          {/* Right - Shader Display */}
          <div className="order-1 lg:order-2 animate-fade-up opacity-0 animate-delay-200">
            <div 
              ref={containerRef}
              className="relative w-full aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden border border-border/30 shadow-deep"
              style={{ background: '#000' }}
            >
              {/* Subtle corner glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            </div>
            
            {/* Caption */}
            <p className="text-center text-sm text-muted-foreground mt-4 font-medium">
              Interactive 3D Chess World • WebGL Shader
            </p>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in opacity-0 animate-delay-600">
        <button
          onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-muted-foreground/50 to-transparent" />
        </button>
      </div>
    </section>
  );
};
