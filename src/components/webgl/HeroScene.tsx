import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/components/theme-provider';

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  attribute float aScale;
  attribute float aOffset;
  varying float vAlpha;

  // cheap pseudo-curl drift
  vec2 drift(vec2 p, float t, float seed) {
    float a = sin(p.y * 0.6 + t * 0.35 + seed * 6.28);
    float b = cos(p.x * 0.5 - t * 0.28 + seed * 6.28);
    return vec2(a, b) * 0.35;
  }

  void main() {
    vec3 pos = position;
    pos.xy += drift(pos.xy, uTime, aOffset);

    // pointer repulsion — particles flow around the cursor
    vec2 toMouse = pos.xy - uMouse;
    float dist = length(toMouse);
    float force = smoothstep(2.4, 0.0, dist) * uMouseActive;
    pos.xy += normalize(toMouse + 0.0001) * force * 1.4;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * (26.0 / -mv.z);

    vAlpha = 0.35 + 0.45 * sin(uTime * 0.5 + aOffset * 6.28);
    vAlpha *= 1.0 + force * 1.2;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.15, d);
    gl_FragColor = vec4(uColor, vAlpha * soft);
  }
`;

const ParticleField = ({ count, color }: { count: number; color: string }) => {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(99, 99));
  const target = useRef(new THREE.Vector2(99, 99));
  const active = useRef(0);
  const { viewport } = useThree();
  const coarse = isCoarsePointer();

  const { positions, scales, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      scales[i] = 0.5 + Math.random() * 1.5;
      offsets[i] = Math.random();
    }
    return { positions, scales, offsets };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uMouseActive: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uColor.value.set(color);

    if (!coarse) {
      // pointer in NDC → world units on the z=0 plane
      target.current.set(
        (state.pointer.x * viewport.width) / 2,
        (state.pointer.y * viewport.height) / 2
      );
      const hasPointer =
        Math.abs(state.pointer.x) > 0.0001 || Math.abs(state.pointer.y) > 0.0001;
      active.current = THREE.MathUtils.lerp(
        active.current,
        hasPointer ? 1 : 0,
        delta * 3
      );
      mouse.current.lerp(target.current, delta * 6);
      mat.current.uniforms.uMouse.value.copy(mouse.current);
      mat.current.uniforms.uMouseActive.value = active.current;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aOffset" args={[offsets, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};

/**
 * Cursor-reactive ink particle field behind the hero type.
 * Cheap mobile variant: fewer particles, no pointer tracking.
 */
const HeroScene = () => {
  const { resolvedTheme } = useTheme();
  const coarse = isCoarsePointer();

  // ink-muted tones per theme — readable but recessive behind type
  const color = resolvedTheme === 'dark' ? '#9C9486' : '#6A6258';
  const count = coarse ? 1500 : 5000;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <ParticleField count={count} color={color} />
    </Canvas>
  );
};

export default HeroScene;
