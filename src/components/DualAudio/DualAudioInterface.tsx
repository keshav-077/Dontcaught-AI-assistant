import { useDualAudio } from "@/hooks/useDualAudio";
import { DualAudioButton } from "./DualAudioButton";
import { DualAudioPopover } from "./DualAudioPopover";
import { AudioPane } from "./AudioPane";
import { HeadphonesIcon, MicIcon } from "lucide-react";
import type { DualAudioButtonState } from "./DualAudioButton";

/**
 * DualAudioInterface Component
 * 
 * Main component that integrates DualAudioButton and DualAudioPopover.
 * Provides a unified interface for simultaneous microphone and system audio capture.
 * 
 * Requirements: 1.1, 2.1, 2.2
 */
export function DualAudioInterface() {
  const {
    state,
    startCapture,
    stopCapture,
    processTranscriptions,
    checkMicrophonePermission,
    requestMicrophonePermission,
    handleSystemAudioSetup,
    openInterface,
    closeInterface,
  } = useDualAudio();

  // Determine button state based on overall system state
  const getButtonState = (): DualAudioButtonState => {
    // Check if either source has a permission error
    if (state.systemAudio.status === "permission-denied" || state.microphone.status === "permission-denied") {
      return "error";
    }
    
    // Check if either source has an error
    if (state.systemAudio.status === "error" || state.microphone.status === "error") {
      return "error";
    }
    
    // Check if either source is processing
    if (state.systemAudio.status === "processing" || state.microphone.status === "processing") {
      return "processing";
    }
    
    // Check if capturing
    if (state.isCapturing) {
      return "capturing";
    }
    
    return "idle";
  };

  // Handle button click - toggle capture and open interface
  const handleButtonClick = async () => {
    if (state.isCapturing) {
      // If capturing, stop capture
      await stopCapture();
    } else {
      // If not capturing, start capture and open interface
      await startCapture();
    }
  };

  // Handle popover open/close
  const handleOpenChange = (open: boolean) => {
    if (open) {
      openInterface();
    } else {
      closeInterface();
    }
  };

  // Handle Ctrl+Enter - process transcriptions
  const handleCtrlEnter = async () => {
    await processTranscriptions();
  };

  // Handle Escape - close popover if not capturing
  const handleEscape = () => {
    if (!state.isCapturing) {
      closeInterface();
    }
  };

  // Create system audio pane
  const systemAudioPane = (
    <AudioPane
      title="System Audio"
      icon={<HeadphonesIcon className="h-4 w-4" />}
      isCapturing={state.systemAudio.isCapturing}
      audioLevel={state.systemAudio.audioLevel}
      transcription={state.systemAudio.transcription}
      status={state.systemAudio.status}
      errorMessage={state.systemAudio.error}
      deviceName={state.systemAudio.deviceName}
      isPermissionError={state.systemAudio.status === "permission-denied"}
      audioSource="system-audio"
      onRequestPermission={handleSystemAudioSetup}
    />
  );

  // Create microphone pane
  const microphonePane = (
    <AudioPane
      title="Microphone"
      icon={<MicIcon className="h-4 w-4" />}
      isCapturing={state.microphone.isCapturing}
      audioLevel={state.microphone.audioLevel}
      transcription={state.microphone.transcription}
      status={state.microphone.status}
      errorMessage={state.microphone.error}
      deviceName={state.microphone.deviceName}
      isPermissionError={state.microphone.status === "permission-denied"}
      audioSource="microphone"
      onRetryPermission={checkMicrophonePermission}
      onRequestPermission={requestMicrophonePermission}
    />
  );

  return (
    <DualAudioPopover
      trigger={
        <DualAudioButton
          state={getButtonState()}
          onClick={handleButtonClick}
        />
      }
      open={state.isOpen}
      onOpenChange={handleOpenChange}
      systemAudioPane={systemAudioPane}
      microphonePane={microphonePane}
      isCapturing={state.isCapturing}
      onCtrlEnter={handleCtrlEnter}
      onEscape={handleEscape}
    />
  );
}
