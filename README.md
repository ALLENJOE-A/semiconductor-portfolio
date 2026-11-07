# Allen Joe A — Semiconductor & VLSI Engineering Portfolio

[![Deploy Semiconductor Portfolio to GitHub Pages](https://github.com/ALLENJOE-A/semiconductor-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/ALLENJOE-A/semiconductor-portfolio/actions/workflows/deploy.yml)
[![Live Portfolio](https://img.shields.io/badge/Live_Site-allenjoe--a.github.io-00D9FF?style=flat&logo=githubpages)](https://allenjoe-a.github.io/semiconductor-portfolio/)
[![GitHub Profile](https://img.shields.io/badge/GitHub-ALLENJOE--A-268BFF?style=flat&logo=github)](https://github.com/ALLENJOE-A)
[![Resume Download](https://img.shields.io/badge/Resume-PDF_Download-00D9FF?style=flat&logo=adobeacrobatreader)](https://allenjoe-a.github.io/semiconductor-portfolio/resume.pdf)

Personal engineering portfolio of **Allen Joe A**, Bachelor of Technology (B.Tech) in Electronics & VLSI Engineering at the School of Electronics Engineering (SENSE), Vellore Institute of Technology (VIT), Chennai.

Focused on ASIC Physical Design, RTL Microarchitecture, Built-In Self-Test (DFT), TCAD Device Physics, and Computational AI in EDA.

**🌐 Live Site:** [https://allenjoe-a.github.io/semiconductor-portfolio/](https://allenjoe-a.github.io/semiconductor-portfolio/)

---

## 🔬 Featured Engineering Projects

1. **[4-Channel Adaptive Burst DMA Controller](https://github.com/ALLENJOE-A/4-Channel-Adaptive-Burst-DMA-Controller-with-Hardware-Performance-Monitoring)**
   - Pure Verilog RTL DMA engine featuring round-robin channel arbitration, dynamic burst sizing (1, 4, 8, 16-word INCR bursts), and non-intrusive 64-bit performance counters.
   - 6,266 automated self-checking verification checks (0 errors); 5.61% cycle reduction and 50% burst overhead reduction on 512-word transfers.

2. **[Gain-Scheduled All-Digital PLL (GS-ADPLL) & RTL-to-GDS Flow](https://github.com/ALLENJOE-A/Gear-Shifting-All-Digital-Phase-Locked-Loop)**
   - Dual-mode gain-scheduled Digital Loop Filter (DLF) combining rapid acquisition (28 reference cycles) with narrow-bandwidth tracking (0.8–3.1 ps C2C jitter; 91.9% jitter reduction at optimal K=8 knee; 87.5% loop filter activity reduction).
   - Full synthesizable Verilog RTL hierarchy (`adpll_top`, `pfd`, `dlf_top`, `gear_ctrl`, `prop_path`, `integ_path`, `lock_det`, `dco_core`, `div_n`) evaluated through Cadence Genus, Innovus, and Voltus vector power analysis.

3. **[Low-Power 16-Bit MAC BIST Architecture](https://github.com/ALLENJOE-A/Low-Power-MAC-BIST-PPA-Fault-Coverage)**
   - Synthesizable 16-bit Multiply-Accumulate (MAC) datapath evaluated alongside low-transition Built-In Self-Test (BIST) architectures.
   - Synthesized in Cadence Genus 21.1 under 100 MHz constraint; fault simulation in Cadence Incisive achieving 99.8980% stuck-at fault coverage across 1,960 faults.

4. **[GNN-T Edge Error Prediction for Computational Lithography](https://github.com/ALLENJOE-A/GNN-T_Edge-Error-Prediction-for-Computational-Lithography)**
   - E(n)-Equivariant Graph Neural Network (EGNN) and Graph Transformer predicting sub-resolution Edge Placement Errors (EPE) from layout polygon topologies to accelerate Optical Proximity Correction (OPC).

5. **[FE-DGDM-JLTFET Biosensor TCAD](https://github.com/ALLENJOE-A/FE-DGDM-JLTFET-Biosensor-TCAD)**
   - Synopsys Sentaurus TCAD modeling of ferroelectric negative-capacitance junctionless TFET for label-free biomolecular detection ($I_{on} = 0.804\text{ mA}$, $I_{on}/I_{off} = 7.24 \times 10^8$, 18.14% sensitivity).

6. **[DG Source-Pocket Engineered Vertical TFET](https://github.com/ALLENJOE-A/DG-Source-Pocket-Engineered-Vertical-TFET)**
   - Steep subthreshold swing ($34.2\text{ mV/dec}$) device optimization with narrow-bandgap heterojunction source pocket and high-k dielectric stack in Sentaurus TCAD.

7. **[PS-02 Mode-Switching Flight Control PID](https://github.com/ALLENJOE-A/Mode_Switching-Flight_control-Pid_Controller-)**
   - Silicon Dawn VLSI Hackathon Finalist. Cascaded flight PID controller synthesized in Cadence Genus and physically routed in Cadence Innovus closing timing at 50 MHz with zero DRC violations.

8. **[Digital Oscilloscope — STM32F103C8T6](https://github.com/ALLENJOE-A/Digital-Oscilloscope-STM32)**
   - Real-time dual interleaved ADC sampling with continuous DMA streaming to an ILI9341 SPI TFT display.

---

## 🛠️ Architecture & Interactive Features

- **Continuous 3D Exploded Die**: Built with [Three.js](https://threejs.org), deconstructing a sealed BGA package into a nickel lid (laser-etched with `ALLEN JOE A`), gold wire bonds, and SkyWater 130nm metal stack (met5 down to li1) with semiconductor macros (`GS-ADPLL / DLF`, `16-bit MAC BIST`, `4-Ch DMA Controller`, `burst FIFO buffer`).
- **Interactive Technical Demonstrations**:
  - Dynamic DMA burst efficiency visualization (1-word fixed vs. 16-word adaptive).
  - GS-ADPLL gear-shifting acquisition and tracking dynamics readout (tracking mode vs. auto gear-shift vs. baseline fixed).
  - Cycle-accurate simulation waveform viewer based on real Verilog VCD trace data.
  - 8×8 systolic processing element LED wavefront animation.
- **Smooth Scroller**: Powered by [Lenis](https://github.com/darkroomengineering/lenis).
- **Vite & TypeScript Integration**: Optimized production bundling with modern ES modules.

---

## 📜 Credits & Licensing

- **License & Copyright**: Original VLSI designs, RTL architectures, and modifications copyright © 2026 Allen Joe A (MIT License); underlying visual layout scaffolding adapted with attribution from Chinmay Mahananda under GitHub public repository terms (see [`LICENSE`](LICENSE)).
- **3D Engine**: Three.js (MIT License)
- **Smooth Scrolling**: Lenis (MIT License)
- **Typography**: Inter Tight (SIL OFL 1.1) and JetBrains Mono (SIL OFL 1.1)
- **Historical Portraits**:
  - Isaac Newton by Godfrey Kneller (1689, Public Domain)
  - Richard Feynman (1939 MIT yearbook, Public Domain)
  - Edsger W. Dijkstra by Hamilton Richards (CC BY-SA 3.0, Wikimedia Commons)
- **EDA & Tool Logos**: Belong to their respective owners (Cadence, Synopsys, SkyWater, OpenROAD, Python, etc.)
