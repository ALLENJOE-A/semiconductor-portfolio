import * as THREE from 'three';

export const CinematicPassShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uGrainIntensity: { value: 0.045 },
    uAberrationOffset: { value: 0.0022 },
    uVignetteDarkness: { value: 1.25 },
    uVignetteOffset: { value: 1.1 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrainIntensity;
    uniform float uAberrationOffset;
    uniform float uVignetteDarkness;
    uniform float uVignetteOffset;

    varying vec2 vUv;

    // Fast pseudo-random generator
    float random(vec2 p) {
      return fract(sin(dot(p + uTime * 0.05, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 distFromCenter = vUv - 0.5;
      float dist = length(distFromCenter);

      // Chromatic aberration scaling with distance from center
      vec2 offset = distFromCenter * (dist * uAberrationOffset);
      float r = texture2D(tDiffuse, vUv + offset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - offset).b;
      vec3 color = vec3(r, g, b);

      // Procedural subtle film grain
      float noise = (random(vUv * 800.0) - 0.5) * uGrainIntensity;
      color += noise;

      // Vignette
      float vignette = smoothstep(uVignetteOffset, uVignetteOffset - 0.5, dist);
      color = mix(color * (1.0 - uVignetteDarkness * 0.4), color, vignette);

      gl_FragColor = vec4(color, 1.0);
    }
  `
};
