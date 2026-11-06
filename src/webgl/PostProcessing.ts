import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { CinematicPassShader } from './shaders/postProcessingShaders';

export class PostProcessing {
  public composer: EffectComposer;
  public bloomPass: UnrealBloomPass;
  public cinematicPass: ShaderPass;
  private renderer: THREE.WebGLRenderer;
  private width: number;
  private height: number;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer = renderer;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Renderer color management
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // EffectComposer with half-float render target for HDR bloom
    const renderTarget = new THREE.WebGLRenderTarget(this.width, this.height, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      samples: window.devicePixelRatio > 1.5 ? 1 : 2, // Antialiasing balance
    });

    this.composer = new EffectComposer(this.renderer, renderTarget);

    // 1. Base Render Pass
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    // 2. Selective UnrealBloom Pass (tuned strictly for emissive circuit traces)
    // Threshold set > 1.0 so standard screenshots/textures (max 1.0) NEVER bloom!
    const bloomResolution = new THREE.Vector2(this.width, this.height);
    this.bloomPass = new UnrealBloomPass(bloomResolution, 1.55, 0.42, 1.08);
    this.composer.addPass(this.bloomPass);

    // 3. Cinematic Vignette + Film Grain + Chromatic Aberration
    this.cinematicPass = new ShaderPass(CinematicPassShader);
    this.composer.addPass(this.cinematicPass);

    // 4. Color space / Tone mapping Output Pass
    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }

  public setQuality(tier: 'high' | 'medium' | 'low') {
    if (tier === 'high') {
      this.bloomPass.enabled = true;
      this.bloomPass.strength = 1.55;
      this.bloomPass.radius = 0.42;
      this.bloomPass.threshold = 1.08;
      this.cinematicPass.enabled = true;
      this.cinematicPass.uniforms.uGrainIntensity.value = 0.045;
    } else if (tier === 'medium') {
      this.bloomPass.enabled = true;
      this.bloomPass.strength = 1.1;
      this.bloomPass.radius = 0.35;
      this.bloomPass.threshold = 1.08;
      this.cinematicPass.enabled = true;
      this.cinematicPass.uniforms.uGrainIntensity.value = 0.03;
    } else {
      // Low tier (battery / mobile performance mode)
      this.bloomPass.enabled = false;
      this.cinematicPass.enabled = false;
    }
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.composer.setSize(width, height);
    this.bloomPass.resolution.set(width, height);
  }

  public render(delta: number) {
    if (this.cinematicPass.uniforms.uTime) {
      this.cinematicPass.uniforms.uTime.value += delta;
    }
    this.composer.render();
  }
}
