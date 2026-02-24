import { useState } from "react";
import { DualAudioButton, DualAudioButtonState } from "./DualAudioButton";

/**
 * Example usage of DualAudioButton component
 * 
 * This component demonstrates all visual states:
 * - idle: Default state with gray icons
 * - capturing: Animated pulse with green icons and ring
 * - error: Red icons with ring
 * - processing: Loading spinner in blue
 */
export const DualAudioButtonExample = () => {
  const [state, setState] = useState<DualAudioButtonState>("idle");

  const handleClick = () => {
    // Cycle through states for demonstration
    const states: DualAudioButtonState[] = ["idle", "capturing", "processing", "error"];
    const currentIndex = states.indexOf(state);
    const nextIndex = (currentIndex + 1) % states.length;
    setState(states[nextIndex]);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">DualAudioButton States</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button to cycle through different states
        </p>
        <div className="flex items-center gap-4">
          <DualAudioButton state={state} onClick={handleClick} />
          <span className="text-sm">Current state: <strong>{state}</strong></span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-semibold">All States:</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DualAudioButton state="idle" onClick={() => {}} />
            <span className="text-sm">Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <DualAudioButton state="capturing" onClick={() => {}} />
            <span className="text-sm">Capturing (animated pulse)</span>
          </div>
          <div className="flex items-center gap-2">
            <DualAudioButton state="processing" onClick={() => {}} />
            <span className="text-sm">Processing (spinner)</span>
          </div>
          <div className="flex items-center gap-2">
            <DualAudioButton state="error" onClick={() => {}} />
            <span className="text-sm">Error</span>
          </div>
        </div>
      </div>
    </div>
  );
};
