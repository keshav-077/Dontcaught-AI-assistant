import { DualAudioInterface } from "./DualAudioInterface";

/**
 * Example usage of DualAudioInterface component
 * 
 * This is the main entry point for the unified dual-audio capture feature.
 * Simply render this component in your application to enable dual audio capture.
 */
export default function DualAudioInterfaceExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Dual Audio Interface</h1>
          <p className="text-muted-foreground">
            Click the button below to start capturing audio from both system audio and microphone
          </p>
        </div>

        {/* Main component - just render it! */}
        <DualAudioInterface />

        <div className="text-sm text-muted-foreground max-w-md space-y-2">
          <p>
            <strong>How to use:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click the button to start/stop dual audio capture</li>
            <li>The popover shows both audio sources side-by-side</li>
            <li>Press <kbd className="px-1 py-0.5 bg-muted border rounded text-xs">Ctrl+Enter</kbd> to process transcriptions</li>
            <li>Press <kbd className="px-1 py-0.5 bg-muted border rounded text-xs">Esc</kbd> to close (when not capturing)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
