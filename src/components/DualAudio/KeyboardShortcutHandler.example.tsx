/**
 * Example usage of KeyboardShortcutHandler component
 * 
 * This file demonstrates how to integrate the KeyboardShortcutHandler
 * into a dual-audio interface component.
 */

import { KeyboardShortcutHandler } from "./KeyboardShortcutHandler";
import { useDualAudio } from "@/hooks/useDualAudio";

export function DualAudioInterfaceExample() {
  const {
    state,
    processTranscriptions,
    closeInterface,
  } = useDualAudio();

  return (
    <div>
      {/* Your dual-audio interface UI here */}
      <div>
        <p>System Audio: {state.systemAudio.transcription}</p>
        <p>Microphone: {state.microphone.transcription}</p>
      </div>

      {/* Keyboard shortcut handler - invisible component */}
      <KeyboardShortcutHandler
        isActive={state.isOpen}
        isCapturing={state.isCapturing}
        onCtrlEnter={processTranscriptions}
        onEscape={closeInterface}
      />
    </div>
  );
}
