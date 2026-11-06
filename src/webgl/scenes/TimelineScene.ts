import * as THREE from 'three';
import { createTracePulseMaterial } from '../shaders/tracePulseShader';

export class TimelineScene {
  public group: THREE.Group;
  private traceMaterial: THREE.ShaderMaterial;
  private milestoneNodes: { mesh: THREE.Mesh; ring: THREE.Mesh; targetProgress: number; baseColor: number }[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(-2, 0, 0);

    // ─────────────────────────────────────────────────────────────
    // 1. VERTICAL GLOWING COPPER BUS TRACE
    // ─────────────────────────────────────────────────────────────
    this.traceMaterial = createTracePulseMaterial('#FF9D4D', '#1A0E05', 2.0);
    const traceGeo = new THREE.BoxGeometry(0.12, 12, 0.12);
    const trace = new THREE.Mesh(traceGeo, this.traceMaterial);
    trace.position.y = 3.0;
    this.group.add(trace);

    // ─────────────────────────────────────────────────────────────
    // 2. MILESTONE NODES (Ignite as camera approaches)
    // ─────────────────────────────────────────────────────────────
    const milestones = [
      { y: 6.8, progress: 0.86, color: 0xC6FF3D },
      { y: 4.6, progress: 0.88, color: 0x38BDF8 },
      { y: 2.4, progress: 0.91, color: 0xFF9D4D },
      { y: 0.2, progress: 0.94, color: 0x22C55E },
    ];

    const nodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const ringGeo = new THREE.RingGeometry(0.24, 0.32, 32);

    milestones.forEach((m) => {
      const nodeMat = new THREE.MeshStandardMaterial({
        color: m.color,
        emissive: m.color,
        emissiveIntensity: 0.2,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(0, m.y, 0);

      const ringMat = new THREE.MeshBasicMaterial({
        color: m.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, m.y, 0.01);
      this.group.add(ring);
      this.group.add(nodeMesh);

      this.milestoneNodes.push({
        mesh: nodeMesh,
        ring,
        targetProgress: m.progress,
        baseColor: m.color,
      });
    });
  }

  public update(delta: number, elapsed: number, scrollProgress: number) {
    if (scrollProgress < 0.83 || scrollProgress > 0.97) {
      this.group.visible = false;
      return;
    }
    this.group.visible = true;

    if (this.traceMaterial.uniforms.uTime) {
      this.traceMaterial.uniforms.uTime.value = elapsed;
    }

    // Light up milestones when scroll progress passes their threshold
    this.milestoneNodes.forEach((node) => {
      const dist = Math.abs(scrollProgress - node.targetProgress);
      const isNear = dist < 0.025;
      const intensity = isNear ? 2.5 : (scrollProgress > node.targetProgress ? 1.2 : 0.2);
      
      const mat = node.mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, intensity, delta * 6.0);
      
      const ringMat = node.ring.material as THREE.MeshBasicMaterial;
      ringMat.opacity = isNear ? 0.9 : 0.3;
      node.ring.scale.setScalar(isNear ? (1.0 + Math.sin(elapsed * 6.0) * 0.15) : 1.0);
    });
  }
}
