/* Reusable Interactive Architecture Diagram for DMA Controller */
export function DmaArchitectureDiagram() {
  return (
    <div style={{ background: '#091522', border: '1px solid rgba(92,225,230,0.25)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBlock: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
        <span className="text-mono" style={{ fontSize: '0.75rem', color: '#5CE1E6', textTransform: 'uppercase' }}>
          Hardware Architecture Block Diagram (SystemVerilog RTL)
        </span>
        <span className="text-mono" style={{ fontSize: '0.7rem', color: '#BFC8D0', opacity: 0.7 }}>
          Documented Structure
        </span>
      </div>

      <svg viewBox="0 0 740 280" width="100%" height="auto" style={{ maxHeight: '340px' }} aria-label="DMA controller hardware architecture diagram">
        {/* Background Grid */}
        <defs>
          <pattern id="diagGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="740" height="280" fill="url(#diagGrid)" rx="6" />

        {/* 4 DMA Channels */}
        {[0, 1, 2, 3].map((ch) => (
          <g key={ch} transform={`translate(20, ${25 + ch * 60})`}>
            <rect width="160" height="48" fill="#132338" stroke="#2E7BFF" strokeWidth="1.2" rx="4" />
            <text x="80" y="24" fill="#FFFFFF" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              Channel {ch} Descriptor
            </text>
            <text x="80" y="38" fill="#5CE1E6" fontSize="9" fontFamily="monospace" textAnchor="middle">
              Src / Dst / Len [31:0]
            </text>
            {/* Outgoing request lines */}
            <line x1="160" y1="24" x2="230" y2="24" stroke="#5CE1E6" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        ))}

        {/* Central Priority Arbiter Block */}
        <g transform="translate(230, 25)">
          <rect width="140" height="228" fill="#182c44" stroke="#5CE1E6" strokeWidth="1.5" rx="6" />
          <text x="70" y="35" fill="#5CE1E6" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            PRIORITY
          </text>
          <text x="70" y="52" fill="#5CE1E6" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            ARBITER
          </text>
          <text x="70" y="80" fill="#BFC8D0" fontSize="9" fontFamily="sans-serif" textAnchor="middle">
            Round-Robin / Fixed
          </text>
          <text x="70" y="115" fill="#C88752" fontSize="9" fontFamily="monospace" textAnchor="middle">
            Channel Grants
          </text>
          <rect x="15" y="140" width="110" height="60" fill="#0c1724" stroke="rgba(255,255,255,0.15)" rx="3" />
          <text x="70" y="162" fill="#fff" fontSize="9" fontFamily="monospace" textAnchor="middle">
            Transfer FSM
          </text>
          <text x="70" y="180" fill="#BFC8D0" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
            Idle/Req/Burst/Done
          </text>
        </g>

        {/* Connection to Adaptive Burst Sizing Logic */}
        <line x1="370" y1="80" x2="430" y2="80" stroke="#5CE1E6" strokeWidth="2" />
        <line x1="370" y1="180" x2="430" y2="180" stroke="#C88752" strokeWidth="2" />

        {/* Adaptive Burst Logic Unit */}
        <g transform="translate(430, 25)">
          <rect width="140" height="110" fill="#132a42" stroke="#2E7BFF" strokeWidth="1.5" rx="6" />
          <text x="70" y="30" fill="#2E7BFF" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            ADAPTIVE BURST
          </text>
          <text x="70" y="46" fill="#fff" fontSize="10" fontFamily="monospace" textAnchor="middle">
            ENGINE
          </text>
          <text x="70" y="70" fill="#BFC8D0" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
            Dynamic Length Calculator
          </text>
          <text x="70" y="88" fill="#5CE1E6" fontSize="9" fontFamily="monospace" textAnchor="middle">
            INCR4 / INCR8 / INCR16
          </text>
        </g>

        {/* Hardware Performance Monitoring Block */}
        <g transform="translate(430, 145)">
          <rect width="140" height="108" fill="#1f2a36" stroke="#C88752" strokeWidth="1.5" rx="6" />
          <text x="70" y="28" fill="#C88752" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            HW MONITORING
          </text>
          <text x="70" y="44" fill="#BFC8D0" fontSize="9" fontFamily="sans-serif" textAnchor="middle">
            Performance Counters
          </text>
          <text x="70" y="68" fill="#5CE1E6" fontSize="8" fontFamily="monospace" textAnchor="middle">
            • Cycle Counters [63:0]
          </text>
          <text x="70" y="84" fill="#5CE1E6" fontSize="8" fontFamily="monospace" textAnchor="middle">
            • Burst Counters [31:0]
          </text>
        </g>

        {/* Master Bus Interface (AMBA / AXI Bridge) */}
        <g transform="translate(620, 25)">
          <rect width="100" height="228" fill="#0d1f30" stroke="#5CE1E6" strokeWidth="1.5" strokeDasharray="4 2" rx="6" />
          <text x="50" y="80" fill="#5CE1E6" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            MASTER
          </text>
          <text x="50" y="98" fill="#5CE1E6" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            BUS I/F
          </text>
          <text x="50" y="130" fill="#BFC8D0" fontSize="9" fontFamily="sans-serif" textAnchor="middle">
            Read/Write
          </text>
          <text x="50" y="145" fill="#BFC8D0" fontSize="9" fontFamily="sans-serif" textAnchor="middle">
            Channels
          </text>
          <text x="50" y="180" fill="#fff" fontSize="8" fontFamily="monospace" textAnchor="middle">
            AW / W / AR / R
          </text>
        </g>
        <line x1="570" y1="80" x2="620" y2="80" stroke="#5CE1E6" strokeWidth="2" />
      </svg>
      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#BFC8D0', opacity: 0.75, lineHeight: 1.5 }}>
        Caption: Architectural partitioning of the 4-channel controller showing descriptor queues, prioritized arbitration logic, adaptive transfer sizing, and non-intrusive 64-bit performance counters.
      </div>
    </div>
  );
}

/* Reusable Interactive Waveform / Benchmark Visualizer */
export function DmaWaveformVisualizer() {
  return (
    <div style={{ background: '#091522', border: '1px solid rgba(46,123,255,0.3)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBlock: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
        <span className="text-mono" style={{ fontSize: '0.75rem', color: '#2E7BFF', textTransform: 'uppercase' }}>
          Functional Timing &amp; Burst Sizing Waveform (ModelSim / Questa)
        </span>
        <span className="text-mono" style={{ fontSize: '0.7rem', color: '#BFC8D0', opacity: 0.7 }}>
          Simulated Signal Trace
        </span>
      </div>

      <svg viewBox="0 0 740 180" width="100%" height="auto" aria-label="DMA timing waveform trace illustration">
        {/* Clock signal */}
        <text x="15" y="32" fill="#5CE1E6" fontSize="10" fontFamily="monospace">clk</text>
        <path d="M 80 35 L 110 35 L 110 18 L 140 18 L 140 35 L 170 35 L 170 18 L 200 18 L 200 35 L 230 35 L 230 18 L 260 18 L 260 35 L 290 35 L 290 18 L 320 18 L 320 35 L 350 35 L 350 18 L 380 18 L 380 35 L 410 35 L 410 18 L 440 18 L 440 35 L 470 35 L 470 18 L 500 18 L 500 35 L 530 35 L 530 18 L 560 18 L 560 35 L 590 35 L 590 18 L 620 18 L 620 35 L 650 35 L 650 18 L 680 18 L 680 35 L 710 35" fill="none" stroke="#5CE1E6" strokeWidth="1.5" />

        {/* Channel Request */}
        <text x="15" y="70" fill="#BFC8D0" fontSize="10" fontFamily="monospace">ch_req[0]</text>
        <path d="M 80 75 L 140 75 L 140 58 L 650 58 L 650 75 L 710 75" fill="none" stroke="#C88752" strokeWidth="1.5" />

        {/* Burst Length Size Bus */}
        <text x="15" y="110" fill="#2E7BFF" fontSize="10" fontFamily="monospace">burst_len</text>
        <rect x="140" y="98" width="120" height="20" fill="#132840" stroke="#2E7BFF" strokeWidth="1" rx="2" />
        <text x="200" y="112" fill="#fff" fontSize="9" fontFamily="monospace" textAnchor="middle">INCR4 (0x03)</text>
        <rect x="260" y="98" width="240" height="20" fill="#1b3c61" stroke="#5CE1E6" strokeWidth="1" rx="2" />
        <text x="380" y="112" fill="#5CE1E6" fontSize="9" fontFamily="monospace" textAnchor="middle">ADAPTIVE INCR16 (0x0F) [50% Burst Reduction]</text>
        <rect x="500" y="98" width="150" height="20" fill="#132840" stroke="#2E7BFF" strokeWidth="1" rx="2" />
        <text x="575" y="112" fill="#fff" fontSize="9" fontFamily="monospace" textAnchor="middle">INCR8 (0x07)</text>

        {/* Data Valid / Grant */}
        <text x="15" y="152" fill="#5CE1E6" fontSize="10" fontFamily="monospace">dma_ack</text>
        <path d="M 80 156 L 200 156 L 200 140 L 650 140 L 650 156 L 710 156" fill="none" stroke="#5CE1E6" strokeWidth="1.5" />
      </svg>
      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#BFC8D0', opacity: 0.75, lineHeight: 1.5 }}>
        Caption: Annotated behavioral signal simulation showing transition from small static burst transfers to wide contiguous INCR16 operations on large word sizes.
      </div>
    </div>
  );
}

/* TCAD Biosensor Device Cross-Section Visualizer */
export function BiosensorDeviceVisualizer() {
  return (
    <div style={{ background: '#091522', border: '1px solid rgba(92,225,230,0.25)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBlock: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
        <span className="text-mono" style={{ fontSize: '0.75rem', color: '#5CE1E6', textTransform: 'uppercase' }}>
          FE-DGDM-JLTFET Cross-Section Schematic (Sentaurus TCAD Simulation Model)
        </span>
        <span className="text-mono" style={{ fontSize: '0.7rem', color: '#BFC8D0', opacity: 0.7 }}>
          Device Physics Model
        </span>
      </div>

      <svg viewBox="0 0 740 220" width="100%" height="auto" aria-label="FE-DGDM-JLTFET biosensor device cross-section schematic">
        {/* Top Gate & Ferroelectric Layer */}
        <rect x="220" y="20" width="300" height="28" fill="#2E7BFF" opacity="0.9" rx="3" />
        <text x="370" y="38" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          TOP GATE (TiN) [V_GS]
        </text>

        <rect x="220" y="52" width="300" height="20" fill="#5CE1E6" opacity="0.8" rx="2" />
        <text x="370" y="66" fill="#081521" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          Ferroelectric Layer (HZO: Hf_{0.5}Zr_{0.5}O_2)
        </text>

        {/* Source, Doping-Modulated Channel, Drain */}
        <rect x="60" y="78" width="150" height="60" fill="#C88752" opacity="0.85" rx="3" />
        <text x="135" y="112" fill="#fff" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          n+ SOURCE (1e19 cm^-3)
        </text>

        <rect x="220" y="78" width="140" height="60" fill="#1a3554" stroke="#5CE1E6" strokeWidth="1" rx="2" />
        <text x="290" y="105" fill="#5CE1E6" fontSize="10" fontFamily="monospace" textAnchor="middle">
          Region 1 (Bio-Cavity)
        </text>
        <text x="290" y="120" fill="#BFC8D0" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
          Dielectric Modulation
        </text>

        <rect x="370" y="78" width="150" height="60" fill="#13273e" stroke="#2E7BFF" strokeWidth="1" rx="2" />
        <text x="445" y="105" fill="#2E7BFF" fontSize="10" fontFamily="monospace" textAnchor="middle">
          Region 2 (Tunnel Junc)
        </text>
        <text x="445" y="120" fill="#BFC8D0" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
          Band-to-Band Tunneling
        </text>

        <rect x="530" y="78" width="150" height="60" fill="#C88752" opacity="0.85" rx="3" />
        <text x="605" y="112" fill="#fff" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          n+ DRAIN (1e19 cm^-3)
        </text>

        {/* Bottom Ferroelectric & Gate */}
        <rect x="220" y="144" width="300" height="20" fill="#5CE1E6" opacity="0.8" rx="2" />
        <text x="370" y="158" fill="#081521" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          Bottom Ferroelectric Layer (HZO)
        </text>

        <rect x="220" y="168" width="300" height="28" fill="#2E7BFF" opacity="0.9" rx="3" />
        <text x="370" y="186" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          BOTTOM GATE (TiN) [V_GS]
        </text>
      </svg>
      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#BFC8D0', opacity: 0.75, lineHeight: 1.5 }}>
        Caption: TCAD device architecture illustrating double-gate ferroelectric negative-capacitance stack combined with bio-molecular cavity modulation in a junctionless tunnel FET structure.
      </div>
    </div>
  );
}
