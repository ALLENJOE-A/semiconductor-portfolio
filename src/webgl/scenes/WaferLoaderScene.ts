import * as THREE from 'three';
import { createIridescenceMaterial } from '../shaders/iridescenceShader';

export class WaferLoaderScene {
  public group: THREE.Group;
  private waferMesh: THREE.Mesh;
  private liftDieMesh: THREE.Mesh;
  private ringMesh: THREE.Mesh;
  private iridMat: THREE.ShaderMaterial;
  private isCompleted = false;
  private liftProgress = 0;

  constructor() {
    this.group = new THREE.Group();

    // 1. 300mm Silicon Wafer Disc
    const waferGeo = new THREE.CylinderGeometry(6, 6, 0.15, 64);
    this.iridMat = createIridescenceMaterial('#0a111e', 380);
    this.waferMesh = new THREE.Mesh(waferGeo, this.iridMat);
    this.waferMesh.rotation.x = 0.2;
    this.group.add(this.waferMesh);

    // 2. Concentric Die Reticle Grid Lines on Wafer
    const gridHelper = new THREE.GridHelper(10.5, 24, 0xC6FF3D, 0x1E3345);
    gridHelper.position.y = 0.08;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.35;
    this.waferMesh.add(gridHelper);

    // Flat notch on wafer edge (semiconductor orientation flat)
    const notchGeo = new THREE.BoxGeometry(0.8, 0.2, 0.4);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0x060B14 });
    const notch = new THREE.Mesh(notchGeo, notchMat);
    notch.position.set(0, 0, 5.95);
    this.waferMesh.add(notch);

    // 3. Central Die that lifts off upon load completion
    const dieGeo = new THREE.BoxGeometry(1.6, 0.18, 1.6);
    const dieMat = new THREE.MeshStandardMaterial({
      color: 0x111c2e,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x051329,
      emissiveIntensity: 0.4,
    });
    this.liftDieMesh = new THREE.Mesh(dieGeo, dieMat);
    this.liftDieMesh.position.set(0, 0.12, 0);
    
    // Gold wirebond pads around lifting die edge
    const padGeo = new THREE.BoxGeometry(0.12, 0.04, 0.12);
    const padMat = new THREE.MeshStandardMaterial({ color: 0xffa500, metalness: 0.9, roughness: 0.1 });
    const padMesh = new THREE.InstancedMesh(padGeo, padMat, 32);
    let pIdx = 0;
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < 8; i++) {
      const offset = (i - 3.5) * 0.18;
      // Top & Bottom
      matrix.setPosition(offset, 0.1, 0.72);
      padMesh.setMatrixAt(pIdx++, matrix);
      matrix.setPosition(offset, 0.1, -0.72);
      padMesh.setMatrixAt(pIdx++, matrix);
      // Left & Right
      matrix.setPosition(0.72, 0.1, offset);
      padMesh.setMatrixAt(pIdx++, matrix);
      matrix.setPosition(-0.72, 0.1, offset);
      padMesh.setMatrixAt(pIdx++, matrix);
    }
    padMesh.instanceMatrix.needsUpdate = true;
    this.liftDieMesh.add(padMesh);
    this.waferMesh.add(this.liftDieMesh);

    // 4. Glowing Progress Ring around the Wafer
    const ringGeo = new THREE.RingGeometry(6.3, 6.45, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xC6FF3D,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    this.ringMesh = new THREE.Mesh(ringGeo, ringMat);
    this.ringMesh.rotation.x = Math.PI / 2;
    this.ringMesh.position.y = 0.09;
    this.waferMesh.add(this.ringMesh);
  }

  public setProgress(pct: number) {
    if (pct >= 1.0) {
      this.isCompleted = true;
    }
    // Scale ring opacity or rotation with load progress
    this.ringMesh.scale.setScalar(0.9 + pct * 0.1);
  }

  public update(delta: number, elapsed: number): boolean {
    if (this.iridMat.uniforms.uTime) {
      this.iridMat.uniforms.uTime.value = elapsed;
    }

    if (!this.isCompleted) {
      // Gentle idle spin while loading
      this.waferMesh.rotation.y += delta * 0.6;
    } else {
      // Lift die toward camera and fade out wafer
      this.liftProgress = Math.min(this.liftProgress + delta * 1.5, 1.0);
      const ease = this.liftProgress * this.liftProgress * (3 - 2 * this.liftProgress);
      
      this.liftDieMesh.position.y = 0.12 + ease * 4.5;
      this.liftDieMesh.rotation.y += delta * 1.2;
      this.liftDieMesh.scale.setScalar(1.0 + ease * 0.5);

      this.group.position.y = -ease * 6.0;
      this.waferMesh.position.y = -ease * 3.0;

      if (this.liftProgress >= 1.0) {
        this.group.visible = false;
        return true; // Finished transition
      }
    }
    return false;
  }
}
