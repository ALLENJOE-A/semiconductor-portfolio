import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── 3D Stage 1: Wafer with highlighted extraction die ──────────
function Wafer3D() {
  const meshRef = useRef<THREE.Group>(null!);

  const dieTex = useMemo(() => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#161c26';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.fill();

    const dSize = (size - 60) / 9;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const x = 30 + c * dSize;
        const y = 30 + r * dSize;
        if (Math.hypot(x + dSize / 2 - size / 2, y + dSize / 2 - size / 2) > size / 2 - 20) continue;
        const isTarget = r === 4 && c === 4;
        ctx.strokeStyle = isTarget ? '#5CE1E6' : 'rgba(92, 225, 230, 0.28)';
        ctx.lineWidth = isTarget ? 3.0 : 1.0;
        ctx.strokeRect(x + 2, y + 2, dSize - 4, dSize - 4);
        if (isTarget) {
          ctx.fillStyle = 'rgba(92, 225, 230, 0.35)';
          ctx.fillRect(x + 2, y + 2, dSize - 4, dSize - 4);
        }
      }
    }
    const t = new THREE.CanvasTexture(canvas);
    t.needsUpdate = true;
    return t;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = 0.9 + Math.sin(t * 0.4) * 0.05;
    meshRef.current.rotation.y = -0.3 + t * 0.12;
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <cylinderGeometry args={[2.0, 2.0, 0.08, 64]} />
        <meshStandardMaterial attach="material-0" color="#353e4b" metalness={0.8} roughness={0.3} />
        <meshStandardMaterial attach="material-1" map={dieTex} metalness={0.85} roughness={0.2} color="#cdd7e4" />
        <meshStandardMaterial attach="material-2" color="#111620" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Target die extractor pulse */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.38, 0.02, 0.38]} />
        <meshStandardMaterial color="#5CE1E6" emissive="#5CE1E6" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

// ── 3D Stage 2: Extracted Isolated Die with Bond Pads & Layers ─
function Die3D() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.4;
    groupRef.current.rotation.x = 0.45 + Math.sin(t * 0.6) * 0.12;
  });

  return (
    <group ref={groupRef}>
      {/* Silicon Substrate Base */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[2.2, 0.12, 2.2]} />
        <meshStandardMaterial color="#1f2836" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Active Interconnect Stack Layer */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.8, 0.05, 1.8]} />
        <meshStandardMaterial color="#2E7BFF" metalness={0.7} roughness={0.3} transparent opacity={0.85} />
      </mesh>

      {/* Top Core Die Logic */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.5, 0.06, 1.5]} />
        <meshStandardMaterial color="#0c1724" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Peripheral Gold/Copper Wirebond Pads */}
      {[-0.95, -0.6, -0.2, 0.2, 0.6, 0.95].map((pos, idx) => (
        <group key={idx}>
          <mesh position={[pos, 0.02, 0.95]}>
            <boxGeometry args={[0.14, 0.05, 0.14]} />
            <meshStandardMaterial color="#C88752" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[pos, 0.02, -0.95]}>
            <boxGeometry args={[0.14, 0.05, 0.14]} />
            <meshStandardMaterial color="#C88752" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.95, 0.02, pos]}>
            <boxGeometry args={[0.14, 0.05, 0.14]} />
            <meshStandardMaterial color="#C88752" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.95, 0.02, pos]}>
            <boxGeometry args={[0.14, 0.05, 0.14]} />
            <meshStandardMaterial color="#C88752" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Circuit track lines on die surface */}
      <mesh position={[0, 0.115, 0]}>
        <planeGeometry args={[1.3, 1.3]} />
        <meshBasicMaterial color="#5CE1E6" wireframe transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// ── 3D Stage 3: Nanoscale Transistor (Gate, High-κ, S/D, Channel) ─
function Transistor3D() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = 0.6 + Math.sin(t * 0.3) * 0.25;
    groupRef.current.rotation.x = 0.3;
  });

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* Substrate: Silicon base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[3.2, 0.6, 2.0]} />
        <meshStandardMaterial color="#162232" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Source (n+/p+) region with copper contact */}
      <mesh position={[-1.0, 0.0, 0]}>
        <boxGeometry args={[0.8, 0.4, 1.8]} />
        <meshStandardMaterial color="#C88752" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Drain region with copper contact */}
      <mesh position={[1.0, 0.0, 0]}>
        <boxGeometry args={[0.8, 0.4, 1.8]} />
        <meshStandardMaterial color="#C88752" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Inversion Channel */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.2, 0.2, 1.6]} />
        <meshStandardMaterial color="#2E7BFF" emissive="#2E7BFF" emissiveIntensity={0.4} transparent opacity={0.9} />
      </mesh>

      {/* High-κ Dielectric Layer (e.g. HfO2) */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.2, 0.12, 1.6]} />
        <meshStandardMaterial color="#5CE1E6" emissive="#5CE1E6" emissiveIntensity={0.5} transparent opacity={0.85} />
      </mesh>

      {/* Metal Gate Electrode */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.0, 0.55, 1.6]} />
        <meshStandardMaterial color="#d4e0ee" metalness={0.95} roughness={0.15} />
      </mesh>
    </group>
  );
}

// ── 3D Stage 4: Digital Architecture & System Bus Routing ──────
function System3D() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.2;
    groupRef.current.rotation.x = 0.4 + Math.sin(t * 0.3) * 0.1;
  });

  return (
    <group ref={groupRef} scale={[0.9, 0.9, 0.9]}>
      {/* PCB / Silicon Interposer Substrate */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[3.8, 0.1, 3.2]} />
        <meshStandardMaterial color="#0c1824" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Core 1: 4-Channel DMA Controller */}
      <mesh position={[-1.1, 0.15, -0.7]}>
        <boxGeometry args={[1.1, 0.3, 1.0]} />
        <meshStandardMaterial color="#2E7BFF" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Core 2: PE Array / CNN Accelerator */}
      <mesh position={[1.1, 0.25, -0.7]}>
        <boxGeometry args={[1.1, 0.5, 1.0]} />
        <meshStandardMaterial color="#C88752" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Core 3: High-Speed SRAM Cache / Memory */}
      <mesh position={[-1.1, 0.15, 0.7]}>
        <boxGeometry args={[1.1, 0.25, 1.0]} />
        <meshStandardMaterial color="#354961" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Core 4: Central AXI/AHB Bus Arbiter */}
      <mesh position={[1.1, 0.15, 0.7]}>
        <boxGeometry args={[1.1, 0.25, 1.0]} />
        <meshStandardMaterial color="#1a2f47" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Connecting Bus Lines (Glowing Cyan Traces) */}
      <mesh position={[0, -0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 2.6]} />
        <meshBasicMaterial color="#5CE1E6" wireframe transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

export function Stage3DCanvas({ stage }: { stage: number }) {
  return (
    <Canvas
      camera={{ position: [0, 2.2, 4.4], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.7} color="#dce7f5" />
      <directionalLight position={[4, 6, 4]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[-4, 2, -2]} intensity={1.2} color="#5CE1E6" />
      <pointLight position={[0, -2, 2]} intensity={0.6} color="#C88752" />

      {stage === 0 && <Wafer3D />}
      {stage === 1 && <Die3D />}
      {stage === 2 && <Transistor3D />}
      {stage === 3 && <System3D />}
    </Canvas>
  );
}
