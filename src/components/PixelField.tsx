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

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ASSETS = ["/assets/px-blue.webp", "/assets/px-green.webp", "/assets/px-yellow.webp", "/assets/px-orange.webp"];

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
      const built: { geo: THREE.BufferGeometry; mat: THREE.PointsMaterial; tex: THREE.Texture }[] = [];

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
        built.push({ geo, mat, tex });
      });

      // --- input: screen track, mouse move ---
      const onMouseMove = (e: MouseEvent) => {
        mouseRef.current.x = e.clientX - window.innerWidth / 2;
        mouseRef.current.y = e.clientY - window.innerHeight / 2;
      };
      const moveTarget: Window | HTMLElement = track === "window" ? window : mount;
      moveTarget.addEventListener("mousemove", onMouseMove as EventListener, { passive: true });

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

      const animate = () => {
        raf = requestAnimationFrame(animate);
        const sx = liveRef.current.cameraVelX * 0.0005;
        const sy = liveRef.current.cameraVelY * 0.0005;
        camera.position.x += (mouseRef.current.x - camera.position.x) * sx;
        camera.position.y += (-mouseRef.current.y - camera.position.y) * sy;
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
        moveTarget.removeEventListener("mousemove", onMouseMove as EventListener);
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
