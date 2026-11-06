import * as THREE from 'three';
import { createTracePulseMaterial } from '../shaders/tracePulseShader';
import { createIridescenceMaterial } from '../shaders/iridescenceShader';

export class DieHeroScene {
  public group: THREE.Group;
  private layerGroups: { group: THREE.Group; baseHeight: number; peelThreshold: number }[] = [];
  private pulseMaterials: THREE.ShaderMaterial[] = [];
  private iridMaterial: THREE.ShaderMaterial;

  constructor() {
    this.group = new THREE.Group();

    // ─────────────────────────────────────────────────────────────
    // LAYER 0: BULK SILICON SUBSTRATE (Base: Y = 0.0)
    // ─────────────────────────────────────────────────────────────
    const subGroup = new THREE.Group();
    const subGeo = new THREE.BoxGeometry(8, 0.4, 8);
    const subMat = new THREE.MeshStandardMaterial({
      color: 0x07101C,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0x02070D,
      emissiveIntensity: 0.3,
    });
    const substrate = new THREE.Mesh(subGeo, subMat);
    subGroup.add(substrate);

    // Gold Guard Ring / Seal Ring around die periphery
    const ringGeo = new THREE.BoxGeometry(7.8, 0.05, 7.8);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xFF9D4D, // Copper/gold seal ring
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x442200,
      emissiveIntensity: 0.5,
    });
    const sealRing = new THREE.Mesh(ringGeo, ringMat);
    sealRing.position.y = 0.22;
    subGroup.add(sealRing);

    // Inner Silicon Bulk Plate
    const innerGeo = new THREE.BoxGeometry(7.4, 0.06, 7.4);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0E1A2B,
      metalness: 0.8,
      roughness: 0.3,
    });
    const innerPlate = new THREE.Mesh(innerGeo, innerMat);
    innerPlate.position.y = 0.23;
    subGroup.add(innerPlate);

    this.group.add(subGroup);
    this.layerGroups.push({ group: subGroup, baseHeight: 0.0, peelThreshold: 0.28 });

    // ─────────────────────────────────────────────────────────────
    // LAYER 1: DOPING WELLS (Base: Y = 0.7)
    // Translucent N-well and P-well implantation regions
    // ─────────────────────────────────────────────────────────────
    const wellGroup = new THREE.Group();
    const wellMatN = new THREE.MeshStandardMaterial({
      color: 0x1A4433,
      transparent: true,
      opacity: 0.65,
      emissive: 0x0D3322,
      emissiveIntensity: 0.6,
    });
    const wellMatP = new THREE.MeshStandardMaterial({
      color: 0x442211,
      transparent: true,
      opacity: 0.65,
      emissive: 0x331508,
      emissiveIntensity: 0.6,
    });

    // Grid of alternate well blocks
    const wellBoxGeo = new THREE.BoxGeometry(1.2, 0.12, 1.2);
    for (let x = -3; x <= 3; x += 1.5) {
      for (let z = -3; z <= 3; z += 1.5) {
        const isN = (Math.abs(x + z) % 3) === 0;
        const well = new THREE.Mesh(wellBoxGeo, isN ? wellMatN : wellMatP);
        well.position.set(x, 0, z);
        wellGroup.add(well);
      }
    }
    this.group.add(wellGroup);
    this.layerGroups.push({ group: wellGroup, baseHeight: 0.7, peelThreshold: 0.24 });

    // ─────────────────────────────────────────────────────────────
    // LAYER 2: POLYSILICON GATES (Base: Y = 1.4)
    // Arrays of dense transistor gate fingers
    // ─────────────────────────────────────────────────────────────
    const polyGroup = new THREE.Group();
    const polyMat = new THREE.MeshStandardMaterial({
      color: 0x3E5675,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x1E334D,
      emissiveIntensity: 0.4,
    });
    const polyFingerGeo = new THREE.BoxGeometry(0.12, 0.15, 6.2);
    const polyMesh = new THREE.InstancedMesh(polyFingerGeo, polyMat, 24);
    const polyMat4 = new THREE.Matrix4();
    for (let i = 0; i < 24; i++) {
      const x = -3.2 + i * 0.28;
      polyMat4.setPosition(x, 0, 0);
      polyMesh.setMatrixAt(i, polyMat4);
    }
    polyMesh.instanceMatrix.needsUpdate = true;
    polyGroup.add(polyMesh);
    this.group.add(polyGroup);
    this.layerGroups.push({ group: polyGroup, baseHeight: 1.4, peelThreshold: 0.20 });

    // ─────────────────────────────────────────────────────────────
    // LAYER 3: CONTACTS & VIAS (Base: Y = 2.0)
    // Tungsten vertical contact plugs connecting poly to M1
    // ─────────────────────────────────────────────────────────────
    const viaGroup = new THREE.Group();
    const viaMat = new THREE.MeshStandardMaterial({
      color: 0x8899AA,
      metalness: 0.95,
      roughness: 0.1,
    });
    const viaGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.28, 8);
    const viaMesh = new THREE.InstancedMesh(viaGeo, viaMat, 120);
    const viaMat4 = new THREE.Matrix4();
    let vCount = 0;
    for (let x = -3.0; x <= 3.0; x += 0.55) {
      for (let z = -3.0; z <= 3.0; z += 0.65) {
        if (vCount < 120) {
          viaMat4.setPosition(x + (Math.sin(z) * 0.1), 0, z);
          viaMesh.setMatrixAt(vCount++, viaMat4);
        }
      }
    }
    viaMesh.instanceMatrix.needsUpdate = true;
    viaGroup.add(viaMesh);
    this.group.add(viaGroup);
    this.layerGroups.push({ group: viaGroup, baseHeight: 2.0, peelThreshold: 0.17 });

    // ─────────────────────────────────────────────────────────────
    // LAYER 4: M1 METAL ROUTING (Base: Y = 2.6)
    // Fine-pitch local interconnects with electric lime pulses
    // ─────────────────────────────────────────────────────────────
    const m1Group = new THREE.Group();
    const m1Mat = createTracePulseMaterial('#C6FF3D', '#0F2618', 2.8);
    this.pulseMaterials.push(m1Mat);

    const m1TraceGeo = new THREE.BoxGeometry(6.4, 0.08, 0.14);
    const m1Inst = new THREE.InstancedMesh(m1TraceGeo, m1Mat, 18);
    const m1M4 = new THREE.Matrix4();
    for (let i = 0; i < 18; i++) {
      const z = -3.0 + i * 0.35;
      m1M4.setPosition(0, 0, z);
      m1Inst.setMatrixAt(i, m1M4);
    }
    m1Inst.instanceMatrix.needsUpdate = true;
    m1Group.add(m1Inst);
    this.group.add(m1Group);
    this.layerGroups.push({ group: m1Group, baseHeight: 2.6, peelThreshold: 0.14 });

    // ─────────────────────────────────────────────────────────────
    // LAYER 5: M2 ORTHOGONAL COPPER ROUTING (Base: Y = 3.2)
    // Orthogonal routing with copper glow
    // ─────────────────────────────────────────────────────────────
    const m2Group = new THREE.Group();
    const m2Mat = createTracePulseMaterial('#FF9D4D', '#2B170B', 2.2);
    this.pulseMaterials.push(m2Mat);

    const m2TraceGeo = new THREE.BoxGeometry(0.18, 0.08, 6.4);
    const m2Inst = new THREE.InstancedMesh(m2TraceGeo, m2Mat, 16);
    const m2M4 = new THREE.Matrix4();
    for (let i = 0; i < 16; i++) {
      const x = -3.0 + i * 0.4;
      m2M4.setPosition(x, 0, 0);
      m2Inst.setMatrixAt(i, m2M4);
    }
    m2Inst.instanceMatrix.needsUpdate = true;
    m2Group.add(m2Inst);
    this.group.add(m2Group);
    this.layerGroups.push({ group: m2Group, baseHeight: 3.2, peelThreshold: 0.11 });

    // ─────────────────────────────────────────────────────────────
    // LAYER 6: M3 & M4 POWER & CLOCK BUS NETWORK (Base: Y = 3.9)
    // Wide power rails and global H-tree clock trunks
    // ─────────────────────────────────────────────────────────────
    const m3Group = new THREE.Group();
    const m3Mat = createTracePulseMaterial('#C6FF3D', '#122B18', 3.5);
    this.pulseMaterials.push(m3Mat);

    // Wide VDD/VSS Power Rails
    const railGeo = new THREE.BoxGeometry(6.6, 0.1, 0.4);
    const rail1 = new THREE.Mesh(railGeo, m3Mat);
    rail1.position.set(0, 0, 2.0);
    const rail2 = new THREE.Mesh(railGeo, m3Mat);
    rail2.position.set(0, 0, -2.0);
    m3Group.add(rail1, rail2);

    // Main Clock Distribution Spine
    const clkGeo = new THREE.BoxGeometry(0.4, 0.1, 6.6);
    const clkSpine = new THREE.Mesh(clkGeo, m3Mat);
    m3Group.add(clkSpine);

    this.group.add(m3Group);
    this.layerGroups.push({ group: m3Group, baseHeight: 3.9, peelThreshold: 0.08 });

    // ─────────────────────────────────────────────────────────────
    // LAYER 7: TOP DIELECTRIC PASSIVATION WITH IRIDESCENCE (Base: Y = 4.6)
    // Protective silicon nitride glass with thin-film interference
    // ─────────────────────────────────────────────────────────────
    const passGroup = new THREE.Group();
    this.iridMaterial = createIridescenceMaterial('#0e1929', 420);
    const passGeo = new THREE.BoxGeometry(7.6, 0.08, 7.6);
    const passMesh = new THREE.Mesh(passGeo, this.iridMaterial);
    passGroup.add(passMesh);

    // Outer I/O Wirebond Pads on top passivation
    const padGeo = new THREE.BoxGeometry(0.35, 0.12, 0.35);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0xFF9D4D,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x552200,
      emissiveIntensity: 0.6,
    });
    const padMesh = new THREE.InstancedMesh(padGeo, padMat, 48);
    const padM4 = new THREE.Matrix4();
    let padCount = 0;
    for (let i = 0; i < 12; i++) {
      const coord = -3.3 + i * 0.6;
      // Top & Bottom
      padM4.setPosition(coord, 0.08, 3.4);
      padMesh.setMatrixAt(padCount++, padM4);
      padM4.setPosition(coord, 0.08, -3.4);
      padMesh.setMatrixAt(padCount++, padM4);
      // Left & Right
      padM4.setPosition(3.4, 0.08, coord);
      padMesh.setMatrixAt(padCount++, padM4);
      padM4.setPosition(-3.4, 0.08, coord);
      padMesh.setMatrixAt(padCount++, padM4);
    }
    padMesh.instanceMatrix.needsUpdate = true;
    passGroup.add(padMesh);

    this.group.add(passGroup);
    this.layerGroups.push({ group: passGroup, baseHeight: 4.6, peelThreshold: 0.05 });
  }

  public update(delta: number, elapsed: number, scrollProgress: number, mouseX: number, mouseY: number) {
    // 1. Update shader uniforms
    for (const mat of this.pulseMaterials) {
      if (mat.uniforms.uTime) {
        mat.uniforms.uTime.value = elapsed;
      }
    }
    if (this.iridMaterial.uniforms.uTime) {
      this.iridMaterial.uniforms.uTime.value = elapsed;
    }

    // 2. Mouse parallax tilt (subtle and cinematic)
    const targetRotX = 0.45 + mouseY * 0.25;
    const targetRotY = -0.65 + mouseX * 0.35;
    this.group.rotation.x = THREE.MathUtils.lerp(this.group.rotation.x, targetRotX, delta * 4.0);
    this.group.rotation.y = THREE.MathUtils.lerp(this.group.rotation.y, targetRotY, delta * 4.0);

    // 3. Exploded Layer Expansion & Descent Layer Peel
    // At scrollProgress = 0, exploded spread is maximum
    // As scroll dives into die (t from 0 to 0.22), layers peel and dissolve away
    for (const layer of this.layerGroups) {
      // Normal hover spread
      const explodeFactor = Math.max(0, 1.0 - scrollProgress * 5.0);
      const targetY = layer.baseHeight * (0.4 + 0.6 * explodeFactor);
      layer.group.position.y = THREE.MathUtils.lerp(layer.group.position.y, targetY, delta * 6.0);

      // Layer peel: as camera passes the layer, it dissolves / scales out
      if (scrollProgress > layer.peelThreshold) {
        const peelT = Math.min(1.0, (scrollProgress - layer.peelThreshold) / 0.06);
        layer.group.scale.setScalar(1.0 + peelT * 0.5);
        // Fade opacity
        layer.group.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj.material) {
            const m = obj.material as THREE.Material;
            m.transparent = true;
            m.opacity = Math.max(0, 1.0 - peelT * 1.2);
          }
        });
        if (peelT >= 1.0) {
          layer.group.visible = false;
        } else {
          layer.group.visible = true;
        }
      } else {
        layer.group.visible = true;
        layer.group.scale.setScalar(1.0);
        layer.group.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj.material) {
            const m = obj.material as THREE.Material;
            if (m.name !== 'pulse') {
              m.opacity = 1.0;
            }
          }
        });
      }
    }

    // Fade entire hero scene out when entering device scene deeply (t > 0.30)
    if (scrollProgress > 0.28) {
      this.group.visible = false;
    } else {
      this.group.visible = true;
    }
  }
}
