import { useState } from "react";
import { AudioPane } from "./AudioPane";
import { MicIcon, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioSourceStatus } from "./StatusIndicator";

/**
 * Example usage of the AudioPane component
 * 
 * This demonstrates how to use AudioPane for both system audio and microphone sources
 */

interface AudioState {
  isCapturing: boolean;
  audioLevel: number;
  transcription: string;
  status: AudioSourceStatus;
  deviceName: string;
}

export function AudioPaneExample() {
  const [systemAudioState, setSystemAudioState] = useState<AudioState>({
    isCapturing: false,
    audioLevel: 0,
    transcription: "",
    status: "idle",
    deviceName: "Default Speakers",
  });

  const [microphoneState, setMicrophoneState] = useState<AudioState>({
    isCapturing: false,
    audioLevel: 0,
    transcription: "",
    status: "idle",
    deviceName: "Built-in Microphone",
  });

  // Simulate audio capture
  const startSystemAudio = () => {
    setSystemAudioState((prev) => ({
      ...prev,
      isCapturing: true,
      status: "capturing",
    }));

    // Simulate audio levels
    const levelInterval = setInterval(() => {
      setSystemAudioState((prev) => ({
        ...prev,
        audioLevel: Math.random() * 100,
      }));
    }, 100);

    // Simulate transcription updates
    setTimeout(() => {
      setSystemAudioState((prev) => ({
        ...prev,
        transcription: "Hello, this is a test transcription from system audio...",
      }));
    }, 2000);

    // Store interval for cleanup
    (window as any).systemAudioInterval = levelInterval;
  };

  const stopSystemAudio = () => {
    clearInterval((window as any).systemAudioInterval);
    setSystemAudioState((prev) => ({
      ...prev,
      isCapturing: false,
      audioLevel: 0,
      status: "idle",
    }));
  };

  const startMicrophone = () => {
    setMicrophoneState((prev) => ({
      ...prev,
      isCapturing: true,
      status: "capturing",
    }));

    // Simulate audio levels
    const levelInterval = setInterval(() => {
      setMicrophoneState((prev) => ({
        ...prev,
        audioLevel: Math.random() * 100,
      }));
    }, 100);

    // Simulate transcription updates
    setTimeout(() => {
      setMicrophoneState((prev) => ({
        ...prev,
        transcription: "This is my response captured from the microphone...",
      }));
    }, 2000);

    // Store interval for cleanup
    (window as any).microphoneInterval = levelInterval;
  };

  const stopMicrophone = () => {
    clearInterval((window as any).microphoneInterval);
    setMicrophoneState((prev) => ({
      ...prev,
      isCapturing: false,
      audioLevel: 0,
      status: "idle",
    }));
  };

  const simulateError = (source: "system" | "microphone") => {
    if (source === "system") {
      setSystemAudioState((prev) => ({
        ...prev,
        status: "error",
        isCapturing: false,
      }));
    } else {
      setMicrophoneState((prev) => ({
        ...prev,
        status: "error",
        isCapturing: false,
      }));
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">AudioPane Component Examples</h2>
        <p className="text-muted-foreground mb-6">
          Demonstrates the AudioPane component with different states and configurations
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <div className="space-x-2">
          <Button onClick={startSystemAudio} disabled={systemAudioState.isCapturing}>
            Start System Audio
          </Button>
          <Button onClick={stopSystemAudio} disabled={!systemAudioState.isCapturing}>
            Stop System Audio
          </Button>
          <Button onClick={() => simulateError("system")} variant="destructive">
            Simulate Error
          </Button>
        </div>
        <div className="space-x-2">
          <Button onClick={startMicrophone} disabled={microphoneState.isCapturing}>
            Start Microphone
          </Button>
          <Button onClick={stopMicrophone} disabled={!microphoneState.isCapturing}>
            Stop Microphone
          </Button>
          <Button onClick={() => simulateError("microphone")} variant="destructive">
            Simulate Error
          </Button>
        </div>
      </div>

      {/* Dual pane layout */}
      <div className="grid grid-cols-2 gap-4 h-[600px]">
        {/* System Audio Pane */}
        <AudioPane
          title="System Audio"
          icon={<HeadphonesIcon className="h-4 w-4" />}
          isCapturing={systemAudioState.isCapturing}
          audioLevel={systemAudioState.audioLevel}
          transcription={systemAudioState.transcription}
          status={systemAudioState.status}
          errorMessage={
            systemAudioState.status === "error"
              ? "Failed to initialize system audio capture. Please check your audio device settings."
              : undefined
          }
          deviceName={systemAudioState.deviceName}
        />

        {/* Microphone Pane */}
        <AudioPane
          title="Microphone"
          icon={<MicIcon className="h-4 w-4" />}
          isCapturing={microphoneState.isCapturing}
          audioLevel={microphoneState.audioLevel}
          transcription={microphoneState.transcription}
          status={microphoneState.status}
          errorMessage={
            microphoneState.status === "error"
              ? "Microphone access denied. Please grant microphone permissions in your system settings."
              : undefined
          }
          deviceName={microphoneState.deviceName}
        />
      </div>
    </div>
  );
}
