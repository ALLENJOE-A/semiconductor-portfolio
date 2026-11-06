import * as THREE from 'three';

export const IridescenceShader = {
  uniforms: {
    uTime: { value: 0 },
    uBaseColor: { value: new THREE.Color('#0c131f') },
    uFilmThickness: { value: 380.0 }, // nm
    uRefractiveIndex: { value: 1.46 }, // SiO2
    uRoughness: { value: 0.12 },
    uBoost: { value: 1.6 },
    uOpacity: { value: 0.92 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uBaseColor;
    uniform float uFilmThickness;
    uniform float uRefractiveIndex;
    uniform float uRoughness;
    uniform float uBoost;
    uniform float uOpacity;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // Airy thin-film interference approximation for RGB wavelengths
    vec3 spectralInterference(float cosTheta, float d, float n) {
      // Wavelengths in nm: Red (650nm), Green (530nm), Blue (460nm)
      vec3 lambda = vec3(650.0, 532.0, 465.0);
      
      // Optical path difference: 2 * n * d * cos(theta_t)
      float sinTheta2 = (1.0 - cosTheta * cosTheta) / (n * n);
      float cosThetaT = sqrt(max(0.0, 1.0 - sinTheta2));
      float opd = 2.0 * n * d * cosThetaT;

      // Phase difference delta = 2 * pi * OPD / lambda
      vec3 phase = 6.2831853 * opd / lambda;
      
      // Interference intensity I = cos^2(phase / 2)
      vec3 intensity = 0.5 + 0.5 * cos(phase);
      
      return intensity;
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      float NdotV = max(dot(normal, viewDir), 0.0);
      float fresnel = pow(1.0 - NdotV, 3.5);

      // Vary thickness slightly over the surface for wafer rainbow swirls
      float d = uFilmThickness + 140.0 * sin(vUv.x * 12.0 + vUv.y * 12.0 + uTime * 0.2);

      vec3 iridescentColor = spectralInterference(NdotV, d, uRefractiveIndex);
      
      // Specular reflection highlight
      vec3 lightDir = normalize(vec3(0.5, 0.8, 0.4));
      vec3 halfVec = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfVec), 0.0), 32.0 / max(uRoughness, 0.01));

      // Combine base silicon reflection with thin-film interference
      vec3 finalColor = mix(uBaseColor, iridescentColor * uBoost, fresnel * 0.75 + 0.25);
      finalColor += vec3(0.8, 0.9, 1.0) * spec * 0.4;

      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `
};

export function createIridescenceMaterial(baseColor = '#0b1424', thickness = 380.0) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color(baseColor) },
      uFilmThickness: { value: thickness },
      uRefractiveIndex: { value: 1.46 },
      uRoughness: { value: 0.1 },
      uBoost: { value: 1.5 },
      uOpacity: { value: 0.95 },
    },
    vertexShader: IridescenceShader.vertexShader,
    fragmentShader: IridescenceShader.fragmentShader,
    transparent: true,
    depthWrite: true,
  });
}
