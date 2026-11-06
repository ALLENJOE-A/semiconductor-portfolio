import * as THREE from 'three';

export class PackageSysScene {
  public group: THREE.Group;
  private audioRibbonMesh: THREE.Mesh;
  private gnnGraphGroup: THREE.Group;
  private gnnNodes: THREE.InstancedMesh;
  private gnnEdges: THREE.LineSegments;
  private gnnNodeCount = 28;
  private nodePositions: THREE.Vector3[] = [];
  private imagePlanes: { mesh: THREE.Mesh; baseRot: THREE.Euler }[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(4, 0, 0);

    // ─────────────────────────────────────────────────────────────
    // 1. PROCEDURAL 3D EMBEDDED SYSTEM PCB (Raspberry Pi 5 / STM32 Board)
    // ─────────────────────────────────────────────────────────────
    const pcbGroup = new THREE.Group();
    pcbGroup.position.set(-2.5, 0, 0);

    // PCB Substrate (FR4 with dark solder mask)
    const pcbGeo = new THREE.BoxGeometry(5.2, 0.12, 3.6);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0A1826,
      metalness: 0.6,
      roughness: 0.35,
      emissive: 0x040D17,
      emissiveIntensity: 0.4,
    });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcbGroup.add(pcb);

    // Gold ENIG edge mounting holes & copper pads
    const holeGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.14, 16);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xFF9D4D, metalness: 0.95, roughness: 0.1 });
    const holePositions = [
      [-2.3, 0.01, -1.5],
      [-2.3, 0.01, 1.5],
      [2.3, 0.01, -1.5],
      [2.3, 0.01, 1.5],
    ];
    holePositions.forEach(([hx, hy, hz]) => {
      const hMesh = new THREE.Mesh(holeGeo, goldMat);
      hMesh.position.set(hx, hy, hz);
      pcbGroup.add(hMesh);
    });

    // SoC Package with Laser Etched Heat Spreader
    const socGeo = new THREE.BoxGeometry(1.2, 0.16, 1.2);
    const socMat = new THREE.MeshStandardMaterial({
      color: 0x1E2B38,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x081525,
      emissiveIntensity: 0.5,
    });
    const soc = new THREE.Mesh(socGeo, socMat);
    soc.position.set(-0.6, 0.12, -0.2);
    pcbGroup.add(soc);

    // 40-Pin GPIO Header (Instanced Gold Pins)
    const pinGeo = new THREE.BoxGeometry(0.04, 0.45, 0.04);
    const pinMesh = new THREE.InstancedMesh(pinGeo, goldMat, 40);
    const pMat4 = new THREE.Matrix4();
    let pCount = 0;
    for (let c = 0; c < 20; c++) {
      const px = -2.0 + c * 0.18;
      pMat4.setPosition(px, 0.25, -1.55);
      pinMesh.setMatrixAt(pCount++, pMat4);
      pMat4.setPosition(px, 0.25, -1.4);
      pinMesh.setMatrixAt(pCount++, pMat4);
    }
    pinMesh.instanceMatrix.needsUpdate = true;
    pcbGroup.add(pinMesh);

    // USB Ports & Connectors
    const usbGeo = new THREE.BoxGeometry(0.7, 0.6, 0.8);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x8899AA, metalness: 0.9, roughness: 0.15 });
    const usb1 = new THREE.Mesh(usbGeo, metalMat);
    usb1.position.set(2.4, 0.35, -0.7);
    const usb2 = new THREE.Mesh(usbGeo, metalMat);
    usb2.position.set(2.4, 0.35, 0.7);
    pcbGroup.add(usb1, usb2);

    // 3.5-inch TFT LCD Module with Real STM32 Oscilloscope Waveform Image
    const texLoader = new THREE.TextureLoader();
    const lcdTex = texLoader.load('./assets/real/stm32_oscilloscope.webp');
    lcdTex.colorSpace = THREE.SRGBColorSpace;

    const lcdFrameGeo = new THREE.BoxGeometry(2.3, 0.08, 1.7);
    const lcdFrame = new THREE.Mesh(lcdFrameGeo, metalMat);
    lcdFrame.position.set(0.6, 0.18, 0.4);
    pcbGroup.add(lcdFrame);

    const lcdScreenGeo = new THREE.PlaneGeometry(2.1, 1.5);
    const lcdScreenMat = new THREE.MeshBasicMaterial({ map: lcdTex });
    const lcdScreen = new THREE.Mesh(lcdScreenGeo, lcdScreenMat);
    lcdScreen.rotation.x = -Math.PI / 2;
    lcdScreen.position.set(0.6, 0.23, 0.4);
    pcbGroup.add(lcdScreen);

    this.group.add(pcbGroup);

    // ─────────────────────────────────────────────────────────────
    // 2. SOUND-WAVE AUDIO RIBBONS (Real-time Speaker Diarization)
    // ─────────────────────────────────────────────────────────────
    const ribbonGeo = new THREE.PlaneGeometry(3.6, 1.2, 48, 8);
    const ribbonMat = new THREE.MeshBasicMaterial({
      color: 0xC6FF3D,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
    });
    this.audioRibbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    this.audioRibbonMesh.position.set(-2.5, 1.4, 0.8);
    this.group.add(this.audioRibbonMesh);

    // ─────────────────────────────────────────────────────────────
    // 3. 3D FORCE-DIRECTED GRAPH (GNN-T Computational Lithography)
    // ─────────────────────────────────────────────────────────────
    this.gnnGraphGroup = new THREE.Group();
    this.gnnGraphGroup.position.set(3.8, 1.5, 0);

    const nodeGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x0369A1,
      emissiveIntensity: 0.8,
    });
    this.gnnNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, this.gnnNodeCount);

    // Fibonacci sphere distribution for GNN graph nodes
    const nodeM4 = new THREE.Matrix4();
    const edgePoints: number[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < this.gnnNodeCount; i++) {
      const y = 1 - (i / (this.gnnNodeCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y) * 1.5;
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const pos = new THREE.Vector3(x, y * 1.4, z);
      this.nodePositions.push(pos);
      nodeM4.setPosition(pos);
      this.gnnNodes.setMatrixAt(i, nodeM4);
    }
    this.gnnNodes.instanceMatrix.needsUpdate = true;
    this.gnnGraphGroup.add(this.gnnNodes);

    // Connect proximate nodes with edge lines
    for (let i = 0; i < this.gnnNodeCount; i++) {
      for (let j = i + 1; j < this.gnnNodeCount; j++) {
        if (this.nodePositions[i].distanceTo(this.nodePositions[j]) < 1.35) {
          edgePoints.push(
            this.nodePositions[i].x, this.nodePositions[i].y, this.nodePositions[i].z,
            this.nodePositions[j].x, this.nodePositions[j].y, this.nodePositions[j].z
          );
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePoints, 3));
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xC6FF3D, transparent: true, opacity: 0.45 });
    this.gnnEdges = new THREE.LineSegments(edgeGeo, edgeMat);
    this.gnnGraphGroup.add(this.gnnEdges);

    this.group.add(this.gnnGraphGroup);

    // ─────────────────────────────────────────────────────────────
    // 4. FLOATING REAL GNN ARCHITECTURE DIAGRAM
    // ─────────────────────────────────────────────────────────────
    const gnnTex = texLoader.load('./assets/real/gnn_model_layers.webp');
    gnnTex.colorSpace = THREE.SRGBColorSpace;

    const gnnFrameGeo = new THREE.PlaneGeometry(3.0, 1.8);
    const gnnFrameMat = new THREE.MeshStandardMaterial({
      color: 0x060B14,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x0E1A29,
      emissiveIntensity: 0.5,
    });
    const gnnFrame = new THREE.Mesh(gnnFrameGeo, gnnFrameMat);
    gnnFrame.position.set(4.0, 3.2, 0.8);
    gnnFrame.rotation.set(-0.2, -0.2, 0);

    const borderGeo = new THREE.EdgesGeometry(gnnFrameGeo);
    gnnFrame.add(new THREE.LineSegments(borderGeo, new THREE.LineBasicMaterial({ color: 0x38BDF8 })));

    const gnnImg = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.7), new THREE.MeshBasicMaterial({ map: gnnTex }));
    gnnImg.position.z = 0.01;
    gnnFrame.add(gnnImg);

    this.group.add(gnnFrame);
    this.imagePlanes.push({ mesh: gnnFrame, baseRot: gnnFrame.rotation.clone() });
  }

  public update(delta: number, elapsed: number, scrollProgress: number, mouseX: number, mouseY: number) {
    if (scrollProgress < 0.68 || scrollProgress > 0.89) {
      this.group.visible = false;
      return;
    }
    this.group.visible = true;

    // Animate sound-wave ribbons
    const ribbonAttr = this.audioRibbonMesh.geometry.attributes.position as THREE.BufferAttribute;
    const posArr = ribbonAttr.array as Float32Array;
    for (let i = 0; i < posArr.length; i += 3) {
      const u = posArr[i];
      posArr[i + 2] = Math.sin(u * 4.0 + elapsed * 5.0) * 0.25 * (1.0 - Math.abs(u) / 1.8);
    }
    ribbonAttr.needsUpdate = true;

    // Orbit 3D GNN Graph
    this.gnnGraphGroup.rotation.y += delta * 0.45;
    this.gnnGraphGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.15;

    // Tilt image frame
    for (const item of this.imagePlanes) {
      item.mesh.rotation.x = item.baseRot.x + mouseY * 0.12;
      item.mesh.rotation.y = item.baseRot.y + mouseX * 0.15;
    }
  }
}
