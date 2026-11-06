import * as THREE from 'three';

export class MetalPDScene {
  public group: THREE.Group;
  private cellMesh: THREE.InstancedMesh;
  private cellCount = 960;
  private cellInitialPos: { x: number; targetY: number; scatterY: number; z: number; width: number }[] = [];
  private hTreeLines: THREE.LineSegments;
  private hTreeGeometry: THREE.BufferGeometry;
  private routingMesh: THREE.InstancedMesh;
  private routingCount = 360;
  private drcSweepPlane: THREE.Mesh;
  private imagePlanes: { mesh: THREE.Mesh; baseRot: THREE.Euler }[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 0, -2);

    // ─────────────────────────────────────────────────────────────
    // 1. SILICON FLOORPLAN SUBSTRATE WITH POWER GRID
    // ─────────────────────────────────────────────────────────────
    const floorGeo = new THREE.BoxGeometry(11, 0.15, 11);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x070E1A,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x030812,
      emissiveIntensity: 0.4,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.08;
    this.group.add(floor);

    // Outer Ring / Core Boundary
    const boundGeo = new THREE.BoxGeometry(10.5, 0.04, 10.5);
    const boundEdges = new THREE.EdgesGeometry(boundGeo);
    const boundMat = new THREE.LineBasicMaterial({ color: 0xFF9D4D, transparent: true, opacity: 0.8 });
    this.group.add(new THREE.LineSegments(boundEdges, boundMat));

    // Power Ring (VDD / VSS straps)
    const powerMat = new THREE.MeshStandardMaterial({ color: 0xFF9D4D, metalness: 0.95, roughness: 0.15 });
    const powerStrapGeo = new THREE.BoxGeometry(10.2, 0.05, 0.25);
    const p1 = new THREE.Mesh(powerStrapGeo, powerMat); p1.position.set(0, 0.02, 4.9);
    const p2 = new THREE.Mesh(powerStrapGeo, powerMat); p2.position.set(0, 0.02, -4.9);
    this.group.add(p1, p2);

    // Macro Blocks (Attitude Controller, Rate Controller, Failsafe)
    const macroMat = new THREE.MeshStandardMaterial({
      color: 0x112338,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0x0A1B2D,
      emissiveIntensity: 0.6,
    });
    const macro1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 2.0), macroMat);
    macro1.position.set(-3.4, 0.1, -3.4);
    const macro2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 2.0), macroMat);
    macro2.position.set(3.4, 0.1, -3.4);
    this.group.add(macro1, macro2);

    // ─────────────────────────────────────────────────────────────
    // 2. THOUSANDS OF INSTANCED STANDARD CELLS IN ROWS
    // ─────────────────────────────────────────────────────────────
    const cellBaseGeo = new THREE.BoxGeometry(0.24, 0.12, 0.14);
    const cellMat = new THREE.MeshStandardMaterial({
      color: 0x3E5675,
      metalness: 0.5,
      roughness: 0.35,
      emissive: 0x1E334D,
      emissiveIntensity: 0.5,
    });
    this.cellMesh = new THREE.InstancedMesh(cellBaseGeo, cellMat, this.cellCount);

    const rows = 32;
    const cellsPerRow = 30;
    let cIdx = 0;
    for (let r = 0; r < rows; r++) {
      const z = -4.2 + r * 0.27;
      for (let c = 0; c < cellsPerRow; c++) {
        const x = -4.2 + c * 0.28 + (Math.sin(r * 3 + c) * 0.04);
        // Avoid macro zones
        if ((x < -2.0 && z < -2.0) || (x > 2.0 && z < -2.0)) continue;
        if (cIdx < this.cellCount) {
          this.cellInitialPos.push({
            x,
            targetY: 0.06,
            scatterY: 2.5 + Math.random() * 4.0,
            z,
            width: 0.8 + Math.random() * 0.4,
          });
          cIdx++;
        }
      }
    }
    this.group.add(this.cellMesh);

    // ─────────────────────────────────────────────────────────────
    // 3. FRACTAL H-TREE CLOCK NETWORK (Lime #C6FF3D)
    // ─────────────────────────────────────────────────────────────
    const hTreeVertices: number[] = [];
    // Recursive H-tree generation
    const buildHTree = (x: number, z: number, w: number, h: number, depth: number) => {
      if (depth === 0) return;
      const y = 0.18;
      // Horizontal trunk
      hTreeVertices.push(x - w / 2, y, z, x + w / 2, y, z);
      // Left vertical branch
      hTreeVertices.push(x - w / 2, y, z - h / 2, x - w / 2, y, z + h / 2);
      // Right vertical branch
      hTreeVertices.push(x + w / 2, y, z - h / 2, x + w / 2, y, z + h / 2);

      // Sub-trees at 4 corners
      buildHTree(x - w / 2, z - h / 2, w / 2, h / 2, depth - 1);
      buildHTree(x - w / 2, z + h / 2, w / 2, h / 2, depth - 1);
      buildHTree(x + w / 2, z - h / 2, w / 2, h / 2, depth - 1);
      buildHTree(x + w / 2, z + h / 2, w / 2, h / 2, depth - 1);
    };
    buildHTree(0, 0, 6.0, 6.0, 3);

    this.hTreeGeometry = new THREE.BufferGeometry();
    this.hTreeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(hTreeVertices, 3));
    const hTreeMat = new THREE.LineBasicMaterial({
      color: 0xC6FF3D,
      linewidth: 2,
      transparent: true,
      opacity: 0.0, // Drawn dynamically via scroll
    });
    this.hTreeLines = new THREE.LineSegments(this.hTreeGeometry, hTreeMat);
    this.group.add(this.hTreeLines);

    // ─────────────────────────────────────────────────────────────
    // 4. MULTI-LAYER COPPER INTERCONNECT ROUTING (Horizontal M3 / Vertical M4)
    // ─────────────────────────────────────────────────────────────
    const wireGeo = new THREE.BoxGeometry(0.08, 0.04, 1.2);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xFF9D4D,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x442200,
      emissiveIntensity: 0.5,
    });
    this.routingMesh = new THREE.InstancedMesh(wireGeo, wireMat, this.routingCount);
    const rMat4 = new THREE.Matrix4();
    for (let i = 0; i < this.routingCount; i++) {
      const rx = -4.0 + Math.random() * 8.0;
      const rz = -4.0 + Math.random() * 8.0;
      const isVertical = Math.random() > 0.5;
      rMat4.makeRotationY(isVertical ? 0 : Math.PI / 2);
      rMat4.setPosition(rx, 0.14, rz);
      this.routingMesh.setMatrixAt(i, rMat4);
    }
    this.routingMesh.instanceMatrix.needsUpdate = true;
    this.routingMesh.visible = false;
    this.group.add(this.routingMesh);

    // ─────────────────────────────────────────────────────────────
    // 5. DRC VERIFICATION SCAN PLANE (Glowing Neon Green Sweep)
    // ─────────────────────────────────────────────────────────────
    const sweepGeo = new THREE.BoxGeometry(0.12, 0.45, 10.5);
    const sweepMat = new THREE.MeshBasicMaterial({
      color: 0x22C55E,
      transparent: true,
      opacity: 0.85,
    });
    this.drcSweepPlane = new THREE.Mesh(sweepGeo, sweepMat);
    this.drcSweepPlane.position.set(-5.5, 0.2, 0);
    this.drcSweepPlane.visible = false;
    this.group.add(this.drcSweepPlane);

    // ─────────────────────────────────────────────────────────────
    // 6. REAL CADENCE INNOVUS LAYOUT CAPTURES
    // ─────────────────────────────────────────────────────────────
    const texLoader = new THREE.TextureLoader();
    const figures = [
      {
        path: './assets/real/pid_final_layout.webp',
        pos: new THREE.Vector3(-3.8, 3.2, 1.2),
        rot: new THREE.Euler(-0.3, 0.25, 0),
        size: [3.2, 1.8],
        title: 'Final GDSII Layout with Fillers',
      },
      {
        path: './assets/real/pid_drc_clean.webp',
        pos: new THREE.Vector3(3.8, 3.2, 1.2),
        rot: new THREE.Euler(-0.3, -0.25, 0),
        size: [3.0, 1.7],
        title: 'Verify DRC: Zero Violations',
      },
      {
        path: './assets/real/pid_cts.webp',
        pos: new THREE.Vector3(0, 4.2, -3.2),
        rot: new THREE.Euler(-0.4, 0, 0),
        size: [3.2, 1.8],
        title: 'Clock Tree Synthesis (CTS) Skew',
      },
    ];

    figures.forEach((fig) => {
      const tex = texLoader.load(fig.path);
      tex.colorSpace = THREE.SRGBColorSpace;

      const frameGeo = new THREE.PlaneGeometry(fig.size[0] + 0.1, fig.size[1] + 0.1);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x060B14,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x102015,
        emissiveIntensity: 0.5,
      });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.copy(fig.pos);
      frame.rotation.copy(fig.rot);

      const borderGeo = new THREE.EdgesGeometry(frameGeo);
      const borderMat = new THREE.LineBasicMaterial({ color: 0xC6FF3D, transparent: true, opacity: 0.7 });
      frame.add(new THREE.LineSegments(borderGeo, borderMat));

      const imgGeo = new THREE.PlaneGeometry(fig.size[0], fig.size[1]);
      const imgMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.95 });
      const imgMesh = new THREE.Mesh(imgGeo, imgMat);
      imgMesh.position.z = 0.01;
      frame.add(imgMesh);

      this.group.add(frame);
      this.imagePlanes.push({ mesh: frame, baseRot: fig.rot.clone() });
    });
  }

  public update(_delta: number, _elapsed: number, scrollProgress: number, mouseX: number, mouseY: number) {
    if (scrollProgress < 0.48 || scrollProgress > 0.76) {
      this.group.visible = false;
      return;
    }
    this.group.visible = true;

    // SCROLL-DRIVEN PHYSICAL DESIGN FLOW STAGES (progress 0.52 to 0.72)
    // 1. Placement Scrub (0.52 to 0.59): cells fly in and snap into legal rows
    const placeT = THREE.MathUtils.clamp((scrollProgress - 0.52) / 0.07, 0, 1);
    const easePlace = placeT * placeT * (3 - 2 * placeT);

    const mat4 = new THREE.Matrix4();
    for (let i = 0; i < this.cellInitialPos.length; i++) {
      const cell = this.cellInitialPos[i];
      const curY = THREE.MathUtils.lerp(cell.scatterY, cell.targetY, easePlace);
      mat4.makeScale(cell.width, 1, 1);
      mat4.setPosition(cell.x, curY, cell.z);
      this.cellMesh.setMatrixAt(i, mat4);
    }
    this.cellMesh.instanceMatrix.needsUpdate = true;

    // 2. Clock Tree Synthesis Scrub (0.58 to 0.65): lime H-tree draws itself
    const ctsT = THREE.MathUtils.clamp((scrollProgress - 0.58) / 0.07, 0, 1);
    (this.hTreeLines.material as THREE.LineBasicMaterial).opacity = ctsT * 0.95;

    // 3. Routing Scrub (0.63 to 0.70): copper wires grow net by net
    const routeT = THREE.MathUtils.clamp((scrollProgress - 0.63) / 0.07, 0, 1);
    if (routeT > 0.05) {
      this.routingMesh.visible = true;
      this.routingMesh.count = Math.floor(this.routingCount * routeT);
    } else {
      this.routingMesh.visible = false;
    }

    // 4. Sign-off DRC Clean Sweep (0.68 to 0.74): green beam sweeps over
    const drcT = THREE.MathUtils.clamp((scrollProgress - 0.68) / 0.06, 0, 1);
    if (drcT > 0 && drcT < 1) {
      this.drcSweepPlane.visible = true;
      this.drcSweepPlane.position.x = -5.5 + drcT * 11.0;
    } else {
      this.drcSweepPlane.visible = false;
    }

    // Tilt image frames
    for (const item of this.imagePlanes) {
      item.mesh.rotation.x = item.baseRot.x + mouseY * 0.12;
      item.mesh.rotation.y = item.baseRot.y + mouseX * 0.15;
    }
  }
}
