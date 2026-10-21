# Allen Joe A — Semiconductor & VLSI Engineering Portfolio

[![Deploy Semiconductor Portfolio to GitHub Pages](https://github.com/ALLENJOE-A/semiconductor-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/ALLENJOE-A/semiconductor-portfolio/actions/workflows/deploy.yml)
[![Live Portfolio](https://img.shields.io/badge/Live_Site-allenjoe--a.github.io-00D9FF?style=flat&logo=githubpages)](https://allenjoe-a.github.io/semiconductor-portfolio/)
[![Resume Download](https://img.shields.io/badge/Resume-PDF_Download-d4af37?style=flat&logo=adobeacrobatreader)](https://allenjoe-a.github.io/semiconductor-portfolio/resume.pdf)

> Interactive, evidence-backed semiconductor engineering portfolio showcasing Digital RTL Design, ASIC Microarchitecture, Physical Design (OpenROAD), Semiconductor Device Modelling (Sentaurus TCAD), and AI for EDA.

**🌐 Live Production Website:** [https://allenjoe-a.github.io/semiconductor-portfolio/](https://allenjoe-a.github.io/semiconductor-portfolio/)

---

## 🔬 Featured Engineering Case Studies

1. **Gain-Scheduled All-Digital PLL (GS-ADPLL) & RTL-to-GDS Flow** (`adpll-core`)
   - Dual-mode gain-scheduled Digital Loop Filter with fast acquisition (sub-100 cycle lock at 85 cycles) and low-jitter tracking (1.8 ps RMS phase jitter).
   - Verilog RTL synthesized with OpenROAD / SkyWater 130nm PDK.
2. **4-Channel Adaptive Burst DMA Controller** (`dma-controller`)
   - 4-channel controller with dynamic transfer burst sizing, round-robin arbitration, and non-intrusive 64-bit performance counters.
   - Simulation verified with 6,266 checks (0 errors); achieved 5.61% cycle reduction and 50% burst reduction on 512-word transfers.
3. **GNN-T Edge Error Prediction for Computational Lithography** (`gnn-lithography`)
   - Graph Neural Network + Transformer pipeline predicting sub-resolution edge placement error (EPE < 1.2nm) with 14× speedup over numerical OPC.
4. **CNN-Driven Explainable AI for Lithography Hotspot Detection** (`cnn-hotspot`)
   - ResNet classifier combined with Grad-CAM gradient saliency maps to identify sub-resolution necking/bridging pinch hotspots on 2D layout clips.
5. **FE-DGDM-JLTFET Biosensor TCAD** (`jltfet-biosensor`)
   - Double-gate junctionless tunnel FET with ferroelectric negative capacitance (HZO) and dielectric cavity modulation for label-free biomolecular detection.
6. **DG Source-Pocket Engineered Vertical TFET** (`dgsp-vtfet`)
   - TCAD device simulation evaluating narrow-bandgap p++ source pockets to thin the band-to-band tunneling barrier and boost ON-current.
7. **Processing Element Array for CNN Accelerator** (`pe-array-cnn`)
   - Scalable 2D systolic array executing weight-stationary matrix multiplication with streaming horizontal activations and vertical partial sum accumulation.

---

## 🛠️ Technology Stack

- **Frontend & Rendering**: React 19, TypeScript, Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP ScrollTrigger, Lucide Icons, Recharts.
- **Continuous 3D World**: Fixed background WebGL canvas tracking scroll progress `0.00 → 1.00`, smoothly illustrating silica sand → ingot boule → sliced 300mm wafer → FinFET transistor cross-section → packaged SoC.
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
Contact: [GitHub Profile](https://github.com/ALLENJOE-A) · [LinkedIn Profile](https://www.linkedin.com/in/allen-joe-a-36069831b/)
