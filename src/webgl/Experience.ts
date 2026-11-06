import * as THREE from 'three';
import { CameraSpline } from './CameraSpline';
import { PostProcessing } from './PostProcessing';

class FrameTimer {
  private previousTime = performance.now();
  private startTime = performance.now();
  private delta = 0;

  public update(): void {
    const currentTime = performance.now();
    this.delta = Math.min((currentTime - this.previousTime) / 1000, 0.1);
    this.previousTime = currentTime;
  }

  public getDelta(): number {
    return this.delta;
  }

  public getElapsed(): number {
    return (performance.now() - this.startTime) / 1000;
  }
}
import { WaferLoaderScene } from './scenes/WaferLoaderScene';
import { DieHeroScene } from './scenes/DieHeroScene';
import { DeviceTCADScene } from './scenes/DeviceTCADScene';
import { GateBISTScene } from './scenes/GateBISTScene';
import { MetalPDScene } from './scenes/MetalPDScene';
import { PackageSysScene } from './scenes/PackageSysScene';
import { TimelineScene } from './scenes/TimelineScene';
import { TapeoutScene } from './scenes/TapeoutScene';

export class Experience {
  public canvas: HTMLCanvasElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public postProcessing: PostProcessing;
  public cameraSpline: CameraSpline;

  // Scene Components
  public waferLoader: WaferLoaderScene;
  public dieHero: DieHeroScene;
  public deviceTCAD: DeviceTCADScene;
  public gateBIST: GateBISTScene;
  public metalPD: MetalPDScene;
  public packageSys: PackageSysScene;
  public timeline: TimelineScene;
  public tapeout: TapeoutScene;

  // State
  public scrollProgress = 0;
  private targetScrollProgress = 0;
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  private timer: FrameTimer;
  private isRunning = true;
  private isLoaderFinished = false;

  // Adaptive Quality Metrics
  private frameTimes: number[] = [];
  private qualityTier: 'high' | 'medium' | 'low' = 'high';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.timer = new FrameTimer();

    // 1. Scene & Renderer Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#060B14');
    this.scene.fog = new THREE.FogExp2('#060B14', 0.024);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.cameraSpline = new CameraSpline();

    const maxDpr = isMobile ? 1.5 : 2.0;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = false; // Soft ambient lighting preferred for 60fps

    // 2. Post-Processing Setup
    this.postProcessing = new PostProcessing(this.renderer, this.scene, this.camera);
    if (isMobile) {
      this.postProcessing.setQuality('medium');
    }

    // 3. Cinematic Studio Lighting
    this.setupLighting();

    // 4. Initialize Sub-Scenes
    this.waferLoader = new WaferLoaderScene();
    this.dieHero = new DieHeroScene();
    this.deviceTCAD = new DeviceTCADScene();
    this.gateBIST = new GateBISTScene();
    this.metalPD = new MetalPDScene();
    this.packageSys = new PackageSysScene();
    this.timeline = new TimelineScene();
    this.tapeout = new TapeoutScene();

    this.scene.add(this.waferLoader.group);
    this.scene.add(this.dieHero.group);
    this.scene.add(this.deviceTCAD.group);
    this.scene.add(this.gateBIST.group);
    this.scene.add(this.metalPD.group);
    this.scene.add(this.packageSys.group);
    this.scene.add(this.timeline.group);
    this.scene.add(this.tapeout.group);

    // Initial camera pose
    const initialPose = this.cameraSpline.sample(0, 0, 0);
    this.camera.position.copy(initialPose.position);
    this.camera.lookAt(initialPose.target);

    // 5. Event Listeners
    this.initEvents();

    // 6. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  private setupLighting() {
    // Ambient dark fill
    const ambientLight = new THREE.AmbientLight(0x0E1A29, 0.45);
    this.scene.add(ambientLight);

    // Top soft key light
    const keyLight = new THREE.DirectionalLight(0xE8EEF7, 1.1);
    keyLight.position.set(0, 20, 10);
    this.scene.add(keyLight);

    // Primary Electric Lime Rim Light
    const limeRim = new THREE.DirectionalLight(0xC6FF3D, 2.4);
    limeRim.position.set(-18, 12, -15);
    this.scene.add(limeRim);

    // Secondary Copper Rim Light
    const copperRim = new THREE.DirectionalLight(0xFF9D4D, 2.0);
    copperRim.position.set(18, -8, -15);
    this.scene.add(copperRim);

    // Subtle Cyan Fill
    const cyanFill = new THREE.PointLight(0x38BDF8, 1.2, 40);
    cyanFill.position.set(0, 4, 12);
    this.scene.add(cyanFill);
  }

  private initEvents() {
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.postProcessing.resize(w, h);
    });

    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      this.isRunning = !document.hidden;
      if (this.isRunning) {
        requestAnimationFrame(this.animate);
      }
    });
  }

  public setScrollProgress(progress: number) {
    this.targetScrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
  }

  public completeLoader() {
    this.waferLoader.setProgress(1.0);
  }

  private animate() {
    if (!this.isRunning) return;

    this.timer.update();
    const delta = Math.min(this.timer.getDelta(), 0.1);
    const elapsed = this.timer.getElapsed();

    // 1. Smooth damping of scroll progress & mouse coordinates
    this.scrollProgress = THREE.MathUtils.lerp(this.scrollProgress, this.targetScrollProgress, delta * 6.5);
    this.mouseX = THREE.MathUtils.lerp(this.mouseX, this.targetMouseX, delta * 4.0);
    this.mouseY = THREE.MathUtils.lerp(this.mouseY, this.targetMouseY, delta * 4.0);

    // 2. Update Loader if not finished
    if (!this.isLoaderFinished) {
      const finished = this.waferLoader.update(delta, elapsed);
      if (finished) {
        this.isLoaderFinished = true;
      }
    }

    // 3. Update Camera Spline Trajectory
    const pose = this.cameraSpline.sample(this.scrollProgress, this.mouseX, this.mouseY);
    this.camera.position.copy(pose.position);
    this.camera.lookAt(pose.target);
    this.camera.rotation.z += pose.roll;
    if (this.camera.fov !== pose.fov) {
      this.camera.fov = pose.fov;
      this.camera.updateProjectionMatrix();
    }

    // 4. Update Sub-Scenes
    this.dieHero.update(delta, elapsed, this.scrollProgress, this.mouseX, this.mouseY);
    this.deviceTCAD.update(delta, elapsed, this.scrollProgress, this.mouseX, this.mouseY);
    this.gateBIST.update(delta, elapsed, this.scrollProgress, this.mouseX, this.mouseY);
    this.metalPD.update(delta, elapsed, this.scrollProgress, this.mouseX, this.mouseY);
    this.packageSys.update(delta, elapsed, this.scrollProgress, this.mouseX, this.mouseY);
    this.timeline.update(delta, elapsed, this.scrollProgress);
    this.tapeout.update(delta, elapsed, this.scrollProgress);

    // 5. Render Post-Processing
    this.postProcessing.render(delta);

    // 6. Adaptive Quality Throttling
    this.frameTimes.push(delta * 1000);
    if (this.frameTimes.length > 60) {
      const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.frameTimes = [];
      if (avg > 24 && this.qualityTier === 'high') {
        this.qualityTier = 'medium';
        this.postProcessing.setQuality('medium');
      } else if (avg > 32 && this.qualityTier === 'medium') {
        this.qualityTier = 'low';
        this.postProcessing.setQuality('low');
      }
    }

    requestAnimationFrame(this.animate);
  }
}
