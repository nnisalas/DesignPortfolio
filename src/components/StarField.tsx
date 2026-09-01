"use client";

// Three.js point-cloud starfield used as the hero background.
//
// Adapted from a Framer component: this project has no `framer` dependency,
// so addPropertyControls / ControlType / useIsStaticRenderer (Framer-canvas
// APIs) are gone and the knobs are plain props with the defaults from the
// control panel the user shared.
//
// Two of those controls -- Lazy Load and Init Distance -- weren't actually
// implemented in the source, so they're built here: the WebGL context isn't
// created until the element comes within `initDistanceVh` of the viewport,
// and the render loop is parked whenever it scrolls out of view. That
// matters on this page, where the starfield sits in the hero and would
// otherwise keep a GPU loop running for the whole rest of the document.

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type StarFieldShape = "square" | "circle" | "star";

export interface StarFieldProps {
  shape?: StarFieldShape;
  backgroundColor?: string;
  color?: string;
  count?: number;
  size?: number;
  sceneDepth?: number;
  cameraDepth?: number;
  cameraVelX?: number;
  cameraVelY?: number;
  /** "move" follows the pointer; "drag" pans while held. */
  interaction?: "move" | "drag";
  /** "window" tracks the whole page; "container" only this element. */
  track?: "window" | "container";
  lazyLoad?: boolean;
  initDistanceVh?: number;
  className?: string;
  style?: React.CSSProperties;
}

function shapeTexture(shape: StarFieldShape): THREE.Texture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#ffffff";
  if (shape === "circle") {
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === "star") {
    ctx.fill(new Path2D("M32 2 L41 22 L62 25 L47 40 L50 62 L32 52 L14 62 L17 40 L2 25 L23 22 Z"));
  } else {
    ctx.fillRect(4, 4, 56, 56);
  }
  return new THREE.CanvasTexture(canvas);
}

export default function StarField({
  shape = "square",
  backgroundColor = "#ffffff",
  color = "#87CEEB",
  count = 3000,
  size = 6,
  sceneDepth = 1500,
  cameraDepth = 900,
  cameraVelX = 2,
  cameraVelY = 2,
  interaction = "move",
  track = "window",
  lazyLoad = true,
  initDistanceVh = 100,
  className,
  style,
}: StarFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  // Live prop mirror so the render loop never closes over stale values.
  const liveRef = useRef({ cameraVelX, cameraVelY });
  liveRef.current = { cameraVelX, cameraVelY };
  const materialRef = useRef<THREE.PointsMaterial | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Structural effect: rebuilding the WebGL context is expensive, so this
  // only re-runs for props that change the scene's structure. Colour and
  // size are pushed through the separate effect below instead.
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let started = false;
    let raf = 0;
    let cleanupScene: (() => void) | null = null;
    // Assigned by start(); lets the observer park/resume the loop.
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
      renderer.setClearColor(new THREE.Color(backgroundColor), 1);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      mount.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const half = sceneDepth / 2;
      for (let i = 0; i < count * 3; i++) positions[i] = Math.random() * sceneDepth - half;
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const texture = shapeTexture(shape);
      const material = new THREE.PointsMaterial({
        size,
        map: texture,
        color: new THREE.Color(color),
        transparent: true,
        alphaTest: 0.2,
        depthWrite: true,
        sizeAttenuation: true,
      });
      materialRef.current = material;

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // --- interaction ---
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      const onMouseMove = (e: MouseEvent) => {
        mouseRef.current.x = e.clientX - window.innerWidth / 2;
        mouseRef.current.y = e.clientY - window.innerHeight / 2;
      };
      const onPointerDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!dragging) return;
        mouseRef.current.x += e.clientX - lastX;
        mouseRef.current.y += e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
      };
      const onPointerUp = () => {
        dragging = false;
      };

      const moveTarget: Window | HTMLElement = track === "window" ? window : mount;
      if (interaction === "move") {
        moveTarget.addEventListener("mousemove", onMouseMove as EventListener, { passive: true });
      } else {
        mount.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerup", onPointerUp);
      }

      const onResize = () => {
        const nw = mount.clientWidth || window.innerWidth;
        const nh = mount.clientHeight || window.innerHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener("resize", onResize);
      // The hero is sized in vh/vw, so it can change without a window
      // resize event (mobile URL-bar collapse, container reflow).
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

      // Reduced motion: draw the field once, never run the loop.
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

      cleanupScene = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        ro?.disconnect();
        moveTarget.removeEventListener("mousemove", onMouseMove as EventListener);
        mount.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        geometry.dispose();
        material.dispose();
        texture?.dispose();
        renderer.dispose();
        renderer.domElement.parentNode?.removeChild(renderer.domElement);
        materialRef.current = null;
        rendererRef.current = null;
      };
    };

    // Lazy start + park the loop while off-screen.
    //
    // The proximity test is done synchronously first rather than waiting on
    // the observer: IntersectionObserver callbacks are delivered as part of
    // the rendering lifecycle, so a throttled or backgrounded tab can
    // withhold them indefinitely -- and this element is the hero, which is
    // in view on load. Waiting for the callback risks never starting at all.
    const nearViewport = () => {
      const r = mount.getBoundingClientRect();
      const margin = (initDistanceVh / 100) * window.innerHeight;
      return r.top < window.innerHeight + margin && r.bottom > -margin;
    };
    if (!lazyLoad || nearViewport()) start();

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
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
      );
      io.observe(mount);
    }

    return () => {
      disposed = true;
      io?.disconnect();
      cleanupScene?.();
    };
  }, [shape, count, sceneDepth, cameraDepth, interaction, track, lazyLoad, initDistanceVh, backgroundColor, color, size]);

  // Cheap prop updates that don't need a context rebuild.
  useEffect(() => {
    rendererRef.current?.setClearColor(new THREE.Color(backgroundColor), 1);
    const mat = materialRef.current;
    if (mat) {
      mat.color.set(color);
      mat.size = size;
    }
  }, [backgroundColor, color, size]);

  return <div ref={mountRef} aria-hidden="true" className={className} style={{ width: "100%", height: "100%", ...style }} />;
}
