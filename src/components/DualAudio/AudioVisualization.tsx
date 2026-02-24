import { useEffect, useRef, useState, useCallback } from "react";

interface AudioVisualizationProps {
  audioLevel: number; // 0-100
  isActive: boolean;
  variant?: "waveform" | "meter";
  status?: "idle" | "capturing" | "processing" | "error";
}

export function AudioVisualization({
  audioLevel,
  isActive,
  variant = "waveform",
  status = "idle",
}: AudioVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastLevelRef = useRef<number>(0);

  // Smooth level transitions for better performance
  const smoothLevel = useCallback((currentLevel: number, targetLevel: number) => {
    const smoothingFactor = 0.15;
    return currentLevel + (targetLevel - currentLevel) * smoothingFactor;
  }, []);

  // Determine color based on status and active state
  const getColor = (): string => {
    if (status === "error") return "#ef4444"; // red
    if (isActive && status === "capturing") return "#22c55e"; // green
    return "#9ca3af"; // gray
  };

  // Update visualization level with smoothing
  const updateLevel = useCallback((level: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const color = getColor();

    // Smooth the level transition
    lastLevelRef.current = smoothLevel(lastLevelRef.current, level);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (variant === "waveform") {
      drawWaveform(ctx, width, height, lastLevelRef.current, color);
    } else {
      drawMeter(ctx, width, height, lastLevelRef.current, color);
    }
  }, [variant, status, isActive, smoothLevel]);

  // Draw waveform visualization with smooth animation
  const drawWaveform = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    level: number,
    color: string
  ) => {
    const centerY = height / 2;
    const amplitude = (level / 100) * (height / 2) * 0.8;
    const frequency = 0.02;
    const time = Date.now() * 0.002; // Smoother animation speed

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Add shadow for depth
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;

    for (let x = 0; x < width; x++) {
      // Multiple sine waves for more organic look
      const wave1 = Math.sin(x * frequency + time * 2) * amplitude;
      const wave2 = Math.sin(x * frequency * 1.5 + time * 1.5) * amplitude * 0.5;
      const wave3 = Math.sin(x * frequency * 0.5 + time * 2.5) * amplitude * 0.3;
      
      const y = centerY + wave1 + wave2 + wave3;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  };

  // Draw meter visualization with smooth transitions
  const drawMeter = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    level: number,
    color: string
  ) => {
    const barWidth = (width * level) / 100;
    const barHeight = height * 0.6;
    const y = (height - barHeight) / 2;
    const borderRadius = 4;

    // Background with rounded corners
    ctx.fillStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.roundRect(0, y, width, barHeight, borderRadius);
    ctx.fill();

    // Level bar with gradient and rounded corners
    if (barWidth > 0) {
      const gradient = ctx.createLinearGradient(0, y, barWidth, y);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + "cc"); // Slightly transparent at end
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(0, y, barWidth, barHeight, borderRadius);
      ctx.fill();
      
      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(0, y, barWidth, barHeight, borderRadius);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  // Animation loop with performance optimization
  const animate = useCallback(() => {
    updateLevel(audioLevel);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [audioLevel, updateLevel]);

  // Start animation
  const start = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      lastLevelRef.current = 0; // Reset smooth level
      animate();
    }
  }, [isAnimating, animate]);

  // Stop animation with cleanup
  const stop = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsAnimating(false);
    lastLevelRef.current = 0; // Reset smooth level

    // Clear canvas when stopped
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  // Start/stop animation based on isActive with proper cleanup
  useEffect(() => {
    if (isActive) {
      start();
    } else {
      stop();
    }

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isActive, start, stop]);

  // Update visualization when audioLevel or status changes
  useEffect(() => {
    if (isAnimating) {
      updateLevel(audioLevel);
    }
  }, [audioLevel, status]);

  // Set canvas size on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }, []);

  return (
    <div className="w-full h-20 bg-gray-50 rounded-md overflow-hidden transition-all duration-300">
      <canvas
        ref={canvasRef}
        className="w-full h-full transition-opacity duration-300"
        style={{ display: "block", opacity: isActive ? 1 : 0.5 }}
      />
    </div>
  );
}
