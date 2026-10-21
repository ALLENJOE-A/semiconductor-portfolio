import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DIE_GRID = 11;
const WAFER_RADIUS = 2.4;

export function SiliconWafer({ mouseX = 0, mouseY = 0 }: { mouseX?: number; mouseY?: number }) {
  const groupRef = useRef<THREE.Group>(null!);

  // High-fidelity procedural wafer texture:
  // - Iridescent silicon reflections with mirror-polished finish
  // - High-contrast die boundaries and inner circuit micro-features
  // - Concentric circular alignment rings and stepper marks
  // - Standard SEMI flat orientation notch
  const dieTexture = useMemo(() => {
    const size = 2048;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Mirror-grade dark silicon base with micro-radial gradient
    const grad = ctx.createRadialGradient(size / 2, size / 2, 20, size / 2, size / 2, size / 2);
    grad.addColorStop(0, '#222938');
    grad.addColorStop(0.5, '#151b24');
    grad.addColorStop(0.85, '#0e131a');
    grad.addColorStop(1, '#080c12');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
    ctx.fill();

    // Concentric zone markers (stepper exposure test zones)
    const zones = [0.22, 0.40, 0.58, 0.74, 0.88, 0.96];
    zones.forEach((z) => {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, (size / 2 - 8) * z, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(92, 225, 230, 0.16)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Die grid calculation
    const usableSize = size - 80;
    const dieSize = usableSize / DIE_GRID;
    const startOffset = 40;
    const cx = size / 2;
    const cy = size / 2;
    const maxRadius = size / 2 - 24;

    for (let row = 0; row < DIE_GRID; row++) {
      for (let col = 0; col < DIE_GRID; col++) {
        const x = startOffset + col * dieSize;
        const y = startOffset + row * dieSize;

        // Check if all 4 corners of die fall within the wafer circle
        const corners = [
          [x, y],
          [x + dieSize, y],
          [x, y + dieSize],
          [x + dieSize, y + dieSize],
        ];
        const inside = corners.every(([px, py]) => Math.hypot(px - cx, py - cy) < maxRadius);

        if (!inside) continue;

        // Outer die street (scribe line)
        ctx.strokeStyle = 'rgba(92, 225, 230, 0.42)';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(x + 2, y + 2, dieSize - 4, dieSize - 4);

        // Die active silicon fill with subtle circuit hue
        const isHighlight = (row === 5 && col === 5) || (row === 4 && col === 6);
        ctx.fillStyle = isHighlight ? 'rgba(92, 225, 230, 0.22)' : 'rgba(46, 123, 255, 0.05)';
        ctx.fillRect(x + 4, y + 4, dieSize - 8, dieSize - 8);

        // Sub-die architectural blocks (simulated memory bank & core logic partition)
        ctx.strokeStyle = isHighlight ? 'rgba(92, 225, 230, 0.7)' : 'rgba(191, 200, 208, 0.22)';
        ctx.lineWidth = 1.0;
        const half = (dieSize - 8) / 2;
        ctx.strokeRect(x + 5, y + 5, half - 1, half - 1);
        ctx.strokeRect(x + 5 + half, y + 5, half - 1, half - 1);
        ctx.strokeRect(x + 5, y + 5 + half, dieSize - 10, half - 1);

        // Inner test bond pads
        ctx.fillStyle = isHighlight ? '#5CE1E6' : 'rgba(200, 135, 82, 0.6)';
        ctx.fillRect(x + 7, y + 7, 6, 6);
        ctx.fillRect(x + dieSize - 13, y + 7, 6, 6);
      }
    }

    // SEMI standard orientation notch (alignment key at bottom-right)
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 8, 0.48 * Math.PI, 0.52 * Math.PI);
    ctx.lineTo(size / 2, size / 2 + 10);
    ctx.closePath();
    ctx.fillStyle = '#060a0f';
    ctx.fill();
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Frame animation: continuous slow precession + responsive pointer interaction
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle float on Y
    groupRef.current.position.y = 0.05 + Math.sin(t * 0.5) * 0.08;

    // Default angle: three-quarter isometric presentation
    // Tilt towards camera by ~52 degrees (0.9 rad) so face is clearly circular & detailed
    const targetRotX = 0.88 + mouseY * 0.24;
    // Yaw towards left so wafer faces viewer nicely + slow idle rotation
    const targetRotY = -0.35 + mouseX * 0.32 + Math.sin(t * 0.15) * 0.08;
    const targetRotZ = -0.15 + mouseX * 0.1;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.06);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Silicon disc body - cylinder with top facing positive Y */}
      <mesh>
        <cylinderGeometry args={[WAFER_RADIUS, WAFER_RADIUS, 0.06, 128, 1]} />
        {/* Multi-material: [side, top, bottom] */}
        <meshStandardMaterial attach="material-0" color="#424c5a" metalness={0.9} roughness={0.2} />
        <meshStandardMaterial
          attach="material-1"
          map={dieTexture}
          metalness={0.88}
          roughness={0.18}
          color="#d2dbe6"
        />
        <meshStandardMaterial attach="material-2" color="#181d26" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Outer chamfered edge / bevel rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[WAFER_RADIUS, 0.038, 24, 128]} />
        <meshStandardMaterial color="#6a7888" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Cyan edge-glow ring (optical boundary accent) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.032, 0]}>
        <ringGeometry args={[WAFER_RADIUS - 0.04, WAFER_RADIUS + 0.01, 128]} />
        <meshBasicMaterial color="#5CE1E6" transparent opacity={0.45} />
      </mesh>

      {/* Thin reflective sheen on top face */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.032, 0]}>
        <circleGeometry args={[WAFER_RADIUS - 0.02, 128]} />
        <meshStandardMaterial
          color="#9ec6f5"
          metalness={0.98}
          roughness={0.08}
          transparent
          opacity={0.14}
        />
      </mesh>
    </group>
  );
}
