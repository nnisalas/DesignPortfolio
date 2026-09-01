"use client";

// Hero background: a 3D point cloud using the site's own pixel-cluster
// assets (the ones flanking the value-highlight section) as the sprites.
//
// The knobs come from the shared control panel: count 3000, size 6, scene
// depth 1500, camera depth 900, camera speed 2/2, mouse-move, screen track,
// lazy load, init distance 100vh. Those are three.js parameters -- scene and
// camera depth, and a point size with distance attenuation -- so this is
// WebGL rather than the 2D canvas it replaces: the depth falloff that makes
// distant sprites tiny and near ones large can't be faithfully faked in 2D.
//
// The palette is the assets themselves, so instead of one tinted material
// there are four Points objects, one per texture, splitting the count. The
// material colour stays white so each texture shows its own colour.
//
// Adapted from a Framer component; addPropertyControls / ControlType /
// useIsStaticRenderer are Framer-canvas APIs and this project has no framer
// dependency, so the knobs are plain props.
//
// On top of the camera drift, each sprite runs a small spring simulation so
// the field reacts to the pointer: nearby sprites ease away from the cursor
// and settle back, and a click/tap sends an expanding ring outward that
// decays. The simulation is done in SCREEN space -- every sprite is projected
// to pixels each frame -- because "nearby" has to mean visually nearby, and
// in a perspective scene a fixed world-space radius would grab a huge patch
// of the distant sprites and almost none of the near ones.

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ASSETS = ["/assets/px-blue.webp", "/assets/px-green.webp", "/assets/px-yellow.webp", "/assets/px-orange.webp"];

// --- pointer interaction (all distances in screen px) ---
const REPEL_RADIUS = 150; // how close the cursor has to be to nudge a sprite
const REPEL_FORCE = 0.75; // steady-state push ~= REPEL_FORCE / SPRING px
const SPRING = 0.022; // pull back toward the sprite's home position
const DAMPING = 0.86; // velocity bleed, keeps the return calm rather than springy
const RIPPLE_SPEED = 950; // px/sec the ring expands
const RIPPLE_WIDTH = 130; // thickness of the ring's influence
const RIPPLE_FORCE = 1.5; // impulse at the crest (~60px peak throw)
const RIPPLE_DECAY = 1.5; // per-second falloff of the crest
const MAX_RIPPLES = 4;
const REST_EPS = 0.004; // below this the field counts as settled and stops writing

export interface PixelFieldProps {
  count?: number;
  size?: number;
  sceneDepth?: number;
  cameraDepth?: number;
  cameraVelX?: number;
  cameraVelY?: number;
  /** "window" tracks the whole screen; "container" only this element. */
  track?: "window" | "container";
  lazyLoad?: boolean;
  initDistanceVh?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function PixelField({
  count = 3000,
  size = 6,
  sceneDepth = 1500,
  cameraDepth = 900,
  cameraVelX = 2,
  cameraVelY = 2,
  track = "window",
  lazyLoad = true,
  initDistanceVh = 100,
  className,
  style,
}: PixelFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  // Live mirror so the render loop never closes over stale speeds.
  const liveRef = useRef({ cameraVelX, cameraVelY });
  liveRef.current = { cameraVelX, cameraVelY };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let started = false;
    let raf = 0;
    let teardown: (() => void) | null = null;
    let setRunning: (on: boolean) => void = () => {};

    const start = () => {
      if (started || disposed) return;
      started = true;

      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;

      const camera = new THREE.PerspectiveCamera(75, w / h, 1, cameraDepth);
      camera.position.z = cameraDepth / 2;
      const scene = new THREE.Scene();

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0); // transparent: the page's white shows through
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      mount.appendChild(renderer.domElement);

      // One Points object per asset, so every sprite keeps its own colour.
      const loader = new THREE.TextureLoader();
      const per = Math.max(1, Math.floor(count / ASSETS.length));
      const half = sceneDepth / 2;
      const built: {
        geo: THREE.BufferGeometry;
        mat: THREE.PointsMaterial;
        tex: THREE.Texture;
        /** home positions; the attribute array is home + displacement */
        home: Float32Array;
        /** current displacement, in screen px (converted to world at write time) */
        offs: Float32Array;
        vels: Float32Array;
      }[] = [];

      ASSETS.forEach((src) => {
        const positions = new Float32Array(per * 3);
        for (let i = 0; i < per * 3; i++) positions[i] = Math.random() * sceneDepth - half;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const tex = loader.load(src);
        tex.colorSpace = THREE.SRGBColorSpace;
        const mat = new THREE.PointsMaterial({
          size,
          map: tex,
          // white, so the texture's own colour comes through untinted
          color: 0xffffff,
          transparent: true,
          // the assets have soft edges baked in; a high alphaTest would clip
          // them into hard squares, so keep it low and skip depth writes
          alphaTest: 0.01,
          depthWrite: false,
          sizeAttenuation: true,
        });
        scene.add(new THREE.Points(geo, mat));
        built.push({
          geo,
          mat,
          tex,
          home: positions.slice(),
          offs: new Float32Array(per * 2),
          vels: new Float32Array(per * 2),
        });
      });

      // --- input: screen track, pointer move ---
      // pointermove rather than mousemove so a touch drag drives it too.
      let ptrX = 0;
      let ptrY = 0;
      let hasPtr = false;
      // Skips the per-sprite loop entirely once the field has settled.
      let simDirty = false;
      const ripples: { x: number; y: number; t: number }[] = [];

      const onPointerMove = (e: PointerEvent) => {
        mouseRef.current.x = e.clientX - window.innerWidth / 2;
        mouseRef.current.y = e.clientY - window.innerHeight / 2;
        // Repulsion needs the raw viewport position, not the centred one.
        const r = mount.getBoundingClientRect();
        ptrX = e.clientX - r.left;
        ptrY = e.clientY - r.top;
        hasPtr = true;
      };
      // Cursor gone: let everything relax home instead of holding the last push.
      const onPointerOut = () => {
        hasPtr = false;
      };
      const onPointerDown = (e: PointerEvent) => {
        const r = mount.getBoundingClientRect();
        ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 });
        if (ripples.length > MAX_RIPPLES) ripples.shift();
      };

      const moveTarget: Window | HTMLElement = track === "window" ? window : mount;
      moveTarget.addEventListener("pointermove", onPointerMove as EventListener, { passive: true });
      moveTarget.addEventListener("pointerdown", onPointerDown as EventListener, { passive: true });
      window.addEventListener("pointerout", onPointerOut);
      window.addEventListener("blur", onPointerOut);

      const onResize = () => {
        const nw = mount.clientWidth || window.innerWidth;
        const nh = mount.clientHeight || window.innerHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener("resize", onResize);
      // The hero is sized in svh, so it can change without a window resize.
      const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
      ro?.observe(mount);

      const renderOnce = () => {
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      };

      // Projection scratch, reused every frame so the loop allocates nothing.
      const viewProj = new THREE.Matrix4();
      const TAN_HALF_FOV = Math.tan((75 / 2) * (Math.PI / 180));
      let last = performance.now();

      const simulate = (dt: number) => {
        const vw = renderer.domElement.clientWidth || mount.clientWidth;
        const vh = renderer.domElement.clientHeight || mount.clientHeight;
        if (!vw || !vh) return;

        camera.updateMatrixWorld();
        camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
        viewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        const e = viewProj.elements;

        // World units per screen pixel at clip-w depth 1; scaling by this keeps
        // a given push the same size on screen whether the sprite is near or far.
        const worldPerPx = (2 * TAN_HALF_FOV) / vh;

        // Advance ripples and drop the spent ones.
        for (let r = ripples.length - 1; r >= 0; r--) {
          ripples[r].t += dt;
          const amp = Math.exp(-ripples[r].t * RIPPLE_DECAY);
          const ring = ripples[r].t * RIPPLE_SPEED;
          if (amp < 0.02 || ring > Math.hypot(vw, vh) + RIPPLE_WIDTH) ripples.splice(r, 1);
        }

        let moved = false;

        for (const b of built) {
          const { home, offs, vels } = b;
          const arr = b.geo.attributes.position.array as Float32Array;
          const n = home.length / 3;

          for (let i = 0; i < n; i++) {
            const i3 = i * 3;
            const i2 = i * 2;
            const hx = home[i3];
            const hy = home[i3 + 1];
            const hz = home[i3 + 2];

            // Project the home position; the displacement is small enough that
            // using it (instead of the displaced position) keeps the field
            // stable and avoids sprites shoving themselves around.
            const w = e[3] * hx + e[7] * hy + e[11] * hz + e[15];
            if (w <= 0) continue; // behind the camera
            const sxp = ((e[0] * hx + e[4] * hy + e[8] * hz + e[12]) / w) * 0.5 + 0.5;
            const syp = -((e[1] * hx + e[5] * hy + e[9] * hz + e[13]) / w) * 0.5 + 0.5;
            const px = sxp * vw;
            const py = syp * vh;

            let fx = 0;
            let fy = 0;

            if (hasPtr) {
              const dx = px - ptrX;
              const dy = py - ptrY;
              const d2 = dx * dx + dy * dy;
              if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
                const d = Math.sqrt(d2) || 0.0001;
                // squared falloff: firm right at the cursor, nothing at the edge
                const f = (1 - d / REPEL_RADIUS) ** 2 * REPEL_FORCE;
                fx += (dx / d) * f;
                fy += (dy / d) * f;
              }
            }

            for (let r = 0; r < ripples.length; r++) {
              const rp = ripples[r];
              const dx = px - rp.x;
              const dy = py - rp.y;
              const d = Math.hypot(dx, dy) || 0.0001;
              const band = (d - rp.t * RIPPLE_SPEED) / RIPPLE_WIDTH;
              if (band < -1.5 || band > 1.5) continue;
              const crest = Math.exp(-band * band * 2) * Math.exp(-rp.t * RIPPLE_DECAY) * RIPPLE_FORCE;
              fx += (dx / d) * crest;
              fy += (dy / d) * crest;
            }

            // spring-damper toward home
            let vx = (vels[i2] + fx - offs[i2] * SPRING) * DAMPING;
            let vy = (vels[i2 + 1] + fy - offs[i2 + 1] * SPRING) * DAMPING;
            let ox = offs[i2] + vx;
            let oy = offs[i2 + 1] + vy;

            if (Math.abs(ox) < REST_EPS && Math.abs(vx) < REST_EPS) {
              ox = 0;
              vx = 0;
            }
            if (Math.abs(oy) < REST_EPS && Math.abs(vy) < REST_EPS) {
              oy = 0;
              vy = 0;
            }

            offs[i2] = ox;
            offs[i2 + 1] = oy;
            vels[i2] = vx;
            vels[i2 + 1] = vy;

            if (ox !== 0 || oy !== 0) moved = true;

            // px -> world at this sprite's depth; screen +y is world -y
            const k = worldPerPx * w;
            arr[i3] = hx + ox * k;
            arr[i3 + 1] = hy - oy * k;
            arr[i3 + 2] = hz;
          }

          b.geo.attributes.position.needsUpdate = true;
        }

        // Nothing displaced and nothing pending: stop writing buffers until
        // the pointer does something again.
        if (!moved && !ripples.length) simDirty = false;
      };

      const animate = () => {
        raf = requestAnimationFrame(animate);
        const now = performance.now();
        // clamp so a backgrounded tab doesn't resume with one enormous step
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        const sx = liveRef.current.cameraVelX * 0.0005;
        const sy = liveRef.current.cameraVelY * 0.0005;
        camera.position.x += (mouseRef.current.x - camera.position.x) * sx;
        camera.position.y += (-mouseRef.current.y - camera.position.y) * sy;

        if (hasPtr || ripples.length) simDirty = true;
        if (simDirty) simulate(dt);

        renderOnce();
      };

      if (reduced) renderOnce();
      else animate();

      setRunning = (on: boolean) => {
        if (reduced) return;
        if (on && !raf) animate();
        else if (!on && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };

      teardown = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        moveTarget.removeEventListener("pointermove", onPointerMove as EventListener);
        moveTarget.removeEventListener("pointerdown", onPointerDown as EventListener);
        window.removeEventListener("pointerout", onPointerOut);
        window.removeEventListener("blur", onPointerOut);
        window.removeEventListener("resize", onResize);
        ro?.disconnect();
        built.forEach(({ geo, mat, tex }) => {
          geo.dispose();
          mat.dispose();
          tex.dispose();
        });
        renderer.dispose();
        renderer.domElement.parentNode?.removeChild(renderer.domElement);
      };
    };

    // Lazy start + park the loop while off-screen.
    //
    // The proximity test runs synchronously first rather than waiting on the
    // observer: IntersectionObserver callbacks are delivered as part of the
    // rendering lifecycle, so a throttled or backgrounded tab can withhold
    // them -- and this is the hero, in view on load, so waiting on a callback
    // risks never starting at all.
    const nearViewport = () => {
      const r = mount.getBoundingClientRect();
      const margin = (initDistanceVh / 100) * window.innerHeight;
      return r.top < window.innerHeight + margin && r.bottom > -margin;
    };
    if (!lazyLoad || nearViewport()) start();

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                start();
                setRunning(true);
              } else {
                setRunning(false);
              }
            },
            // rootMargin only accepts px or %, never vh -- the control is
            // specified in vh, so convert against the viewport height.
            { rootMargin: `${Math.round((initDistanceVh / 100) * window.innerHeight)}px 0px` }
          )
        : null;
    io?.observe(mount);

    return () => {
      disposed = true;
      io?.disconnect();
      teardown?.();
    };
  }, [count, size, sceneDepth, cameraDepth, track, lazyLoad, initDistanceVh]);

  return <div ref={mountRef} aria-hidden="true" className={className} style={{ width: "100%", height: "100%", ...style }} />;
}
