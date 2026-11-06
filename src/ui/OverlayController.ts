import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Experience } from '../webgl/Experience';
import { Lightbox } from './Lightbox';
import { PORTFOLIO_DATA } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export class OverlayController {
  private experience: Experience;
  private lightbox: Lightbox;
  private lenis: Lenis;
  private layerButtons: HTMLElement[] = [];
  private activeSectionIndex = 0;

  constructor(experience: Experience, lightbox: Lightbox) {
    this.experience = experience;
    this.lightbox = lightbox;

    // 1. Initialize Lenis Smooth Scroll
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Setup Scroll Scrubbing for Continuous 3D Journey
    this.initScrollScrub();

    // 3. Setup Layer Rail Interactive Clicks
    this.initLayerRail();

    // 4. Setup Lightbox Triggers for all real project figures
    this.initLightboxTriggers();

    // 5. Setup Animated Stats Counters
    this.initStatsCounters();
  }

  private initScrollScrub() {
    const scrollTrack = document.querySelector('.scroll-track');
    if (!scrollTrack) return;

    ScrollTrigger.create({
      trigger: scrollTrack,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.0, // Smooth buttery scrub
      onUpdate: (self) => {
        const p = self.progress;
        this.experience.setScrollProgress(p);
        this.updateActiveLayerRail(p);
      },
    });
  }

  private initLayerRail() {
    this.layerButtons = Array.from(document.querySelectorAll('.layer-rail-item'));
    this.layerButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const targetScroll = PORTFOLIO_DATA.layers[index]?.scroll || (index / this.layerButtons.length);
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        this.lenis.scrollTo(targetScroll * maxScroll, { duration: 1.6 });
      });
    });
  }

  private updateActiveLayerRail(progress: number) {
    // Find closest layer threshold
    let activeIdx = 0;
    for (let i = 0; i < PORTFOLIO_DATA.layers.length; i++) {
      if (progress >= (PORTFOLIO_DATA.layers[i].scroll - 0.05)) {
        activeIdx = i;
      }
    }
    if (activeIdx !== this.activeSectionIndex) {
      this.activeSectionIndex = activeIdx;
      this.layerButtons.forEach((btn, i) => {
        if (i === activeIdx) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  private initLightboxTriggers() {
    const triggerCards = document.querySelectorAll('[data-lightbox-src]');
    triggerCards.forEach((card) => {
      card.addEventListener('click', () => {
        const src = card.getAttribute('data-lightbox-src') || '';
        const title = card.getAttribute('data-lightbox-title') || 'Technical Diagram';
        const caption = card.getAttribute('data-lightbox-caption') || '';
        const category = card.getAttribute('data-lightbox-category') || 'EVIDENCE';
        const repoUrl = card.getAttribute('data-lightbox-repo') || undefined;

        this.lightbox.open({ src, title, caption, category, repoUrl });
      });
    });
  }

  private initStatsCounters() {
    // Animate stats numbers when they enter viewport
    const statElements = document.querySelectorAll('.stat-value[data-count]');
    statElements.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const raw = el.getAttribute('data-count') || '0';
          const targetNum = parseFloat(raw.replace(/,/g, ''));
          if (!isNaN(targetNum)) {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: targetNum,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                if (raw.includes('.')) {
                  el.textContent = obj.val.toFixed(raw.split('.')[1].length);
                } else if (raw.includes(',')) {
                  el.textContent = Math.floor(obj.val).toLocaleString();
                } else {
                  el.textContent = Math.floor(obj.val).toString();
                }
              },
            });
          }
        },
      });
    });
  }
}
