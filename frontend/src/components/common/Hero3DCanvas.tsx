import React, { useEffect, useRef } from 'react';

interface Node3D {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  vz: number;
}

export const Hero3DCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for 3D parallax tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left - width / 2;
      const cy = e.clientY - rect.top - height / 2;
      mouseX = cx / (width / 2);
      mouseY = cy / (height / 2);
      targetRotY = mouseX * 0.35;
      targetRotX = -mouseY * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Generate 3D Nodes (Cubes / Algorithm network points)
    const nodeCount = 38;
    const nodes: Node3D[] = [];
    const colors = ['#38bdf8', '#06b6d4', '#818cf8', '#fbbf24', '#34d399'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * width * 0.9,
        y: (Math.random() - 0.5) * height * 0.9,
        z: (Math.random() - 0.5) * 400,
        radius: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.6,
      });
    }

    const fov = 350;

    const render = () => {
      // Smooth damp rotation
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Project 3D points to 2D screen
      const projectedNodes = nodes.map((node) => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Bounce back inside bounds
        const boundX = width * 0.45;
        const boundY = height * 0.45;
        const boundZ = 250;

        if (Math.abs(node.x) > boundX) node.vx *= -1;
        if (Math.abs(node.y) > boundY) node.vy *= -1;
        if (Math.abs(node.z) > boundZ) node.vz *= -1;

        // Apply 3D Y rotation
        let x1 = node.x * Math.cos(rotY) - node.z * Math.sin(rotY);
        let z1 = node.z * Math.cos(rotY) + node.x * Math.sin(rotY);

        // Apply 3D X rotation
        let y1 = node.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = z1 * Math.cos(rotX) + node.y * Math.sin(rotX);

        // Perspective scale factor
        const scale = fov / (fov + z2 + 300);
        const px = x1 * scale + width / 2;
        const py = y1 * scale + height / 2;

        return {
          px,
          py,
          scale,
          color: node.color,
          radius: node.radius * scale,
          z: z2,
        };
      });

      // Sort by depth for correct Z rendering
      projectedNodes.sort((a, b) => b.z - a.z);

      // Draw connecting 3D glowing lines
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          const dx = n1.px - n2.px;
          const dy = n1.py - n2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25 * Math.min(n1.scale, n2.scale);
            ctx.beginPath();
            ctx.moveTo(n1.px, n1.py);
            ctx.lineTo(n2.px, n2.py);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1 * Math.min(n1.scale, n2.scale);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Nodes & Wireframe Cubes
      projectedNodes.forEach((node, index) => {
        const opacity = Math.max(0.1, Math.min(1, node.scale * 0.8));
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.px, node.py, Math.max(1, node.radius), 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = opacity;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12 * node.scale;
        ctx.fill();

        // Render small 3D wireframe box for every 4th node
        if (index % 4 === 0) {
          const boxSize = 14 * node.scale;
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = opacity * 0.6;
          ctx.strokeRect(node.px - boxSize / 2, node.py - boxSize / 2, boxSize, boxSize);
        }

        ctx.restore();
      });

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
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
