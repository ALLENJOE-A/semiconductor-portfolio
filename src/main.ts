import { Experience } from './webgl/Experience';
import { Lightbox } from './ui/Lightbox';
import { CustomCursor } from './ui/CustomCursor';
import { OverlayController } from './ui/OverlayController';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
  const preloader = document.getElementById('preloader') as HTMLElement;
  const preloaderMsg = document.getElementById('preloader-msg') as HTMLElement;

  if (!canvas) {
    console.error('WebGL canvas not found in DOM.');
    if (preloader) preloader.classList.add('hidden');
    return;
  }

  let experience: Experience | null = null;
  let lightbox: Lightbox | null = null;
  let customCursor: CustomCursor | null = null;

  try {
    experience = new Experience(canvas);
    lightbox = new Lightbox();
    customCursor = new CustomCursor();
    const overlayController = new OverlayController(experience, lightbox);
    (window as unknown as { __overlayController: OverlayController }).__overlayController = overlayController;
  } catch (err) {
    console.warn('WebGL initialization fallback to static view:', err);
    if (preloader) preloader.classList.add('hidden');
    return;
  }

  // Preloader sequence (completes in ~1.6s, well under 2.0s requirement)
  const steps = [
    { pct: 0.25, msg: 'Growing crystalline ingot boule...' },
    { pct: 0.55, msg: 'Slicing & polishing 300mm wafer...' },
    { pct: 0.85, msg: 'Exposing photolithography reticle...' },
    { pct: 1.00, msg: 'Die liftoff & initialization complete.' },
  ];

  let currentStep = 0;
  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      const s = steps[currentStep];
      if (preloaderMsg) preloaderMsg.textContent = s.msg;
      if (experience) experience.waferLoader.setProgress(s.pct);
      currentStep++;
    } else {
      clearInterval(interval);
      if (experience) experience.completeLoader();
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('hidden');
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 800);
        }
        if (customCursor) customCursor.setupHoverTriggers();
      }, 500);
    }
  }, 350);
});
