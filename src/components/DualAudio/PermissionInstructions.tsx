import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { getPlatform } from "@/lib/platform";
import { cn } from "@/lib/utils";

interface PermissionInstructionsProps {
  audioSource: "microphone" | "system-audio";
  onRetry?: () => void;
  onRequestPermission?: () => void;
  isRequesting?: boolean;
}

export function PermissionInstructions({
  audioSource,
  onRetry,
  onRequestPermission,
  isRequesting = false,
}: PermissionInstructionsProps) {
  const [showManual, setShowManual] = useState(false);
  const platform = getPlatform();

  const getInstructions = () => {
    if (audioSource === "microphone") {
      switch (platform) {
        case "macos":
          return {
            title: "Microphone Permission Required",
            description: "Grant microphone access to capture your audio",
            steps: [
              "Open System Settings",
              "Go to Privacy & Security",
              "Select Microphone",
              "Enable this application",
            ],
          };
        case "windows":
          return {
            title: "Microphone Permission Required",
            description: "Grant microphone access to capture your audio",
            steps: [
              "Open Windows Settings",
              "Go to Privacy & Security",
              "Select Microphone",
              "Enable microphone access for this app",
            ],
          };
        case "linux":
          return {
            title: "Microphone Permission Required",
            description: "Grant microphone access to capture your audio",
            steps: [
              "Check your audio settings",
              "Ensure microphone is not muted",
              "Verify application has microphone permissions",
            ],
          };
      }
    } else {
      // system-audio
      switch (platform) {
        case "macos":
          return {
            title: "System Audio Permission Required",
            description: "Grant system audio access to capture audio output",
            steps: [
              "Open System Settings",
              "Go to Privacy & Security",
              "Select Screen & System Audio Recording",
              "Enable this application",
            ],
          };
        case "windows":
          return {
            title: "System Audio Permission Required",
            description: "Grant system audio access to capture audio output",
            steps: [
              "Open Windows Settings",
              "Go to Privacy & Security",
              "Select App permissions",
              "Enable audio capture for this app",
            ],
          };
        case "linux":
          return {
            title: "System Audio Permission Required",
            description: "Grant system audio access to capture audio output",
            steps: [
              "Check your audio settings",
              "Ensure PulseAudio or PipeWire is configured",
              "Verify application has audio capture permissions",
            ],
          };
      }
    }
  };

  const instructions = getInstructions();

  return (
    <div className="px-4 py-3 bg-orange-50 border-y border-orange-200">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-orange-900 mb-1">
            {instructions.title}
          </h4>
          <p className="text-xs text-orange-700 mb-2">
            {instructions.description}
          </p>

          <div className="space-y-2">
            {onRequestPermission && (
              <Button
                onClick={onRequestPermission}
                size="sm"
                className="w-full text-xs"
                disabled={isRequesting}
              >
                {isRequesting ? "Requesting..." : "Grant Permission"}
              </Button>
            )}

            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                Retry
              </Button>
            )}

            <button
              type="button"
              onClick={() => setShowManual(!showManual)}
              className="w-full flex items-center justify-center gap-1 text-xs text-orange-700 hover:text-orange-900"
            >
              Manual setup instructions
              <ChevronDown
                className={cn(
                  "w-3 h-3 transition-transform",
                  showManual && "rotate-180"
                )}
              />
            </button>

            {showManual && (
              <ol className="text-xs text-orange-700 space-y-1 list-decimal list-inside pt-2 border-t border-orange-200">
                {instructions.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
