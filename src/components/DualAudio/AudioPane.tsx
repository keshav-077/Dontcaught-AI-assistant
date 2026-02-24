import { ReactNode } from "react";
import { AudioVisualization } from "./AudioVisualization";
import { TranscriptionDisplay } from "./TranscriptionDisplay";
import { StatusIndicator, type AudioSourceStatus } from "./StatusIndicator";
import { PermissionInstructions } from "./PermissionInstructions";

interface AudioPaneProps {
  title: string; // "System Audio" or "Microphone"
  icon: ReactNode;
  isCapturing: boolean;
  audioLevel: number; // 0-100
  transcription: string;
  status: AudioSourceStatus;
  errorMessage?: string;
  deviceName: string;
  isPermissionError?: boolean;
  onRetryPermission?: () => void;
  onRequestPermission?: () => void;
  audioSource?: "microphone" | "system-audio";
}

export function AudioPane({
  title,
  icon,
  isCapturing,
  audioLevel,
  transcription,
  status,
  errorMessage,
  deviceName,
  isPermissionError = false,
  onRetryPermission,
  onRequestPermission,
  audioSource = "microphone",
}: AudioPaneProps) {
  // Determine accent color based on audio source for visual distinction
  const accentColor = audioSource === "system-audio" 
    ? "text-blue-600 dark:text-blue-400" 
    : "text-green-600 dark:text-green-400";
  
  const badgeBgColor = audioSource === "system-audio"
    ? "bg-blue-100 dark:bg-blue-950"
    : "bg-green-100 dark:bg-green-950";

  return (
    <div className="flex flex-col h-full border border-border rounded-lg bg-background transition-all duration-300">
      {/* Header with title, icon, status, and source badge */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border transition-colors duration-200">
        <div className="flex items-center gap-2">
          <div className={`${accentColor} transition-colors duration-200`}>{icon}</div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {/* Source badge for visual distinction (Requirement 3.4) */}
          <span className={`text-xs px-2 py-0.5 rounded-full ${badgeBgColor} ${accentColor} font-medium transition-all duration-200`}>
            {audioSource === "system-audio" ? "Left" : "Right"}
          </span>
        </div>
        <StatusIndicator status={status} message={errorMessage} />
      </div>

      {/* Device name display */}
      <div className="px-4 py-2 border-b border-border bg-muted/30 transition-colors duration-200">
        <p className="text-xs text-muted-foreground">
          Device: <span className="font-medium text-foreground">{deviceName || "Not selected"}</span>
        </p>
      </div>

      {/* Audio visualization */}
      <div className="px-4 py-3">
        <AudioVisualization
          audioLevel={audioLevel}
          isActive={isCapturing}
          variant="waveform"
          status={status === "permission-denied" ? "error" : status}
        />
      </div>

      {/* Permission error display (if present) with smooth animation */}
      {isPermissionError && status === "permission-denied" && (
        <div className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <PermissionInstructions
            audioSource={audioSource}
            onRetry={onRetryPermission}
            onRequestPermission={onRequestPermission}
          />
        </div>
      )}

      {/* Error message display (if present and not permission error) with smooth animation */}
      {errorMessage && status === "error" && !isPermissionError && (
        <div className="px-4 py-2 bg-red-50 border-y border-red-200 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <p className="text-xs text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Transcription display */}
      <div className="flex-1 min-h-0">
        <TranscriptionDisplay
          text={transcription}
          isProcessing={status === "processing"}
          placeholder={`${title} transcription will appear here...`}
        />
      </div>
    </div>
  );
}
