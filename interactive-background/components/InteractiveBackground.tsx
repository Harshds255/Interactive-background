// components/InteractiveBackground.tsx

import React, { useEffect, useRef } from 'react';

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles: Particle[] = [];
  let mouseX = 0;
  let mouseY = 0;

  interface Particle {
    x: number; // Particle's x position
    y: number; // Particle's y position
    radius: number; // Particle's radius
    color: string; // Particle's color
    speedX: number; // Particle's speed in the X direction
    speedY: number; // Particle's speed in the Y direction
    isMoving: boolean; // Whether the particle is moving
  }

  const createParticles = (numParticles: number) => {
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 10 + 2, // Random radius between 2 and 7
        color: `rgba(255, 255, 255, ${Math.random() - 0.5})`, // Random white color with transparency
        speedX: (Math.random() - 0.5) * 2, // Initial random speed
        speedY: (Math.random() - 0.5) * 2, // Initial random speed
        isMoving: false, // Initially, particles are not moving
      });
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.closePath();

      // Move particles away from the mouse only if they are set to move
      if (particle.isMoving) {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) { // If within 100px of the mouse
          const force = (100 - distance) / 100; // Calculate force based on distance
          
          // Calculate speed based on the direction and force
          const moveSpeed = 5; // Base speed
          particle.speedX += (dx / distance) * force * moveSpeed; // Add some speed in the opposite direction of the mouse
          particle.speedY += (dy / distance) * force * moveSpeed;

          // Apply inertia to slow down over time
          particle.speedX *= 0.95; // Dampen speed
          particle.speedY *= 0.95; // Dampen speed
        }

        // Oscillate particle movement using sine wave
        particle.x += particle.speedX + Math.sin(particle.y * 0.01) * 0.5; // Sine wave effect on X
        particle.y += particle.speedY + Math.cos(particle.x * 0.01) * 0.5; // Sine wave effect on Y

        // Bounce off walls
        if (particle.x + particle.radius > window.innerWidth || particle.x - particle.radius < 0) {
          particle.speedX *= -1; // Reverse speed
        }
        if (particle.y + particle.radius > window.innerHeight || particle.y - particle.radius < 0) {
          particle.speedY *= -1; // Reverse speed
        }
      }
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawParticles(ctx);
        requestAnimationFrame(animate);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles(500); // Create 100 particles
      animate();
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX; // Update mouseX
      mouseY = event.clientY; // Update mouseY

      // Check if the mouse is near any particles and update their movement state
      particles.forEach((particle) => {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        particle.isMoving = distance < 100; // Set isMoving if mouse is near the particle
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1}} />;
};

export default InteractiveBackground;
