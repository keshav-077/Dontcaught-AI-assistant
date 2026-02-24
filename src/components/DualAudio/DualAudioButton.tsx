import { Button } from "@/components/ui/button";
import { HeadphonesIcon, MicIcon, LoaderCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type DualAudioButtonState = "idle" | "capturing" | "error" | "processing";

export interface DualAudioButtonProps {
  state: DualAudioButtonState;
  onClick: () => void;
  className?: string;
}

export const DualAudioButton = ({
  state,
  onClick,
  className,
}: DualAudioButtonProps) => {
  const getButtonContent = () => {
    switch (state) {
      case "processing":
        return (
          <LoaderCircleIcon className="h-4 w-4 animate-spin text-blue-500" />
        );
      case "capturing":
        return (
          <div className="relative flex items-center gap-1">
            <div className="absolute inset-0 animate-ping opacity-75">
              <HeadphonesIcon className="h-3.5 w-3.5 text-green-500" />
            </div>
            <HeadphonesIcon className="h-3.5 w-3.5 text-green-500 relative z-10" />
            <MicIcon className="h-3.5 w-3.5 text-green-500 relative z-10" />
          </div>
        );
      case "error":
        return (
          <div className="relative flex items-center gap-1">
            <HeadphonesIcon className="h-3.5 w-3.5 text-red-500" />
            <MicIcon className="h-3.5 w-3.5 text-red-500" />
          </div>
        );
      case "idle":
      default:
        return (
          <div className="relative flex items-center gap-1">
            <HeadphonesIcon className="h-3.5 w-3.5" />
            <MicIcon className="h-3.5 w-3.5" />
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (state) {
      case "processing":
        return "Processing transcriptions...";
      case "capturing":
        return "Capturing audio from both sources";
      case "error":
        return "Error with audio capture";
      case "idle":
      default:
        return "Start dual audio capture";
    }
  };

  return (
    <Button
      size="icon"
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-300 ease-in-out",
        state === "capturing" && "ring-2 ring-green-500/50 shadow-lg shadow-green-500/20",
        state === "error" && "ring-2 ring-red-500/50 shadow-lg shadow-red-500/20",
        state === "processing" && "ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20",
        className
      )}
      title={getTitle()}
    >
      {getButtonContent()}
    </Button>
  );
};
