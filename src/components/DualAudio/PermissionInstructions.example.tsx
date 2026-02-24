import { PermissionInstructions } from "./PermissionInstructions";

/**
 * Example: Microphone Permission Instructions
 */
export function MicrophonePermissionExample() {
  return (
    <div className="p-4 max-w-md">
      <PermissionInstructions
        audioSource="microphone"
        onRetry={() => console.log("Retry clicked")}
        onRequestPermission={() => console.log("Request permission clicked")}
      />
    </div>
  );
}

/**
 * Example: System Audio Permission Instructions
 */
export function SystemAudioPermissionExample() {
  return (
    <div className="p-4 max-w-md">
      <PermissionInstructions
        audioSource="system-audio"
        onRequestPermission={() => console.log("Request permission clicked")}
      />
    </div>
  );
}

/**
 * Example: Permission Instructions with Requesting State
 */
export function RequestingPermissionExample() {
  return (
    <div className="p-4 max-w-md">
      <PermissionInstructions
        audioSource="microphone"
        onRequestPermission={() => console.log("Request permission clicked")}
        isRequesting={true}
      />
    </div>
  );
}
