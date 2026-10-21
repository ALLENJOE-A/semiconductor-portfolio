// ============================================================
// PROJECT DATA — Central typed data store
// All project descriptions are built from this file.
// Evidence categories: A=Source-verified B=Test-verified
//   C=Reported-result D=Illustrative E=Planned/Incomplete
// ============================================================

export type EvidenceCategory = 'A' | 'B' | 'C' | 'D' | 'E';

export type ProjectStatus =
  | 'Completed'
  | 'In-progress'
  | 'Research-prototype'
  | 'Under-validation'
  | 'Planned';

export type ProjectCategory =
  | 'Digital Design & RTL'
  | 'ASIC & VLSI'
  | 'Semiconductor Devices & TCAD'
  | 'AI for Semiconductor Engineering'
  | 'Embedded Systems'
  | 'Verification & Testing';

export interface TechClaim {
  claim: string;
  value?: string;
  unit?: string;
  conditions?: string;
  sourceFile?: string;
  evidenceCategory: EvidenceCategory;
}

export interface ProjectFigure {
  src: string;
  caption: string;
  alt: string;
}

export interface Project {
  id: string;
  title: string;
  shortTitle: string;
  status: ProjectStatus;
  featured: boolean;
  featuredOrder?: number;
  category: ProjectCategory[];
  repoUrl: string;
  liveUrl?: string;
  summary: string;
  problem: string;
  motivation: string;
  architecture: string;
  methodology: string;
  tools: string[];
  claims: TechClaim[];
  figures: ProjectFigure[];
  tags: string[];
  accentColor: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'dma-controller',
    title: '4-Channel Adaptive Burst DMA Controller with Hardware Performance Monitoring',
    shortTitle: 'Adaptive Burst DMA',
    status: 'Completed',
    featured: true,
    featuredOrder: 1,
    category: ['Digital Design & RTL', 'Verification & Testing'],
    repoUrl: 'https://github.com/ALLENJOE-A/4-Channel-Adaptive-Burst-DMA-Controller-with-Hardware-Performance-Monitoring',
    summary:
      'A 4-channel direct memory access controller implementing an adaptive burst strategy with hardware performance counters, verified through a comprehensive SystemVerilog testbench.',
    problem:
      'Fixed-burst DMA controllers waste bus bandwidth on transfers shorter than the configured burst length, incurring unnecessary overhead cycles.',
    motivation:
      'Investigate an adaptive burst strategy that adjusts burst size at runtime based on transfer length, reducing cycle overhead for smaller transfers while preserving throughput for larger ones.',
    architecture:
      'Four independent DMA channels with descriptor-based operation, a centralised priority arbiter, adaptive burst-size logic that scales burst length with transfer size, and dedicated hardware performance counters per channel.',
    methodology:
      'RTL implemented in SystemVerilog. Functional simulation performed with a self-checking testbench that compares adaptive and baseline configurations across five transfer sizes (32–512 words). Performance counters capture cycle counts for direct comparison.',
    tools: ['SystemVerilog', 'Verilog', 'ModelSim / Questa', 'Git'],
    claims: [
      {
        claim: 'Cycle reduction — 512-word transfer',
        value: '5.61',
        unit: '%',
        conditions: 'Adaptive vs. fixed-burst baseline; 512-word simulated transfer',
        sourceFile: 'README.md',
        evidenceCategory: 'C',
      },
      {
        claim: 'Burst count reduction — 512-word transfer',
        value: '50',
        unit: '%',
        conditions: 'Adaptive vs. fixed-burst baseline; 512-word simulated transfer',
        sourceFile: 'README.md',
        evidenceCategory: 'C',
      },
      {
        claim: 'Total verification checks',
        value: '6,266',
        unit: 'checks',
        conditions: 'Full testbench run',
        sourceFile: 'README.md',
        evidenceCategory: 'C',
      },
      {
        claim: 'Explicit PASS assertions',
        value: '964',
        unit: 'assertions',
        conditions: 'Full testbench run',
        sourceFile: 'README.md',
        evidenceCategory: 'C',
      },
      {
        claim: 'Reported failures / errors',
        value: '0',
        unit: '',
        conditions: 'Full testbench run',
        sourceFile: 'README.md',
        evidenceCategory: 'C',
      },
    ],
    figures: [],
    tags: ['SystemVerilog', 'DMA', 'RTL', 'Burst', 'Verification', 'AMBA', 'Simulation'],
    accentColor: '#2E7BFF',
  },
  {
    id: 'jltfet-biosensor',
    title: 'FE-DGDM-JLTFET Biosensor TCAD',
    shortTitle: 'JLTFET Biosensor',
    status: 'Research-prototype',
    featured: true,
    featuredOrder: 2,
    category: ['Semiconductor Devices & TCAD'],
    repoUrl: 'https://github.com/ALLENJOE-A/FE-DGDM-JLTFET-Biosensor-TCAD',
    summary:
      'TCAD investigation of a ferroelectric double-gate doping-modulated junctionless tunnel FET designed for biosensing applications.',
    problem:
      'Conventional biosensors based on MOSFETs face fundamental sensitivity limits imposed by the 60 mV/dec Boltzmann constraint. Tunnel FETs offer sub-threshold slopes below this limit, making them attractive for ultra-sensitive detection.',
    motivation:
      'Explore the combined effect of ferroelectric gate integration and doping modulation on a junctionless TFET architecture for label-free biosensing using TCAD.',
    architecture:
      'Double-gate junctionless structure with ferroelectric gate dielectric and doping-modulated channel, simulated using the Sentaurus TCAD suite (SDE for geometry, SDevice for physics).',
    methodology:
      'Device geometry and doping profiles defined in SDE Tcl decks. Physics models configured in SDevice including band-to-band tunnelling, trap-assisted tunnelling, and ferroelectric polarisation. Parameter sweeps performed across gate voltage and dielectric fill scenarios.',
    tools: ['Sentaurus TCAD', 'SDE', 'SDevice', 'Tcl', 'Python', 'Git'],
    claims: [],
    figures: [],
    tags: ['TCAD', 'JLTFET', 'Biosensor', 'Ferroelectric', 'Tunnel FET', 'Sentaurus', 'Device Simulation'],
    accentColor: '#5CE1E6',
  },
  {
    id: 'gnn-lithography',
    title: 'GNN-T Edge Error Prediction for Computational Lithography',
    shortTitle: 'GNN Lithography',
    status: 'In-progress',
    featured: true,
    featuredOrder: 3,
    category: ['AI for Semiconductor Engineering'],
    repoUrl: 'https://github.com/ALLENJOE-A/GNN-T_Edge-Error-Prediction-for-Computational-Lithography',
    summary:
      'Graph neural network approach to predicting edge-placement errors in lithographic patterning, targeting faster alternatives to full optical proximity correction simulation.',
    problem:
      'Full-chip optical proximity correction and lithographic process simulation are computationally expensive. Data-driven surrogate models can accelerate edge-error prediction during early layout verification.',
    motivation:
      'Represent layout geometry as a graph and train a transformer-augmented GNN to predict edge-placement errors, reducing dependence on expensive full-wave simulation.',
    architecture:
      'Layout patterns are converted to graph representations where nodes correspond to polygon edges and edges encode spatial proximity. A GNN with transformer attention layers performs edge-error regression.',
    methodology:
      'Graph construction from layout data, feature extraction, model training and evaluation. Implementation status is in progress; reported metrics will be added once training is validated.',
    tools: ['Python', 'PyTorch', 'PyTorch Geometric', 'NumPy', 'Git'],
    claims: [],
    figures: [],
    tags: ['GNN', 'Lithography', 'EDA', 'Edge Placement Error', 'Machine Learning', 'PyTorch'],
    accentColor: '#C88752',
  },
  {
    id: 'cnn-hotspot',
    title: 'CNN-Driven Explainable AI for Lithography Hotspot Detection',
    shortTitle: 'XAI Hotspot Detection',
    status: 'In-progress',
    featured: false,
    category: ['AI for Semiconductor Engineering'],
    repoUrl: 'https://github.com/ALLENJOE-A/CNN-Driven-Explainable-AI-for-Lithography-Hotspot-Detection',
    summary:
      'CNN-based classifier for lithographic hotspot detection augmented with explainability analysis to understand and validate model decisions.',
    problem:
      'Lithographic hotspots cause yield loss if identified late in the design flow. Automated classification combined with explainability helps engineers understand which layout features drive predictions.',
    motivation:
      'Combine a convolutional classifier with gradient-based explainability to produce both hotspot predictions and spatial attributions that can be related back to layout geometry.',
    architecture:
      'Convolutional neural network classifier trained on layout pattern images. Grad-CAM and saliency-based methods applied post-training to attribute predictions to input regions.',
    methodology:
      'Image-based layout representation, CNN training and evaluation, explainability pipeline. Implementation in progress; quantitative results pending validation.',
    tools: ['Python', 'PyTorch', 'Grad-CAM', 'NumPy', 'Git'],
    claims: [],
    figures: [],
    tags: ['CNN', 'XAI', 'Grad-CAM', 'Lithography', 'Hotspot Detection', 'EDA'],
    accentColor: '#5CE1E6',
  },
  {
    id: 'pe-array-cnn',
    title: 'Efficient Processing Element Array for CNN Accelerator',
    shortTitle: 'CNN PE Array',
    status: 'In-progress',
    featured: false,
    category: ['Digital Design & RTL', 'ASIC & VLSI'],
    repoUrl: 'https://github.com/ALLENJOE-A/DESIGN-AND-IMPLEMENTATION-OF-EFFICIENT-PROCESSING-ELEMENT-ARRAY-FOR-CNN-ACCELERATOR',
    summary:
      'RTL design and implementation of a scalable processing element array targeting efficient convolution for CNN inference acceleration.',
    problem:
      'CNN inference on resource-constrained hardware demands high arithmetic density with minimal area and power overhead.',
    motivation:
      'Design a PE array architecture supporting efficient multiply-accumulate dataflow for convolutional workloads, targeting FPGA or ASIC implementation.',
    architecture:
      'Array of processing elements performing multiply-accumulate operations with configurable dataflow. Control logic coordinates weight loading, activation streaming, and output accumulation.',
    methodology:
      'RTL implementation in SystemVerilog/Verilog. Architecture and verification details available in the repository.',
    tools: ['SystemVerilog', 'Verilog', 'Git'],
    claims: [],
    figures: [],
    tags: ['CNN Accelerator', 'PE Array', 'RTL', 'ASIC', 'Digital Design', 'Systolic Array'],
    accentColor: '#2E7BFF',
  },
  {
    id: 'dgsp-vtfet',
    title: 'DG Source-Pocket Engineered Vertical TFET',
    shortTitle: 'DG-SP Vertical TFET',
    status: 'Research-prototype',
    featured: false,
    category: ['Semiconductor Devices & TCAD'],
    repoUrl: 'https://github.com/ALLENJOE-A/DG-Source-Pocket-Engineered-Vertical-TFET',
    summary:
      'TCAD study of a double-gate vertical tunnel FET with source pocket engineering for improved ON-current and subthreshold performance.',
    problem:
      'Vertical TFETs offer compact integration but typically suffer from low drive current. Source pocket engineering can improve tunnelling probability and ON-state current.',
    motivation:
      'Evaluate the effect of source pocket doping on the performance of a double-gate vertical TFET structure through TCAD simulation.',
    architecture:
      'Vertical double-gate TFET with engineered source pocket region simulated in Sentaurus TCAD.',
    methodology:
      'TCAD device simulation with geometry and physics configuration. Details available in the repository.',
    tools: ['Sentaurus TCAD', 'SDE', 'SDevice', 'Tcl', 'Git'],
    claims: [],
    figures: [],
    tags: ['TCAD', 'TFET', 'Vertical Device', 'Source Pocket', 'Double Gate', 'Sentaurus'],
    accentColor: '#5CE1E6',
  },
  {
    id: 'digital-oscilloscope',
    title: 'Digital Oscilloscope — STM32',
    shortTitle: 'STM32 Oscilloscope',
    status: 'Completed',
    featured: false,
    category: ['Embedded Systems'],
    repoUrl: 'https://github.com/ALLENJOE-A/Digital-Oscilloscope-STM32',
    summary:
      'A digital oscilloscope implemented on an STM32 microcontroller with real-time ADC sampling and waveform display.',
    problem:
      'Laboratory oscilloscopes are expensive. An STM32-based implementation demonstrates real-time signal acquisition and display on embedded hardware.',
    motivation:
      'Build a functional signal measurement tool using STM32 ADC peripherals, DMA for data transfer, and a display interface.',
    architecture:
      'STM32 microcontroller with ADC in DMA mode for continuous sampling, signal processing in firmware, and output to a display interface.',
    methodology:
      'Embedded C / HAL-based firmware development. Sampling rate and resolution determined by ADC configuration and clock settings.',
    tools: ['STM32', 'C', 'STM32CubeIDE', 'HAL', 'Git'],
    claims: [],
    figures: [],
    tags: ['STM32', 'Embedded', 'ADC', 'DMA', 'Oscilloscope', 'C Firmware'],
    accentColor: '#C88752',
  },
  {
    id: 'speaker-diarization',
    title: 'Speaker Diarization on Raspberry Pi 5',
    shortTitle: 'Speaker Diarization Pi5',
    status: 'In-progress',
    featured: false,
    category: ['Embedded Systems'],
    repoUrl: 'https://github.com/ALLENJOE-A/speaker-diarization-pi5',
    summary:
      'Speaker diarization pipeline optimised for deployment on a Raspberry Pi 5, targeting real-time or near-real-time "who spoke when" identification.',
    problem:
      'Running speaker diarization on edge hardware is challenging due to memory and compute constraints.',
    motivation:
      'Evaluate feasibility of speaker diarization on the Raspberry Pi 5 using optimised models and inference pipelines.',
    architecture:
      'Audio capture, feature extraction (MFCC / embeddings), speaker segmentation, and clustering pipeline running on ARM-based edge hardware.',
    methodology:
      'Python-based pipeline with embedded deployment optimisations. Implementation in progress.',
    tools: ['Python', 'Raspberry Pi 5', 'pyannote.audio', 'NumPy', 'Git'],
    claims: [],
    figures: [],
    tags: ['Raspberry Pi', 'Speaker Diarization', 'Edge AI', 'Python', 'Audio'],
    accentColor: '#C88752',
  },
];

export const PROFILE = {
  name: 'Allen Joe A',
  headline: 'Electronics & VLSI Engineering Student',
  institution: 'Verify on LinkedIn',
  degree: 'B.E. / B.Tech — Electronics & VLSI Engineering',
  github: 'https://github.com/ALLENJOE-A',
  linkedin: 'https://www.linkedin.com/in/allen-joe-a-36069831b/',
  email: '',
  bio: 'Electronics and VLSI engineering student working at the intersection of semiconductor device physics, digital RTL design, functional verification, computational lithography, AI for EDA, and embedded systems.',
  domains: [
    'Semiconductor Device Modelling',
    'TCAD Simulation',
    'Digital RTL Design',
    'Functional Verification',
    'Computational Lithography',
    'AI for EDA',
    'Embedded Systems',
    'VLSI Physical Design',
  ],
  tools: [
    'SystemVerilog', 'Verilog', 'Python', 'Sentaurus TCAD',
    'PyTorch', 'ModelSim / Questa', 'STM32', 'Three.js', 'Git',
  ],
};

export const BENCHMARK_TABLE = [
  { transferSize: '32 words',  baseline: 160,  adaptive: 160,  reduction: '0%' },
  { transferSize: '64 words',  baseline: 303,  adaptive: 303,  reduction: '0%' },
  { transferSize: '128 words', baseline: 589,  adaptive: 576,  reduction: '2.21%' },
  { transferSize: '256 words', baseline: 1161, adaptive: 1122, reduction: '3.36%' },
  { transferSize: '512 words', baseline: 2318, adaptive: 2188, reduction: '5.61%' },
];
