export interface LightboxData {
  src: string;
  title: string;
  caption: string;
  category: string;
  repoUrl?: string;
}

export class Lightbox {
  private dialog: HTMLDialogElement;
  private imgEl: HTMLImageElement;
  private titleEl: HTMLElement;
  private captionEl: HTMLElement;
  private categoryEl: HTMLElement;
  private repoLink: HTMLAnchorElement;

  constructor() {
    // Create native <dialog> conforming to Modern Web Guidance
    this.dialog = document.createElement('dialog');
    this.dialog.id = 'portfolio-lightbox';
    this.dialog.setAttribute('aria-labelledby', 'lightbox-title');
    this.dialog.className = 'cinematic-lightbox';

    this.dialog.innerHTML = `
      <div class="lightbox-shell">
        <header class="lightbox-header">
          <div class="lightbox-meta">
            <span class="lightbox-layer-badge" id="lightbox-category">EVIDENCE · VERIFIED</span>
            <h2 id="lightbox-title" class="lightbox-title">Asset Inspection</h2>
          </div>
          <button type="button" class="lightbox-close-btn" aria-label="Close modal dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        <div class="lightbox-media-container">
          <img id="lightbox-img" src="" alt="Technical project schematic" class="lightbox-image" />
        </div>
        <footer class="lightbox-footer">
          <p id="lightbox-caption" class="lightbox-caption"></p>
          <a id="lightbox-repo" href="#" target="_blank" rel="noopener noreferrer" class="lightbox-repo-btn">
            View Source Repository &rarr;
          </a>
        </footer>
      </div>
    `;

    document.body.appendChild(this.dialog);

    this.imgEl = this.dialog.querySelector('#lightbox-img')!;
    this.titleEl = this.dialog.querySelector('#lightbox-title')!;
    this.captionEl = this.dialog.querySelector('#lightbox-caption')!;
    this.categoryEl = this.dialog.querySelector('#lightbox-category')!;
    this.repoLink = this.dialog.querySelector('#lightbox-repo')!;

    const closeBtn = this.dialog.querySelector('.lightbox-close-btn')!;
    closeBtn.addEventListener('click', () => this.close());

    // Light-dismiss: click on backdrop dismisses dialog
    this.dialog.addEventListener('click', (event) => {
      const rect = this.dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        this.close();
      }
    });

    // Close on Escape key is automatically handled by native <dialog>
  }

  public open(data: LightboxData) {
    this.imgEl.src = data.src;
    this.imgEl.alt = data.title;
    this.titleEl.textContent = data.title;
    this.captionEl.textContent = data.caption;
    this.categoryEl.textContent = data.category.toUpperCase();

    if (data.repoUrl) {
      this.repoLink.href = data.repoUrl;
      this.repoLink.style.display = 'inline-flex';
    } else {
      this.repoLink.style.display = 'none';
    }

    this.dialog.showModal();
  }

  public close() {
    this.dialog.close();
  }
}
