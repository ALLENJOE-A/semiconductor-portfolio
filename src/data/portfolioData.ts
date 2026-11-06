export interface ProjectItem {
  id: string;
  layerTag: string;
  title: string;
  role: string;
  domain: string;
  summary: string;
  metrics: { label: string; value: string; unit?: string; verified: boolean }[];
  tools: string[];
  repoUrl: string;
  images: { src: string; caption: string; title: string; category: string }[];
  todoNotes?: string[];
}

export const PORTFOLIO_DATA = {
  profile: {
    name: 'Allen Joe A',
    title: 'Electronics & VLSI Semiconductor Engineer',
    institution: 'School of Electronics Engineering, VIT Chennai',
    location: 'Chennai, India',
    github: 'https://github.com/ALLENJOE-A',
    linkedin: 'https://www.linkedin.com/in/allen-joe-a-36069831b/',
    bio: 'From quantum device physics and TCAD simulation to RTL microarchitecture, low-power BIST, and tapeout-ready physical design (RTL-to-GDS).',
    toolbox: [
      'Verilog-2001', 'SystemVerilog', 'VHDL', 'SVA',
      'Cadence Genus', 'Cadence Innovus', 'Synopsys Sentaurus (SDE/SDevice)',
      'Yosys', 'QFLOW', 'SkyWater 130nm', 'LTspice', 'ModelSim / Questa',
      'STM32 HAL', 'ARM Cortex-M', 'Python', 'PyTorch', 'Git', 'Linux'
    ],
  },
  layers: [
    { id: 'substrate', code: 'M0 · SUBSTRATE', title: 'Silicon Foundation & Physics', scroll: 0.05 },
    { id: 'wells', code: 'W · WELLS', title: 'Doping & Quantum Junctions', scroll: 0.18 },
    { id: 'device', code: 'DEV · TCAD', title: 'Sub-60mV Tunnel-FET Devices', scroll: 0.30 },
    { id: 'gate', code: 'G · RTL/BIST', title: 'Digital Architecture & DFT', scroll: 0.46 },
    { id: 'metal', code: 'M1-M4 · GDSII', title: 'ASIC Physical Design & PnR', scroll: 0.62 },
    { id: 'package', code: 'SYS · PACKAGE', title: 'Embedded AI & Edge Hardware', scroll: 0.78 },
    { id: 'tapeout', code: 'PKG · BGA', title: 'Sign-off & Tape-out', scroll: 0.95 },
  ],
  projects: [
    {
      id: 'biosensor-tcad',
      layerTag: 'DEV · DEVICE TCAD',
      title: 'FE-DGDM-JLTFET Biosensor (TCAD)',
      role: 'Research Intern · Center for Nanotechnology and VLSI (CNVD), VIT Chennai',
      domain: 'TCAD Device Physics & Biosensing',
      summary: 'TCAD modeling and sensitivity investigation of a ferroelectric double-gate doping-modulated junctionless tunnel FET (FE-DGDM-JLTFET) for label-free biomolecule detection. Work supervised by Dr. Lakshmi B, co-authored with Asvitha R.',
      metrics: [
        { label: 'ON-Current (Ion)', value: '0.804', unit: 'mA', verified: true },
        { label: 'Ion / Ioff Ratio', value: '7.24 × 10⁸', unit: '@ 30nm', verified: true },
        { label: 'Current Sensitivity', value: '18.137', unit: '% (MDA-MB-231)', verified: true },
        { label: 'Permittivity Sweep', value: '1 to 22', unit: 'K-range', verified: true },
      ],
      tools: ['Synopsys Sentaurus', 'SDE', 'SDevice', 'Inspect', 'Tcl'],
      repoUrl: 'https://github.com/ALLENJOE-A/FE-DGDM-JLTFET-Biosensor-TCAD',
      images: [
        {
          src: './assets/real/biosensor_device_structure.webp',
          title: 'FE-DGDM-JLTFET Device Architecture',
          caption: 'Synopsys Sentaurus 2D/3D structural mesh showing inverted-T nanocavity, ferroelectric oxide, and doping modulation.',
          category: 'TCAD Mesh Architecture'
        },
        {
          src: './assets/real/biosensor_k_sweep.webp',
          title: 'Id-Vgs Transfer Characteristics across K-Sweeps',
          caption: 'Drain current vs. gate voltage showing pronounced threshold shift as biomolecule permittivity sweeps from 1 to 22.',
          category: 'Electrical Characteristics'
        },
        {
          src: './assets/real/biosensor_sensitivity.webp',
          title: 'Sensitivity Comparison under Fixed Surface Charge',
          caption: 'Comparative current sensitivity under neutral vs. charged biomolecule scenarios confirming label-free biosensing efficiency.',
          category: 'Sensitivity Analysis'
        }
      ]
    },
    {
      id: 'vtfet-tcad',
      layerTag: 'DEV · BEYOND-CMOS',
      title: 'DG Source-Pocket-Engineered Vertical TFET',
      role: 'Author & Device Designer',
      domain: 'Quantum Band-to-Band Tunneling (BTBT)',
      summary: 'Optimization of a Double-Gate Vertical Tunnel-FET integrating a p⁺-GaSb source, 5nm heavily n⁺-doped GaAsSb pocket, and heterogeneous high-k dielectric stack (HfO₂ + SiO₂) simulated in Sentaurus TCAD with non-local Hurkx BTBT physics.',
      metrics: [
        { label: 'ON-Current Boost', value: '344×', unit: 'vs. baseline', verified: true },
        { label: 'Subthreshold Swing', value: '34.2', unit: 'mV/dec (sub-60mV)', verified: true },
        { label: 'OFF-Current (Ioff)', value: '1.25 × 10⁻¹⁵', unit: 'A (sub-fA)', verified: true },
        { label: 'Switching Ratio', value: '5.92 × 10⁸', unit: '', verified: true },
      ],
      tools: ['Sentaurus TCAD', 'SDE', 'SDevice', '128-bit Math'],
      repoUrl: 'https://github.com/ALLENJOE-A/DG-Source-Pocket-Engineered-Vertical-TFET',
      images: [
        {
          src: './assets/real/vtfet_device_structure.webp',
          title: 'Pocket-Engineered Vertical TFET Structure',
          caption: 'Heterojunction source-pocket and dual-gate arrangement in Sentaurus TCAD.',
          category: 'Device Physics'
        },
        {
          src: './assets/real/vtfet_energy_band.webp',
          title: 'Energy Band Alignment under Bias',
          caption: 'Conduction and valence band profiles showing the quantum tunneling window established by the 5nm pocket.',
          category: 'Band Diagram'
        },
        {
          src: './assets/real/vtfet_idvg_comparison.webp',
          title: 'Id-Vg Characteristic: 34,318% Current Gain',
          caption: 'Transfer curve comparison confirming steep subthreshold slope below the Boltzmann 60 mV/dec limit.',
          category: 'Transfer Curve'
        }
      ]
    },
    {
      id: 'mac-bist',
      layerTag: 'G · RTL & DFT',
      title: 'Low-Power Built-In Self-Test (BIST) for 16-bit MAC',
      role: 'RTL & DFT Architect',
      domain: 'ASIC Verification & DFT',
      summary: 'Comparative evaluation of six synthesizable 16-bit MAC BIST architectures synthesized in Cadence Genus 21.1 under 100 MHz timing constraint, with stuck-at fault injection in Cadence Incisive across 1960 faults.',
      metrics: [
        { label: 'Fault Coverage', value: '99.8980', unit: '%', verified: true },
        { label: 'Total Injected Faults', value: '1,960', unit: 'stuck-at faults', verified: true },
        { label: 'Target Frequency', value: '100', unit: 'MHz (closed)', verified: true },
        { label: 'Architectures Evaluated', value: '6', unit: 'BIST variants', verified: true },
      ],
      tools: ['Verilog-2001', 'Cadence Genus 21.1', 'Cadence Incisive', 'ModelSim'],
      repoUrl: 'https://github.com/ALLENJOE-A/Low-Power-MAC-BIST-PPA-Fault-Coverage',
      images: [
        {
          src: './assets/real/mac_16_genus_schematic.webp',
          title: 'Cadence Genus 21.1 Synthesized Schematic',
          caption: 'Gate-level schematic mapping 16-bit MAC datapath and low-power control circuitry.',
          category: 'Synthesis Schematic'
        },
        {
          src: './assets/real/fault_coverage_summary.webp',
          title: 'Fault Coverage Summary Log',
          caption: 'Cadence Incisive stuck-at fault simulation terminal run confirming 99.8980% fault coverage.',
          category: 'DFT Fault Simulation'
        },
        {
          src: './assets/real/ppa_comparison_table.webp',
          title: 'BIST PPA Trade-Off Matrix',
          caption: 'Quantitative power, performance, and area evaluation across candidate BIST architectures.',
          category: 'PPA Benchmark'
        }
      ]
    },
    {
      id: 'pid-flight-controller',
      layerTag: 'M1-M4 · PHYSICAL DESIGN',
      title: 'PS-02 Mode-Switching Hardware PID Controller',
      role: 'VLSI Hackathon Finalist · Sudarshana Semiconductors PS-02',
      domain: 'RTL-to-GDS Physical Design',
      summary: 'Dual-loop cascaded attitude and angular rate quadcopter flight controller in Q8.8 fixed-point arithmetic with Acro, Stabilize, Altitude Hold, and Failsafe modes. Synthesized in Cadence Genus and physically implemented in Cadence Innovus.',
      metrics: [
        { label: 'Core Area', value: '446.31 × 444.28', unit: 'µm', verified: true },
        { label: 'Operating Frequency', value: '50', unit: 'MHz (closed)', verified: true },
        { label: 'DRC Violations', value: '0', unit: 'clean', verified: true },
        { label: 'Connectivity Violations', value: '0', unit: 'clean', verified: true },
      ],
      tools: ['Verilog-2001', 'Cadence Genus', 'Cadence Innovus', 'NanoRoute', 'Q8.8 Fixed-Point'],
      repoUrl: 'https://github.com/ALLENJOE-A/Mode_Switching-Flight_control-Pid_Controller-',
      images: [
        {
          src: './assets/real/pid_final_layout.webp',
          title: 'Full Core GDSII Layout with Fillers',
          caption: 'Cadence Innovus final physical layout showing power mesh, standard cell rows, and clock distribution.',
          category: 'Cadence Innovus P&R'
        },
        {
          src: './assets/real/pid_drc_clean.webp',
          title: 'DRC Verification Clean Report',
          caption: 'Sign-off verification log verifying zero DRC and zero connectivity errors across 446.31 × 444.28 µm die.',
          category: 'Sign-off Verification'
        },
        {
          src: './assets/real/pid_cts.webp',
          title: 'Clock Tree Synthesis (CTS) Visualization',
          caption: 'Post-CTS clock skew and delay distribution across cascaded PID processing elements.',
          category: 'Clock Tree Synthesis'
        }
      ]
    },
    {
      id: 'maven-internship',
      layerTag: 'M1-M4 · ASIC FLOW',
      title: 'Maven Silicon Physical Design Internship',
      role: 'VLSI Physical Design Intern · May 2026',
      domain: 'Open-Source EDA & Standard Cell ASIC',
      summary: 'ASIC implementation flow utilizing Yosys synthesis for counter and carry-lookahead adders targeting SkyWater 130nm standard cell libraries, alongside complete SPI peripheral physical design with QFLOW (OSU018).',
      metrics: [
        { label: 'Foundry Process', value: 'SkyWater 130nm', unit: '& OSU018', verified: true },
        { label: 'Synthesis Engine', value: 'Yosys Open EDA', unit: '', verified: true },
        { label: 'PnR Toolchain', value: 'QFLOW / OpenROAD', unit: '', verified: true },
      ],
      tools: ['Yosys', 'Sky130', 'QFLOW', 'OSU018', 'Magic VLSI', 'Linux'],
      repoUrl: 'https://github.com/ALLENJOE-A',
      images: [],
      todoNotes: ['TODO: Upload QFLOW SPI final layout screenshot to assets/real/maven_silicon_gds.png']
    },
    {
      id: 'speaker-diarization',
      layerTag: 'SYS · EMBEDDED AI',
      title: 'Real-Time Speaker Diarization on Raspberry Pi 5',
      role: 'B.Tech Thesis Project · Guide: Prof. Mohammed Aarif K O',
      domain: 'Edge AI & Audio DSP',
      summary: 'Edge hardware deployment of a real-time speaker diarization and identification pipeline using Raspberry Pi 5, USB microphone array, 3.5" 480x320 LCD touchscreen, Python, CustomTkinter, and SpeechBrain ECAPA-TDNN embeddings.',
      metrics: [
        { label: 'Target Platform', value: 'Raspberry Pi 5', unit: 'ARM Cortex-A76', verified: true },
        { label: 'Acoustic Model', value: 'ECAPA-TDNN', unit: 'SpeechBrain', verified: true },
        { label: 'Interface', value: '3.5" 480×320', unit: 'CustomTkinter', verified: true },
      ],
      tools: ['Python', 'SpeechBrain', 'CustomTkinter', 'Raspberry Pi 5', 'Linux ALSA'],
      repoUrl: 'https://github.com/ALLENJOE-A/speaker-diarization-pi5',
      images: [],
      todoNotes: ['TODO: Supply photograph of physical Raspberry Pi 5 hardware with USB mic array and 3.5" LCD module.']
    },
    {
      id: 'gnn-litho',
      layerTag: 'SYS · COMPUTATIONAL EDA',
      title: 'GNN-T Edge Error Prediction for Computational Lithography',
      role: 'Research Prototype',
      domain: 'Geometric Deep Learning in EDA',
      summary: 'E(n)-Equivariant Graph Neural Network (EGNN) combined with a scalar graph transformer and five decoupled prediction heads to forecast Edge Placement Errors (EPE) from layout graph topologies.',
      metrics: [
        { label: 'Architecture', value: 'EGNN + Transformer', unit: 'Equivariant', verified: true },
        { label: 'Prediction Heads', value: '5 Decoupled', unit: 'Multi-Task', verified: true },
        { label: 'Loss Formulation', value: 'Homoscedastic', unit: 'Uncertainty-Weighted', verified: true },
      ],
      tools: ['PyTorch', 'PyTorch Geometric', 'EGNN', 'Python', 'EDA Lithography'],
      repoUrl: 'https://github.com/ALLENJOE-A/GNN-T_Edge-Error-Prediction-for-Computational-Lithography',
      images: [
        {
          src: './assets/real/gnn_model_layers.webp',
          title: 'GNN-T Geometric Deep Learning Architecture',
          caption: 'Equivariant graph learning pipeline linking polygon nodes and transformer self-attention.',
          category: 'Model Architecture'
        },
        {
          src: './assets/real/gnn_model_comparison.webp',
          title: 'Multi-Task Convergence Comparison',
          caption: 'Training convergence across decoupled prediction heads with uncertainty weighting.',
          category: 'Training Metrics'
        }
      ]
    },
    {
      id: 'stm32-oscilloscope',
      layerTag: 'SYS · EMBEDDED HARDWARE',
      title: 'Digital Oscilloscope — STM32F103C8T6',
      role: 'Firmware & Hardware Designer',
      domain: 'Real-Time Embedded Systems',
      summary: 'Dual interleaved high-speed ADC sampling with DMA continuous circular buffer streaming to an ILI9341 320×240 SPI TFT display with trigger detection and real-time waveform visualization.',
      metrics: [
        { label: 'Microcontroller', value: 'STM32F103C8T6', unit: 'ARM Cortex-M3', verified: true },
        { label: 'Sampling Mode', value: 'Dual ADC + DMA', unit: 'Circular Buffer', verified: true },
        { label: 'Display Driver', value: 'ILI9341 320×240', unit: 'High-speed SPI', verified: true },
      ],
      tools: ['C Firmware', 'STM32CubeIDE', 'HAL', 'DMA Engine', 'ILI9341'],
      repoUrl: 'https://github.com/ALLENJOE-A/Digital-Oscilloscope-STM32',
      images: [
        {
          src: './assets/real/stm32_oscilloscope.webp',
          title: 'Real Hardware Oscilloscope Capture',
          caption: 'Real-time square-wave capture running on STM32F103C8T6 hardware with ILI9341 TFT display.',
          category: 'Hardware Photograph'
        }
      ]
    }
  ],
  timeline: [
    {
      year: '2023 – 2027',
      title: 'B.Tech in Electronics & VLSI Engineering',
      institution: 'School of Electronics Engineering (SENSE), VIT Chennai',
      description: 'Specialization in ASIC Physical Design, RTL Architecture, Device Physics, and Embedded Systems.',
      badge: 'EDUCATION'
    },
    {
      year: 'May – Jul 2026',
      title: 'Research Intern · TCAD Biosensor Modeling',
      institution: 'Center for Nanotechnology & VLSI (CNVD), VIT Chennai',
      description: 'Synopsys Sentaurus TCAD modeling and sensitivity analysis of FE-DGDM-JLTFET for MDA-MB-231 breast cancer detection under Dr. Lakshmi B.',
      badge: 'RESEARCH'
    },
    {
      year: 'May 2026',
      title: 'VLSI Physical Design Internship',
      institution: 'Maven Silicon',
      description: 'Yosys synthesis for arithmetic datapaths on SkyWater 130nm and QFLOW RTL-to-GDS physical design.',
      badge: 'INDUSTRY'
    },
    {
      year: '2026',
      title: 'Silicon Dawn VLSI Hackathon Finalist (PS-02)',
      institution: 'Sudarshana Semiconductors & VIT Chennai',
      description: 'Cadence Genus RTL-to-GDS physical design of Mode-Switching Flight Control PID closing timing at 50 MHz with zero DRC violations.',
      badge: 'HACKATHON'
    }
  ]
};
