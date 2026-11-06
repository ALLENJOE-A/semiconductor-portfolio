import * as THREE from 'three';

export class TapeoutScene {
  public group: THREE.Group;
  private bgaBallsMesh: THREE.InstancedMesh;
  private ballCount = 256;
  private turntableGroup: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);

    this.turntableGroup = new THREE.Group();
    this.group.add(this.turntableGroup);

    // ─────────────────────────────────────────────────────────────
    // 1. FLIP-CHIP BGA PACKAGE SUBSTRATE
    // ─────────────────────────────────────────────────────────────
    const subGeo = new THREE.BoxGeometry(6.5, 0.4, 6.5);
    const subMat = new THREE.MeshStandardMaterial({
      color: 0x091422, // High-density multilayer ceramic
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x040912,
      emissiveIntensity: 0.4,
    });
    const subMesh = new THREE.Mesh(subGeo, subMat);
    subMesh.position.y = 0.2;
    this.turntableGroup.add(subMesh);

    // Gold Pin 1 Corner Index Marker
    const markerGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xFF9D4D, metalness: 0.95, roughness: 0.1 });
    const marker = new THREE.Mesh(markerGeo, goldMat);
    marker.position.set(-2.8, 0.42, -2.8);
    this.turntableGroup.add(marker);

    // ─────────────────────────────────────────────────────────────
    // 2. INTEGRATED HEAT SPREADER (IHS) LID
    // ─────────────────────────────────────────────────────────────
    const ihsGeo = new THREE.BoxGeometry(4.8, 0.35, 4.8);
    const ihsMat = new THREE.MeshStandardMaterial({
      color: 0x6E7B8C, // Nickel-plated copper
      metalness: 0.92,
      roughness: 0.18,
    });
    const ihs = new THREE.Mesh(ihsGeo, ihsMat);
    ihs.position.y = 0.58;
    this.turntableGroup.add(ihs);

    // Laser-etched die label plate
    const labelGeo = new THREE.PlaneGeometry(3.6, 2.2);
    // Create laser-etched texture using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 312;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#6E7B8C';
    ctx.fillRect(0, 0, 512, 312);
    ctx.fillStyle = '#111A24';
    ctx.font = 'bold 28px monospace';
    ctx.fillText('ALLEN JOE A', 36, 68);
    ctx.font = '20px monospace';
    ctx.fillStyle = '#223244';
    ctx.fillText('VLSI & SEMICONDUCTOR', 36, 110);
    ctx.fillText('CORE: PS-02 PID / BIST MAC', 36, 150);
    ctx.fillText('TECH: SKY130 · CADENCE · TCAD', 36, 190);
    ctx.fillText('TAPE-OUT READY · 2026', 36, 240);

    const labelTex = new THREE.CanvasTexture(canvas);
    labelTex.colorSpace = THREE.SRGBColorSpace;
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTex,
      metalness: 0.85,
      roughness: 0.25,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.rotation.x = -Math.PI / 2;
    labelMesh.position.set(0, 0.76, 0);
    this.turntableGroup.add(labelMesh);

    // ─────────────────────────────────────────────────────────────
    // 3. BGA SOLDER BALL ARRAY (Underside Matrix)
    // ─────────────────────────────────────────────────────────────
    const ballGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xAAB8C8, // Lead-free Sn-Ag-Cu solder alloy
      metalness: 0.95,
      roughness: 0.12,
    });
    this.bgaBallsMesh = new THREE.InstancedMesh(ballGeo, ballMat, this.ballCount);

    const matrix = new THREE.Matrix4();
    let bIdx = 0;
    const gridSize = 16;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip center cavity
        if (r >= 5 && r <= 10 && c >= 5 && c <= 10) continue;
        if (bIdx < this.ballCount) {
          const bx = -2.8 + c * 0.37;
          const bz = -2.8 + r * 0.37;
          matrix.setPosition(bx, -0.06, bz);
          this.bgaBallsMesh.setMatrixAt(bIdx++, matrix);
        }
      }
    }
    this.bgaBallsMesh.instanceMatrix.needsUpdate = true;
    this.turntableGroup.add(this.bgaBallsMesh);

    // ─────────────────────────────────────────────────────────────
    // 4. MIRRORED PEDESTAL RING WITH DUAL LIME & COPPER RIM ACCENTS
    // ─────────────────────────────────────────────────────────────
    const pedestalGeo = new THREE.CylinderGeometry(5.2, 5.5, 0.4, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x040810,
      metalness: 0.95,
      roughness: 0.1,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.35;
    this.group.add(pedestal);

    // Glowing rim rings
    const rimLime = new THREE.Mesh(
      new THREE.RingGeometry(5.25, 5.35, 48),
      new THREE.MeshBasicMaterial({ color: 0xC6FF3D, side: THREE.DoubleSide })
    );
    rimLime.rotation.x = Math.PI / 2;
    rimLime.position.y = -0.14;
    this.group.add(rimLime);
  }

  public update(delta: number, _elapsed: number, scrollProgress: number) {
    if (scrollProgress < 0.91) {
      this.group.visible = false;
      return;
    }
    this.group.visible = true;

    // Slow turntable rotation
    this.turntableGroup.rotation.y += delta * 0.45;
  }
}
