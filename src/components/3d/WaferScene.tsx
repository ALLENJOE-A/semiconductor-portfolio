import React, { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { SiliconWafer } from './SiliconWafer';

function WaferFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #0D2035 0%, #081521 100%)',
      }}
    >
      <svg viewBox="0 0 240 240" width="280" height="280" aria-label="Silicon wafer schematic illustration">
        <circle cx="120" cy="120" r="105" fill="#141c28" stroke="#5CE1E6" strokeWidth="2" />
        <circle cx="120" cy="120" r="102" fill="none" stroke="#2E7BFF" strokeWidth="0.8" />
        {[28, 52, 76, 96].map((r) => (
          <circle key={r} cx="120" cy="120" r={r} fill="none" stroke="rgba(92,225,230,0.18)" strokeWidth="0.8" strokeDasharray="4 3" />
        ))}
        {[-3, -2, -1, 0, 1, 2, 3].map((row) =>
          [-3, -2, -1, 0, 1, 2, 3].map((col) => {
            const x = 120 + col * 24 - 10;
            const y = 120 + row * 24 - 10;
            const d = Math.hypot(x + 10 - 120, y + 10 - 120);
            return d < 88 ? (
              <rect
                key={`${row}-${col}`}
                x={x}
                y={y}
                width="20"
                height="20"
                fill={row === 0 && col === 1 ? 'rgba(92,225,230,0.25)' : 'none'}
                stroke="rgba(92,225,230,0.3)"
                strokeWidth="0.8"
                rx="2"
              />
            ) : null;
          })
        )}
        <text x="120" y="218" textAnchor="middle" fill="#5CE1E6" fontSize="8" fontFamily="monospace">
          300mm SILICON WAFER (FALLBACK)
        </text>
      </svg>
    </div>
  );
}

interface WaferSceneProps {
  className?: string;
}

export function WaferScene({ className }: WaferSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [webglFailed, setWebglFailed] = useState(false);

  // Check WebGL availability safely
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setWebglFailed(true);
    } catch {
      setWebglFailed(true);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * -2,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 });
  }, []);

  if (webglFailed) return <WaferFallback />;

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      role="img"
      aria-label="Interactive 3D silicon wafer model — three-quarter presentation with die grid"
    >
      <Canvas
        camera={{ position: [0, 1.8, 5.0], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          if (!gl) setWebglFailed(true);
        }}
      >
        <color attach="background" args={['#081521']} />

        {/* Ambient base lighting */}
        <ambientLight intensity={0.6} color="#dbe5f2" />

        {/* Primary key light: crisp overhead directional illuminating top wafer face */}
        <directionalLight position={[5, 7, 5]} intensity={2.0} color="#f4f7ff" />

        {/* Secondary fill light: cool blue highlighting metallic curvature */}
        <directionalLight position={[-4, 3, 2]} intensity={1.1} color="#6ba6ff" />

        {/* Rim / Accent back light: vibrant electric cyan edge glow */}
        <directionalLight position={[0, -2, -4]} intensity={1.5} color="#5CE1E6" />

        {/* Copper / Warm reflection for circuit details */}
        <pointLight position={[-2, 2, 3]} intensity={0.8} color="#C88752" distance={10} />
        <pointLight position={[2, 3, 2]} intensity={1.2} color="#5CE1E6" distance={10} />

        <Suspense fallback={null}>
          <SiliconWafer mouseX={mouse.x} mouseY={mouse.y} />
          <Stars radius={60} depth={40} count={900} factor={3} saturation={0.2} fade speed={0.4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
