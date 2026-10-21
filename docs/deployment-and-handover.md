# Deployment & Handover Guide — Semiconductor Portfolio

## 1. Project Overview & Folder Architecture
Located at `D:\3RD YEAR MATERIALS\AGY\semiconductor-portfolio`:
```text
semiconductor-portfolio/
├── docs/
│   └── portfolio-evidence.md    # Evidence categories & verification manifest
├── public/
│   ├── favicon.svg              # Silicon wafer emblem
│   └── models/, figures/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── SiliconWafer.tsx          # Three.js / R3F interactive wafer model
│   │   │   ├── WaferScene.tsx            # WebGL scene with lights, stars & fallbacks
│   │   │   └── WaferToWorldSequence.tsx  # Metaphor transition from Wafer -> Die -> Transistor -> System
│   │   ├── layout/
│   │   │   ├── Footer.tsx & Footer.module.css
│   │   └── navigation/
│   │       ├── Navigation.tsx & Navigation.module.css
│   ├── data/
│   │   └── projects.ts          # Central typed repository of all projects, claims & metadata
│   ├── hooks/
│   │   ├── useReducedMotion.ts  # WCAG prefers-reduced-motion accessibility hook
│   │   ├── useScroll.ts         # Scroll progress tracker
│   │   └── useWebGL.ts          # WebGL detection & automatic fallback handler
│   ├── pages/
│   │   ├── HomePage.tsx & HomePage.module.css
│   │   ├── ProjectsPage.tsx & ProjectsPage.module.css
│   │   ├── ProjectDetailPage.tsx & ProjectDetailPage.module.css
│   │   ├── ResearchPage.tsx & ResearchPage.module.css
│   │   ├── AboutPage.tsx & AboutPage.module.css
│   │   ├── ContactPage.tsx & ContactPage.module.css
│   │   └── NotFoundPage.tsx & NotFoundPage.module.css
│   ├── styles/
│   │   ├── tokens.css           # Design tokens (silicon white, deep navy, electric cyan, etc.)
│   │   └── global.css           # Global typography, layout, reset & a11y styling
│   ├── App.tsx                  # Declarative client-side routing with React.lazy
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## 2. Local Development & Build Commands
In powershell or bash from the project directory:
```bash
# Start local development server
npm run dev

# Run TypeScript checks and production bundle build
npm run build

# Preview the production build locally
npm run preview
```

## 3. How to Deploy (Free Tier Options)

### Option A: Vercel (Recommended)
1. Push this directory to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: complete cinematic semiconductor engineering portfolio"
   git branch -M main
   git remote add origin https://github.com/ALLENJOE-A/<repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Framework preset: **Vite**.
4. Root directory: `./`
5. Click **Deploy**.

### Option B: GitHub Pages
1. In `vite.config.ts`, set `base: '/<repo-name>/'`.
2. Install `gh-pages` or use GitHub Actions workflow:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: 20 }
         - run: npm ci && npm run build
         - uses: JamesIves/github-pages-deploy-action@v4
           with:
             folder: dist
   ```

## 4. Connecting a Future Custom Domain
In Vercel or GitHub Pages settings:
- Add your custom domain (e.g. `allenjoe.dev` or `allenjoe.engineering`).
- Point your DNS records:
  - CNAME: `cname.vercel-dns.com` (for Vercel) or `<username>.github.io` (for GitHub Pages).
- Update the `<link rel="canonical">` and Open Graph URL inside `index.html`.

## 5. Adding a New Project Without Touching 3D Code
Open `src/data/projects.ts` and append an entry to `PROJECTS`:
```ts
{
  id: 'my-new-project',
  title: 'Project Title',
  shortTitle: 'Short Name',
  status: 'In-progress',
  featured: true,
  category: ['Digital Design & RTL'],
  repoUrl: 'https://github.com/ALLENJOE-A/...',
  summary: 'Brief description...',
  problem: 'Problem statement...',
  motivation: 'Motivation...',
  architecture: 'Architecture description...',
  methodology: 'Methodology...',
  tools: ['SystemVerilog', 'Python'],
  claims: [
    {
      claim: 'Target Metric',
      value: '10',
      unit: '%',
      conditions: 'Simulation',
      sourceFile: 'README.md',
      evidenceCategory: 'C',
    }
  ],
  figures: [],
  tags: ['VLSI', 'RTL'],
  accentColor: '#2E7BFF',
}
```
The Projects listing, detail case study page, filter system, and homepage cards will update automatically.
