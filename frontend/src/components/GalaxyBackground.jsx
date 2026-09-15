import React, { useEffect, useRef } from 'react';

export default function GalaxyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse interactive tilt state
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) * 0.0005;
      targetMouseY = (e.clientY - height / 2) * 0.0005;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle Galaxy configuration
    const PARTICLE_COUNT = 1200;
    const ARMS = 4;
    const GALAXY_RADIUS = Math.min(width, height) * 0.65;
    const particles = [];

    const colors = [
      'rgba(0, 242, 254, ',   // Electric Cyan
      'rgba(121, 40, 202, ',  // Deep Purple
      'rgba(255, 0, 122, ',   // Neon Pink
      'rgba(79, 172, 254, ',  // Bright Blue
      'rgba(255, 255, 255, '  // White Star
    ];

    // Generate Galaxy Spiral Particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const armIndex = i % ARMS;
      const armAngle = (armIndex / ARMS) * Math.PI * 2;
      
      // Distance from center with exponential density towards core
      const distance = Math.pow(Math.random(), 2.5) * GALAXY_RADIUS + 10;
      
      // Spiral twist angle based on distance
      const spiralAngle = distance * 0.004 + armAngle;
      
      // Add random dispersion off the spiral arm center
      const spreadX = (Math.random() - 0.5) * (distance * 0.3);
      const spreadY = (Math.random() - 0.5) * (distance * 0.3);
      const spreadZ = (Math.random() - 0.5) * (distance * 0.2);

      const x = Math.cos(spiralAngle) * distance + spreadX;
      const y = spreadY;
      const z = Math.sin(spiralAngle) * distance + spreadZ;

      const baseColor = colors[Math.floor(Math.random() * colors.length)];
      const opacity = Math.random() * 0.75 + 0.2;
      const size = Math.random() * 1.8 + 0.6;

      particles.push({
        x, y, z,
        baseX: x,
        baseZ: z,
        distance,
        angle: Math.atan2(z, x),
        speed: (0.0015 + (1 / (distance + 1)) * 0.8) * (Math.random() * 0.4 + 0.8),
        size,
        color: baseColor,
        opacity
      });
    }

    let globalRotation = 0;

    // Render loop
    const render = () => {
      // Smooth interpolation for mouse parallax tilt
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Clear frame with soft fade trail effect
      ctx.fillStyle = 'rgba(6, 9, 19, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      globalRotation += 0.0012; // Continuous slow galaxy rotation

      const cosRotX = Math.cos(mouseY + 0.35); // Slight tilt angle
      const sinRotX = Math.sin(mouseY + 0.35);
      const cosRotY = Math.cos(globalRotation + mouseX);
      const sinRotY = Math.sin(globalRotation + mouseX);

      // Render Central Core Glow Nebula
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, GALAXY_RADIUS * 0.3);
      coreGradient.addColorStop(0, 'rgba(0, 242, 254, 0.18)');
      coreGradient.addColorStop(0.4, 'rgba(121, 40, 202, 0.12)');
      coreGradient.addColorStop(1, 'rgba(6, 9, 19, 0)');
      ctx.fillStyle = coreGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Galaxy Particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // Update particle angle along orbit
        p.angle += p.speed;
        const rx = Math.cos(p.angle) * p.distance;
        const rz = Math.sin(p.angle) * p.distance;

        // 3D Matrix Rotation (Y-axis + X-axis tilt)
        const x1 = rx * cosRotY - rz * sinRotY;
        const z1 = rx * sinRotY + rz * cosRotY;

        const y2 = p.y * cosRotX - z1 * sinRotX;
        const z2 = p.y * sinRotX + z1 * cosRotX;

        // Perspective Projection calculation
        const perspective = 800;
        const scale = perspective / (perspective + z2 + 400);

        if (scale > 0) {
          const screenX = centerX + x1 * scale;
          const screenY = centerY + y2 * scale;
          const renderSize = Math.max(0.4, p.size * scale);
          const alpha = Math.min(1, p.opacity * scale * 1.2);

          ctx.beginPath();
          ctx.arc(screenX, screenY, renderSize, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${alpha})`;
          
          // Glow effect for brighter/larger core particles
          if (p.size > 1.2 && alpha > 0.4) {
            ctx.shadowBlur = renderSize * 4;
            ctx.shadowColor = `${p.color}0.8)`;
          } else {
            ctx.shadowBlur = 0;
          }
          
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}
