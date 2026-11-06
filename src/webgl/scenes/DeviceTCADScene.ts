import * as THREE from 'three';
import { createBandBendingMaterial } from '../shaders/bandBendingShader';

export class DeviceTCADScene {
  public group: THREE.Group;
  private bandMaterial: THREE.ShaderMaterial;
  private carrierParticles: THREE.InstancedMesh;
  private particleCount = 280;
  private particleData: { x: number; y: number; z: number; speed: number; state: 'source' | 'tunneling' | 'channel' }[] = [];
  private imagePlanes: { mesh: THREE.Mesh; baseRot: THREE.Euler; basePos: THREE.Vector3 }[] = [];

  constructor() {
    this.group = new THREE.Group();
    // Positioned in the right half of the viewport so it never overlaps the left HTML glass panel
    this.group.position.set(3.2, 0, 0);

    // ─────────────────────────────────────────────────────────────
    // 1. EXTRUDED 3D DEVICE CROSS-SECTION
    // ─────────────────────────────────────────────────────────────
    const deviceHeight = 2.4;
    const deviceDepth = 2.8;

    // A. p+ Source Region (GaSb / Heavily Doped Source)
    const sourceGeo = new THREE.BoxGeometry(1.2, deviceHeight, deviceDepth);
    const sourceMat = new THREE.MeshStandardMaterial({
      color: 0x9e3a14, // Deep copper-red
      metalness: 0.4,
      roughness: 0.35,
      emissive: 0x4a1806,
      emissiveIntensity: 0.4,
    });
    const sourceMesh = new THREE.Mesh(sourceGeo, sourceMat);
    sourceMesh.position.set(-1.8, 0, 0);
    this.group.add(sourceMesh);

    // B. Ultra-Thin Heavily n+ Doped Pocket (5nm GaAsSb)
    const pocketGeo = new THREE.BoxGeometry(0.25, deviceHeight, deviceDepth);
    const pocketMat = new THREE.MeshStandardMaterial({
      color: 0xFF9D4D, // Electric amber
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x994411,
      emissiveIntensity: 0.8,
    });
    const pocketMesh = new THREE.Mesh(pocketGeo, pocketMat);
    pocketMesh.position.set(-1.075, 0, 0);
    this.group.add(pocketMesh);

    // C. Intrinsic Channel Region (GaAs / Junctionless T-shape)
    const channelGeo = new THREE.BoxGeometry(1.8, deviceHeight * 0.85, deviceDepth);
    const channelMat = new THREE.MeshStandardMaterial({
      color: 0x1E334D, // Silicon teal-blue
      metalness: 0.3,
      roughness: 0.4,
      emissive: 0x0A1828,
      emissiveIntensity: 0.3,
    });
    const channelMesh = new THREE.Mesh(channelGeo, channelMat);
    channelMesh.position.set(-0.05, 0, 0);
    this.group.add(channelMesh);

    // D. n+ Drain Region
    const drainGeo = new THREE.BoxGeometry(1.2, deviceHeight, deviceDepth);
    const drainMat = new THREE.MeshStandardMaterial({
      color: 0x225577,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0x0c2538,
      emissiveIntensity: 0.4,
    });
    const drainMesh = new THREE.Mesh(drainGeo, drainMat);
    drainMesh.position.set(1.45, 0, 0);
    this.group.add(drainMesh);

    // E. Double Gate Stack & Oxide (HfO2 + SiO2 Translucent Glass)
    const oxideMat = new THREE.MeshPhysicalMaterial({
      color: 0xC6FF3D,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      ior: 1.5,
      emissive: 0x284008,
      emissiveIntensity: 0.35,
    });
    // Top Gate
    const topGateGeo = new THREE.BoxGeometry(1.9, 0.28, deviceDepth * 1.05);
    const topGate = new THREE.Mesh(topGateGeo, oxideMat);
    topGate.position.set(-0.05, deviceHeight * 0.5 + 0.15, 0);
    // Bottom Gate
    const botGate = new THREE.Mesh(topGateGeo, oxideMat);
    botGate.position.set(-0.05, -deviceHeight * 0.5 - 0.15, 0);
    this.group.add(topGate, botGate);

    // F. Nanocavity for Biomolecule Binding (Inverted-T Cavity)
    const cavityGeo = new THREE.BoxGeometry(0.8, 0.45, deviceDepth * 0.8);
    const cavityMat = new THREE.MeshStandardMaterial({
      color: 0x081525,
      wireframe: true,
      emissive: 0xC6FF3D,
      emissiveIntensity: 0.7,
    });
    const cavity = new THREE.Mesh(cavityGeo, cavityMat);
    cavity.position.set(-0.3, deviceHeight * 0.5 - 0.2, 0);
    this.group.add(cavity);

    // ─────────────────────────────────────────────────────────────
    // 2. QUANTUM TUNNELING CARRIER PARTICLES
    // ─────────────────────────────────────────────────────────────
    const particleGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xC6FF3D });
    this.carrierParticles = new THREE.InstancedMesh(particleGeo, particleMat, this.particleCount);

    for (let i = 0; i < this.particleCount; i++) {
      this.particleData.push({
        x: -2.3 + Math.random() * 3.8,
        y: (Math.random() - 0.5) * (deviceHeight * 0.7),
        z: (Math.random() - 0.5) * (deviceDepth * 0.7),
        speed: 1.2 + Math.random() * 2.0,
        state: 'source',
      });
    }
    this.group.add(this.carrierParticles);

    // ─────────────────────────────────────────────────────────────
    // 3. FLOATING ENERGY BAND DIAGRAM PLANE (Ec & Ev)
    // ─────────────────────────────────────────────────────────────
    this.bandMaterial = createBandBendingMaterial();
    const bandGeo = new THREE.PlaneGeometry(4.8, 2.6, 48, 24);
    const bandPlane = new THREE.Mesh(bandGeo, this.bandMaterial);
    bandPlane.position.set(-0.1, 2.6, -1.2);
    bandPlane.rotation.x = -0.35;
    this.group.add(bandPlane);

    // ─────────────────────────────────────────────────────────────
    // 4. FLOATING REAL SENTAURUS FIGURES IN GLASS FRAMES
    // ─────────────────────────────────────────────────────────────
    const textureLoader = new THREE.TextureLoader();
    const figures = [
      {
        path: './assets/real/biosensor_device_structure.webp',
        pos: new THREE.Vector3(-3.2, 0.5, 2.2),
        rot: new THREE.Euler(0.1, 0.35, 0),
        size: [2.4, 1.3],
        title: 'Sentaurus 2D TCAD Mesh',
      },
      {
        path: './assets/real/vtfet_energy_band.webp',
        pos: new THREE.Vector3(3.2, 0.6, 2.0),
        rot: new THREE.Euler(0.05, -0.32, 0),
        size: [2.3, 1.4],
        title: 'Band-to-Band Tunneling (BTBT)',
      },
      {
        path: './assets/real/biosensor_k_sweep.webp',
        pos: new THREE.Vector3(-0.2, -1.8, 2.4),
        rot: new THREE.Euler(-0.2, 0.05, 0),
        size: [2.5, 1.1],
        title: 'Id-Vgs Dielectric Permittivity K-Sweep',
      },
    ];

    figures.forEach((fig) => {
      const tex = textureLoader.load(fig.path);
      tex.colorSpace = THREE.SRGBColorSpace;

      // Dark backing plate for high-contrast viewing
      const frameGeo = new THREE.PlaneGeometry(fig.size[0] + 0.12, fig.size[1] + 0.12);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x060B14,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x0F1B2B,
        emissiveIntensity: 0.5,
      });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.copy(fig.pos);
      frame.rotation.copy(fig.rot);

      // Lime hairline border
      const borderGeo = new THREE.EdgesGeometry(frameGeo);
      const borderMat = new THREE.LineBasicMaterial({ color: 0xC6FF3D, transparent: true, opacity: 0.6 });
      const border = new THREE.LineSegments(borderGeo, borderMat);
      frame.add(border);

      // Image plane with matte tone to prevent white glare
      const imgGeo = new THREE.PlaneGeometry(fig.size[0], fig.size[1]);
      const imgMat = new THREE.MeshBasicMaterial({
        map: tex,
        color: new THREE.Color(0.85, 0.88, 0.9),
        transparent: true,
        opacity: 0.92,
      });
      const imgMesh = new THREE.Mesh(imgGeo, imgMat);
      imgMesh.position.z = 0.01;
      frame.add(imgMesh);

      this.group.add(frame);
      this.imagePlanes.push({ mesh: frame, baseRot: fig.rot.clone(), basePos: fig.pos.clone() });
    });
  }

  public update(delta: number, elapsed: number, scrollProgress: number, mouseX: number, mouseY: number) {
    // Only animate when near this stage (scroll 0.18 to 0.44)
    if (scrollProgress < 0.14 || scrollProgress > 0.48) {
      this.group.visible = false;
      return;
    }
    this.group.visible = true;

    // Update Band Bending Shader
    if (this.bandMaterial.uniforms.uTime) {
      this.bandMaterial.uniforms.uTime.value = elapsed;
      // Animate gate bias modulation
      const vgs = 0.4 + 0.45 * (0.5 + 0.5 * Math.sin(elapsed * 1.5));
      this.bandMaterial.uniforms.uVgs.value = vgs;
    }

    // Update Tunneling Carriers
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < this.particleCount; i++) {
      const p = this.particleData[i];
      p.x += delta * p.speed;

      // When crossing the pocket (-1.1 to -0.9), speed accelerates exponentially (quantum tunneling)
      if (p.x > -1.2 && p.x < -0.8) {
        p.x += delta * p.speed * 2.5;
      }

      // Recycle to source
      if (p.x > 2.2) {
        p.x = -2.3 - Math.random() * 0.4;
        p.y = (Math.random() - 0.5) * 1.6;
        p.z = (Math.random() - 0.5) * 1.8;
      }

      matrix.setPosition(p.x, p.y, p.z);
      this.carrierParticles.setMatrixAt(i, matrix);
    }
    this.carrierParticles.instanceMatrix.needsUpdate = true;

    // Tilt image frames toward mouse
    for (const item of this.imagePlanes) {
      item.mesh.rotation.x = item.baseRot.x + mouseY * 0.15;
      item.mesh.rotation.y = item.baseRot.y + mouseX * 0.2;
    }
  }
}
