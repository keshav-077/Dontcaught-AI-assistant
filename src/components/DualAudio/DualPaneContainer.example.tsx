import { DualPaneContainer } from "./DualPaneContainer";
import { AudioPane } from "./AudioPane";
import { Mic, Headphones } from "lucide-react";

export function DualPaneContainerExample() {
  return (
    <div className="w-full h-[600px] p-4 bg-background">
      <DualPaneContainer
        systemAudioPane={
          <AudioPane
            title="System Audio"
            icon={<Headphones className="w-4 h-4" />}
            isCapturing={true}
            audioLevel={65}
            transcription="This is a sample transcription from system audio. The audio is being captured and transcribed in real-time."
            status="capturing"
            deviceName="Default Speakers"
          />
        }
        microphonePane={
          <AudioPane
            title="Microphone"
            icon={<Mic className="w-4 h-4" />}
            isCapturing={true}
            audioLevel={45}
            transcription="This is a sample transcription from the microphone. The user is speaking and their words are being transcribed."
            status="capturing"
            deviceName="Built-in Microphone"
          />
        }
      />
    </div>
  );
}

export function DualPaneContainerIdleExample() {
  return (
    <div className="w-full h-[600px] p-4 bg-background">
      <DualPaneContainer
        systemAudioPane={
          <AudioPane
            title="System Audio"
            icon={<Headphones className="w-4 h-4" />}
            isCapturing={false}
            audioLevel={0}
            transcription=""
            status="idle"
            deviceName="Default Speakers"
          />
        }
        microphonePane={
          <AudioPane
            title="Microphone"
            icon={<Mic className="w-4 h-4" />}
            isCapturing={false}
            audioLevel={0}
            transcription=""
            status="idle"
            deviceName="Built-in Microphone"
          />
        }
      />
    </div>
  );
}

export function DualPaneContainerErrorExample() {
  return (
    <div className="w-full h-[600px] p-4 bg-background">
      <DualPaneContainer
        systemAudioPane={
          <AudioPane
            title="System Audio"
            icon={<Headphones className="w-4 h-4" />}
            isCapturing={false}
            audioLevel={0}
            transcription=""
            status="error"
            errorMessage="Failed to initialize system audio device"
            deviceName="Default Speakers"
          />
        }
        microphonePane={
          <AudioPane
            title="Microphone"
            icon={<Mic className="w-4 h-4" />}
            isCapturing={true}
            audioLevel={55}
            transcription="Microphone is working fine even though system audio failed."
            status="capturing"
            deviceName="Built-in Microphone"
          />
        }
      />
    </div>
  );
}
