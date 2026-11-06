export class CustomCursor {
  private cursorEl!: HTMLElement;
  private dotEl!: HTMLElement;
  private mouseX = -100;
  private mouseY = -100;
  private curX = -100;
  private curY = -100;
  private isHovered = false;

  constructor() {
    // Check if device supports fine hover
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    this.cursorEl = document.createElement('div');
    this.cursorEl.className = 'cinematic-cursor-ring';

    this.dotEl = document.createElement('div');
    this.dotEl.className = 'cinematic-cursor-dot';

    document.body.appendChild(this.cursorEl);
    document.body.appendChild(this.dotEl);

    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    this.setupHoverTriggers();
    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
  }

  public setupHoverTriggers() {
    const targets = document.querySelectorAll('a, button, .interactive, .glass-card, [data-lightbox]');
    targets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        this.isHovered = true;
        this.cursorEl.classList.add('cursor-crosshair');
      });
      target.addEventListener('mouseleave', () => {
        this.isHovered = false;
        this.cursorEl.classList.remove('cursor-crosshair');
      });
    });
  }

  private render() {
    const factor = 0.2;
    this.curX += (this.mouseX - this.curX) * factor;
    this.curY += (this.mouseY - this.curY) * factor;

    this.dotEl.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0)`;
    this.cursorEl.style.transform = `translate3d(${this.curX}px, ${this.curY}px, 0) scale(${this.isHovered ? 1.8 : 1.0})`;

    requestAnimationFrame(this.render);
  }
}
