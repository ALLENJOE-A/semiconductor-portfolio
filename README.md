# Allen Joe A — Semiconductor & VLSI Engineering Portfolio

[![Deploy Semiconductor Portfolio to GitHub Pages](https://github.com/ALLENJOE-A/semiconductor-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/ALLENJOE-A/semiconductor-portfolio/actions/workflows/deploy.yml)
[![Live Portfolio](https://img.shields.io/badge/Live_Site-allenjoe--a.github.io-00D9FF?style=flat&logo=githubpages)](https://allenjoe-a.github.io/semiconductor-portfolio/)
[![GitHub Profile](https://img.shields.io/badge/GitHub-ALLENJOE--A-268BFF?style=flat&logo=github)](https://github.com/ALLENJOE-A)
[![Resume Download](https://img.shields.io/badge/Resume-PDF_Download-00D9FF?style=flat&logo=adobeacrobatreader)](https://allenjoe-a.github.io/semiconductor-portfolio/resume.pdf)

> Interactive, evidence-backed semiconductor engineering portfolio showcasing Digital RTL Design, ASIC Microarchitecture, Physical Design (OpenROAD), Semiconductor Device Modelling (Sentaurus TCAD), and AI for EDA.

**🌐 Live Production Website:** [https://allenjoe-a.github.io/semiconductor-portfolio/](https://allenjoe-a.github.io/semiconductor-portfolio/)

---

## 🔬 Featured Engineering Case Studies

1. **[Gain-Scheduled All-Digital PLL (GS-ADPLL) & RTL-to-GDS Flow](https://github.com/ALLENJOE-A/Gear-Shifting-All-Digital-Phase-Locked-Loop)**
   - Dual-mode gain-scheduled Digital Loop Filter (DLF) combining high-bandwidth acquisition (sub-100 cycle lock at 85 simulated cycles) with low-bandwidth tracking (1.8 ps RMS phase jitter in behavioral simulation).
   - Synthesizable Verilog RTL evaluated through OpenROAD / SkyWater 130nm PDK standard-cell physical design flow.
   - *Status: RTL Implemented & Simulation Verified*

2. **[4-Channel Adaptive Burst DMA Controller](https://github.com/ALLENJOE-A/4-Channel-Adaptive-Burst-DMA-Controller-with-Hardware-Performance-Monitoring)**
   - Pure Verilog RTL DMA engine featuring round-robin channel arbitration, dynamic burst sizing (1/4/8/16-word INCR bursts), and non-intrusive 64-bit performance counters.
   - Thoroughly verified via self-checking testbench with 6,266 automated verification checks (0 errors); achieved 5.61% cycle reduction and 50% burst overhead reduction on 512-word transfers.
   - *Status: RTL Implemented & Verified*

3. **[Low-Power 16-Bit MAC BIST Architecture](https://github.com/ALLENJOE-A/Low-Power-MAC-BIST-PPA-Fault-Coverage)**
   - Comparative evaluation of low-transition Built-In Self-Test (BIST) architectures for a 16-bit Multiply-Accumulate (MAC) datapath.
   - Evaluates power, performance, area (PPA), test application duration, and stuck-at fault coverage across candidate LFSR generator topologies.
   - *Status: Simulation & Synthesis Completed*

4. **[GNN-T Edge Error Prediction for Computational Lithography](https://github.com/ALLENJOE-A/GNN-T_Edge-Error-Prediction-for-Computational-Lithography)**
   - Hybrid Graph Neural Network + Transformer architecture predicting sub-resolution Edge Placement Errors (EPE) from non-Euclidean layout geometries.
   - Physics-inspired research prototype evaluated on 2D scalar Fourier-optics simulation graphs to accelerate optical proximity correction (OPC) exploration.
   - *Status: Research Prototype*

5. **[CNN-Driven Explainable AI for Lithography Hotspot Detection](https://github.com/ALLENJOE-A/CNN-Driven-Explainable-AI-for-Lithography-Hotspot-Detection)**
   - Deep CNN layout classifier trained on ICCAD-12 benchmarks to detect lithography pinching and bridging hotspots.
   - Integrates Grad-CAM gradient saliency maps to visualize critical layout contours and provide explainable model attribution.
   - *Status: Research Prototype*

6. **[FE-DGDM-JLTFET Biosensor TCAD](https://github.com/ALLENJOE-A/FE-DGDM-JLTFET-Biosensor-TCAD)**
   - Double-gate junctionless tunnel FET integrating ferroelectric negative capacitance (HZO) and dielectric-modulated nanocavity for label-free biomolecular detection.
   - Calibrated 2D/3D Sentaurus TCAD simulation evaluating subthreshold swing steepening and biomolecule sensitivity metrics.
   - *Status: Simulation Completed*

7. **[DG Source-Pocket Engineered Vertical TFET](https://github.com/ALLENJOE-A/DG-Source-Pocket-Engineered-Vertical-TFET)**
   - Synopsys Sentaurus TCAD device optimization incorporating narrow-bandgap p++ source pockets to thin the band-to-band tunneling barrier and boost ON-current.
   - Investigates electrostatic gate control and subthreshold performance for ultra-low-power logic.
   - *Status: Simulation Completed*

8. **[Processing Element Array for CNN Accelerator](https://github.com/ALLENJOE-A/DESIGN-AND-IMPLEMENTATION-OF-EFFICIENT-PROCESSING-ELEMENT-ARRAY-FOR-CNN-ACCELERATOR)**
   - Scalable 2D systolic processing element (PE) array executing weight-stationary matrix multiplication for edge AI acceleration.
   - Implements Dadda multiplier trees and hybrid adders for low-power FPGA evaluation.
   - *Status: RTL Implemented*

9. **[Digital Oscilloscope — STM32](https://github.com/ALLENJOE-A/Digital-Oscilloscope-STM32)**
   - Dual interleaved ADC hardware with direct memory access (DMA) sampling and real-time waveform rendering on an ILI9341 320x240 TFT display.
   - *Status: Hardware & Firmware Completed*

---

## 📊 Verification & Evidence Framework

| Domain | Project | Key Verification Methodology | Implementation Status |
|:---|:---|:---|:---:|
| **Mixed-Signal / PLL** | GS-ADPLL | Behavioral simulation & OpenROAD 130nm standard-cell flow | RTL Implemented |
| **ASIC / Interconnect** | 4-Ch DMA Controller | Self-checking testbench (6,266 checks, 0 errors) | RTL Verified |
| **DFT / Testing** | Low-Power MAC BIST | Fault simulation & PPA synthesis comparison | Simulation & Synthesis |
| **EDA AI / Litho** | GNN-T EPE Prediction | 2D Fourier-optics simulation graphs | Research Prototype |
| **EDA AI / Litho** | CNN Hotspot Detection | ICCAD-12 benchmark evaluation & Grad-CAM attribution | Research Prototype |
| **Device Modelling** | FE-DGDM-JLTFET | Synopsys Sentaurus TCAD physics & parameter sweeps | Simulation Completed |
| **Device Modelling** | Vertical TFET | Synopsys Sentaurus TCAD non-local band-to-band tunneling | Simulation Completed |
| **Embedded Systems** | STM32 Oscilloscope | Hardware bench testing with dual ADC + DMA pipeline | Completed |

*Note: Verification statuses transparently reflect digital RTL simulation, TCAD simulation, and academic prototypes. No silicon tapeouts are claimed without physical foundry manufacturing evidence.*

---

## 🛠️ Technology Stack

- **Frontend & Rendering**: React 19, TypeScript, Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP ScrollTrigger, Lucide Icons, Recharts.
- **Continuous 3D World**: Fixed background WebGL canvas tracking scroll progress `0.00 → 1.00`, smoothly illustrating silica sand → ingot boule → sliced 300mm wafer → FinFET transistor cross-section → packaged SoC.
- **Design System**: Electric Cyan (`#00D9FF`), Semiconductor Blue (`#268BFF`), Deep Navy (`#0A1E2E`), and GitHub Dark (`#0D1117`).
- **Build & CI/CD**: Vite 8, GitHub Actions (`deploy-pages`), Vercel SPA routing (`vercel.json`).

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/ALLENJOE-A/semiconductor-portfolio.git
cd semiconductor-portfolio

# Install dependencies
npm install

# Run local development server
npm run dev

# Run production build and typecheck
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License & Attribution

All hardware RTL code, TCAD models, and simulation datasets are authored by **Allen Joe A**.  
Contact: [GitHub Profile](https://github.com/ALLENJOE-A) · [LinkedIn Profile](https://www.linkedin.com/in/allenjoe-a)
