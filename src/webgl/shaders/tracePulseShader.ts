import * as THREE from 'three';

export const TracePulseShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#C6FF3D') },
    uBaseColor: { value: new THREE.Color('#1A2E22') },
    uSpeed: { value: 2.0 },
    uFrequency: { value: 4.0 },
    uPulseLength: { value: 0.18 },
    uGlowIntensity: { value: 3.5 },
    uOpacity: { value: 1.0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uBaseColor;
    uniform float uSpeed;
    uniform float uFrequency;
    uniform float uPulseLength;
    uniform float uGlowIntensity;
    uniform float uOpacity;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      // Traveling pulse along u dimension
      float phase = fract(vUv.x * uFrequency - uTime * uSpeed);
      float pulse = smoothstep(1.0 - uPulseLength, 1.0, phase) + (1.0 - smoothstep(0.0, uPulseLength * 0.3, phase));
      pulse = clamp(pulse, 0.0, 1.0);
      
      // Secondary micro-sparkle along v dimension
      float micro = sin(vUv.y * 30.0 + uTime * 4.0) * 0.15 + 0.85;

      // Color composition
      vec3 finalColor = mix(uBaseColor, uColor * uGlowIntensity, pulse * micro);

      // Edge falloff for glowing conductor look
      float edge = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
      finalColor *= (0.4 + 0.6 * edge);

      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `
};

export function createTracePulseMaterial(color = '#C6FF3D', baseColor = '#0F2318', speed = 2.0) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uBaseColor: { value: new THREE.Color(baseColor) },
      uSpeed: { value: speed },
      uFrequency: { value: 3.0 },
      uPulseLength: { value: 0.22 },
      uGlowIntensity: { value: 3.8 },
      uOpacity: { value: 1.0 },
    },
    vertexShader: TracePulseShader.vertexShader,
    fragmentShader: TracePulseShader.fragmentShader,
    transparent: true,
    depthWrite: true,
  });
}
