import * as THREE from 'three';

/**
 * Vertex shader: classic simplex-noise displacement.
 *
 * Two layers of noise at different frequencies/speeds are summed so the
 * surface reads as an organic liquid blob rather than a pulsing ball.
 * The pointer offset warps the noise field, so the mesh appears to "lean"
 * toward the cursor instead of just rotating.
 */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDistort;
  uniform float uFrequency;
  uniform vec2  uPointer;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  // --- Ashima Arts simplex noise (public domain) -------------------------
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
  // ----------------------------------------------------------------------

  void main() {
    vNormal = normal;
    vPosition = position;

    // Pointer nudges the noise field so the blob leans into the cursor.
    vec3 warped = position + vec3(uPointer * 0.55, 0.0);

    float slow = snoise(warped * uFrequency + vec3(0.0, 0.0, uTime * 0.22));
    float fast = snoise(warped * (uFrequency * 2.35) - vec3(0.0, 0.0, uTime * 0.35));

    float displacement = (slow * 0.72 + fast * 0.28) * uDistort;
    vDisplacement = displacement;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

/**
 * Fragment shader: fresnel-driven gradient.
 *
 * Colour mixes across the brand ramp by displacement, then a fresnel term
 * lights the silhouette so the blob glows at its edges. Alpha is driven by
 * the same fresnel so the centre stays translucent against the page.
 */
const fragmentShader = /* glsl */ `
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorC;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    // Rim light: bright where the surface turns away from the camera.
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - abs(dot(viewDirection, normalize(vNormal)));
    fresnel = pow(clamp(fresnel, 0.0, 1.0), 2.1);

    float mixer = clamp(vDisplacement * 1.9 + 0.5, 0.0, 1.0);
    vec3 color = mix(uColorA, uColorB, mixer);
    color = mix(color, uColorC, fresnel * 0.65);

    // Lift the edges so the shape reads against a near-black background.
    color += fresnel * 0.28;

    gl_FragColor = vec4(color, (0.18 + fresnel * 0.82) * uOpacity);
  }
`;

export interface LiquidUniforms {
  uTime: { value: number };
  uDistort: { value: number };
  uFrequency: { value: number };
  uPointer: { value: THREE.Vector2 };
  uColorA: { value: THREE.Color };
  uColorB: { value: THREE.Color };
  uColorC: { value: THREE.Color };
  uOpacity: { value: number };
}

/**
 * Builds the material imperatively. Keeping it out of JSX avoids having to
 * augment the R3F element namespace, and lets the caller keep a typed handle
 * on the uniforms for per-frame updates.
 */
export function createLiquidMaterial() {
  const uniforms: LiquidUniforms = {
    uTime: { value: 0 },
    uDistort: { value: 0.34 },
    uFrequency: { value: 1.15 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    // Brand ramp: blue -> cyan -> emerald.
    uColorA: { value: new THREE.Color('#1d4ed8') },
    uColorB: { value: new THREE.Color('#22d3ee') },
    uColorC: { value: new THREE.Color('#34d399') },
    uOpacity: { value: 0.9 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: uniforms as unknown as Record<string, THREE.IUniform>,
    transparent: true,
    // Additive-ish glow without the blown-out highlights of true additive.
    blending: THREE.NormalBlending,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  return { material, uniforms };
}
