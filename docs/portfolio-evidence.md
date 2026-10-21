# Portfolio Evidence Manifest

This file records the source, evidence category, and verification status
of every substantive claim published on the portfolio website.

## Evidence Categories
- **A** — Source-verified: supported by inspected source file or repository documentation
- **B** — Test-verified: supported by testbench, simulation run, or reproducible command
- **C** — Reported result: exists in README/report; not independently reproduced here
- **D** — Illustrative: conceptual diagram, 3D visualisation, or artistic representation
- **E** — Planned / Incomplete: not yet implemented or verified

---

## Identity

| Field       | Value                                              | Source          | Status           |
|-------------|---------------------------------------------------|-----------------|------------------|
| Name        | Allen Joe A                                        | GitHub profile  | Verified         |
| GitHub      | https://github.com/ALLENJOE-A                     | Direct          | Verified         |
| LinkedIn    | https://www.linkedin.com/in/allen-joe-a-36069831b/| Direct          | Verified         |
| Degree      | B.Tech in Electronics & Communication (VLSI Focus)| Verified Resume | Verified         |
| Resume      | /resume.pdf                                       | Direct Download | Verified         |

---

## Projects

### Gain-Scheduled All-Digital PLL (GS-ADPLL) & RTL-to-GDS Flow

**Repository:** https://github.com/ALLENJOE-A/gs-adpll-core  
**Status:** Completed (RTL & Synthesis Flow)  
**Languages / Tools:** SystemVerilog, Verilog, OpenROAD, Yosys, SkyWater 130nm PDK

| Claim | Value | Unit | Conditions | Source | Category | Notes |
|-------|-------|------|-----------|--------|----------|-------|
| Lock acquisition time | 85 | cycles | Gain-scheduled high proportional gain mode (simulated) | README.md | C | Simulated behavioral/RTL |
| RMS phase jitter | 1.8 | ps | Simulated tracking mode with DCO quantization model | README.md | C | Simulated behavioral/RTL |

**Uncertainties:**
- OpenROAD physical layout GDS generated for SkyWater 130nm; no silicon tapeout claimed.
- Phase noise and jitter are behavioral/digital simulation models.

---

### 4-Channel Adaptive Burst DMA Controller

**Repository:** https://github.com/ALLENJOE-A/4-Channel-Adaptive-Burst-DMA-Controller-with-Hardware-Performance-Monitoring  
**Status:** Completed (simulation)  
**Languages:** SystemVerilog, Verilog

| Claim | Value | Unit | Conditions | Source | Category | Notes |
|-------|-------|------|-----------|--------|----------|-------|
| Cycle reduction — 512-word transfer | 5.61 | % | Adaptive vs. fixed-burst baseline; simulated | README.md | C | Not independently reproduced |
| Burst count reduction — 512-word transfer | 50 | % | Adaptive vs. fixed-burst baseline; simulated | README.md | C | Not independently reproduced |
| Total verification checks | 6,266 | checks | Full testbench run | README.md | C | Distinct from assertion count |
| Explicit PASS assertions | 964 | assertions | Full testbench run | README.md | C | Not independently reproduced |
| Failures / errors | 0 | — | Full testbench run | README.md | C | Not independently reproduced |

**Uncertainties:**
- Baseline burst length not confirmed from source
- Simulation environment (simulator version, memory latency model) not documented here
- No synthesis, place-and-route, or silicon evidence exists or is claimed

---

### FE-DGDM-JLTFET Biosensor TCAD

**Repository:** https://github.com/ALLENJOE-A/FE-DGDM-JLTFET-Biosensor-TCAD  
**Status:** Research-prototype  
**Languages:** Tcl, Python

No quantitative results published. Conceptual 3D illustrations on the website are category D.

**Uncertainties:**
- Sentaurus execution status not confirmed
- CSV provenance not independently verified
- Geometry and transport length reconciliation pending

---

### GNN-T Edge Error Prediction for Computational Lithography

**Repository:** https://github.com/ALLENJOE-A/GNN-T_Edge-Error-Prediction-for-Computational-Lithography  
**Status:** In-progress  
**Languages:** Python

No quantitative results published. Implementation in progress.

---

### CNN-Driven Explainable AI for Lithography Hotspot Detection

**Repository:** https://github.com/ALLENJOE-A/CNN-Driven-Explainable-AI-for-Lithography-Hotspot-Detection  
**Status:** In-progress  
**Languages:** Python

No quantitative results published. Implementation in progress.

---

### Efficient PE Array for CNN Accelerator

**Repository:** https://github.com/ALLENJOE-A/DESIGN-AND-IMPLEMENTATION-OF-EFFICIENT-PROCESSING-ELEMENT-ARRAY-FOR-CNN-ACCELERATOR  
**Status:** In-progress

No PPA or throughput figures published.

---

### DG Source-Pocket Engineered Vertical TFET

**Repository:** https://github.com/ALLENJOE-A/DG-Source-Pocket-Engineered-Vertical-TFET  
**Status:** Research-prototype

No quantitative results published.

---

### Digital Oscilloscope — STM32

**Repository:** https://github.com/ALLENJOE-A/Digital-Oscilloscope-STM32  
**Status:** Completed

No specific bandwidth, sampling rate, or resolution figures published without source verification.

---

### Speaker Diarization on Raspberry Pi 5

**Repository:** https://github.com/ALLENJOE-A/speaker-diarization-pi5  
**Status:** In-progress

No accuracy or latency figures published.

---

## 3D Visualisations

All 3D scenes on this website are artistic/conceptual representations (Category D).
They do not represent measured data or validated simulation outputs.
Each is labelled on the site as "Conceptual illustration."

---

*Last updated: 2026-10-21 (Portfolio Polish & Recruiter Enhancements)*  
*To update: edit `src/data/projects.ts` and update this file to match.*
