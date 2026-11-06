import * as THREE from 'three';

export interface BISTBlock {
  mesh: THREE.Mesh;
  title: string;
  desc: string;
  specs: string;
  box: THREE.Box3;
}

export class GateBISTScene {
  public group: THREE.Group;
  public blocks: BISTBlock[] = [];
  private packetMeshes: THREE.InstancedMesh;
  private packetPaths: { curve: THREE.CatmullRomCurve3; progress: number; speed: number }[] = [];
  private imagePlanes: { mesh: THREE.Mesh; baseRot: THREE.Euler }[] = [];

  constructor() {
    this.group = new THREE.Group();
    // Positioned in right half of the screen
    this.group.position.set(3.0, 0, 0);

    // ─────────────────────────────────────────────────────────────
    // 1. TINTED DARK GLASS SUBSTRATE BASE
    // ─────────────────────────────────────────────────────────────
    const planeGeo = new THREE.BoxGeometry(10, 0.1, 7.5);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x060D17,
      metalness: 0.85,
      roughness: 0.15,
      emissive: 0x030810,
      emissiveIntensity: 0.3,
    });
    const basePlane = new THREE.Mesh(planeGeo, planeMat);
    basePlane.position.y = -0.05;
    this.group.add(basePlane);

    // Grid markings on the plane
    const grid = new THREE.GridHelper(9.5, 16, 0xC6FF3D, 0x1A2E3D);
    grid.position.y = 0.01;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.3;
    this.group.add(grid);

    // ─────────────────────────────────────────────────────────────
    // 2. EXTRUDED 3D ARCHITECTURAL BLOCKS
    // ─────────────────────────────────────────────────────────────
    const blockMat = new THREE.MeshStandardMaterial({
      color: 0x0E1A29,
      metalness: 0.7,
      roughness: 0.25,
      emissive: 0x081524,
      emissiveIntensity: 0.5,
    });

    const blockConfigs = [
      {
        id: 'lfsr',
        title: 'Dual 16-bit LFSR TPG',
        desc: 'Independent pseudo-random test pattern generators (LFSR-A seeded 0xACE1, LFSR-B seeded 0x1B3D) with low-power transition control.',
        specs: '16-bit Polynomial · Maximal Length · Clock-Gated',
        size: [1.8, 0.8, 2.2],
        pos: [-3.4, 0.4, 0],
        color: 0xC6FF3D,
      },
      {
        id: 'mac',
        title: 'Pipelined 16-bit MAC Core',
        desc: 'Booth multiplier + Wallace tree adder + 32-bit accumulator. Evaluated across operand isolation and clock-gating low-power architectures.',
        specs: '100 MHz Cadence Genus · 1960 Stuck-at Faults',
        size: [2.4, 1.1, 2.6],
        pos: [-0.3, 0.55, 0],
        color: 0x38BDF8,
      },
      {
        id: 'misr',
        title: 'MISR / ORA Compactor',
        desc: 'Multiple-Input Signature Register for spatial & temporal response compaction into a 16-bit diagnostic signature.',
        specs: 'Zero Aliasing · 99.8980% Fault Coverage',
        size: [1.6, 0.8, 1.8],
        pos: [2.5, 0.4, 0],
        color: 0xFF9D4D,
      },
      {
        id: 'comparator',
        title: 'Signature Comparator & FSM',
        desc: 'BIST controller FSM coordinating test mode, pattern counter, scan shift, and cycle-accurate golden signature comparison.',
        specs: 'Self-Checking · PASS/FAIL Flag · IEEE 1364-2001',
        size: [1.4, 0.7, 1.4],
        pos: [4.2, 0.35, 0],
        color: 0x22C55E,
      },
    ];

    blockConfigs.forEach((cfg) => {
      const geo = new THREE.BoxGeometry(cfg.size[0], cfg.size[1], cfg.size[2]);
      const mesh = new THREE.Mesh(geo, blockMat.clone());
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);

      // Glowing top border accent
      const edges = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.85 });
      const border = new THREE.LineSegments(edges, edgeMat);
      mesh.add(border);

      // Top glowing indicator strip
      const stripGeo = new THREE.BoxGeometry(cfg.size[0] * 0.8, 0.04, 0.15);
      const stripMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.set(0, cfg.size[1] * 0.5 + 0.02, 0);
      mesh.add(strip);

      this.group.add(mesh);

      const box = new THREE.Box3().setFromObject(mesh);
      this.blocks.push({
        mesh,
        title: cfg.title,
        desc: cfg.desc,
        specs: cfg.specs,
        box,
      });
    });

    // ─────────────────────────────────────────────────────────────
    // 3. TRANSPARENT BUS CONDUITS & TRAVELING DATA PACKETS
    // ─────────────────────────────────────────────────────────────
    const tubeMat = new THREE.MeshPhysicalMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      transmission: 0.85,
    });

    const segments = [
      { start: new THREE.Vector3(-2.5, 0.4, 0), end: new THREE.Vector3(-1.5, 0.5, 0) }, // LFSR -> MAC
      { start: new THREE.Vector3(0.9, 0.5, 0), end: new THREE.Vector3(1.7, 0.4, 0) },  // MAC -> MISR
      { start: new THREE.Vector3(3.3, 0.4, 0), end: new THREE.Vector3(3.5, 0.35, 0) }, // MISR -> Comp
    ];

    segments.forEach((seg) => {
      const curve = new THREE.CatmullRomCurve3([seg.start, seg.end]);
      const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.06, 8, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      this.group.add(tubeMesh);

      // Create data packet flow along this curve
      for (let k = 0; k < 20; k++) {
        this.packetPaths.push({
          curve,
          progress: Math.random(),
          speed: 0.4 + Math.random() * 0.5,
        });
      }
    });

    // Instanced glowing data packet beads
    const packetGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xC6FF3D });
    this.packetMeshes = new THREE.InstancedMesh(packetGeo, packetMat, this.packetPaths.length);
    this.group.add(this.packetMeshes);

    // ─────────────────────────────────────────────────────────────
    // 4. FLOATING REAL CADENCE SCHEMATIC & FAULT COVERAGE CHARTS
    // ─────────────────────────────────────────────────────────────
    const texLoader = new THREE.TextureLoader();
    const figures = [
      {
        path: './assets/real/mac_16_genus_schematic.webp',
        pos: new THREE.Vector3(-0.3, 2.5, -1.8),
        rot: new THREE.Euler(-0.25, 0, 0),
        size: [3.4, 1.9],
        title: 'Cadence Genus 21.1 Mapped Schematic',
      },
      {
        path: './assets/real/fault_coverage_summary.webp',
        pos: new THREE.Vector3(3.4, 1.8, 1.6),
        rot: new THREE.Euler(0.1, -0.35, 0),
        size: [2.4, 0.85],
        title: '99.8980% Stuck-at Fault Coverage',
      },
      {
        path: './assets/real/ppa_comparison_table.webp',
        pos: new THREE.Vector3(-3.4, 1.6, 1.5),
        rot: new THREE.Euler(0.1, 0.35, 0),
        size: [2.5, 0.55],
        title: 'PPA Trade-off Across 6 Architectures',
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
        emissive: 0x101B2B,
        emissiveIntensity: 0.5,
      });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.copy(fig.pos);
      frame.rotation.copy(fig.rot);

      const borderGeo = new THREE.EdgesGeometry(frameGeo);
      const borderMat = new THREE.LineBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.65 });
      frame.add(new THREE.LineSegments(borderGeo, borderMat));

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
      this.imagePlanes.push({ mesh: frame, baseRot: fig.rot.clone() });
    });
  }

  public update(delta: number, _elapsed: number, scrollProgress: number, mouseX: number, mouseY: number) {
    if (scrollProgress < 0.32 || scrollProgress > 0.62) {
      this.group.visible = false;
      return;
    }
    this.group.visible = true;

    // Animate data packets flowing along pipeline conduits
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < this.packetPaths.length; i++) {
      const item = this.packetPaths[i];
      item.progress = (item.progress + delta * item.speed) % 1.0;
      const point = item.curve.getPointAt(item.progress);
      matrix.setPosition(point);
      this.packetMeshes.setMatrixAt(i, matrix);
    }
    this.packetMeshes.instanceMatrix.needsUpdate = true;

    // Subtle frame tilt
    for (const item of this.imagePlanes) {
      item.mesh.rotation.x = item.baseRot.x + mouseY * 0.12;
      item.mesh.rotation.y = item.baseRot.y + mouseX * 0.15;
    }
  }
}
