# Real Project Evidence Assets

This directory contains verified, non-simulated/real engineering assets extracted directly from Allen Joe A's repositories.

## Verified Assets Present
1. **TCAD Biosensor (FE-DGDM-JLTFET)**:
   - `biosensor_device_structure.png`: Cross-sectional TCAD device architecture schematic with dual gate, inverted-T nanocavity, and doping regions.
   - `biosensor_k_sweep.png`: Transfer characteristics ($I_d-V_{gs}$) under dielectric constant sweeps ($K = 1$ to $22$).
   - `biosensor_sensitivity.png`: Current sensitivity analysis comparing neutral vs. fixed biomolecule charge.

2. **Pocket-Engineered Vertical TFET**:
   - `vtfet_device_structure.png`: Synopsys Sentaurus 2D mesh and structural definition (GaSb source, GaAsSb pocket, GaAs channel).
   - `vtfet_energy_band.png`: Conduction and valence energy band diagrams under off/on biasing showing quantum band-to-band tunneling (BTBT).
   - `vtfet_idvg_comparison.png`: Transfer characteristics proving 344x ON-current boost ($7.40 \times 10^{-7}\text{ A}$) and sub-fA OFF-current.

3. **Low-Power 16-bit MAC BIST**:
   - `mac_16_genus_schematic.jpeg`: Cadence Genus 21.1 mapped gate-level schematic.
   - `full_bist_schematic.png`: Synthesized full BIST top-level schematic with LFSR, MISR, and Controller FSM.
   - `fault_coverage_summary.png`: Cadence Incisive stuck-at fault injection report showing 99.8980% fault coverage.
   - `ppa_comparison_table.png`: Quantitative PPA trade-off table across all six evaluated BIST architectures.

4. **PS-02 Mode-Switching Flight Control PID**:
   - `pid_placement.png`: Cadence Innovus standard cell floorplan and initial placement.
   - `pid_cts.png`: Clock Tree Synthesis (CTS) routing and clock skew visualization.
   - `pid_routing.png`: NanoRoute detailed multi-layer copper interconnect routing in progress.
   - `pid_final_layout.png`: Complete GDSII layout with filler cells and power mesh.
   - `pid_drc_clean.png`: Verification summary confirming zero DRC and zero connectivity violations.

5. **AI in EDA (GNN-T Computational Lithography)**:
   - `gnn_model_layers.jpg`: Equivariant GNN + Transformer deep learning architecture diagram.
   - `gnn_model_comparison.png`: Convergence and multi-task loss comparison curves.

6. **Gain-Scheduled ADPLL (GS-ADPLL)**:
   - `adpll_architecture.png`: Top-level FSM gear-shifting and dual-mode digital loop filter architecture schematic.
   - `adpll_jitter_comparison.png`: Cadence Incisive measured cycle-to-cycle jitter comparing baseline ($K=1$) vs. gear-shifted tracking ($K=8$, 91.9% jitter reduction).

7. **Embedded Systems (Digital Oscilloscope)**:
   - `stm32_oscilloscope.jpeg`: Real hardware photograph of the STM32F103C8T6 driving the ILI9341 320x240 TFT display with real-time square-wave capture.

## Assets Under Lab Measurement
- `rpi5_diarization_hardware.jpg`: Photo of Raspberry Pi 5 with USB mic array and 3.5" 480x320 LCD displaying the CustomTkinter UI.
