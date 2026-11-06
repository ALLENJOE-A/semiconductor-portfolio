import * as THREE from 'three';

export interface CameraPose {
  position: THREE.Vector3;
  target: THREE.Vector3;
  roll: number; // Banking angle in radians
  fov: number;
}

export class CameraSpline {
  private positionCurve: THREE.CatmullRomCurve3;
  private targetCurve: THREE.CatmullRomCurve3;
  private fovKeyframes: { t: number; fov: number }[];

  constructor() {
    // Continuous 3D camera trajectory through the semiconductor world
    // Normalized t ranges from 0.00 to 1.00
    // Targets are positioned in the right half of the viewport (x > 0)
    // so 3D objects and left HTML panels never collide
    const positionPoints = [
      // 0.00 - Hero Die Exploded view (oblique high angle)
      new THREE.Vector3(0, 18, 28),
      
      // 0.12 - Descent into Interconnect stacks (diving down toward metal planes)
      new THREE.Vector3(1.5, 8, 12),
      
      // 0.22 - Substrate & Well level (close fly-by through vias and poly gates)
      new THREE.Vector3(2.0, 2.5, 6),
      
      // 0.32 - Device TCAD (Tunnel-FET cross section perspective)
      new THREE.Vector3(3.2, 1.4, 7.5),
      
      // 0.45 - Gate RTL / BIST (rising smoothly to high-angle architectural block plane)
      new THREE.Vector3(3.0, 6.5, 12.5),
      
      // 0.60 - Metal Physical Design (top-down flyover looking across standard cell rows)
      new THREE.Vector3(2.5, 14, 5.5),
      
      // 0.75 - Package & Systems (pulling up and back to show full PCB board and orbiting GNN graph)
      new THREE.Vector3(3.5, 8.5, 14),
      
      // 0.88 - Milestone Timeline (drifting smoothly alongside vertical glowing trace)
      new THREE.Vector3(2.0, 5.5, 12),
      
      // 1.00 - Tape-out BGA Packaging turntable view (epic pull-back turntable)
      new THREE.Vector3(1.0, 12, 22),
    ];

    const targetPoints = [
      // 0.00 - Hero Die Center
      new THREE.Vector3(0, 0, 0),
      
      // 0.12 - Die core interconnects
      new THREE.Vector3(0.5, 1, 0),
      
      // 0.22 - Gate and source/drain junction
      new THREE.Vector3(1.5, 0.5, 0),
      
      // 0.32 - TCAD Tunnel-FET channel & tunneling junction
      new THREE.Vector3(3.2, 0, 0),
      
      // 0.45 - BIST Pipeline Center (MAC & LFSR conduits)
      new THREE.Vector3(3.0, 0, 0),
      
      // 0.60 - Floorplan core center (PS-02 PID macro)
      new THREE.Vector3(2.5, 0, -1),
      
      // 0.75 - PCB System board and GNN graph
      new THREE.Vector3(3.5, 0, 0),
      
      // 0.88 - Timeline active trace node
      new THREE.Vector3(2.0, 2, 0),
      
      // 1.00 - Packaged BGA chip center
      new THREE.Vector3(1.0, 0, 0),
    ];

    this.positionCurve = new THREE.CatmullRomCurve3(positionPoints, false, 'centripetal', 0.5);
    this.targetCurve = new THREE.CatmullRomCurve3(targetPoints, false, 'centripetal', 0.5);

    this.fovKeyframes = [
      { t: 0.00, fov: 42 },
      { t: 0.22, fov: 50 }, // Wider immersion during descent
      { t: 0.32, fov: 38 }, // Telephoto precision for TCAD physics
      { t: 0.45, fov: 42 }, // Architecture perspective
      { t: 0.60, fov: 48 }, // Floorplan overview
      { t: 0.75, fov: 44 }, // System perspective
      { t: 1.00, fov: 40 }, // Turntable showcase
    ];
  }

  public sample(t: number, mouseParallaxX = 0, mouseParallaxY = 0): CameraPose {
    const clampedT = THREE.MathUtils.clamp(t, 0, 1);

    const basePosition = this.positionCurve.getPointAt(clampedT);
    const baseTarget = this.targetCurve.getPointAt(clampedT);
    const tangent = this.positionCurve.getTangentAt(clampedT);

    // Compute natural camera roll (banking) based on horizontal turning
    const roll = -tangent.x * 0.15;

    // Smooth FOV interpolation across keyframes
    let fov = 42;
    for (let i = 0; i < this.fovKeyframes.length - 1; i++) {
      const kf1 = this.fovKeyframes[i];
      const kf2 = this.fovKeyframes[i + 1];
      if (clampedT >= kf1.t && clampedT <= kf2.t) {
        const factor = (clampedT - kf1.t) / (kf2.t - kf1.t);
        const smoothFactor = factor * factor * (3 - 2 * factor);
        fov = THREE.MathUtils.lerp(kf1.fov, kf2.fov, smoothFactor);
        break;
      }
    }

    // Apply mouse parallax with depth dampening
    const position = basePosition.clone().add(
      new THREE.Vector3(mouseParallaxX * 1.5, mouseParallaxY * 1.0, 0)
    );
    const target = baseTarget.clone().add(
      new THREE.Vector3(mouseParallaxX * 0.4, mouseParallaxY * 0.3, 0)
    );

    return { position, target, roll, fov };
  }
}
