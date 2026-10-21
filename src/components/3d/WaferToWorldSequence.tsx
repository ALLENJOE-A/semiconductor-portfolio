import { useState } from 'react';
import { Stage3DCanvas } from './Stage3DCanvas';

const STAGES = [
  {
    id: 'wafer',
    title: 'Stage A — The Silicon Wafer',
    desc: 'Pure monocrystalline silicon ingot sliced into 300mm discs, chemical-mechanically polished to atomic flatness, and patterned with hundreds of integrated circuit dies across photo-exposure steppers.'
  },
  {
    id: 'die',
    title: 'Stage B — Die Singulation & Layer Stack',
    desc: 'Precision diamond dicing separates the wafer along scribe streets into individual operational dies. Microscopic copper/gold bond pads provide the electrical interface to the package interposer.'
  },
  {
    id: 'transistor',
    title: 'Stage C — Transistor & Device Nanostructures',
    desc: 'Sub-10nm conceptual cross-section: metal gate electrode, high-κ dielectric layer, n+/p+ source-drain regions, and quantum tunneling channel. Relates directly to TCAD simulation models like Sentaurus JLTFET.'
  },
  {
    id: 'system',
    title: 'Stage D/E — Digital Architecture & Engineering Systems',
    desc: 'Billions of nanoscale devices interconnected into synthesized functional RTL blocks: 4-Channel Adaptive Burst DMA, CNN Processing Element arrays, high-speed memory interfaces, and verification assertion engines.'
  }
];

export function WaferToWorldSequence() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section className="section" style={{ background: 'var(--color-deep-navy)', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <p className="text-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-secondary)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
            Signature Visual Journey
          </p>
          <h2 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-technical-white)', marginBottom: 'var(--space-4)' }}>
            From Wafer to World
          </h2>
          <p style={{ color: 'var(--color-silicon-silver)', maxWidth: '680px', marginInline: 'auto', fontSize: 'var(--text-md)', lineHeight: 1.65 }}>
            "Engineering begins at the material level and becomes a complete system through design, modelling, verification, and implementation."
          </p>
        </div>

        {/* Accessible Stage Navigation Pills */}
        <div
          role="tablist"
          aria-label="Wafer to world story stages"
          style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}
        >
          {STAGES.map((s, idx) => (
            <button
              key={s.id}
              role="tab"
              id={`stage-tab-${idx}`}
              aria-selected={activeStage === idx}
              aria-controls={`stage-panel-${idx}`}
              tabIndex={0}
              onClick={() => setActiveStage(idx)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') setActiveStage((prev) => (prev + 1) % 4);
                if (e.key === 'ArrowLeft') setActiveStage((prev) => (prev - 1 + 4) % 4);
              }}
              style={{
                background: activeStage === idx ? 'rgba(92,225,230,0.18)' : 'rgba(255,255,255,0.03)',
                border: activeStage === idx ? '1px solid var(--accent-secondary)' : '1px solid rgba(255,255,255,0.1)',
                color: activeStage === idx ? 'var(--color-technical-white)' : 'var(--color-silicon-silver)',
                padding: '0.65rem 1.35rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              0{idx + 1}. {s.id.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Real 3D Cinematic Transformation Viewport */}
        <div
          id={`stage-panel-${activeStage}`}
          role="tabpanel"
          aria-labelledby={`stage-tab-${activeStage}`}
          style={{
            background: 'rgba(8, 21, 33, 0.85)',
            border: '1px solid rgba(92, 225, 230, 0.25)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.3fr) minmax(280px, 1fr)',
            minHeight: '520px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.45)'
          }}
        >
          {/* Interactive 3D Canvas Box */}
          <div style={{ position: 'relative', minHeight: '380px', background: 'radial-gradient(circle at center, #11283d 0%, #081521 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <Stage3DCanvas stage={activeStage} />
            <div style={{ position: 'absolute', bottom: '12px', left: '16px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5CE1E6', display: 'inline-block' }} />
              <span style={{ fontSize: '0.7rem', color: '#BFC8D0', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                3D SCENE: {STAGES[activeStage].id.toUpperCase()} (Interactive Rotation)
              </span>
            </div>
          </div>

          {/* Detailed Narrative Explanation */}
          <div style={{ padding: 'var(--space-8) var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 'var(--space-2)' }}>
              Metaphor Step 0{activeStage + 1} of 04
            </span>
            <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-technical-white)', marginBottom: 'var(--space-3)', lineHeight: 1.25 }}>
              {STAGES[activeStage].title}
            </h3>
            <p style={{ color: 'var(--color-silicon-silver)', lineHeight: 1.7, fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)' }}>
              {STAGES[activeStage].desc}
            </p>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {activeStage === 0 && (
                <>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(191,200,208,0.85)' }}><strong className="text-cyan">Physical Substrate:</strong> 300mm p-type silicon wafer with &lt;100&gt; crystal orientation</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(191,200,208,0.85)' }}><strong className="text-cyan">Lithography Metrology:</strong> Deep Ultraviolet (DUV) / Extreme Ultraviolet (EUV) patterning</div>
                </>
              )}
              {activeStage === 1 && (
                <>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(191,200,208,0.85)' }}><strong className="text-cyan">Separation:</strong> Wafer dicing along kerf/scribe streets</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(191,200,208,0.85)' }}><strong className="text-cyan">Pad Pitch:</strong> Microbump / wirebond array for I/O and power delivery routing</div>
                </>
              )}
              {activeStage === 2 && (
                <>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(191,200,208,0.85)' }}><strong className="text-copper">TCAD Scope:</strong> 2D/3D numerical mesh modeling in Sentaurus SDE/SDevice</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(191,200,208,0.85)' }}><strong className="text-copper">Physics Verification:</strong> Band-to-band tunneling (BTBT), ferroelectric polarization, subthreshold slope</div>
                </>
              )}
              {activeStage === 3 && (
                <>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(191,200,208,0.85)' }}><strong className="text-accent">RTL Subsystems:</strong> 4-Channel Adaptive Burst DMA, MAC BIST, CNN PE Array</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(191,200,208,0.85)' }}><strong className="text-accent">Verification Metrics:</strong> 6,266 simulation checks &amp; 964 explicit assertions (Reported)</div>
                </>
              )}
            </div>

            <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setActiveStage((prev) => (prev > 0 ? prev - 1 : 3))}
                style={{ padding: '0.45rem 1.1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', color: 'var(--color-silicon-silver)', borderRadius: '4px', cursor: 'pointer', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}
                aria-label="Previous story stage"
              >
                ← Prev
              </button>
              <button
                onClick={() => setActiveStage((prev) => (prev < 3 ? prev + 1 : 0))}
                style={{ padding: '0.45rem 1.1rem', background: 'var(--accent-primary)', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                aria-label="Next story stage"
              >
                Next Stage →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
