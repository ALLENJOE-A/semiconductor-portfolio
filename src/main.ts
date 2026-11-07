/**
 * Allen Joe A — Semiconductor & VLSI Engineering Portfolio
 * Production Application Entry Point (TypeScript / Vite)
 */

document.addEventListener('DOMContentLoaded', () => {
  const dieCanvas = document.getElementById('die') as HTMLCanvasElement | null;
  const timingDemo = document.getElementById('timing');
  const dmaDemo = document.getElementById('block');

  if (import.meta.env.DEV) {
    console.log('[VLSI Portfolio] Initialized in development mode.');
    console.log('[VLSI Portfolio] 3D Die Canvas:', dieCanvas ? 'Ready' : 'Pending');
    console.log('[VLSI Portfolio] GS-ADPLL Timing Demo:', timingDemo ? 'Ready' : 'Pending');
    console.log('[VLSI Portfolio] DMA Burst Demo:', dmaDemo ? 'Ready' : 'Pending');
  }
});

export {};
