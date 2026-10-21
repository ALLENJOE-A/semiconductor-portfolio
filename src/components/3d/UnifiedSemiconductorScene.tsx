import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// ── Deterministic PRNG for stable, reproducible geometry ───────────
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// ──────────────────────────────────────────────────────────────────
// STAGE 1: SAND & SILICON INGOT
// Warm quartz sand, ochre, champagne gold converging into crystalline boule
// ──────────────────────────────────────────────────────────────────
function StageSandAndIngot({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const ingotGroupRef = useRef<THREE.Group>(null!);

  const PARTICLE_COUNT = 3000;

  const [positions, targets, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const tar = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    // Warm earth & silicon palette: champagne gold, warm sand, ochre, crystalline quartz
    const sandPalette = [
      new THREE.Color('#d4af37'), // champagne gold
      new THREE.Color('#c89f65'), // warm sand
      new THREE.Color('#dfc28d'), // natural silica
      new THREE.Color('#e8d5b5'), // light quartz
      new THREE.Color('#8fa1b5'), // crystalline silicon fleck
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Dispersed wide field
      const dist = 5 + seededRandom(i * 7 + 1) * 11;
      const theta = seededRandom(i * 11 + 2) * Math.PI * 2;
      const phi = (seededRandom(i * 13 + 3) - 0.5) * Math.PI;

      pos[i3] = dist * Math.cos(theta) * Math.cos(phi);
      pos[i3 + 1] = dist * Math.sin(phi) + (seededRandom(i * 17 + 4) - 0.5) * 4;
      pos[i3 + 2] = dist * Math.sin(theta) * Math.cos(phi);

      // Ingot Boule Target Coordinates
      const u = seededRandom(i * 19 + 5);
      const targetY = (u - 0.5) * 3.0; // -1.5 to +1.5

      let r = 0.95;
      if (targetY > 0.9) {
        r *= Math.max(0.1, 1 - (targetY - 0.9) / 0.6);
      } else if (targetY < -0.9) {
        r *= Math.max(0.1, 1 - (-0.9 - targetY) / 0.6);
      }
      r *= 0.85 + seededRandom(i * 23 + 6) * 0.15;

      const angle = seededRandom(i * 29 + 7) * Math.PI * 2;
      tar[i3] = r * Math.cos(angle);
      tar[i3 + 1] = targetY;
      tar[i3 + 2] = r * Math.sin(angle);

      const c = sandPalette[Math.floor(seededRandom(i * 31 + 8) * sandPalette.length)];
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }

    return [pos, tar, col];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    // Normalised progress for Stage 1 (0.00 to 0.22)
    const p = Math.min(Math.max((progress - 0.0) / 0.22, 0), 1);
    const easeP = p * p * (3 - 2 * p);
    const time = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const ox = positions[i3];
      const oy = positions[i3 + 1];
      const oz = positions[i3 + 2];

      const tx = targets[i3];
      const ty = targets[i3 + 1];
      const tz = targets[i3 + 2];

      const swirl = (1 - easeP) * 3.2 + time * 0.15;
      const cosS = Math.cos(swirl);
      const sinS = Math.sin(swirl);

      const curX = THREE.MathUtils.lerp(ox, tx, easeP);
      const curY = THREE.MathUtils.lerp(oy, ty, easeP);
      const curZ = THREE.MathUtils.lerp(oz, tz, easeP);

      arr[i3] = curX * cosS - curZ * sinS;
      arr[i3 + 1] = curY + Math.sin(time + curX) * 0.04 * (1 - easeP);
      arr[i3 + 2] = curX * sinS + curZ * cosS;
    }
    posAttr.needsUpdate = true;

    if (ingotGroupRef.current) {
      const ingotScale = Math.min(Math.max((progress - 0.06) / 0.12, 0), 1);
      ingotGroupRef.current.scale.setScalar(ingotScale);

      // Ingot tilts to horizontal at transition to slicing (0.16 to 0.24)
      const tiltP = Math.min(Math.max((progress - 0.16) / 0.08, 0), 1);
      ingotGroupRef.current.rotation.z = tiltP * (Math.PI / 2);
      ingotGroupRef.current.rotation.y = time * 0.2 + progress * 1.5;

      const fadeOut = progress > 0.24 ? Math.max(0, 1 - (progress - 0.24) / 0.06) : 1;
      ingotGroupRef.current.visible = fadeOut > 0.01;
      if (ingotGroupRef.current.visible) {
        ingotGroupRef.current.scale.multiplyScalar(fadeOut);
      }
    }

    pointsRef.current.visible = progress < 0.26;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(positions), 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.062} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </points>

      {/* Czochralski Ingot Boule (Crystalline Silver-Grey Silicon) */}
      <group ref={ingotGroupRef} scale={[0.001, 0.001, 0.001]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 2.0, 48]} />
          <meshStandardMaterial color="#4a5566" metalness={0.92} roughness={0.22} />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <coneGeometry args={[0.95, 0.7, 48]} />
          <meshStandardMaterial color="#4a5566" metalness={0.92} roughness={0.22} />
        </mesh>
        <mesh position={[0, -1.35, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.95, 0.7, 48]} />
          <meshStandardMaterial color="#4a5566" metalness={0.92} roughness={0.22} />
        </mesh>
        {/* Growth rings */}
        {[-0.7, -0.35, 0.0, 0.35, 0.7].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]}>
            <torusGeometry args={[0.952, 0.01, 16, 48]} />
            <meshBasicMaterial color="#8fa1b5" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// STAGE 2: 300mm SILICON WAFER & DIE SEPARATION
// Polished silver-grey with subtle thin-film iridescence, crisp die boundaries
// ──────────────────────────────────────────────────────────────────
function StageWaferAndDies({ progress }: { progress: number }) {
  const waferRef = useRef<THREE.Group>(null!);
  const dieRef = useRef<THREE.Group>(null!);
  const slicingRef = useRef<THREE.Group>(null!);

  const waferTexture = useMemo(() => {
    const size = 1536;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Polished silver-grey silicon base with subtle radial gradient
    const grad = ctx.createRadialGradient(size / 2, size / 2, 20, size / 2, size / 2, size / 2);
    grad.addColorStop(0, '#5a6878');
    grad.addColorStop(0.5, '#3a4654');
    grad.addColorStop(0.85, '#28323d');
    grad.addColorStop(1, '#1b232c');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
    ctx.fill();

    // Alignment test rings
    [0.28, 0.50, 0.70, 0.88].forEach((z) => {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, (size / 2 - 8) * z, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)'; // warm gold hairline ring
      ctx.lineWidth = 1.4;
      ctx.stroke();
    });

    // 11x11 Die Grid with scribe lines
    const GRID = 11;
    const margin = 50;
    const usable = size - margin * 2;
    const dieDim = usable / GRID;
    const cx = size / 2;
    const cy = size / 2;
    const maxR = size / 2 - 20;

    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const x = margin + c * dieDim;
        const y = margin + r * dieDim;

        const corners = [
          [x, y],
          [x + dieDim, y],
          [x, y + dieDim],
          [x + dieDim, y + dieDim],
        ];
        if (!corners.every(([px, py]) => Math.hypot(px - cx, py - cy) < maxR)) continue;

        const isCenter = r === 5 && c === 5;

        // Scribe lines (clear silver/gold contrast)
        ctx.strokeStyle = isCenter ? '#e8a855' : 'rgba(164, 180, 196, 0.45)';
        ctx.lineWidth = isCenter ? 2.5 : 1.0;
        ctx.strokeRect(x + 2, y + 2, dieDim - 4, dieDim - 4);

        // Active die fill
        ctx.fillStyle = isCenter ? 'rgba(212, 175, 55, 0.25)' : 'rgba(124, 140, 158, 0.1)';
        ctx.fillRect(x + 3, y + 3, dieDim - 6, dieDim - 6);

        // Internal sub-die circuit partitions
        ctx.strokeStyle = isCenter ? 'rgba(212, 175, 55, 0.7)' : 'rgba(164, 180, 196, 0.2)';
        ctx.lineWidth = 0.8;
        const h = (dieDim - 8) / 2;
        ctx.strokeRect(x + 4, y + 4, h, h);
        ctx.strokeRect(x + 4 + h, y + 4, h, h);
        ctx.strokeRect(x + 4, y + 4 + h, dieDim - 8, h);
      }
    }

    // SEMI notch
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 8, 0.485 * Math.PI, 0.515 * Math.PI);
    ctx.lineTo(size / 2, size / 2 + 12);
    ctx.closePath();
    ctx.fillStyle = '#10151c';
    ctx.fill();
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state) => {
    const isVisible = progress >= 0.18 && progress <= 0.46;
    if (waferRef.current) waferRef.current.visible = isVisible;
    if (dieRef.current) dieRef.current.visible = isVisible;
    if (slicingRef.current) slicingRef.current.visible = progress >= 0.18 && progress <= 0.28;
    if (!isVisible) return;

    const time = state.clock.elapsedTime;

    // Slicing saw motion
    if (slicingRef.current && progress <= 0.28) {
      const sp = Math.min(Math.max((progress - 0.18) / 0.08, 0), 1);
      slicingRef.current.position.x = -sp * 1.5;
    }

    // Wafer rotation and scale
    if (waferRef.current) {
      const enter = Math.min(Math.max((progress - 0.22) / 0.08, 0), 1);
      const exit = progress > 0.38 ? Math.max(0, 1 - (progress - 0.38) / 0.06) : 1;
      waferRef.current.scale.setScalar(enter * exit * 1.05);

      waferRef.current.rotation.x = 0.8 + Math.sin(time * 0.3) * 0.04;
      waferRef.current.rotation.y = -0.2 + (progress - 0.25) * 1.4;
    }

    // Extracted singulated die
    if (dieRef.current) {
      if (progress < 0.32) {
        dieRef.current.visible = false;
      } else {
        dieRef.current.visible = true;
        const lift = Math.min(Math.max((progress - 0.32) / 0.08, 0), 1);
        dieRef.current.position.z = lift * 2.8;
        dieRef.current.position.y = lift * 0.4;
        dieRef.current.scale.setScalar(1 + lift * 1.8);
        dieRef.current.rotation.x = (1 - lift) * 0.8 + lift * 0.3;
        dieRef.current.rotation.y = (progress - 0.32) * 2.0;

        if (progress > 0.42) {
          const fade = Math.max(0, 1 - (progress - 0.42) / 0.04);
          dieRef.current.scale.multiplyScalar(fade);
        }
      }
    }
  });

  return (
    <group>
      {/* Warm amber diamond-wire slicing planes */}
      <group ref={slicingRef}>
        {[-0.7, -0.35, 0.0, 0.35, 0.7].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[0.96, 1.15, 48]} />
            <meshBasicMaterial color="#e8a855" side={THREE.DoubleSide} transparent opacity={0.65} />
          </mesh>
        ))}
      </group>

      {/* 300mm Silicon Wafer Disc */}
      <group ref={waferRef}>
        <mesh>
          <cylinderGeometry args={[2.2, 2.2, 0.05, 64]} />
          <meshStandardMaterial attach="material-0" color="#3a4654" metalness={0.92} roughness={0.2} />
          <meshStandardMaterial attach="material-1" map={waferTexture} metalness={0.94} roughness={0.16} />
          <meshStandardMaterial attach="material-2" color="#1a232c" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* Extracted Die with Copper/Gold Bond Pads */}
      <group ref={dieRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.48, 0.04, 0.48]} />
          <meshStandardMaterial color="#232d3a" metalness={0.88} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.025, 0]}>
          <boxGeometry args={[0.44, 0.015, 0.44]} />
          <meshStandardMaterial color="#c87d46" metalness={0.9} roughness={0.2} />
        </mesh>
        <lineSegments position={[0, 0.035, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.49, 0.02, 0.49)]} />
          <lineBasicMaterial color="#e8a855" />
        </lineSegments>
      </group>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// STAGE 3: NANOSCALE TRANSISTOR CROSS-SECTION
// Distinct physical materials: slate silicon substrate, rich copper-bronze S/D,
// translucent ceramic HfO2 dielectric, brushed tungsten/titanium gate, tungsten plugs
// ──────────────────────────────────────────────────────────────────
function StageTransistor({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const carriersRef = useRef<THREE.Points>(null!);

  const CARRIER_COUNT = 160;

  const [carrierPos] = useMemo(() => {
    const pos = new Float32Array(CARRIER_COUNT * 3);
    for (let i = 0; i < CARRIER_COUNT; i++) {
      pos[i * 3] = (seededRandom(i * 11 + 1) - 0.5) * 2.0;
      pos[i * 3 + 1] = -0.05 + (seededRandom(i * 13 + 2) - 0.5) * 0.12;
      pos[i * 3 + 2] = (seededRandom(i * 17 + 3) - 0.5) * 1.2;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    const isVisible = progress >= 0.38 && progress <= 0.66;
    if (groupRef.current) groupRef.current.visible = isVisible;
    if (!isVisible) return;

    const time = state.clock.elapsedTime;

    const enter = Math.min(Math.max((progress - 0.38) / 0.08, 0), 1);
    const exit = progress > 0.58 ? Math.max(0, 1 - (progress - 0.58) / 0.06) : 1;
    groupRef.current.scale.setScalar(enter * exit * 1.35);

    groupRef.current.rotation.y = 0.55 + Math.sin(time * 0.25) * 0.1;
    groupRef.current.rotation.x = 0.32 + Math.cos(time * 0.2) * 0.04;

    if (carriersRef.current) {
      const geo = carriersRef.current.geometry;
      const attr = geo.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < CARRIER_COUNT; i++) {
        const i3 = i * 3;
        arr[i3] += 0.035;
        if (arr[i3] > 1.2) arr[i3] = -1.2;
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Bulk P-Type Silicon Substrate (Slate Charcoal) */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[3.6, 0.7, 2.2]} />
        <meshStandardMaterial color="#232b36" metalness={0.65} roughness={0.35} />
      </mesh>

      {/* 2. Source (n+ SiGe Epitaxy, Rich Copper-Bronze) */}
      <mesh position={[-1.15, -0.05, 0]}>
        <boxGeometry args={[0.9, 0.45, 1.8]} />
        <meshStandardMaterial color="#c87d46" metalness={0.88} roughness={0.25} />
      </mesh>

      {/* 3. Drain (n+ SiGe Epitaxy, Rich Copper-Bronze) */}
      <mesh position={[1.15, -0.05, 0]}>
        <boxGeometry args={[0.9, 0.45, 1.8]} />
        <meshStandardMaterial color="#c87d46" metalness={0.88} roughness={0.25} />
      </mesh>

      {/* 4. Active Conduction Channel Fin */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.4, 0.28, 1.6]} />
        <meshStandardMaterial color="#3d5168" metalness={0.75} roughness={0.3} />
      </mesh>

      {/* 5. High-κ Gate Dielectric (HfO₂ ~1.2nm, Translucent Pale Ceramic) */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.36, 0.1, 1.66]} />
        <meshStandardMaterial color="#8cd4d6" transparent opacity={0.85} roughness={0.2} />
      </mesh>

      {/* 6. Work-Function Metal Gate (HKMG, Brushed Titanium/Tungsten Silver) */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.15, 0.72, 1.6]} />
        <meshStandardMaterial color="#d2d9e0" metalness={0.95} roughness={0.18} />
      </mesh>

      {/* 7. Sidewall Spacers (Si₃N₄ Nitride, Charcoal) */}
      <mesh position={[-0.64, 0.4, 0]}>
        <boxGeometry args={[0.16, 0.55, 1.65]} />
        <meshStandardMaterial color="#343e4d" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0.64, 0.4, 0]}>
        <boxGeometry args={[0.16, 0.55, 1.65]} />
        <meshStandardMaterial color="#343e4d" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* 8. Tungsten Contact Plugs onto S/D */}
      <mesh position={[-1.15, 0.4, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.6, 24]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[1.15, 0.4, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.6, 24]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.2} />
      </mesh>

      {/* 9. Amber/Gold Carrier Packet Stream */}
      <points ref={carriersRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(carrierPos), 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.065} color="#d4af37" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// STAGE 4 & 5: VLSI INTERCONNECTS & PACKAGED CHIP
// Warm copper dual-damascene (M1-M4), graphite package, gold solder pads
// ──────────────────────────────────────────────────────────────────
function StageChipArchitecture({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const isVisible = progress >= 0.58;
    if (groupRef.current) groupRef.current.visible = isVisible;
    if (!isVisible) return;

    const time = state.clock.elapsedTime;
    const enter = Math.min(Math.max((progress - 0.58) / 0.08, 0), 1);
    groupRef.current.scale.setScalar(enter * 1.05);

    groupRef.current.rotation.x = 0.58 + Math.sin(time * 0.25) * 0.04;
    groupRef.current.rotation.y = time * 0.12 + (progress - 0.6) * 0.9;
  });

  return (
    <group ref={groupRef}>
      {/* 1. Organic BGA Package Substrate (Deep Graphite) */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[4.4, 0.15, 4.4]} />
        <meshStandardMaterial color="#181e26" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 2. Silicon Interposer Die */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[3.8, 0.12, 3.8]} />
        <meshStandardMaterial color="#2a3442" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 3. Multi-Tier Metallization (M1-M4) Grid (Warm Copper & Gold Traces) */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial color="#b86d38" wireframe transparent opacity={0.5} />
      </mesh>

      {/* ── 4. Core Functional Hardware Execution Blocks ── */}

      {/* Core A: Adaptive Burst DMA (Navy Bronze) */}
      <group position={[-0.95, 0.12, -0.95]}>
        <mesh>
          <boxGeometry args={[1.4, 0.28, 1.4]} />
          <meshStandardMaterial color="#264466" metalness={0.85} roughness={0.25} />
        </mesh>
        <lineSegments position={[0, 0.15, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.4, 0.01, 1.4)]} />
          <lineBasicMaterial color="#b86d38" />
        </lineSegments>
      </group>

      {/* Core B: GS-ADPLL & Clock Network (Teal Graphite) */}
      <group position={[0.95, 0.12, -0.95]}>
        <mesh>
          <boxGeometry args={[1.4, 0.32, 1.4]} />
          <meshStandardMaterial color="#1f4d54" metalness={0.9} roughness={0.2} />
        </mesh>
        <lineSegments position={[0, 0.17, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.4, 0.01, 1.4)]} />
          <lineBasicMaterial color="#d4af37" />
        </lineSegments>
      </group>

      {/* Core C: TCAD Physics & PE Compute Engine (Warm Earth Graphite) */}
      <group position={[-0.95, 0.12, 0.95]}>
        <mesh>
          <boxGeometry args={[1.4, 0.28, 1.4]} />
          <meshStandardMaterial color="#4a3a2e" metalness={0.85} roughness={0.25} />
        </mesh>
        <lineSegments position={[0, 0.15, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.4, 0.01, 1.4)]} />
          <lineBasicMaterial color="#c87d46" />
        </lineSegments>
      </group>

      {/* Core D: GNN Lithography & Hotspot Engine (Slate Graphite) */}
      <group position={[0.95, 0.12, 0.95]}>
        <mesh>
          <boxGeometry args={[1.4, 0.28, 1.4]} />
          <meshStandardMaterial color="#2c3747" metalness={0.8} roughness={0.3} />
        </mesh>
        <lineSegments position={[0, 0.15, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.4, 0.01, 1.4)]} />
          <lineBasicMaterial color="#8cd4d6" />
        </lineSegments>
      </group>

      {/* 5. Central AXI Interconnect Crossbar (Polished Gold/Tin Conductor) */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.42, 0.26, 0.42]} />
        <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.12} />
      </mesh>

      {/* 6. Gold Wirebond / Flip-Chip Micro-Pads */}
      {[-1.85, -1.2, -0.6, 0, 0.6, 1.2, 1.85].map((pos, idx) => (
        <group key={idx}>
          <mesh position={[pos, -0.08, 1.95]}>
            <boxGeometry args={[0.2, 0.08, 0.15]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[pos, -0.08, -1.95]}>
            <boxGeometry args={[0.2, 0.08, 0.15]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[1.95, -0.08, pos]}>
            <boxGeometry args={[0.15, 0.08, 0.2]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[-1.95, -0.08, pos]}>
            <boxGeometry args={[0.15, 0.08, 0.2]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// UNIFIED SCENE RIG (Controlled Framing, Lighting & Camera Movement)
// Asymmetric composition: 3D scene sits comfortably to the right/center
// while left column displays the synchronized portfolio storytelling
// ──────────────────────────────────────────────────────────────────
export function UnifiedSemiconductorScene({
  progress,
  mouse,
  isMobile = false,
}: {
  progress: number;
  mouse: { x: number; y: number };
  isMobile?: boolean;
}) {
  useFrame((state) => {
    const { camera } = state;

    // Desktop framing biases model slightly to the right (x ~ 1.2 to 1.8)
    // so editorial portfolio story text on the left has ample breathing room
    const xOffset = isMobile ? 0 : 1.35;

    let tx = xOffset;
    let ty = 1.0;
    let tz = 10.0;

    if (progress < 0.22) {
      const p = progress / 0.22;
      tx = xOffset;
      ty = THREE.MathUtils.lerp(0.8, 2.2, p);
      tz = THREE.MathUtils.lerp(10.0, 7.2, p);
    } else if (progress < 0.42) {
      const p = (progress - 0.22) / 0.20;
      tx = xOffset;
      ty = THREE.MathUtils.lerp(2.2, 1.1, p);
      tz = THREE.MathUtils.lerp(7.2, 4.2, p);
    } else if (progress < 0.62) {
      const p = (progress - 0.42) / 0.20;
      tx = xOffset;
      ty = THREE.MathUtils.lerp(1.1, 0.85, p);
      tz = THREE.MathUtils.lerp(4.2, 3.6, p);
    } else if (progress < 0.82) {
      const p = (progress - 0.62) / 0.20;
      tx = xOffset;
      ty = THREE.MathUtils.lerp(0.85, 3.0, p);
      tz = THREE.MathUtils.lerp(3.6, 6.0, p);
    } else {
      const p = (progress - 0.82) / 0.18;
      tx = xOffset;
      ty = THREE.MathUtils.lerp(3.0, 2.6, p);
      tz = THREE.MathUtils.lerp(6.0, 6.8, p);
    }

    // Subtle parallax (constrained, never fights scroll)
    tx += mouse.x * 0.35;
    ty += mouse.y * 0.25;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz, 0.08);

    camera.lookAt(xOffset * 0.8, 0, 0);
  });

  return (
    <>
      {/* Background Starfield / Silicon Dust (Sparse & Restrained) */}
      <Stars radius={45} depth={20} count={600} factor={2.5} saturation={0.3} fade speed={0.3} />

      {/* Tonal Studio Lighting (Warm White Key, Copper Bounce, Cool Fill) */}
      <ambientLight intensity={0.9} color="#d4d9e0" />
      <directionalLight position={[6, 8, 5]} intensity={2.2} color="#fbf5e6" />
      <directionalLight position={[-6, 3, -4]} intensity={1.2} color="#7ea3cc" />
      <pointLight position={[0, -3, 3]} intensity={1.4} color="#c87d46" />

      {/* Stage Nodes */}
      <StageSandAndIngot progress={progress} />
      <StageWaferAndDies progress={progress} />
      <StageTransistor progress={progress} />
      <StageChipArchitecture progress={progress} />
    </>
  );
}
