import * as THREE from 'three';

export const BandBendingShader = {
  uniforms: {
    uTime: { value: 0 },
    uVgs: { value: 0.5 }, // Gate bias voltage (0.0 to 1.0)
    uEcColor: { value: new THREE.Color('#38bdf8') }, // Silicon sky blue
    uEvColor: { value: new THREE.Color('#f97316') }, // Valence band copper
    uTunnelColor: { value: new THREE.Color('#C6FF3D') }, // Tunneling window electric lime
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uVgs;
    
    varying vec2 vUv;
    varying float vBending;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      
      // Compute energy band profile along x (Source -> Pocket -> Channel -> Drain)
      // x in [0, 1]
      float x = position.x;
      
      // Band bending equation: In channel (x > 0.35 and x < 0.75), gate pulls bands down by uVgs
      float gateInfluence = smoothstep(0.25, 0.45, x) * (1.0 - smoothstep(0.70, 0.90, x));
      float bend = -uVgs * 0.8 * gateInfluence;

      // Small quantum fluctuation
      float quantumRipple = sin(x * 40.0 - uTime * 3.0) * 0.02 * gateInfluence;
      
      vec3 modifiedPos = position;
      modifiedPos.z += (bend + quantumRipple);
      vBending = bend;

      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(modifiedPos, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform float uVgs;
    uniform vec3 uEcColor;
    uniform vec3 uEvColor;
    uniform vec3 uTunnelColor;

    varying vec2 vUv;
    varying float vBending;
    varying vec3 vNormal;

    void main() {
      // Top half represents Ec, bottom half represents Ev with bandgap Eg in middle
      float bandGap = 0.22;
      float isEc = step(0.5 + bandGap * 0.5, vUv.y);
      float isEv = 1.0 - step(0.5 - bandGap * 0.5, vUv.y);
      float isGap = 1.0 - isEc - isEv;

      // Grid / contour lines
      float gridX = abs(fract(vUv.x * 20.0) - 0.5);
      float gridY = abs(fract(vUv.y * 30.0) - 0.5);
      float grid = smoothstep(0.02, 0.0, gridX) + smoothstep(0.02, 0.0, gridY);

      // Tunneling window condition: where Valence band of source aligns with Conduction band of channel
      float inTunnelZone = smoothstep(0.32, 0.42, vUv.x) * (1.0 - smoothstep(0.48, 0.58, vUv.x));
      float tunnelAlignment = smoothstep(0.3, 0.8, uVgs) * inTunnelZone;

      vec3 color = vec3(0.02, 0.05, 0.09);

      if (isEc > 0.5) {
        color = mix(uEcColor * 0.5, uEcColor * 1.5, grid * 0.4);
      } else if (isEv > 0.5) {
        color = mix(uEvColor * 0.5, uEvColor * 1.5, grid * 0.4);
      } else {
        // Forbidden bandgap with tunneling wavefunctions
        float tunnelRays = sin(vUv.x * 60.0 - uTime * 6.0) * 0.5 + 0.5;
        color = mix(vec3(0.01, 0.03, 0.06), uTunnelColor * 2.0, tunnelAlignment * tunnelRays);
      }

      // Energy level glow
      float edgeDist = min(abs(vUv.y - (0.5 + bandGap * 0.5)), abs(vUv.y - (0.5 - bandGap * 0.5)));
      float edgeGlow = smoothstep(0.04, 0.0, edgeDist);
      color += (isEc > 0.5 ? uEcColor : uEvColor) * edgeGlow * 1.8;

      gl_FragColor = vec4(color, 0.85);
    }
  `
};

export function createBandBendingMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uVgs: { value: 0.65 },
      uEcColor: { value: new THREE.Color('#38bdf8') },
      uEvColor: { value: new THREE.Color('#f97316') },
      uTunnelColor: { value: new THREE.Color('#C6FF3D') },
    },
    vertexShader: BandBendingShader.vertexShader,
    fragmentShader: BandBendingShader.fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}
