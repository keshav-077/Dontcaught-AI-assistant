import { ReactNode } from "react";

interface DualPaneContainerProps {
  systemAudioPane: ReactNode;
  microphonePane: ReactNode;
}

export function DualPaneContainer({
  systemAudioPane,
  microphonePane,
}: DualPaneContainerProps) {
  return (
    <div className="flex gap-4 w-full h-full min-h-[400px]">
      {/* Left pane - System Audio with staggered animation */}
      <div className="flex-1 min-w-[300px] animate-in fade-in-0 slide-in-from-left-4 duration-300">
        {systemAudioPane}
      </div>

      {/* Vertical divider with fade-in animation */}
      <div className="w-px bg-border flex-shrink-0 animate-in fade-in-0 duration-500 delay-150" />

      {/* Right pane - Microphone with staggered animation */}
      <div className="flex-1 min-w-[300px] animate-in fade-in-0 slide-in-from-right-4 duration-300 delay-75">
        {microphonePane}
      </div>
    </div>
  );
}
