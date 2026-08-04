import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { createLiquidMaterial } from './liquidShader';

/** Linear interpolation used for all pointer/scroll easing. */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Document scroll progress in the 0..1 range. */
function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

/**
 * The hero blob: an icosphere displaced by simplex noise in the vertex
 * shader. Pointer position tilts it, scroll position scales, spins and
 * calms the distortion so the shape "settles" as the visitor reads on.
 */
function LiquidBlob() {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  // Built once; disposed on unmount.
  const { material, uniforms } = useMemo(() => createLiquidMaterial(), []);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.45, 24), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // The canvas sits behind the page with pointer-events disabled, so R3F's
  // own pointer state never updates. Track the pointer on window instead.
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_state, delta) => {
    // Clamp delta so a dropped frame or a background tab can't cause a jump.
    const d = Math.min(delta, 1 / 30);
    const p = pointer.current;

    // Ease the pointer for weight; raw values feel twitchy.
    p.x = lerp(p.x, p.tx, 1 - Math.pow(0.001, d));
    p.y = lerp(p.y, p.ty, 1 - Math.pow(0.001, d));

    const progress = scrollProgress();

    uniforms.uTime.value += d;
    uniforms.uPointer.value.set(p.x, p.y);

    // Distortion relaxes and the blob shrinks/fades as the page scrolls.
    uniforms.uDistort.value = lerp(uniforms.uDistort.value, 0.36 - progress * 0.2, 0.08);
    uniforms.uOpacity.value = lerp(uniforms.uOpacity.value, 0.9 - progress * 0.45, 0.08);

    if (group.current) {
      // Tilt toward the cursor.
      group.current.rotation.x = lerp(group.current.rotation.x, p.y * 0.32, 0.06);
      group.current.rotation.y = lerp(group.current.rotation.y, p.x * 0.42, 0.06);

      // Scroll drives an extra spin plus a gentle scale-down.
      group.current.rotation.z = progress * Math.PI * 0.6;

      const scale = 1 - progress * 0.28;
      group.current.scale.setScalar(lerp(group.current.scale.x, scale, 0.08));

      // Drift upward slightly so it parallaxes against the content.
      group.current.position.y = lerp(group.current.position.y, progress * 1.1, 0.08);
    }

    // Constant slow self-rotation keeps it alive when the pointer is still.
    if (mesh.current) mesh.current.rotation.y += d * 0.12;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.5}>
      <group ref={group}>
        <mesh ref={mesh} geometry={geometry} material={material} />
      </group>
    </Float>
  );
}

/**
 * Sparse particle field for depth. A single Points object with additive
 * blending — one draw call, no per-particle work on the CPU.
 */
function ParticleField({ count = 340 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      // Distribute in a shell so the centre stays clear for the blob.
      const radius = 2.6 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.028,
        color: new THREE.Color('#7dd3fc'),
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_state, delta) => {
    const d = Math.min(delta, 1 / 30);
    if (!points.current) return;

    points.current.rotation.y += d * 0.045;
    points.current.rotation.x += d * 0.015;
    // Field spreads outward slightly on scroll for a subtle warp-speed cue.
    points.current.scale.setScalar(1 + scrollProgress() * 0.25);
  });

  return <points ref={points} geometry={geometry} material={material} />;
}

/** Everything that lives inside the <Canvas>. */
export function LiquidScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <>
      {/* Shaders are unlit, so lights are only here for the particles' feel. */}
      <ambientLight intensity={0.6} />

      {reducedMotion ? (
        <StaticBlob />
      ) : (
        <>
          <LiquidBlob />
          <ParticleField />
        </>
      )}
    </>
  );
}

/**
 * Reduced-motion variant: same look, rendered once, never animated.
 */
function StaticBlob() {
  const { material, uniforms } = useMemo(() => createLiquidMaterial(), []);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.45, 16), []);

  useEffect(() => {
    uniforms.uDistort.value = 0.26;
    uniforms.uOpacity.value = 0.55;
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material, uniforms]);

  return <mesh geometry={geometry} material={material} />;
}
