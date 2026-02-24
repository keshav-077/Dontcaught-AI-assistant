import { useState } from "react";
import { DualAudioPopover } from "./DualAudioPopover";
import { DualAudioButton } from "./DualAudioButton";
import { AudioPane } from "./AudioPane";
import { HeadphonesIcon, MicIcon } from "lucide-react";

/**
 * Example usage of DualAudioPopover component
 * 
 * This example demonstrates:
 * - Opening/closing the popover
 * - Rendering both audio panes
 * - Keyboard shortcut integration
 * - Device selection link
 */
export function DualAudioPopoverExample() {
  const [open, setOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCtrlEnter = () => {
    console.log("Ctrl+Enter pressed - processing transcriptions");
    alert("Processing transcriptions and navigating to LLM response...");
  };

  const handleEscape = () => {
    console.log("Escape pressed - closing popover");
    setOpen(false);
  };

  const handleButtonClick = () => {
    setOpen(!open);
    if (!open) {
      // Simulate starting capture when opening
      setIsCapturing(true);
    }
  };

  // Example system audio pane
  const systemAudioPane = (
    <AudioPane
      title="System Audio"
      icon={<HeadphonesIcon className="h-4 w-4" />}
      isCapturing={isCapturing}
      audioLevel={65}
      transcription="This is example system audio transcription. The interviewer is asking questions about the candidate's experience with React and TypeScript."
      status={isCapturing ? "capturing" : "idle"}
      deviceName="Speakers (Realtek High Definition Audio)"
    />
  );

  // Example microphone pane
  const microphonePane = (
    <AudioPane
      title="Microphone"
      icon={<MicIcon className="h-4 w-4" />}
      isCapturing={isCapturing}
      audioLevel={45}
      transcription="This is example microphone transcription. I have been working with React for about 3 years and TypeScript for 2 years."
      status={isCapturing ? "capturing" : "idle"}
      deviceName="Microphone (USB Audio Device)"
    />
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">DualAudioPopover Example</h1>
          <p className="text-muted-foreground">
            Click the button to open the dual audio interface
          </p>
        </div>

        <div className="flex justify-center">
          <DualAudioPopover
            trigger={
              <DualAudioButton
                state={isCapturing ? "capturing" : "idle"}
                onClick={handleButtonClick}
              />
            }
            open={open}
            onOpenChange={setOpen}
            systemAudioPane={systemAudioPane}
            microphonePane={microphonePane}
            isCapturing={isCapturing}
            onCtrlEnter={handleCtrlEnter}
            onEscape={handleEscape}
          />
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>Try these keyboard shortcuts when the popover is open:</p>
          <ul className="space-y-1">
            <li><kbd className="px-2 py-1 bg-muted border border-border rounded">Ctrl+Enter</kbd> - Process transcriptions</li>
            <li><kbd className="px-2 py-1 bg-muted border border-border rounded">Esc</kbd> - Close popover (when not capturing)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
