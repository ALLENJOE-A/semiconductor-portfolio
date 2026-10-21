import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { PROJECTS, PROFILE } from '../../data/projects';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './SemiconductorJourney.module.css';

// Simple deterministic pseudo-random generator for particle coordinates
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
const STAGES = [
  {
    id: 'sand',
    title: 'Stage A — Silica Sand to Ingot',
    desc: 'Reduction of high-purity quartz (SiO₂) into Electronic-Grade Silicon (EGS, 9N purity). Monocrystalline ingot pulled via Czochralski crystal growth at 1,420°C.',
    telemetry: [
      { label: 'Feedstock', value: 'High-Purity Quartz (SiO₂)' },
      { label: 'Crystal Purity', value: '99.9999999% (9N EGS)' },
      { label: 'Lattice Constant', value: '5.431 Å (Diamond Cubic)' },
      { label: 'Growth Process', value: 'Czochralski (CZ) Boule' },
    ],
    range: [0.00, 0.22],
  },
  {
    id: 'wafer',
    title: 'Stage B — Ingot Slicing & 300mm Wafer',
    desc: 'Diamond-wire slicing into 775µm substrates, chemical-mechanical planarization (CMP) to atomic flatness, and photolithographic exposure of 11×11 die array.',
    telemetry: [
      { label: 'Diameter', value: '300 mm (SEMI M1.15)' },
      { label: 'Wafer Thickness', value: '775 ± 20 µm' },
      { label: 'Orientation', value: '<100> Miller Indices' },
      { label: 'Patterning', value: '193nm Immersion / EUV' },
    ],
    range: [0.20, 0.42],
  },
  {
    id: 'transistor',
    title: 'Stage C — FinFET Nanometer Transistor',
    desc: 'Nanoscale device cross-section: 3D fin channel, High-κ Hafnium Oxide (HfO₂) dielectric (~1.2nm), Work-Function Metal Gate (HKMG), and raised Source/Drain epitaxy.',
    telemetry: [
      { label: 'Gate Length (Lg)', value: '7 nm Effective' },
      { label: 'Dielectric', value: 'HfO₂ (κ ≈ 22, EOT = 0.8nm)' },
      { label: 'Channel', value: 'Quantum Confinement Fin' },
      { label: 'Doping', value: 'In-situ B/P Doped SiGe' },
    ],
    range: [0.40, 0.62],
  },
  {
    id: 'chip',
    title: 'Stage D — VLSI Architecture & Packaging',
    desc: 'Transistor arrays synthesized into multi-tier copper interconnects (M1-M4), functional execution blocks (DMA, ADPLL, Cache), and flip-chip BGA assembly.',
    telemetry: [
      { label: 'Interconnects', value: 'Cu Dual-Damascene (M1-M4)' },
      { label: 'Clocking', value: 'Balanced H-Tree & ADPLL' },
      { label: 'Functional Cores', value: 'DMA, ALU, Cache, Arbiter' },
      { label: 'Package Type', value: 'Flip-Chip BGA (FCBGA)' },
    ],
    range: [0.60, 0.82],
  },
  {
    id: 'projects',
    title: 'Stage E — Hardware Systems & Projects',
    desc: 'Connecting fabricated VLSI architectures to verified engineering work: GS-ADPLL, Adaptive Burst DMA, Sentaurus TCAD physics, and GNN Lithography & Hotspot EDA.',
    telemetry: [
      { label: 'Featured Work', value: '5 Verified Implementations' },
      { label: 'Evidence Level', value: 'Cat A (Repo) & Cat B (Test)' },
      { label: 'HDL & EDA', value: 'Verilog, UVM, Sentaurus' },
      { label: 'Research Focus', value: 'VLSI, Physics, ML-for-EDA' },
    ],
    range: [0.80, 1.00],
  },
];

// ──────────────────────────────────────────────────────────────────
// 3D COMPONENT: STAGE A — Sand Particles & Silicon Ingot
// ──────────────────────────────────────────────────────────────────
function StageSandAndIngot({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const ingotGroupRef = useRef<THREE.Group>(null!);

  const PARTICLE_COUNT = 3200;

  // Generate initial dispersed sand particles and target ingot cylinder points
  const [positions, targets, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const tar = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const sandColors = [
      new THREE.Color('#e0b978'), // warm quartz sand
      new THREE.Color('#d4a359'), // golden silica
      new THREE.Color('#94a8be'), // silicon silver
      new THREE.Color('#5CE1E6'), // subtle cyan excitation
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Dispersed origin in a wide cosmic field
      const radiusDist = 5 + seededRandom(i * 11 + 1) * 12;
      const theta = seededRandom(i * 13 + 2) * Math.PI * 2;
      const phi = (seededRandom(i * 17 + 3) - 0.5) * Math.PI;

      pos[i3] = radiusDist * Math.cos(theta) * Math.cos(phi);
      pos[i3 + 1] = radiusDist * Math.sin(phi) + (seededRandom(i * 19 + 4) - 0.5) * 4;
      pos[i3 + 2] = radiusDist * Math.sin(theta) * Math.cos(phi);

      // Target ingot coordinates (Czochralski boule: cylinder with tapered ends)
      const u = seededRandom(i * 23 + 5);
      const targetY = (u - 0.5) * 3.2; // -1.6 to +1.6

      // Radius tapers at top and bottom of boule
      let localRadius = 1.05;
      if (targetY > 1.0) {
        localRadius *= Math.max(0.1, 1 - (targetY - 1.0) / 0.6);
      } else if (targetY < -1.0) {
        localRadius *= Math.max(0.1, 1 - (-1.0 - targetY) / 0.6);
      }
      localRadius *= 0.8 + seededRandom(i * 29 + 6) * 0.2;

      const targetAngle = seededRandom(i * 31 + 7) * Math.PI * 2;
      tar[i3] = localRadius * Math.cos(targetAngle);
      tar[i3 + 1] = targetY;
      tar[i3 + 2] = localRadius * Math.sin(targetAngle);

      // Assign color
      const c = sandColors[Math.floor(seededRandom(i * 37 + 8) * sandColors.length)];
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
    const posArr = posAttr.array as Float32Array;

    // Normalised stage progress: 0.0 to 0.22
    const p = Math.min(Math.max((progress - 0.0) / 0.22, 0), 1);
    const easeP = p * p * (3 - 2 * p); // smoothstep
    const time = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const ox = positions[i3];
      const oy = positions[i3 + 1];
      const oz = positions[i3 + 2];

      const tx = targets[i3];
      const ty = targets[i3 + 1];
      const tz = targets[i3 + 2];

      // Swirl vortex motion during convergence
      const swirlAngle = (1 - easeP) * 3.5 + time * 0.2;
      const cosS = Math.cos(swirlAngle);
      const sinS = Math.sin(swirlAngle);

      const curX = THREE.MathUtils.lerp(ox, tx, easeP);
      const curY = THREE.MathUtils.lerp(oy, ty, easeP);
      const curZ = THREE.MathUtils.lerp(oz, tz, easeP);

      // Apply vortex swirl around Y axis
      posArr[i3] = curX * cosS - curZ * sinS;
      posArr[i3 + 1] = curY + Math.sin(time + curX) * 0.05 * (1 - easeP);
      posArr[i3 + 2] = curX * sinS + curZ * cosS;
    }

    posAttr.needsUpdate = true;

    // Ingot boule mesh emerges as particles converge
    if (ingotGroupRef.current) {
      const ingotScale = Math.min(Math.max((progress - 0.08) / 0.12, 0), 1);
      ingotGroupRef.current.scale.setScalar(ingotScale);

      // At stage boundary (0.18-0.24), ingot tilts horizontally towards slicing
      const tiltP = Math.min(Math.max((progress - 0.16) / 0.08, 0), 1);
      ingotGroupRef.current.rotation.z = tiltP * (Math.PI / 2);
      ingotGroupRef.current.rotation.y = time * 0.2 + progress * 2.0;

      // Ingot fades out as wafer takes over
      const fadeOut = progress > 0.26 ? Math.max(0, 1 - (progress - 0.26) / 0.06) : 1;
      ingotGroupRef.current.visible = fadeOut > 0.01;
      if (ingotGroupRef.current.visible) {
        ingotGroupRef.current.scale.multiplyScalar(fadeOut);
      }
    }

    // Particle field fades out as wafer slicing completes
    const particlesVisible = progress < 0.28;
    pointsRef.current.visible = particlesVisible;
  });

  return (
    <group>
      {/* Dynamic Sand Particles System */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(positions), 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Monocrystalline Silicon Ingot Boule */}
      <group ref={ingotGroupRef} scale={[0.001, 0.001, 0.001]}>
        {/* Main Boule Cylinder */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 2.2, 48]} />
          <meshStandardMaterial
            color="#273240"
            metalness={0.92}
            roughness={0.16}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Top Seed Crown Cone */}
        <mesh position={[0, 1.45, 0]}>
          <coneGeometry args={[1.05, 0.7, 48]} />
          <meshStandardMaterial
            color="#273240"
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>

        {/* Bottom Tapered Tail Cone */}
        <mesh position={[0, -1.45, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[1.05, 0.7, 48]} />
          <meshStandardMaterial
            color="#273240"
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>

        {/* Crystal Growth Facet Rings */}
        {[-0.8, -0.4, 0.0, 0.4, 0.8].map((yVal, idx) => (
          <mesh key={idx} position={[0, yVal, 0]}>
            <torusGeometry args={[1.052, 0.012, 16, 48]} />
            <meshBasicMaterial color="#5CE1E6" transparent opacity={0.35} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// 3D COMPONENT: STAGE B — Ingot Slicing & 300mm Silicon Wafer
// ──────────────────────────────────────────────────────────────────
function StageWaferAndDies({ progress }: { progress: number }) {
  const waferGroupRef = useRef<THREE.Group>(null!);
  const extractedDieRef = useRef<THREE.Group>(null!);
  const slicingGroupRef = useRef<THREE.Group>(null!);

  // High-resolution procedural wafer canvas texture with die grid & stepper rings
  const waferTexture = useMemo(() => {
    const size = 1536;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Polished dark silicon radial mirror base
    const grad = ctx.createRadialGradient(size / 2, size / 2, 40, size / 2, size / 2, size / 2);
    grad.addColorStop(0, '#2b3647');
    grad.addColorStop(0.5, '#18212e');
    grad.addColorStop(0.85, '#0f1620');
    grad.addColorStop(1, '#080c12');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
    ctx.fill();

    // Concentric test exposure zone rings
    [0.25, 0.45, 0.65, 0.82, 0.94].forEach((z) => {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, (size / 2 - 8) * z, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(92, 225, 230, 0.18)';
      ctx.lineWidth = 1.8;
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

        // Ensure corners fall within wafer circle
        const corners = [
          [x, y],
          [x + dieDim, y],
          [x, y + dieDim],
          [x + dieDim, y + dieDim],
        ];
        if (!corners.every(([px, py]) => Math.hypot(px - cx, py - cy) < maxR)) continue;

        const isCenter = r === 5 && c === 5;

        // Scribe line streets
        ctx.strokeStyle = isCenter ? '#5CE1E6' : 'rgba(92, 225, 230, 0.4)';
        ctx.lineWidth = isCenter ? 3.0 : 1.2;
        ctx.strokeRect(x + 2, y + 2, dieDim - 4, dieDim - 4);

        // Die active silicon fill
        ctx.fillStyle = isCenter ? 'rgba(92, 225, 230, 0.35)' : 'rgba(46, 123, 255, 0.08)';
        ctx.fillRect(x + 3, y + 3, dieDim - 6, dieDim - 6);

        // Sub-die circuit macro layout
        ctx.strokeStyle = isCenter ? 'rgba(92, 225, 230, 0.8)' : 'rgba(191, 200, 208, 0.2)';
        ctx.lineWidth = 1;
        const h = (dieDim - 8) / 2;
        ctx.strokeRect(x + 4, y + 4, h, h);
        ctx.strokeRect(x + 4 + h, y + 4, h, h);
        ctx.strokeRect(x + 4, y + 4 + h, dieDim - 8, h);
      }
    }

    // SEMI standard orientation notch
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 8, 0.485 * Math.PI, 0.515 * Math.PI);
    ctx.lineTo(size / 2, size / 2 + 12);
    ctx.closePath();
    ctx.fillStyle = '#050811';
    ctx.fill();
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state) => {
    // Stage B visibility range: 0.18 to 0.46
    const isVisible = progress >= 0.18 && progress <= 0.46;
    if (waferGroupRef.current) waferGroupRef.current.visible = isVisible;
    if (extractedDieRef.current) extractedDieRef.current.visible = isVisible;
    if (slicingGroupRef.current) slicingGroupRef.current.visible = progress >= 0.18 && progress <= 0.28;
    if (!isVisible) return;

    const time = state.clock.elapsedTime;

    // Slicing animation (0.18 - 0.26)
    if (slicingGroupRef.current && progress <= 0.28) {
      const sliceP = Math.min(Math.max((progress - 0.18) / 0.08, 0), 1);
      slicingGroupRef.current.position.x = -sliceP * 1.5;
    }

    // Wafer scale and orientation
    if (waferGroupRef.current) {
      const waferEnter = Math.min(Math.max((progress - 0.22) / 0.08, 0), 1);
      const waferExit = progress > 0.38 ? Math.max(0, 1 - (progress - 0.38) / 0.06) : 1;
      const curScale = waferEnter * waferExit;
      waferGroupRef.current.scale.setScalar(curScale);

      // Subtle dynamic rotation
      waferGroupRef.current.rotation.x = 0.85 + Math.sin(time * 0.4) * 0.04;
      waferGroupRef.current.rotation.y = -0.2 + (progress - 0.25) * 1.5;
    }

    // Extracted Die (0.32 to 0.44)
    if (extractedDieRef.current) {
      if (progress < 0.32) {
        extractedDieRef.current.visible = false;
      } else {
        extractedDieRef.current.visible = true;
        const dieLiftP = Math.min(Math.max((progress - 0.32) / 0.08, 0), 1);

        // Die lifts out from wafer center and moves towards camera
        extractedDieRef.current.position.z = dieLiftP * 2.8;
        extractedDieRef.current.position.y = dieLiftP * 0.4;
        extractedDieRef.current.scale.setScalar(1 + dieLiftP * 1.8);
        extractedDieRef.current.rotation.x = (1 - dieLiftP) * 0.85 + dieLiftP * 0.3;
        extractedDieRef.current.rotation.y = (progress - 0.32) * 2.0;

        // Die fades out at transition to transistor (0.42 to 0.46)
        if (progress > 0.42) {
          const fadeToTransistor = Math.max(0, 1 - (progress - 0.42) / 0.04);
          extractedDieRef.current.scale.multiplyScalar(fadeToTransistor);
        }
      }
    }
  });

  return (
    <group>
      {/* Slicing Wire Blades (Glowing Diamond Slicing Planes) */}
      <group ref={slicingGroupRef}>
        {[-0.8, -0.4, 0.0, 0.4, 0.8].map((xOffset, idx) => (
          <mesh key={idx} position={[xOffset, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[1.06, 1.25, 48]} />
            <meshBasicMaterial color="#5CE1E6" side={THREE.DoubleSide} transparent opacity={0.65} />
          </mesh>
        ))}
      </group>

      {/* 300mm Silicon Wafer Disc */}
      <group ref={waferGroupRef}>
        <mesh>
          <cylinderGeometry args={[2.3, 2.3, 0.06, 64]} />
          <meshStandardMaterial attach="material-0" color="#18212e" metalness={0.92} roughness={0.2} />
          <meshStandardMaterial attach="material-1" map={waferTexture} metalness={0.95} roughness={0.14} />
          <meshStandardMaterial attach="material-2" color="#0a0f16" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* Extracted Singulated Die with Bond Pads */}
      <group ref={extractedDieRef}>
        {/* Die Base Substrate */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.5]} />
          <meshStandardMaterial color="#1a2533" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Active Circuit Layer */}
        <mesh position={[0, 0.025, 0]}>
          <boxGeometry args={[0.46, 0.015, 0.46]} />
          <meshStandardMaterial color="#2E7BFF" emissive="#2E7BFF" emissiveIntensity={0.3} metalness={0.8} />
        </mesh>
        {/* Glowing Selection Perimeter */}
        <lineSegments position={[0, 0.035, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.51, 0.02, 0.51)]} />
          <lineBasicMaterial color="#5CE1E6" linewidth={2} />
        </lineSegments>
      </group>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// 3D COMPONENT: STAGE C — Detailed Nanometer Transistor Cross-Section
// ──────────────────────────────────────────────────────────────────
function StageTransistor({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const carriersRef = useRef<THREE.Points>(null!);

  const CARRIER_COUNT = 180;

  // Electron carrier stream through inversion channel
  const [carrierPos] = useMemo(() => {
    const pos = new Float32Array(CARRIER_COUNT * 3);
    for (let i = 0; i < CARRIER_COUNT; i++) {
      pos[i * 3] = (seededRandom(i * 13 + 1) - 0.5) * 2.0; // from Source (-1.0) to Drain (+1.0)
      pos[i * 3 + 1] = -0.05 + (seededRandom(i * 17 + 2) - 0.5) * 0.12;
      pos[i * 3 + 2] = (seededRandom(i * 19 + 3) - 0.5) * 1.2;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    const isVisible = progress >= 0.38 && progress <= 0.66;
    if (groupRef.current) groupRef.current.visible = isVisible;
    if (!isVisible) return;

    const time = state.clock.elapsedTime;

    // Smooth entry and exit scaling
    const enterP = Math.min(Math.max((progress - 0.38) / 0.08, 0), 1);
    const exitP = progress > 0.58 ? Math.max(0, 1 - (progress - 0.58) / 0.06) : 1;
    const curScale = enterP * exitP;
    groupRef.current.scale.setScalar(curScale * 1.35);

    // Controlled 3D isometric presentation
    groupRef.current.rotation.y = 0.55 + Math.sin(time * 0.3) * 0.12;
    groupRef.current.rotation.x = 0.35 + Math.cos(time * 0.25) * 0.05;

    // Animate electron carriers moving from Source to Drain
    if (carriersRef.current) {
      const geo = carriersRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < CARRIER_COUNT; i++) {
        const i3 = i * 3;
        arr[i3] += 0.035; // speed of conduction
        if (arr[i3] > 1.2) {
          arr[i3] = -1.2; // reset to source
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Bulk P-Type Silicon Substrate Base */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[3.6, 0.7, 2.2]} />
        <meshStandardMaterial color="#141d28" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* 2. Source (n+ SiGe Epitaxy) */}
      <mesh position={[-1.15, -0.05, 0]}>
        <boxGeometry args={[0.9, 0.45, 1.8]} />
        <meshStandardMaterial color="#C88752" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* 3. Drain (n+ SiGe Epitaxy) */}
      <mesh position={[1.15, -0.05, 0]}>
        <boxGeometry args={[0.9, 0.45, 1.8]} />
        <meshStandardMaterial color="#C88752" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* 4. Active Inversion Fin Channel */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.4, 0.28, 1.6]} />
        <meshStandardMaterial
          color="#2E7BFF"
          emissive="#2E7BFF"
          emissiveIntensity={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 5. High-κ Gate Dielectric (HfO₂ ~1.2nm conformal barrier) */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.36, 0.1, 1.66]} />
        <meshStandardMaterial
          color="#5CE1E6"
          emissive="#5CE1E6"
          emissiveIntensity={0.65}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* 6. Work-Function Metal Gate Electrode (HKMG) */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.15, 0.72, 1.6]} />
        <meshStandardMaterial color="#d8e3f0" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 7. Dielectric Sidewall Spacers (Si₃N₄) */}
      <mesh position={[-0.64, 0.4, 0]}>
        <boxGeometry args={[0.16, 0.55, 1.65]} />
        <meshStandardMaterial color="#324254" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.64, 0.4, 0]}>
        <boxGeometry args={[0.16, 0.55, 1.65]} />
        <meshStandardMaterial color="#324254" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 8. Tungsten Contact Plugs onto S/D */}
      <mesh position={[-1.15, 0.4, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.6, 24]} />
        <meshStandardMaterial color="#e0e6ed" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.15, 0.4, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.6, 24]} />
        <meshStandardMaterial color="#e0e6ed" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 9. Dynamic Electron Carrier Transport Wave-Packets */}
      <points ref={carriersRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(carrierPos), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#5CE1E6"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// 3D COMPONENT: STAGE D & E — Transistor Array, VLSI Chip & Package
// ──────────────────────────────────────────────────────────────────
function StageChipArchitecture({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const isVisible = progress >= 0.58;
    if (groupRef.current) groupRef.current.visible = isVisible;
    if (!isVisible) return;

    const time = state.clock.elapsedTime;

    // Transition scaling from transistor into full chip
    const enterP = Math.min(Math.max((progress - 0.58) / 0.08, 0), 1);
    groupRef.current.scale.setScalar(enterP * 1.05);

    // Continuous dynamic rotation
    groupRef.current.rotation.x = 0.6 + Math.sin(time * 0.3) * 0.05;
    groupRef.current.rotation.y = time * 0.15 + (progress - 0.6) * 1.0;
  });

  return (
    <group ref={groupRef}>
      {/* 1. Organic BGA Package Substrate Base */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[4.4, 0.15, 4.4]} />
        <meshStandardMaterial color="#08101a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 2. Silicon Active Interposer Die */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[3.8, 0.12, 3.8]} />
        <meshStandardMaterial color="#152130" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 3. Multi-Tier Metallization (M1-M4) Grid Network */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial color="#5CE1E6" wireframe transparent opacity={0.4} />
      </mesh>

      {/* ── 4. Core Functional Architectural Execution Blocks ── */}

      {/* Core A (Top-Left): 4-Channel Adaptive Burst DMA */}
      <group position={[-0.95, 0.12, -0.95]}>
        <mesh>
          <boxGeometry args={[1.4, 0.28, 1.4]} />
          <meshStandardMaterial color="#2E7BFF" metalness={0.85} roughness={0.2} />
        </mesh>
        <lineSegments position={[0, 0.15, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.4, 0.01, 1.4)]} />
          <lineBasicMaterial color="#5CE1E6" />
        </lineSegments>
      </group>

      {/* Core B (Top-Right): GS-ADPLL & Clock Network */}
      <group position={[0.95, 0.12, -0.95]}>
        <mesh>
          <boxGeometry args={[1.4, 0.32, 1.4]} />
          <meshStandardMaterial color="#5CE1E6" metalness={0.9} roughness={0.15} />
        </mesh>
        <lineSegments position={[0, 0.17, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.4, 0.01, 1.4)]} />
          <lineBasicMaterial color="#ffffff" />
        </lineSegments>
      </group>

      {/* Core C (Bottom-Left): TCAD Physics & PE Compute Engine */}
      <group position={[-0.95, 0.12, 0.95]}>
        <mesh>
          <boxGeometry args={[1.4, 0.28, 1.4]} />
          <meshStandardMaterial color="#C88752" metalness={0.85} roughness={0.25} />
        </mesh>
        <lineSegments position={[0, 0.15, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.4, 0.01, 1.4)]} />
          <lineBasicMaterial color="#C88752" />
        </lineSegments>
      </group>

      {/* Core D (Bottom-Right): GNN Lithography & Hotspot Engine */}
      <group position={[0.95, 0.12, 0.95]}>
        <mesh>
          <boxGeometry args={[1.4, 0.28, 1.4]} />
          <meshStandardMaterial color="#324965" metalness={0.8} roughness={0.3} />
        </mesh>
        <lineSegments position={[0, 0.15, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.4, 0.01, 1.4)]} />
          <lineBasicMaterial color="#5CE1E6" />
        </lineSegments>
      </group>

      {/* 5. Central AXI Interconnect Crossbar Bus */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.42, 0.26, 0.42]} />
        <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} emissive="#5CE1E6" emissiveIntensity={0.6} />
      </mesh>

      {/* 6. Peripheral Wirebond / Flip-Chip BGA Micro-Pads */}
      {[-1.85, -1.2, -0.6, 0, 0.6, 1.2, 1.85].map((pos, idx) => (
        <group key={idx}>
          <mesh position={[pos, -0.08, 1.95]}>
            <boxGeometry args={[0.2, 0.08, 0.15]} />
            <meshStandardMaterial color="#C88752" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[pos, -0.08, -1.95]}>
            <boxGeometry args={[0.2, 0.08, 0.15]} />
            <meshStandardMaterial color="#C88752" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[1.95, -0.08, pos]}>
            <boxGeometry args={[0.15, 0.08, 0.2]} />
            <meshStandardMaterial color="#C88752" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[-1.95, -0.08, pos]}>
            <boxGeometry args={[0.15, 0.08, 0.2]} />
            <meshStandardMaterial color="#C88752" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// MASTER 3D SCENE RIG (Camera Choreography & Lighting Controller)
// ──────────────────────────────────────────────────────────────────
function SceneRig({ progress, mouse }: { progress: number; mouse: { x: number; y: number } }) {
  useFrame((state) => {
    const { camera } = state;

    // Continuous camera choreography across all 5 stages:
    // Stage A (0.00-0.20): [0, 1.0, 10.5] (wide viewing field for swirling particles)
    // Stage B (0.20-0.40): [0, 2.8, 6.2]  (angled down onto the wafer & slicing)
    // Stage C (0.40-0.60): [0, 0.9, 3.8]  (macro zoom into nanoscale transistor)
    // Stage D (0.60-0.80): [0, 3.2, 5.8]  (pulling back to reveal multi-core chip)
    // Stage E (0.80-1.00): [0, 2.9, 6.8]  (steady isometric frame with project buses)

    let targetCamX = 0;
    let targetCamY = 1.0;
    let targetCamZ = 10.5;

    if (progress < 0.22) {
      const p = progress / 0.22;
      targetCamX = THREE.MathUtils.lerp(0, 0, p);
      targetCamY = THREE.MathUtils.lerp(1.0, 2.4, p);
      targetCamZ = THREE.MathUtils.lerp(10.5, 7.0, p);
    } else if (progress < 0.42) {
      const p = (progress - 0.22) / 0.20;
      targetCamX = THREE.MathUtils.lerp(0, 0, p);
      targetCamY = THREE.MathUtils.lerp(2.4, 1.1, p);
      targetCamZ = THREE.MathUtils.lerp(7.0, 4.2, p);
    } else if (progress < 0.62) {
      const p = (progress - 0.42) / 0.20;
      targetCamX = THREE.MathUtils.lerp(0, 0, p);
      targetCamY = THREE.MathUtils.lerp(1.1, 0.85, p);
      targetCamZ = THREE.MathUtils.lerp(4.2, 3.6, p);
    } else if (progress < 0.82) {
      const p = (progress - 0.62) / 0.20;
      targetCamX = THREE.MathUtils.lerp(0, 0, p);
      targetCamY = THREE.MathUtils.lerp(0.85, 3.2, p);
      targetCamZ = THREE.MathUtils.lerp(3.6, 6.2, p);
    } else {
      const p = (progress - 0.82) / 0.18;
      targetCamX = THREE.MathUtils.lerp(0, 0, p);
      targetCamY = THREE.MathUtils.lerp(3.2, 2.8, p);
      targetCamZ = THREE.MathUtils.lerp(6.2, 6.8, p);
    }

    // Subtle pointer parallax (constrained, never fights scroll)
    targetCamX += mouse.x * 0.4;
    targetCamY += mouse.y * 0.3;

    // Smooth camera lerp
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08);

    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Background Starfield / Silicon Dust Atmosphere */}
      <Stars radius={40} depth={20} count={900} factor={3} saturation={0.5} fade speed={0.4} />

      {/* Controlled Technical Studio Lighting */}
      <ambientLight intensity={0.65} color="#0c1828" />
      <directionalLight position={[6, 9, 5]} intensity={2.6} color="#dbe6f6" />
      <directionalLight position={[-6, 3, -4]} intensity={2.0} color="#5CE1E6" />
      <pointLight position={[0, -3, 3]} intensity={1.2} color="#C88752" />

      {/* 5-Stage Continuous Experience Nodes */}
      <StageSandAndIngot progress={progress} />
      <StageWaferAndDies progress={progress} />
      <StageTransistor progress={progress} />
      <StageChipArchitecture progress={progress} />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// REDUCED-MOTION & NON-WEBGL ACCESSIBLE FALLBACK
// ──────────────────────────────────────────────────────────────────
function AccessibleFallback() {
  return (
    <section className={styles.fallbackWrapper} aria-label="Semiconductor Engineering Sequence">
      <div className={styles.fallbackHeader}>
        <p className="text-mono" style={{ color: 'var(--color-electric-cyan)', fontSize: '0.8rem' }}>
          Origin Story &amp; Nanoscale Architecture
        </p>
        <h1 style={{ fontSize: '2.4rem', color: '#fff', margin: '0.5rem 0 1rem' }}>
          Physical Synthesis: Silica to Complete Chip
        </h1>
        <p style={{ color: 'var(--color-silicon-silver)', lineHeight: 1.6 }}>
          A technically grounded progression illustrating how quartz sand is reduced to electronic-grade silicon, sliced into 300mm wafers, patterned into FinFET nanostructures, and synthesized into multi-channel VLSI hardware systems.
        </p>
      </div>

      <div className={styles.fallbackGrid}>
        {STAGES.map((s, idx) => (
          <article key={s.id} className={styles.fallbackStageCard}>
            <span className="text-mono" style={{ color: 'var(--color-electric-cyan)', fontSize: '0.75rem' }}>
              0{idx + 1} // {s.id.toUpperCase()}
            </span>
            <h2 style={{ fontSize: '1.25rem', color: '#fff', margin: '0.4rem 0 0.8rem' }}>
              {s.title}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, marginBottom: '1rem' }}>
              {s.desc}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
              {s.telemetry.map((t, tidx) => (
                <div key={tidx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{t.label}</span>
                  <span style={{ color: 'var(--color-technical-white)' }}>{t.value}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────
// PRIMARY EXPORT: SEMICONDUCTOR JOURNEY CONTROLLER
// ──────────────────────────────────────────────────────────────────
export function SemiconductorJourney() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [webglSupported] = useState(() => checkWebGLSupport());
  const reducedMotion = useReducedMotion();

  // Native scroll tracking with requestAnimationFrame lerping
  useEffect(() => {
    let animId: number;
    let targetP = 0;
    let currentP = 0;

    const handleScroll = () => {
      if (!runwayRef.current) return;
      const rect = runwayRef.current.getBoundingClientRect();
      const totalDist = rect.height - window.innerHeight;
      if (totalDist <= 0) return;

      const scrolledDist = -rect.top;
      targetP = Math.min(Math.max(scrolledDist / totalDist, 0), 1);
    };

    const updateLoop = () => {
      // Lerp smooth scroll interpolation
      currentP += (targetP - currentP) * 0.12;
      setScrollProgress(currentP);
      animId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Subtle pointer movement for camera parallax
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * -2,
    });
  }, []);

  // Stage scrubber jump click handler
  const jumpToStage = (stageIdx: number) => {
    if (!runwayRef.current) return;
    const stage = STAGES[stageIdx];
    const targetRatio = stage.range[0];
    const runwayTop = window.scrollY + runwayRef.current.getBoundingClientRect().top;
    const totalDist = runwayRef.current.getBoundingClientRect().height - window.innerHeight;
    window.scrollTo({
      top: runwayTop + targetRatio * totalDist + 20,
      behavior: 'smooth',
    });
  };

  // Determine current active stage index
  const activeStageIndex = useMemo(() => {
    const idx = STAGES.findIndex((s) => scrollProgress >= s.range[0] && scrollProgress <= s.range[1]);
    return idx === -1 ? (scrollProgress > 0.8 ? 4 : 0) : idx;
  }, [scrollProgress]);

  const activeStage = STAGES[activeStageIndex];

  // Featured Engineering Projects to showcase in Stage E
  const featuredProjects = useMemo(() => {
    return PROJECTS.filter((p) => p.featured).slice(0, 5);
  }, []);

  if (reducedMotion || !webglSupported) {
    return <AccessibleFallback />;
  }

  return (
    <div
      ref={runwayRef}
      className={styles.runway}
      onMouseMove={handleMouseMove}
      aria-label="Interactive 3D Semiconductor Origin Story"
    >
      <div className={styles.stickyViewport}>
        {/* Full-Viewport 3D Canvas */}
        <div className={styles.canvasContainer}>
          <Canvas
            camera={{ position: [0, 1.0, 10.5], fov: 42 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
          >
            <SceneRig progress={scrollProgress} mouse={mouse} />
          </Canvas>
        </div>

        {/* Minimal Unobtrusive Personal Identity Header */}
        <div className={styles.hudHeader}>
          <div className={styles.hudBrand}>
            <span className={styles.hudName}>{PROFILE.name}</span>
            <span className={styles.hudRole}>VLSI &amp; Semiconductor Engineering</span>
          </div>
          <div className={styles.hudStageBadge}>
            <span className={styles.hudPulse} aria-hidden="true" />
            <span>0{activeStageIndex + 1} // {activeStage.id.toUpperCase()}</span>
          </div>
        </div>

        {/* Vertical Stage Scrubber Rail (Left Margin) */}
        <nav className={styles.scrubberRail} aria-label="Sequence stage navigation">
          {STAGES.map((s, idx) => (
            <button
              key={s.id}
              className={`${styles.scrubberItem} ${activeStageIndex === idx ? styles.active : ''}`}
              onClick={() => jumpToStage(idx)}
              aria-label={`Jump to Stage 0${idx + 1}: ${s.id}`}
            >
              <div className={styles.scrubberIndicator} />
              <span className={styles.scrubberLabel}>0{idx + 1}. {s.id}</span>
            </button>
          ))}
        </nav>

        {/* Initial Scroll Prompt (Fades as soon as scrolling starts) */}
        <div
          className={styles.scrollPrompt}
          style={{ opacity: scrollProgress < 0.03 ? 1 : 0 }}
          aria-hidden={scrollProgress >= 0.03}
        >
          <div className={styles.scrollMouse}>
            <div className={styles.scrollWheel} />
          </div>
          <span>Scroll to Build Chip</span>
        </div>

        {/* Bottom Technical Telemetry Bar */}
        <footer className={styles.telemetryPanel} aria-live="polite">
          <div className={styles.telemetryLeft}>
            <div className={styles.stageTitle}>{activeStage.title}</div>
            <p className={styles.stageDesc}>{activeStage.desc}</p>
          </div>
          <div className={styles.telemetryReadout}>
            {activeStage.telemetry.map((t, idx) => (
              <div key={idx}>
                {t.label}: <span className={styles.telemetryVal}>{t.value}</span>
              </div>
            ))}
          </div>
        </footer>

        {/* Stage E: Direct Transition to Verified Engineering Projects */}
        <div
          className={styles.projectPortalsOverlay}
          style={{
            opacity: scrollProgress >= 0.82 ? Math.min((scrollProgress - 0.82) / 0.1, 1) : 0,
            pointerEvents: scrollProgress >= 0.84 ? 'auto' : 'none',
          }}
          aria-hidden={scrollProgress < 0.84}
        >
          <div className={styles.projectPortalsGrid}>
            {featuredProjects.map((proj) => (
              <Link
                key={proj.id}
                to={`/projects/${proj.id}`}
                className={styles.portalCard}
                style={{ '--card-accent': proj.accentColor } as React.CSSProperties}
              >
                <div className={styles.portalMeta}>
                  <span className={styles.portalCategory}>{proj.category[0]}</span>
                  <span className={styles.portalStatus}>{proj.status}</span>
                </div>
                <h3 className={styles.portalTitle}>{proj.shortTitle}</h3>
                <p className={styles.portalSummary}>{proj.summary}</p>
                <div className={styles.portalFoot}>
                  <span>Inspect Hardware Evidence</span>
                  <span className={styles.portalLinkIcon}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
