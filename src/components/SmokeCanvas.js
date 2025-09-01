import React, { useEffect, useRef } from 'react';

// SmokeCanvas: lightweight canvas particle system for subtle smoke/atmosphere
// Props: intensity (0..1), color (css), speed (multiplier)

export default function SmokeCanvas({ intensity = 0.7, color = 'rgba(198,156,74,0.12)', speed = 1 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return () => {};

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = canvas.offsetWidth * devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const baseCount = Math.round(12 * intensity); // number of particles
    const maxSize = 320;

    const rand = (min, max) => Math.random() * (max - min) + min;

    const spawnParticle = () => {
      const p = {
        x: rand(-0.2 * canvas.offsetWidth, canvas.offsetWidth * 1.2),
        y: rand(canvas.offsetHeight * 0.6, canvas.offsetHeight * 1.1),
        vx: rand(-0.15, 0.15) * speed,
        vy: rand(-0.1, -0.6) * speed,
        size: rand(maxSize * 0.18, maxSize * 0.55),
        life: rand(6, 16),
        age: 0,
        alpha: rand(0.02, 0.12) * intensity
      };
      particlesRef.current.push(p);
    };

    // initialize
    for (let i = 0; i < baseCount; i++) spawnParticle();

    const onResize = () => {
      width = (canvas.width = canvas.offsetWidth * devicePixelRatio);
      height = (canvas.height = canvas.offsetHeight * devicePixelRatio);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    window.addEventListener('resize', onResize);

    const draw = (t) => {
      if (!mountedRef.current) return;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // subtle tint overlay for depth
      ctx.fillStyle = 'rgba(255,255,255,0.0)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const parts = particlesRef.current;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.age += 1 / 60;
        const tAge = p.age / p.life;

        const curAlpha = p.alpha * (1 - tAge);
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grd.addColorStop(0, `rgba(255,255,255,${curAlpha})`);
        grd.addColorStop(0.2, `rgba(255,255,255,${curAlpha * 0.6})`);
        grd.addColorStop(0.6, `rgba(198,156,74,${curAlpha * 0.12})`);
        grd.addColorStop(1, 'rgba(198,156,74,0)');

        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 1;
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.age > p.life) {
          parts.splice(i, 1);
          if (Math.random() > 0.4) spawnParticle();
        }
      }

      // keep particle density
      const desired = Math.max(6, baseCount);
      if (particlesRef.current.length < desired) spawnParticle();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [intensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}
    />
  );
}
