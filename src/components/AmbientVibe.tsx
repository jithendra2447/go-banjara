'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  angle?: number;
  spin?: number;
  depth?: number;
  isExtra?: boolean;
}

interface Wave {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  opacity: number;
}

interface AmbientVibeProps {
  effect: 'river-flow' | 'snowfall' | 'sun-breeze' | 'monsoon';
  className?: string;
}

export const AmbientVibe: React.FC<AmbientVibeProps> = ({
  effect,
  className = 'absolute inset-0 w-full h-full pointer-events-none z-0',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let waves: Wave[] = [];

    // Scroll speed tracking variables
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let targetScrollSpeed = 0;
    let currentScrollSpeed = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleScrollVibe = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        // Accelerate when scrolling down
        const diff = currentScrollY - lastScrollY;
        targetScrollSpeed = Math.min(25, diff * 0.5);
      } else {
        // Return to normal when scrolling up or idle
        targetScrollSpeed = 0;
      }
      lastScrollY = currentScrollY;

      // Slowly return speed to zero when scroll ceases
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        targetScrollSpeed = 0;
      }, 50);
    };

    if (effect === 'snowfall' || effect === 'monsoon') {
      window.addEventListener('scroll', handleScrollVibe, { passive: true });
    }

    // Fit canvas size to parent node dimensions (or viewport for fixed overlays)
    const resizeCanvas = () => {
      if (effect === 'snowfall' || effect === 'monsoon') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
        } else {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles based on selected effect
    const initEffects = () => {
      particles = [];
      waves = [];

      if (effect === 'snowfall') {
        // Increased count for rich snowfall visual depth
        const count = 150;
        for (let i = 0; i < count; i++) {
          const isExtra = i >= 50; // 50 base particles, 100 extra that appear during scroll-down
          const depth = Math.random() * 0.8 + 0.2; // 0.2 (distant) to 1.0 (close)
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: (Math.random() * 2.5 + 1.0) * (depth * 1.3),
            speedX: (Math.random() * 0.8 - 0.4) * depth,
            speedY: (Math.random() * 1.2 + 0.6) * depth,
            opacity: (Math.random() * 0.5 + 0.25) * depth,
            color: '#FFFFFF',
            depth,
            isExtra,
          });
        }
      } else if (effect === 'monsoon') {
        // Heavy, slanted tropical rain streaks
        const count = 100;
        for (let i = 0; i < count; i++) {
          const depth = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: (Math.random() * 18 + 12) * depth, // Length of rain streak
            speedX: -(Math.random() * 2.5 + 1.5) * depth, // Slanted wind left
            speedY: (Math.random() * 10 + 15) * depth, // Fast fall speed
            opacity: (Math.random() * 0.22 + 0.08) * depth,
            color: '#80E7ED', // Soft translucent cloud-blue
            depth,
          });
        }
      } else if (effect === 'river-flow') {
        // Horizontal floating leaves
        const count = Math.min(25, Math.floor(canvas.width / 60));
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 12 + 6,
            speedX: -(Math.random() * 0.8 + 0.4), // Float left
            speedY: Math.random() * 0.2 - 0.1,
            opacity: Math.random() * 0.4 + 0.15,
            color: Math.random() > 0.5 ? '#1D493E' : '#01B99F', // Brand Green / Seaweed
            angle: Math.random() * Math.PI,
            spin: Math.random() * 0.01 - 0.005,
          });
        }

        // River currents/ripples
        const waveCount = 8;
        for (let i = 0; i < waveCount; i++) {
          waves.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: Math.random() * 150 + 100,
            height: Math.random() * 4 + 2,
            speed: -(Math.random() * 0.6 + 0.3),
            opacity: Math.random() * 0.2 + 0.08,
          });
        }
      } else if (effect === 'sun-breeze') {
        const count = Math.min(30, Math.floor(canvas.width / 40));
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 8 + 4,
            speedX: Math.random() * 0.3 - 0.1,
            speedY: -(Math.random() * 0.4 + 0.2), // float up
            opacity: Math.random() * 0.3 + 0.1,
            color: '#FFFF80', // Lemon Yellow
          });
        }
      }
    };
    initEffects();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (effect === 'snowfall') {
        // Smoothly interpolate current scroll speed
        currentScrollSpeed += (targetScrollSpeed - currentScrollSpeed) * 0.08;

        particles.forEach((p) => {
          let opacity = p.opacity;
          if (p.isExtra) {
            const fadeFactor = Math.min(1, currentScrollSpeed / 10);
            opacity = p.opacity * fadeFactor;
          } else {
            const fadeFactor = 1 + Math.min(0.4, currentScrollSpeed / 15);
            opacity = Math.min(1, p.opacity * fadeFactor);
          }

          if (opacity > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
          }

          const particleDepth = p.depth ?? 1;
          const speedMultiplier = p.isExtra ? 1.4 : 1.0;
          const currentSpeedY = p.speedY + (currentScrollSpeed * particleDepth * 1.5 * speedMultiplier);
          const currentSpeedX = p.speedX - (currentScrollSpeed * particleDepth * 0.25);

          p.x += currentSpeedX;
          p.y += currentSpeedY;

          if (p.y > canvas.height) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
          }
          if (p.x > canvas.width) {
            p.x = 0;
          } else if (p.x < 0) {
            p.x = canvas.width;
          }
        });
      } else if (effect === 'monsoon') {
        // Smoothly interpolate current scroll speed
        currentScrollSpeed += (targetScrollSpeed - currentScrollSpeed) * 0.08;

        particles.forEach((p) => {
          const opacity = p.opacity * (1 + Math.min(0.6, currentScrollSpeed / 10));

          ctx.beginPath();
          ctx.strokeStyle = `rgba(128, 231, 237, ${opacity})`;
          ctx.lineWidth = (p.depth ?? 1) * 1.2;
          ctx.lineCap = 'round';
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 1.5, p.y + p.size);
          ctx.stroke();

          const particleDepth = p.depth ?? 1;
          const currentSpeedY = p.speedY + (currentScrollSpeed * particleDepth * 2.2);
          const currentSpeedX = p.speedX - (currentScrollSpeed * particleDepth * 0.35);

          p.x += currentSpeedX;
          p.y += currentSpeedY;

          if (p.y > canvas.height) {
            p.y = -p.size - 10;
            p.x = Math.random() * canvas.width;
          }
          if (p.x < -20) {
            p.x = canvas.width + 20;
          } else if (p.x > canvas.width + 20) {
            p.x = -20;
          }
        });
      } else if (effect === 'river-flow') {
        waves.forEach((w) => {
          ctx.beginPath();
          ctx.ellipse(w.x, w.y, w.width / 2, w.height / 2, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(128, 231, 237, ${w.opacity})`;
          ctx.fill();

          w.x += w.speed;
          if (w.x + w.width / 2 < 0) {
            w.x = canvas.width + w.width / 2;
            w.y = Math.random() * canvas.height;
          }
        });

        particles.forEach((p) => {
          ctx.save();
          ctx.translate(p.x, p.y);
          if (p.angle !== undefined) ctx.rotate(p.angle);
          
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.quadraticCurveTo(p.size / 3, 0, 0, p.size / 2);
          ctx.quadraticCurveTo(-p.size / 3, 0, 0, -p.size / 2);
          
          ctx.fillStyle = p.color === '#1D493E' 
            ? `rgba(29, 73, 62, ${p.opacity})` 
            : `rgba(1, 185, 159, ${p.opacity})`;
          ctx.fill();
          ctx.restore();

          p.x += p.speedX;
          p.y += p.speedY;
          if (p.angle !== undefined && p.spin !== undefined) {
            p.angle += p.spin;
          }

          if (p.x < -p.size) {
            p.x = canvas.width + p.size;
            p.y = Math.random() * canvas.height;
          }
        });
      } else if (effect === 'sun-breeze') {
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 128, ${p.opacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#FFFF80';
          ctx.fill();
          ctx.shadowBlur = 0;

          p.x += p.speedX;
          p.y += p.speedY;

          if (p.y < -p.size) {
            p.y = canvas.height + p.size;
            p.x = Math.random() * canvas.width;
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScrollVibe);
      clearTimeout(scrollTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, [effect]);

  const computedClassName = (effect === 'snowfall' || effect === 'monsoon')
    ? 'fixed inset-0 w-full h-full pointer-events-none z-10'
    : className;

  return <canvas ref={canvasRef} className={computedClassName} />;
};
