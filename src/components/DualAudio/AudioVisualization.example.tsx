import { useState, useEffect } from "react";
import { AudioVisualization } from "./AudioVisualization";

/**
 * Example usage of AudioVisualization component
 * This demonstrates the component with simulated audio levels
 */
export function AudioVisualizationExample() {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "capturing" | "processing" | "error"
  >("idle");

  // Simulate audio level changes when active
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate varying audio levels
      const newLevel = Math.random() * 100;
      setAudioLevel(newLevel);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setStatus("capturing");
  };

  const handleStop = () => {
    setIsActive(false);
    setStatus("idle");
    setAudioLevel(0);
  };

  const handleError = () => {
    setStatus("error");
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">AudioVisualization Example</h2>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Waveform Variant</h3>
        <AudioVisualization
          audioLevel={audioLevel}
          isActive={isActive}
          variant="waveform"
          status={status}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Meter Variant</h3>
        <AudioVisualization
          audioLevel={audioLevel}
          isActive={isActive}
          variant="meter"
          status={status}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleStart}
          disabled={isActive}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Start Capture
        </button>
        <button
          onClick={handleStop}
          disabled={!isActive}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Stop Capture
        </button>
        <button
          onClick={handleError}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Simulate Error
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <p>Status: {status}</p>
        <p>Active: {isActive ? "Yes" : "No"}</p>
        <p>Audio Level: {audioLevel.toFixed(2)}</p>
      </div>
    </div>
  );
}
