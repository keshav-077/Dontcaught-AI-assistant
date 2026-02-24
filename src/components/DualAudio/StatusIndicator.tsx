import { useState } from "react";
import { cn } from "@/lib/utils";

export type AudioSourceStatus = "idle" | "capturing" | "processing" | "error" | "permission-denied";

interface StatusIndicatorProps {
  status: AudioSourceStatus;
  message?: string;
}

export function StatusIndicator({ status, message }: StatusIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Get color based on status
  const getStatusColor = (): string => {
    switch (status) {
      case "idle":
        return "bg-gray-400";
      case "capturing":
        return "bg-green-500";
      case "processing":
        return "bg-blue-500";
      case "error":
        return "bg-red-500";
      case "permission-denied":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };

  // Get status label
  const getStatusLabel = (): string => {
    switch (status) {
      case "idle":
        return "Idle";
      case "capturing":
        return "Capturing";
      case "processing":
        return "Processing";
      case "error":
        return "Error";
      case "permission-denied":
        return "Permission Required";
      default:
        return "Unknown";
    }
  };

  // Get default message if none provided
  const getDefaultMessage = (): string => {
    switch (status) {
      case "idle":
        return "Audio capture is idle. Click to start capturing.";
      case "capturing":
        return "Actively capturing audio and transcribing in real-time.";
      case "processing":
        return "Processing audio data...";
      case "error":
        return "An error occurred during audio capture.";
      case "permission-denied":
        return "Permission required to access audio device. Click to grant access.";
      default:
        return "";
    }
  };

  const tooltipMessage = message || getDefaultMessage();

  return (
    <div className="relative inline-flex items-center">
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Status dot with pulsing ring for capturing state */}
        <div className="relative">
          {status === "capturing" && (
            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
          )}
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300 ease-in-out relative z-10",
              getStatusColor(),
              status === "capturing" && "shadow-lg shadow-green-500/50"
            )}
            aria-label={`Status: ${getStatusLabel()}`}
          />
        </div>

        {/* Tooltip with smooth animation */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200">
            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-xs whitespace-normal">
              <div className="font-semibold mb-1">{getStatusLabel()}</div>
              <div className="text-gray-300">{tooltipMessage}</div>
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
